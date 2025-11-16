import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { setChannelsForServer } from "../../store/channels";
import { csrfFetch } from "../../store/csrf";
import { getDmMessages } from "../../store/messages";
import { fetchFriends } from "../../store/session";
import { getDirectMessages, deleteDirectMessage, addDirectMessage, removeDirectMessage } from "../../store/directMessages";
import { io } from "socket.io-client";
import NewDMForm from "./NewDMForm";
import AddFriendForm from "./AddFriendForm";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const TooltipBubble = ({ title, triggerRef }) => {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (triggerRef?.current && tooltipRef?.current) {
      const updatePosition = () => {
        if (!triggerRef?.current || !tooltipRef?.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        
        const left = triggerRect.right + 0.6 * 16; // 0.6rem in pixels
        const top = triggerRect.top + (triggerRect.height / 2);
        
        setPosition({ left, top });
      };
      
      const timeoutId = setTimeout(updatePosition, 0);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [triggerRef]);

  const tooltipContent = (
    <div 
      ref={tooltipRef}
      className="pointer-events-none fixed items-center gap-2 rounded-md bg-black px-3 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      style={{ 
        left: `${position.left}px`, 
        top: `${position.top}px`, 
        transform: 'translateY(-50%)', 
        display: 'flex',
        zIndex: 2147483647,
        isolation: 'isolate',
        willChange: 'transform'
      }}
    >
      <span className="absolute left-[-0.375rem] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-black" />
      <span className="relative uppercase tracking-[0.22em]">
        {title}
      </span>
    </div>
  );

  // Render tooltip directly to document.body using Portal - this bypasses all stacking contexts
  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(tooltipContent, document.body);
  }
  return null;
};

