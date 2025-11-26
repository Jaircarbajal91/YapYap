import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, sendMessage, updateMessage, removeMessage } from "../../store/messages";
import { addSingleImage } from "../../store/aws_images";
import { io } from "socket.io-client";
import { format } from "date-fns-tz";
import plus from "../../../assets/images/plus.svg";
import { validateImageFile, ALLOWED_IMAGE_MIME_TYPES } from "../../utils/fileValidation";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const UPDATE_MESSAGE = "messages/updateMessage";
const REMOVE_MESSAGE = "messages/removeMessage";

const isProduction = process.env.NODE_ENV === "production";
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Messages({ messages, room, channelId, dmId, onBack }) {
  const sessionUser = useSelector((state) => state.session.user);
  const images = useSelector((state) => state.images);
  const REACT_APP_SOCKET_IO_URL = isProduction
    ? (process.env.REACT_APP_SOCKET_IO_URL || window.location.origin)
    : "http://localhost:8000";
  const dispatch = useDispatch();
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [editingImagePreview, setEditingImagePreview] = useState(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const wrapperRef = useRef(null);
  const socketRef = useRef(null);
  const activeRoomRef = useRef(null);
  const fileInputRef = useRef(null);
  const editInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    socketRef.current = io(REACT_APP_SOCKET_IO_URL, {
      secure: isProduction,
      transports: ["websocket", "polling"], // Add polling as fallback
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      if (activeRoomRef.current) {
        socketRef.current?.emit("leaveRoom", { room: activeRoomRef.current });
        activeRoomRef.current = null;
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [REACT_APP_SOCKET_IO_URL]);

  useEffect(() => {
    const socketInstance = socketRef.current;
    if (!socketInstance) return;

    // Wait for socket to be connected before joining rooms
    const joinRoomWhenConnected = () => {
      if (room && activeRoomRef.current !== room) {
        if (activeRoomRef.current) {
          socketInstance.emit("leaveRoom", { room: activeRoomRef.current });
        }
        console.log("Joining room:", room);
        socketInstance.emit("joinRoom", { room });
        activeRoomRef.current = room;
      }

      if (!room && activeRoomRef.current) {
        socketInstance.emit("leaveRoom", { room: activeRoomRef.current });
        activeRoomRef.current = null;
      }
    };

    if (socketInstance.connected) {
      joinRoomWhenConnected();
    } else {
      socketInstance.once("connect", joinRoomWhenConnected);
    }
  }, [room]);

  useEffect(() => {
    const socketInstance = socketRef.current;
    if (!socketInstance) return;

    const handleReceivedMessage = (data) => {
      const incomingMessage = data?.message;
      if (!incomingMessage) return;

      if (dmId && incomingMessage.dmId !== dmId) return;
      if (channelId && incomingMessage.channelId !== channelId) return;
      if (!dmId && !channelId) return;

      dispatch(addMessage(incomingMessage));
    };

    const handleMessageUpdated = (data) => {
      const updatedMessage = data?.message;
      if (!updatedMessage) return;

      if (dmId && updatedMessage.dmId !== dmId) return;
      if (channelId && updatedMessage.channelId !== channelId) return;
      if (!dmId && !channelId) return;

      dispatch({
        type: UPDATE_MESSAGE,
        payload: updatedMessage,
      });
      if (editingMessageId === updatedMessage.id) {
        setEditingMessageId(null);
        setEditingText("");
      }
    };

    const handleMessageDeleted = (data) => {
      const deletedMessageId = data?.messageId;
      if (!deletedMessageId) return;

      dispatch({
        type: REMOVE_MESSAGE,
        payload: deletedMessageId,
      });
      if (editingMessageId === deletedMessageId) {
        setEditingMessageId(null);
        setEditingText("");
      }
    };

    const handleUserTyping = (data) => {
      console.log("handleUserTyping called with data:", data, "current userId:", sessionUser?.id);
      if (!data) {
        console.log("No data in handleUserTyping");
        return;
      }
      if (!data.typingUsers) {
        console.log("No typingUsers in data");
        return;
      }
      
      // Filter out current user from typing list
      const otherTypingUsers = data.typingUsers.filter(
        (user) => user.userId !== sessionUser?.id
      );
      console.log("User typing event received - filtered users:", otherTypingUsers);
      setTypingUsers(otherTypingUsers);
    };

    const handleUserStoppedTyping = (data) => {
      if (!data || !data.typingUsers) return;
      
      // Filter out current user from typing list
      const otherTypingUsers = data.typingUsers.filter(
        (user) => user.userId !== sessionUser.id
      );
      setTypingUsers(otherTypingUsers);
    };

    socketInstance.on("receivedMessage", handleReceivedMessage);
    socketInstance.on("messageUpdated", handleMessageUpdated);
    socketInstance.on("messageDeleted", handleMessageDeleted);
    socketInstance.on("userTyping", handleUserTyping);
    socketInstance.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socketInstance.off("receivedMessage", handleReceivedMessage);
      socketInstance.off("messageUpdated", handleMessageUpdated);
      socketInstance.off("messageDeleted", handleMessageDeleted);
      socketInstance.off("userTyping", handleUserTyping);
      socketInstance.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [dispatch, dmId, channelId, editingMessageId, sessionUser.id]);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = wrapperRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingMessageId]);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setFileError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setFileError(validation.error);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedImage(file);
    setUploadingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      const imageData = await dispatch(
        addSingleImage({ image: file, type: "message" })
      );
      if (imageData && imageData.id) {
        setSelectedImage({ ...file, imageId: imageData.id });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setFileError("Failed to upload image. Please try again.");
      setSelectedImage(null);
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(message.id);
    setEditingText(message.message || "");
    setEditingImage(null);
    setEditingImagePreview(message.image || null);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
    setEditingImage(null);
    setEditingImagePreview(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleEditImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setFileError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setFileError(validation.error);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = "";
      }
      return;
    }

    setEditingImage(file);
    setUploadingEditImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload image
    try {
      const imageData = await dispatch(
        addSingleImage({ image: file, type: "message" })
      );
      if (imageData && imageData.id) {
        setEditingImage({ ...file, imageId: imageData.id });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setFileError("Failed to upload image. Please try again.");
      setEditingImage(null);
      setEditingImagePreview(null);
    } finally {
      setUploadingEditImage(false);
    }
  };

  const handleRemoveEditImage = () => {
    setEditingImage(null);
    setEditingImagePreview(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async (messageId) => {
    const trimmedText = editingText.trim();
    const hasImage = editingImage?.imageId || editingImagePreview;
    const hasText = trimmedText.length > 0;
    const originalMessage = messages.find(m => m.id === messageId);
    const hadOriginalImage = originalMessage?.imageId;

    // Allow saving if there's either text or image
    if (!hasText && !hasImage) {
      handleCancelEdit();
      return;
    }

    const socketInstance = socketRef.current;
    const updateData = {
      room,
      messageId,
      userId: sessionUser.id,
    };

    if (trimmedText !== undefined) {
      updateData.message = trimmedText;
    }

    // Handle image changes
    if (editingImage?.imageId) {
      // New image uploaded
      updateData.imageId = editingImage.imageId;
    } else if (hadOriginalImage && !editingImagePreview) {
      // Original image was removed (user clicked remove button)
      updateData.removeImage = true;
    }

    if (socketInstance && room) {
      socketInstance.emit("updateMessage", updateData);
    } else {
      await dispatch(
        updateMessage(messageId, trimmedText || "", {
          imageId: editingImage?.imageId,
          removeImage: hadOriginalImage && !editingImagePreview,
        })
      );
    }

    setEditingMessageId(null);
    setEditingText("");
    setEditingImage(null);
    setEditingImagePreview(null);
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };

  const handleDeleteMessage = async (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteModal(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    const socketInstance = socketRef.current;
    if (socketInstance && room) {
      socketInstance.emit("deleteMessage", {
        room,
        messageId: messageToDelete,
        userId: sessionUser.id,
      });
    } else {
      await dispatch(removeMessage(messageToDelete));
    }
    setMessageToDelete(null);
  };

  // Handle typing indicators
  const handleTyping = () => {
    const socketInstance = socketRef.current;
    // Check if socket is connected before emitting typing events
    if (!socketInstance || !socketInstance.connected || !room) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // If not currently typing, emit typingStart
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      console.log("Emitting typingStart for room:", room);
      socketInstance.emit("typingStart", {
        room,
        userId: sessionUser.id,
        username: sessionUser.username,
        alias: sessionUser.alias,
      });
    }

    // Set timeout to stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && socketInstance && socketInstance.connected) {
        isTypingRef.current = false;
        socketInstance.emit("typingStop", {
          room,
          userId: sessionUser.id,
        });
      }
    }, 3000);
  };

  // Clean up typing state when component unmounts or room changes
  useEffect(() => {
    // Clear typing users when room changes
    setTypingUsers([]);
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && socketRef.current && socketRef.current.connected && room) {
        socketRef.current.emit("typingStop", {
          room,
          userId: sessionUser.id,
        });
        isTypingRef.current = false;
      }
    };
  }, [room, sessionUser.id]);

  async function send(e) {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    const imageId = selectedImage?.imageId || null;
    
    // Allow sending if there's either a message or an image
    if (!trimmedMessage && !imageId) return;

    // Stop typing indicator when sending
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTypingRef.current && socketRef.current && socketRef.current.connected && room) {
      isTypingRef.current = false;
      socketRef.current.emit("typingStop", {
        room,
        userId: sessionUser.id,
      });
    }

    const socketInstance = socketRef.current;
    const payload = {
      newMessage: trimmedMessage || "",
      room,
      userId: sessionUser.id,
      channelId: channelId || null,
      dmId: dmId || null,
      imageId: imageId,
    };

    // Check if socket is connected before using it
    if (socketInstance && socketInstance.connected && room) {
      socketInstance.emit("chatMessage", payload);
    } else {
      // Fallback to HTTP API if socket is not connected
      await dispatch(
        sendMessage(trimmedMessage || "", sessionUser.id, {
          channelId: channelId || null,
          dmId: dmId || null,
          imageId: imageId,
        })
      );
    }

    setNewMessage("");
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
  return (
    <>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
        onConfirm={confirmDeleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
      />
      {/* Mobile: Back button for DM view */}
      {dmId && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center gap-2 bg-surfaceLight/95 backdrop-blur-sm border-b border-borderMuted/60 px-3 py-2.5 shadow-soft-card sm:gap-3 sm:px-4 sm:py-3">
          <button
            onClick={() => {
              // Clear the active DM to go back to DM list
              if (onBack) {
                onBack();
              } else if (window.history.length > 1) {
                window.history.back();
              }
            }}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-surfaceMuted/50 active:scale-95 transition-all touch-manipulation"
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-offWhite text-sm font-semibold flex-1 truncate sm:text-base">
            Direct Message
          </span>
        </div>
      )}
      <div className={`relative z-30 flex w-full flex-1 flex-col min-h-0 max-h-full bg-surfaceLight/70 px-2 pt-3 shadow-inner-card backdrop-blur sm:px-3 sm:pt-4 md:px-6 md:pt-6 ${dmId ? 'pt-12 sm:pt-14 md:pt-6' : 'pt-24 sm:pt-28 md:pt-6'}`}>
        <div
          ref={wrapperRef}
          className="scrollbar flex-1 overflow-y-auto min-h-0 rounded-xl border border-borderMuted/40 bg-surfaceMuted/40 p-2 shadow-inner-card sm:rounded-2xl sm:p-3 md:rounded-3xl md:p-6 mb-2 sm:mb-3 md:mb-4"
        >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/70">
            <span className="text-lg font-semibold">No messages yet</span>
            <p className="max-w-sm text-sm text-white/60">
              Say hello and break the ice. Everyone will see your message in real time.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const {
              User: { username, alias },
            } = message;
            const newDate = Date.parse(message.updatedAt);
            const formattedDate = format(
              new Date(newDate),
              "MM/dd/yyyy hh:mm aa",
              { timeZone }
            );

            // Get user avatar (separate from message attachment)
            const userAvatar =
              message.User?.Image?.url ||
              (message.User?.imageId ? images?.[message.User.imageId]?.url : null) ||
              null;
            // Get message attachment (when imageId exists, message.image is the attachment URL)
            const messageAttachment = message.imageId ? message.image : null;
            const isOwnMessage = message.senderId === sessionUser.id;
            const isEditing = editingMessageId === message.id;

            return (
              <div
                key={message.id}
                className="group relative mb-2 flex items-start gap-2 rounded-xl border border-borderMuted/40 bg-surface/90 p-2 shadow-inner-card transition-all duration-200 hover:border-accent/40 hover:shadow-glow sm:mb-3 sm:gap-3 sm:rounded-2xl sm:p-3 md:mb-4 md:gap-4 md:rounded-3xl md:p-4"
              >
                <img
                  className="h-8 w-8 shrink-0 rounded-full border border-borderMuted/40 object-cover shadow-soft-card sm:h-10 sm:w-10 md:h-12 md:w-12"
                  src={
                    userAvatar ||
                    `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                      alias || username
                    )}&backgroundType=gradientLinear`
                  }
                  alt={`${alias || username} avatar`}
                />
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs font-semibold text-offWhite tracking-wide sm:text-sm">
                      {alias || username}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-slate sm:text-xs">
                      {formattedDate}
                    </span>
                    {isOwnMessage && !isEditing && (
                      <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:gap-2">
                        <button
                          onClick={() => handleEditMessage(message)}
                          className="rounded-lg px-1.5 py-0.5 text-[10px] text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95 touch-manipulation sm:px-2 sm:py-1 sm:text-xs"
                          title="Edit message"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="rounded-lg px-1.5 py-0.5 text-[10px] text-red-400/60 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400 active:scale-95 touch-manipulation sm:px-2 sm:py-1 sm:text-xs"
                          title="Delete message"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveEdit(message.id);
                          } else if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                        className="rounded-xl border border-accent/40 bg-surfaceLight/80 px-3 py-2 text-base text-offWhite outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                        maxLength={256}
                        placeholder="Message text (optional if image is present)"
                      />
                      {editingImagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={editingImagePreview}
                            alt="Preview"
                            className="max-w-md rounded-xl border border-borderMuted/40"
                            style={{ maxHeight: "200px", objectFit: "contain" }}
                          />
                          <button
                            type="button"
                            onClick={handleRemoveEditImage}
                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-soft-card transition-all duration-200 hover:bg-red-600"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={editFileInputRef}
                          accept={ALLOWED_IMAGE_MIME_TYPES}
                          onChange={handleEditImageSelect}
                          className="hidden"
                          id={`edit-image-upload-${message.id}`}
                        />
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          disabled={uploadingEditImage}
                          className="rounded-lg border border-borderMuted/60 bg-transparent px-3 py-1 text-xs font-semibold text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Add or replace image"
                        >
                          {uploadingEditImage ? "Uploading..." : editingImagePreview ? "Replace Image" : "Add Image"}
                        </button>
                        <button
                          onClick={() => handleSaveEdit(message.id)}
                          className="rounded-lg bg-accent px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-accentDark"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-lg border border-borderMuted/60 bg-transparent px-3 py-1 text-xs font-semibold text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-white/90"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.message && (
                        <p className="text-sm leading-relaxed text-white/85 break-words sm:text-base">{message.message}</p>
                      )}
                      {messageAttachment && (
                        <div className="mt-2">
                          <img
                            src={messageAttachment}
                            alt="Message attachment"
                            className="max-w-full rounded-xl border border-borderMuted/40 shadow-soft-card sm:max-w-md sm:rounded-2xl"
                            style={{ maxHeight: "300px", objectFit: "contain" }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Typing indicator - fixed at bottom, above input form */}
      {typingUsers.length > 0 && (
        <div className="flex-shrink-0 flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-white/80 mx-4 mb-2">
          <div className="flex items-center gap-1.5">
            {typingUsers.map((user, index) => (
              <span key={user.userId || index} className="font-semibold text-white/95">
                {user.alias || user.username}
                {index < typingUsers.length - 1 && ","}
              </span>
            ))}
          </div>
          <span className="text-white/70 italic">
            {typingUsers.length === 1 ? "is" : "are"} typing
          </span>
          <div className="flex items-center gap-1.5 ml-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-white/90" style={{ animationDelay: "0ms" }}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-white/90" style={{ animationDelay: "150ms" }}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-white/90" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      )}
      <div className="flex-shrink-0 pb-2 sm:pb-4 md:pb-6 bg-surfaceLight/70">
        {fileError && (
          <div className="mb-4 rounded-2xl border border-red-500/50 bg-red-500/10 p-3">
            <p className="text-sm text-red-400">{fileError}</p>
          </div>
        )}
        {imagePreview && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-borderMuted/40 bg-surface/90 p-3">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-20 w-20 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-soft-card transition-all duration-200 hover:bg-red-600"
              >
                ×
              </button>
            </div>
            <span className="flex-1 text-sm text-white/70">
              {selectedImage?.name || "Image selected"}
            </span>
          </div>
        )}
        <form
          className="flex w-full items-center gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2 md:gap-3 md:px-4 md:py-3"
          onSubmit={send}
        >
        <input
          type="file"
          ref={fileInputRef}
          accept={ALLOWED_IMAGE_MIME_TYPES}
          onChange={handleImageSelect}
          className="hidden"
          id="image-upload"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accentSoft text-accent shadow-inner-card transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation sm:h-9 sm:w-9 sm:rounded-xl md:h-11 md:w-11 md:rounded-2xl"
        >
          {uploadingImage ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent sm:h-5 sm:w-5"></div>
          ) : (
            <img className="h-4 w-4 sm:h-5 sm:w-5" src={plus} alt="Add attachment" />
          )}
        </button>
        <input
          type="text"
          value={newMessage}
          className="flex-1 rounded-lg bg-transparent px-2 py-1.5 text-xs text-offWhite placeholder-white/30 outline-none transition-all duration-200 focus:bg-white/5 focus:placeholder-white/20 sm:rounded-xl sm:px-3 sm:py-2 sm:text-sm md:rounded-2xl md:px-4 md:py-3 md:text-base"
          placeholder="Send a message..."
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (e.target.value.trim()) {
              handleTyping();
            } else {
              // Stop typing if input is cleared
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }
              if (isTypingRef.current && socketRef.current && socketRef.current.connected && room) {
                isTypingRef.current = false;
                socketRef.current.emit("typingStop", {
                  room,
                  userId: sessionUser.id,
                });
              }
            }
          }}
        />
        <button
          type="submit"
          className="rounded-lg bg-hero px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-heroDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40 active:scale-95 touch-manipulation sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs md:rounded-2xl md:px-5 md:py-2 md:text-sm"
          disabled={!newMessage.trim() && !selectedImage}
        >
          Send
        </button>
      </form>
      </div>
    </div>
    </>
  );
}
