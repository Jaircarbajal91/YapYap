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

export default function ServerDetails({ sessionUser }) {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const server = useSelector(state => state.servers[serverId]);
    const server_name = server?.server_name;
    const isOwner = server?.ownerId === sessionUser?.id;
    const channelsObj = useSelector(state => state.channels);
    const channels = Object.values(channelsObj);
    const messages = Object.values(useSelector(state => state.messages));
    const [channelId, setChannelId] = useState(null);
    const [messagesLoaded, setMessagesLoaded] = useState([]);
    const [showAddFriendForm, setShowAddFriendForm] = useState(false);
    const [showAddFriendTooltip, setShowAddFriendTooltip] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showLeaveTooltip, setShowLeaveTooltip] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
    const addFriendFormRef = useRef(null);
    const addFriendButtonRef = useRef(null);
    const leaveButtonRef = useRef(null);
    const deleteButtonRef = useRef(null);

    // fetches channels for selected server
    useEffect(() => {
        dispatch(getAllChannelsForServer(serverId));
    },[serverId])

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
    <div className="App flex relative w-full h-screen">
      <div className="relative scrollbar z-0 min-w-[18em] w-[18em] max-w-[18em] py-2 px-3 min-h-screen max-h-screen overflow-auto bg-midGray flex flex-col items-start">
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
        <div className="flex w-full justify-between">
          <h1 className="text-offWhite text-lg ml-1">Text Channels</h1>
          <ChannelModal formType='Create'/>
        </div>
        {channels &&
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
          })}
      </div>
      <div className="bg-chatBg w-full flex flex-col min-h-0">
        {channelId && (
          <Messages
            messages={messages}
            channelId={channelId}
            room={channelId ? `channel-${channelId}` : null}
            isServerView={true}
          />
        )}
      </div>
      {showAddFriendForm && (
        <AddFriendToServerForm
          setShowAddFriendForm={setShowAddFriendForm}
          wrapperRef={addFriendFormRef}
          serverId={serverId}
          onFriendAdded={() => {
            // Optionally refresh server data or show success message
            console.log("Friend added to server");
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