const DirectMessagesList = ({ directMessages, setMessages, setRoom }) => {
  const dispatch = useDispatch();
  const [showCreateDM, setShowCreateDM] = useState(false);
  const [showNewDMForm, setShowNewDMForm] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAddFriendForm, setShowAddFriendForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dmToDelete, setDmToDelete] = useState(null);
  const sessionUser = useSelector((state) => state.session.user);
  const images = useSelector((state) => state.images);
  const wrapperRef = useRef(null);
  const addFriendWrapperRef = useRef(null);
  const createDMRef = useRef(null);
  const addFriendRef = useRef(null);
  const socketRef = useRef(null);

  const isProduction = process.env.NODE_ENV === "production";
  const REACT_APP_SOCKET_IO_URL = isProduction
    ? "https://yapyap.herokuapp.com"
    : "http://localhost:8000";

  useEffect(() => {
    dispatch(setChannelsForServer([]));
    dispatch(fetchFriends());
  }, [dispatch]);

  // Set up socket connection for live DM updates
  useEffect(() => {
    if (!sessionUser?.id) return;

    socketRef.current = io(REACT_APP_SOCKET_IO_URL, {
      secure: isProduction,
      transports: ["websocket"],
    });

    // Join user-specific room for DM notifications
    socketRef.current.emit("joinUserRoom", { userId: sessionUser.id });

    // Listen for new DM creation
    const handleDirectMessageCreated = (data) => {
      const newDM = data?.directMessage;
      if (newDM) {
        dispatch(addDirectMessage(newDM));
      }
    };

    // Listen for DM deletion
    const handleDirectMessageDeleted = (data) => {
      const dmId = data?.dmId;
      if (dmId) {
        dispatch(removeDirectMessage(dmId));
        // If the deleted DM is currently open, close it
        if (setRoom) {
          setRoom(null);
        }
      }
    };

    socketRef.current.on("directMessageCreated", handleDirectMessageCreated);
    socketRef.current.on("directMessageDeleted", handleDirectMessageDeleted);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveUserRoom", { userId: sessionUser.id });
        socketRef.current.off("directMessageCreated", handleDirectMessageCreated);
        socketRef.current.off("directMessageDeleted", handleDirectMessageDeleted);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [sessionUser?.id, dispatch, REACT_APP_SOCKET_IO_URL, isProduction]);

  const directMessagesList = directMessages.filter((dm) => {
    return dm.ChatMembers.length > 0;
  });

  const showMessages = async (id) => {
    const res = await dispatch(getDmMessages(id));
  };

  function closeNewDMForm(ref) {
    useEffect(() => {
      /**
       * Close if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowNewDMForm(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  function closeAddFriendForm(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowAddFriendForm(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  closeNewDMForm(wrapperRef);
  closeAddFriendForm(addFriendWrapperRef);

  const handleDeleteDM = async () => {
    if (!dmToDelete) return;
    await dispatch(deleteDirectMessage(dmToDelete.id));
    dispatch(getDirectMessages());
    if (setRoom) {
      setRoom(null);
    }
    setDmToDelete(null);
  };

  const chatMembersForDelete = dmToDelete ? dmToDelete.ChatMembers.filter((member) => {
    return member.userId !== sessionUser.id;
  }) : [];

  const dmNameForDelete = chatMembersForDelete.length > 0
    ? chatMembersForDelete.map((member) => member.User.alias || member.User.username).join(", ")
    : "this direct message";

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDmToDelete(null);
        }}
        onConfirm={handleDeleteDM}
        title="Delete Direct Message"
        message={`Are you sure you want to delete ${dmNameForDelete}? This action cannot be undone.`}
        confirmText="Delete"
      />
      {showNewDMForm && (
        <NewDMForm
          wrapperRef={wrapperRef}
          setShowNewDMForm={setShowNewDMForm}
          setRoom={setRoom}
        />
      )}
      {showAddFriendForm && (
        <AddFriendForm
          wrapperRef={addFriendWrapperRef}
          setShowAddFriendForm={setShowAddFriendForm}
          onFriendAdded={() => {
            dispatch(fetchFriends());
          }}
        />
      )}
      <div className="flex w-full items-center justify-between">
        <p className="w-full text-lightGray uppercase">Direct Messages</p>
        <div className="flex items-center gap-2">
          <div
            ref={addFriendRef}
            onClick={() => setShowAddFriendForm((prev) => !prev)}
            className="group relative flex h-7 w-7 items-center justify-center cursor-pointer text-lg text-lightGray hover:text-offWhite transition-colors"
            onMouseEnter={() => setShowAddFriend(true)}
            onMouseLeave={() => setShowAddFriend(false)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 13C2 10.5 4 9 6 9C8 9 10 10.5 10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 6V10M10 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {showAddFriend && (
              <TooltipBubble title="Add Friend" triggerRef={addFriendRef} />
            )}
          </div>
          <div
            ref={createDMRef}
            onClick={() => setShowNewDMForm((prev) => !prev)}
            className="group relative flex h-7 w-7 items-center justify-center cursor-pointer text-lg text-lightGray hover:text-offWhite transition-colors"
            onMouseEnter={() => setShowCreateDM(true)}
            onMouseLeave={() => setShowCreateDM(false)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {showCreateDM && (
              <TooltipBubble title="Create DM" triggerRef={createDMRef} />
            )}
          </div>
        </div>
      </div>
      {directMessagesList.length > 0 && directMessagesList.map((dm) => {
        const chatMembers = dm.ChatMembers.filter((member) => {
          return member.userId !== sessionUser.id;
        });

        return (
          <div
            key={dm.id}
            className="w-full flex items-center gap-4 hover:bg-demoButtonHover px-2 py-1 rounded-md group relative"
          >
            <div
              className="flex items-center gap-4 flex-1 cursor-pointer"
              onClick={() => {
                setRoom(dm.id);
                showMessages(dm.id);
              }}
            >
              <img
                className="w-10 h-10 rounded-full"
                src={
                  dm.ChatMembers.length > 1
                    ? `https://api.dicebear.com/5.x/identicon/svg?seed=Aneka&backgroundType=gradientLinear`
                    : images[11]?.url
                }
                alt="avatar"
              />
              <div className="w-full flex flex-col min-h-2">
                <div className="w-full flex gap-2 items-center justify-start">
                  {chatMembers.map((member, i) => {
                    return (
                      <span key={member.id} className="text-lightGray">
                        {member.User.alias
                          ? member.User.alias
                          : member.User.username}
                        {i !== chatMembers.length - 1 && chatMembers.length > 1
                          ? ", "
                          : " "}
                      </span>
                    );
                  })}
                </div>
                <p className="text-lightGray text-sm">
                  {dm.ChatMembers.length > 1
                    ? `${dm.ChatMembers.length} members`
                    : ""}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDmToDelete(dm);
                setShowDeleteModal(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded text-lightGray hover:text-red-400"
              title="Delete DM"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2V3H2V5H3V13C3 13.5304 3.21071 14.0391 3.58579 14.4142C3.96086 14.7893 4.46957 15 5 15H11C11.5304 15 12.0391 14.7893 12.4142 14.4142C12.7893 14.0391 13 13.5304 13 13V5H14V3H10V2C10 1.46957 9.78929 0.960859 9.41421 0.585786C9.03914 0.210714 8.53043 0 8 0H8C7.46957 0 6.96086 0.210714 6.58579 0.585786C6.21071 0.960859 6 1.46957 6 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 7V12M10 7V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DirectMessagesList;
