import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getAllChannelsForServer } from '../../store/channels';
import { getMessages } from '../../store/messages';
import Channels from '../Channels/ChannelForm';
import ChannelModal from '../Channels/ChannelModal';
import Messages from '../Messages';
import AddFriendToServerForm from '../Servers/AddFriendToServerForm';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import { leaveServer, deleteServer } from '../../store/servers';
import signoutIcon from '../../../assets/images/signout.svg';
import trashIcon from '../../../assets/images/trashIcon.svg';
import Logout from '../../auth/Logout';

const TooltipBubble = ({ title, triggerRef }) => {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (triggerRef?.current && tooltipRef?.current) {
      const updatePosition = () => {
        if (!triggerRef?.current || !tooltipRef?.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        
        let tooltipWidth = 120; // Default estimate
        if (tooltipRef.current.offsetWidth > 0) {
          tooltipWidth = tooltipRef.current.offsetWidth;
        }
        
        // Position tooltip to the left of the trigger
        const left = triggerRect.left - tooltipWidth - 12; // 12px spacing
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
      className="pointer-events-none fixed w-fit h-fit bg-black text-white rounded-md flex items-center px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      style={{ 
        left: `${position.left}px`, 
        top: `${position.top}px`, 
        transform: 'translateY(-50%)',
        zIndex: 2147483647,
        isolation: 'isolate',
        willChange: 'transform'
      }}
    >
      <span className="absolute right-[-0.375rem] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-black" />
      <span className="relative uppercase tracking-[0.22em] font-semibold text-xs">{title}</span>
    </div>
  );

  // Render tooltip directly to document.body using Portal - this bypasses all stacking contexts
  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(tooltipContent, document.body);
  }
  return null;
};

