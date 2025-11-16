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

export default function Messages({ messages, room, channelId, dmId }) {
  const sessionUser = useSelector((state) => state.session.user);
  const images = useSelector((state) => state.images);
  const REACT_APP_SOCKET_IO_URL = isProduction
    ? "https://yapyap.herokuapp.com"
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
      <div className="relative z-30 flex w-full flex-1 flex-col min-h-0 bg-surfaceLight/70 px-4 pt-6 shadow-inner-card backdrop-blur md:px-6">
        <div
          ref={wrapperRef}
          className="scrollbar flex-1 overflow-y-auto min-h-0 rounded-3xl border border-borderMuted/40 bg-surfaceMuted/40 p-4 shadow-inner-card md:p-6 mb-4"
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
                className="group relative mb-4 flex items-start gap-4 rounded-3xl border border-borderMuted/40 bg-surface/90 p-4 shadow-inner-card transition-all duration-200 hover:border-accent/40 hover:shadow-glow"
              >
                <img
                  className="h-12 w-12 rounded-full border border-borderMuted/40 object-cover shadow-soft-card"
                  src={
                    userAvatar ||
                    `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                      alias || username
                    )}&backgroundType=gradientLinear`
                  }
                  alt={`${alias || username} avatar`}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-offWhite tracking-wide">
                      {alias || username}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-slate">
                      {formattedDate}
                    </span>
                    {isOwnMessage && !isEditing && (
                      <div className="ml-auto flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <button
                          onClick={() => handleEditMessage(message)}
                          className="rounded-lg px-2 py-1 text-xs text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white/90"
                          title="Edit message"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="rounded-lg px-2 py-1 text-xs text-red-400/60 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-400"
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
                        <p className="text-base leading-relaxed text-white/85">{message.message}</p>
                      )}
                      {messageAttachment && (
                        <div className="mt-2">
                          <img
                            src={messageAttachment}
                            alt="Message attachment"
                            className="max-w-md rounded-2xl border border-borderMuted/40 shadow-soft-card"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
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
      <div className="flex-shrink-0 pb-6">
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
          className="flex w-full items-center gap-3 px-4 py-3"
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
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accentSoft text-accent shadow-inner-card transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploadingImage ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
          ) : (
            <img className="h-5 w-5" src={plus} alt="Add attachment" />
          )}
        </button>
        <input
          type="text"
          value={newMessage}
          className="flex-1 rounded-2xl bg-transparent px-4 py-3 text-base text-offWhite placeholder-white/30 outline-none transition-all duration-200 focus:bg-white/5 focus:placeholder-white/20"
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
          className="rounded-2xl bg-hero px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-soft-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-heroDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
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