// Mobile User Menu Component
const MobileUserMenu = ({ sessionUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const history = useHistory();
  const images = useSelector((state) => state.images);
  const users = useSelector((state) => state.session.users);
  const currentUser = users?.find((user) => user.id === sessionUser?.id);
  const displayUser = currentUser || sessionUser;

  const profileImageUrl =
    currentUser?.Image?.url ||
    (displayUser?.imageId && images?.[displayUser.imageId]?.url) ||
    null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-darkGray active:scale-95 transition-all touch-manipulation"
        aria-label="User menu"
      >
        <img
          className="h-7 w-7 rounded-full object-cover border border-borderMuted/40 sm:h-8 sm:w-8"
          src={
            profileImageUrl ||
            `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
              displayUser?.username || "Guest"
            )}&backgroundType=gradientLinear`
          }
          alt={`${displayUser?.username || "Guest"} avatar`}
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-11 w-48 rounded-lg border border-borderMuted/60 bg-midGray shadow-soft-card overflow-hidden z-[60]">
          <div className="px-4 py-3 border-b border-borderMuted/60">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-10 rounded-full object-cover border border-borderMuted/40"
                src={
                  profileImageUrl ||
                  `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                    displayUser?.username || "Guest"
                  )}&backgroundType=gradientLinear`
                }
                alt={`${displayUser?.username || "Guest"} avatar`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-offWhite truncate">
                  {displayUser?.username || "Guest"}
                </p>
                {displayUser?.alias && (
                  <p className="text-xs text-lightGray truncate">
                    {displayUser.alias}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                history.push('/app');
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-offWhite hover:bg-darkGray transition-colors flex items-center gap-3 active:scale-95 touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Direct Messages
            </button>
            <div className="border-t border-borderMuted/60 my-1" />
            <div className="px-4 py-2.5">
              <Logout />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ServerDetails({ sessionUser }) {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const server = useSelector(state => state.servers[serverId]);
    const server_name = server?.server_name;
    const isOwner = server?.ownerId === sessionUser?.id;
    const channelsObj = useSelector(state => state.channels);
    // setChannelsForServer replaces the entire state with channels for the current server
    // So all channels in the store should already be for this server
    const channels = Object.values(channelsObj);
    const messages = Object.values(useSelector(state => state.messages));
    const images = useSelector(state => state.images);
    const [channelId, setChannelId] = useState(null);
    const [messagesLoaded, setMessagesLoaded] = useState([]);
    const [showAddFriendForm, setShowAddFriendForm] = useState(false);
    const [showAddFriendTooltip, setShowAddFriendTooltip] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showLeaveTooltip, setShowLeaveTooltip] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);
    const addFriendFormRef = useRef(null);
    const addFriendButtonRef = useRef(null);
    const leaveButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);

    // Reset channel selection when server changes
    useEffect(() => {
        setChannelId(null);
        setHasAutoOpened(false);
    }, [serverId])

    // fetches channels for selected server
    useEffect(() => {
        if (serverId) {
            dispatch(getAllChannelsForServer(serverId));
        }
    },[serverId, dispatch])

    useEffect(() => {
        if (!channelId && channels.length > 0 && !hasAutoOpened && window.innerWidth < 768) {
            const drawer = document.getElementById('mobile-server-drawer');
            const overlay = document.getElementById('mobile-server-overlay');
            if (drawer && overlay) {
                // Small delay to ensure drawer is rendered
                setTimeout(() => {
                    drawer.style.transform = 'translateX(0)';
                    overlay.style.display = 'block';
                    setTimeout(() => overlay.style.opacity = '1', 10);
                    setHasAutoOpened(true);
                }, 100);
            }
        }
    }, [channelId, channels.length, hasAutoOpened])

    async function selectChannel(id) {
        setChannelId(id);
        const messages = await dispatch(getMessages(id));
        setMessagesLoaded(messages);
    }

    const handleLeaveServer = async () => {
        try {
            const result = await dispatch(leaveServer(serverId));
            if (result && result.ok) {
                // Redirect to DMs after leaving
                history.push('/app');
            } else {
                alert(result?.error || "Failed to leave server");
            }
        } catch (error) {
            console.error("Error leaving server:", error);
            alert("An error occurred while leaving the server");
        }
    };

    const handleDeleteServer = async () => {
        try {
            const result = await dispatch(deleteServer(serverId));
            if (result && result.ok) {
                // Redirect to DMs after deleting
                history.push('/app');
            } else {
                alert(result?.error || "Failed to delete server");
            }
        } catch (error) {
            console.error("Error deleting server:", error);
            alert("An error occurred while deleting the server");
        }
    };

  return (
    <div className="App flex relative w-full h-screen h-[100dvh]">
      <div className="relative scrollbar z-0 hidden md:flex min-w-[18em] w-[18em] max-w-[18em] py-2 px-3 min-h-screen max-h-screen overflow-auto bg-midGray flex-col items-start">
        <div className="w-full flex items-center justify-between mb-5">
          <h1 className="text-offWhite text-lg ml-1">
            {server_name}
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                ref={addFriendButtonRef}
                onClick={() => setShowAddFriendForm(true)}
                onMouseEnter={() => setShowAddFriendTooltip(true)}
                onMouseLeave={() => setShowAddFriendTooltip(false)}
                className="text-lightGray hover:text-offWhite text-xl font-bold cursor-pointer transition-colors duration-200"
              >
                +
              </button>
              {showAddFriendTooltip && (
                <TooltipBubble title="Add Friend to Server" triggerRef={addFriendButtonRef} />
              )}
            </div>
            {isOwner && (
              <div className="relative">
                <button
                  ref={deleteButtonRef}
                  onClick={() => setShowDeleteModal(true)}
                  onMouseEnter={() => setShowDeleteTooltip(true)}
                  onMouseLeave={() => setShowDeleteTooltip(false)}
                  className="text-lightGray hover:text-red-400 cursor-pointer transition-colors duration-200 p-1.5 rounded hover:bg-red-500/10 flex items-center justify-center"
                  title="Delete Server"
                >
                  <img 
                    src={trashIcon} 
                    alt="Delete Server" 
                    className="w-4 h-4"
                  />
                </button>
                {showDeleteTooltip && (
                  <TooltipBubble title="Delete Server" triggerRef={deleteButtonRef} />
                )}
              </div>
            )}
            {!isOwner && (
              <div className="relative">
                <button
                  ref={leaveButtonRef}
                  onClick={() => setShowLeaveModal(true)}
                  onMouseEnter={() => setShowLeaveTooltip(true)}
                  onMouseLeave={() => setShowLeaveTooltip(false)}
                  className="text-lightGray hover:text-red-400 cursor-pointer transition-colors duration-200 p-1.5 rounded hover:bg-red-500/10 flex items-center justify-center"
                  title="Leave Server"
                >
                  <img 
                    src={signoutIcon} 
                    alt="Leave Server" 
                    className="w-4 h-4"
                  />
                </button>
                {showLeaveTooltip && (
                  <TooltipBubble title="Leave Server" triggerRef={leaveButtonRef} />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full justify-between mb-2">
          <h1 className="text-offWhite text-lg ml-1">Text Channels</h1>
          <ChannelModal formType='Create'/>
        </div>
        {channels && channels.length > 0 ? (
          channels.map((channel) => {
            return (
              <div
                key={channel.id}
                // make the button active if it is the selected channel
                className={`w-full flex justify-between text-offWhite text-left text-sm mb-1 pl-4 hover:bg-darkGray cursor-pointer rounded min-h-fit h-8 ${
                  channelId === channel.id ? 'bg-darkGray text-bold' : ''
                }`}
                onClick={() => selectChannel(channel.id)}
              >
                <div
                  className='mt-1'
                >
                  # {channel.channel_name}
                </div>
                <ChannelModal channel={channel} formType='Update' />
              </div>
            );
          })
        ) : (
          <div className="w-full px-4 py-3 text-center">
            <p className="text-lightGray text-sm">No channels yet. Create one to get started!</p>
          </div>
        )}
      </div>
      {/* Mobile: Server sidebar overlay */}
      <div 
        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300" 
        style={{ display: 'none', opacity: 0 }} 
        id="mobile-server-overlay"
        onClick={() => {
          const drawer = document.getElementById('mobile-server-drawer');
          const overlay = document.getElementById('mobile-server-overlay');
          if (drawer) drawer.style.transform = 'translateX(-100%)';
          if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 300);
          }
        }}
      />
      {/* Mobile: Server sidebar drawer */}
      <div className="md:hidden fixed left-0 top-0 z-50 h-full w-[85vw] max-w-[18em] bg-midGray transform -translate-x-full transition-transform duration-300 ease-in-out shadow-2xl" id="mobile-server-drawer">
        <div className="relative scrollbar h-full overflow-y-auto py-2 px-3 flex flex-col w-full">
          <div className="w-full flex items-center justify-between mb-5 pt-4 flex-shrink-0">
            <button
              onClick={() => {
                const drawer = document.getElementById('mobile-server-drawer');
                const overlay = document.getElementById('mobile-server-overlay');
                if (drawer) drawer.style.transform = 'translateX(-100%)';
                if (overlay) {
                  overlay.style.opacity = '0';
                  setTimeout(() => overlay.style.display = 'none', 300);
                }
              }}
              className="text-lightGray hover:text-offWhite text-2xl font-bold cursor-pointer transition-colors duration-200 mr-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-darkGray active:scale-95 touch-manipulation"
            >
              ×
            </button>
            <h1 className="text-offWhite text-lg ml-1 flex-1">
              {server_name}
            </h1>
            <button
              onClick={() => {
                history.push('/app');
                const drawer = document.getElementById('mobile-server-drawer');
                const overlay = document.getElementById('mobile-server-overlay');
                if (drawer) drawer.style.transform = 'translateX(-100%)';
                if (overlay) {
                  overlay.style.opacity = '0';
                  setTimeout(() => overlay.style.display = 'none', 300);
                }
              }}
              className="text-lightGray hover:text-offWhite text-lg cursor-pointer transition-colors duration-200 p-2 rounded-lg hover:bg-darkGray active:scale-95 touch-manipulation"
              title="Back to DMs"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  ref={addFriendButtonRef}
                  onClick={() => setShowAddFriendForm(true)}
                  onMouseEnter={() => setShowAddFriendTooltip(true)}
                  onMouseLeave={() => setShowAddFriendTooltip(false)}
                  className="text-lightGray hover:text-offWhite text-xl font-bold cursor-pointer transition-colors duration-200"
                >
                  +
                </button>
                {showAddFriendTooltip && (
                  <TooltipBubble title="Add Friend to Server" triggerRef={addFriendButtonRef} />
                )}
              </div>
              {isOwner && (
                <div className="relative">
                  <button
                    ref={deleteButtonRef}
                    onClick={() => setShowDeleteModal(true)}
                    onMouseEnter={() => setShowDeleteTooltip(true)}
                    onMouseLeave={() => setShowDeleteTooltip(false)}
                    className="text-lightGray hover:text-red-400 cursor-pointer transition-colors duration-200 p-1.5 rounded hover:bg-red-500/10 flex items-center justify-center"
                    title="Delete Server"
                  >
                    <img 
                      src={trashIcon} 
                      alt="Delete Server" 
                      className="w-4 h-4"
                    />
                  </button>
                  {showDeleteTooltip && (
                    <TooltipBubble title="Delete Server" triggerRef={deleteButtonRef} />
                  )}
                </div>
              )}
              {!isOwner && (
                <div className="relative">
                  <button
                    ref={leaveButtonRef}
                    onClick={() => setShowLeaveModal(true)}
                    onMouseEnter={() => setShowLeaveTooltip(true)}
                    onMouseLeave={() => setShowLeaveTooltip(false)}
                    className="text-lightGray hover:text-red-400 cursor-pointer transition-colors duration-200 p-1.5 rounded hover:bg-red-500/10 flex items-center justify-center"
                    title="Leave Server"
                  >
                    <img 
                      src={signoutIcon} 
                      alt="Leave Server" 
                      className="w-4 h-4"
                    />
                  </button>
                  {showLeaveTooltip && (
                    <TooltipBubble title="Leave Server" triggerRef={leaveButtonRef} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full justify-between mb-3 mt-2 flex-shrink-0">
            <h1 className="text-offWhite text-lg ml-1 font-semibold">Text Channels</h1>
            <ChannelModal formType='Create'/>
          </div>
          <div className="w-full space-y-1 flex-1 min-h-0 overflow-y-auto">
            {channels && channels.length > 0 ? (
              channels.map((channel) => {
                if (!channel || !channel.id) return null;
                return (
                  <div
                    key={channel.id}
                    className={`w-full flex justify-between text-offWhite text-left text-sm mb-1 pl-4 hover:bg-darkGray cursor-pointer rounded min-h-fit h-8 items-center transition-colors ${
                      channelId === channel.id ? 'bg-darkGray text-bold' : ''
                    }`}
                    onClick={() => {
                      selectChannel(channel.id);
                      // Close drawer on mobile after selecting channel
                      const drawer = document.getElementById('mobile-server-drawer');
                      const overlay = document.getElementById('mobile-server-overlay');
                      if (drawer) drawer.style.transform = 'translateX(-100%)';
                      if (overlay) {
                        overlay.style.opacity = '0';
                        setTimeout(() => overlay.style.display = 'none', 300);
                      }
                    }}
                  >
                    <div className='flex items-center flex-1 min-w-0'>
                      <span className="text-lightGray mr-1">#</span>
                      <span className="truncate">{channel.channel_name}</span>
                    </div>
                    <ChannelModal channel={channel} formType='Update' />
                  </div>
                );
              })
            ) : (
              <div className="w-full px-4 py-3 text-center">
                <p className="text-lightGray text-sm">No channels yet. Create one to get started!</p>
              </div>
            )}
          </div>
          {/* Mobile drawer footer with user info and logout */}
          <div className="mt-auto w-full border-t border-borderMuted/60 pt-3 pb-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3 px-2">
              <img
                className="h-10 w-10 rounded-full object-cover border border-borderMuted/40"
                src={
                  sessionUser?.Image?.url ||
                  (sessionUser?.imageId ? images?.[sessionUser.imageId]?.url : null) ||
                  `https://api.dicebear.com/5.x/identicon/svg?seed=${encodeURIComponent(
                    sessionUser?.username || "Guest"
                  )}&backgroundType=gradientLinear`
                }
                alt={`${sessionUser?.username || "Guest"} avatar`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-offWhite truncate">
                  {sessionUser?.username || "Guest"}
                </p>
                {sessionUser?.alias && (
                  <p className="text-xs text-lightGray truncate">
                    {sessionUser.alias}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                history.push('/app');
                const drawer = document.getElementById('mobile-server-drawer');
                const overlay = document.getElementById('mobile-server-overlay');
                if (drawer) drawer.style.transform = 'translateX(-100%)';
                if (overlay) {
                  overlay.style.opacity = '0';
                  setTimeout(() => overlay.style.display = 'none', 300);
                }
              }}
              className="w-full px-3 py-2 text-left text-sm text-offWhite hover:bg-darkGray rounded-lg transition-colors flex items-center gap-2 mb-2 active:scale-95 touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Direct Messages
            </button>
            <div className="px-2">
              <Logout />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile: Server header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-2 bg-midGray/95 backdrop-blur-sm border-b border-borderMuted/60 px-3 py-2.5 shadow-soft-card sm:gap-3 sm:px-4 sm:py-3">
        <button
          onClick={() => {
            const drawer = document.getElementById('mobile-server-drawer');
            const overlay = document.getElementById('mobile-server-overlay');
            if (drawer) {
              drawer.style.transform = 'translateX(0)';
            }
            if (overlay) {
              overlay.style.display = 'block';
              setTimeout(() => overlay.style.opacity = '1', 10);
            }
          }}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-darkGray active:scale-95 transition-all touch-manipulation"
          aria-label="Open server menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={() => history.push('/app')}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-offWhite hover:bg-darkGray active:scale-95 transition-all touch-manipulation"
          aria-label="Back to DMs"
          title="Back to Direct Messages"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <h1 className="text-offWhite text-sm font-semibold flex-1 truncate sm:text-base">
          {server_name}
        </h1>
        {channelId && channels.find(c => c.id === channelId) && (
          <span className="text-lightGray text-xs truncate max-w-[25%] sm:text-sm sm:max-w-[30%]">
            #{channels.find(c => c.id === channelId)?.channel_name}
          </span>
        )}
        <MobileUserMenu sessionUser={sessionUser} />
      </div>
      <div className="bg-chatBg w-full flex flex-col flex-1 min-h-0 md:min-h-0 pt-12 sm:pt-14 md:pt-0 overflow-hidden">
        {channelId && (
          <Messages
            messages={messages}
            channelId={channelId}
            room={channelId ? `channel-${channelId}` : null}
            isServerView={true}
          />
        )}
        {!channelId && (
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <div className="text-white/60">
              <p className="text-lg font-semibold mb-2">No channel selected</p>
              <p className="text-sm mb-4">Open the menu to select a channel</p>
              <button
                onClick={() => {
                  const drawer = document.getElementById('mobile-server-drawer');
                  const overlay = document.getElementById('mobile-server-overlay');
                  if (drawer) {
                    drawer.style.transform = 'translateX(0)';
                  }
                  if (overlay) {
                    overlay.style.display = 'block';
                    setTimeout(() => overlay.style.opacity = '1', 10);
                  }
                }}
                className="md:hidden px-4 py-2 bg-midGray hover:bg-darkGray text-offWhite rounded-lg transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Open Channels Menu
              </button>
            </div>
          </div>
        )}
      </div>
      {showAddFriendForm && (
        <AddFriendToServerForm
          setShowAddFriendForm={setShowAddFriendForm}
          wrapperRef={addFriendFormRef}
          serverId={serverId}
          onFriendAdded={() => {
            // Optionally refresh server data or show success message
          }}
        />
      )}
      {showLeaveModal && (
        <DeleteConfirmationModal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={handleLeaveServer}
          title="Leave Server"
          message={`Are you sure you want to leave "${server_name}"? You won't be able to rejoin unless someone invites you.`}
          confirmText="Leave Server"
          cancelText="Cancel"
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteServer}
          title="Delete Server"
          message={`Are you sure you want to delete "${server_name}"? This action cannot be undone. All channels and messages will be permanently deleted.`}
          confirmText="Delete Server"
          cancelText="Cancel"
        />
      )}
    </div>
  );
}
