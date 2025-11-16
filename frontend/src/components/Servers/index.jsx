import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { getServers, memberAddedToServer, memberRemovedFromServer } from "../../store/servers";
import Messages from "../Messages";
import { getMessages } from "../../store/messages";
import { useDispatch, useSelector } from "react-redux";
import AddServerForm from "./AddServerForm";
import greenPlusIcon from "../../../assets/images/greenPlusIcon.svg";
import whitePlusIcon from "../../../assets/images/whitePlusIcon.svg";
import discordIcon from "../../../assets/images/discordIcon.svg";
import { Modal } from "../../context/Modal";
import { getImages } from "../../store/aws_images";
import { Link, useHistory } from "react-router-dom";
import { io } from "socket.io-client";

const TooltipBubble = ({ title, subtitle, triggerRef }) => {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (triggerRef?.current && tooltipRef?.current) {
      const updatePosition = () => {
        if (!triggerRef?.current || !tooltipRef?.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        
        // Position tooltip to the right of the trigger, vertically centered
        const left = triggerRect.right + 0.85 * 16; // 0.85rem in pixels
        const top = triggerRect.top + (triggerRect.height / 2);
        
        setPosition({ left, top });
      };
      
      // Small delay to ensure tooltip is rendered before calculating
      const timeoutId = setTimeout(updatePosition, 0);
      
      // Update on scroll/resize
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
      className="pointer-events-none fixed flex-col gap-1 rounded-md bg-black px-3 py-2 text-xs text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
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
      <span className="relative font-semibold uppercase tracking-[0.22em]">
        {title}
      </span>
      {subtitle && (
        <span className="relative text-[0.68rem] font-normal uppercase tracking-[0.18em] text-white/80">
          {subtitle}
        </span>
      )}
    </div>
  );

  // Render tooltip directly to document.body using Portal - this bypasses all stacking contexts
  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(tooltipContent, document.body);
  }
  return null;
};

const Servers = ({ sessionUser }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const servers = Object.values(useSelector((state) => state.servers));
  const messages = Object.values(useSelector((state) => state.messages));
  const images = useSelector((state) => state.images);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState(servers?.[0]?.Channels);
  const [channelId, setChannelId] = useState(channels?.[0]?.id);
  const [messagesLoaded, setMessagesLoaded] = useState(messages);
  const [showNewServerModal, setShowNewServerModal] = useState(false);
  const [channelIdx, setChannelIdx] = useState(-1);
  const [showChannelName, setShowChannelName] = useState(false);
  const [showDMSpan, setShowDMSpan] = useState(false);
  
  const dmButtonRef = useRef(null);
  const addServerRef = useRef(null);
  const serverRefs = useRef({});
  const socketRef = useRef(null);

  const isProduction = process.env.NODE_ENV === "production";
  const REACT_APP_SOCKET_IO_URL = isProduction
    ? "https://yapyap.herokuapp.com"
    : "http://localhost:8000";

  useEffect(() => {
    setIsLoaded(false)
    dispatch(getImages()).then(() => setIsLoaded(true))
  }, [dispatch]);

  useEffect(() => {
    dispatch(getServers()).then(() => setIsLoaded(true));
  }, [dispatch]);

  // Set up socket connection for live server updates
  useEffect(() => {
    if (!sessionUser?.id) return;

    socketRef.current = io(REACT_APP_SOCKET_IO_URL, {
      secure: isProduction,
      transports: ["websocket", "polling"],
    });

    // Join user-specific room for server notifications
    socketRef.current.emit("joinUserRoom", { userId: sessionUser.id });

    // Listen for server member added
    const handleServerMemberAdded = (data) => {
      if (data?.server) {
        // User was added to a server - add it to their list
        dispatch(memberAddedToServer(data.server));
      }
    };

    // Listen for server member removed
    const handleServerMemberRemoved = (data) => {
      if (data?.serverId) {
        // User left a server - remove it from their list
        dispatch(memberRemovedFromServer(data.serverId));
      }
    };

    // Listen for server deleted
    const handleServerDeleted = (data) => {
      if (data?.serverId) {
        // Server was deleted - remove it from the list
        dispatch(memberRemovedFromServer(data.serverId));
      }
    };

    socketRef.current.on("serverMemberAdded", handleServerMemberAdded);
    socketRef.current.on("serverMemberRemoved", handleServerMemberRemoved);
    socketRef.current.on("serverDeleted", handleServerDeleted);

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveUserRoom", { userId: sessionUser.id });
        socketRef.current.off("serverMemberAdded", handleServerMemberAdded);
        socketRef.current.off("serverMemberRemoved", handleServerMemberRemoved);
        socketRef.current.off("serverDeleted", handleServerDeleted);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [sessionUser?.id, dispatch, REACT_APP_SOCKET_IO_URL, isProduction]);

  const selectChannel = async (e) => {
    e.preventDefault();
    // display the messages of the channel that was clicked
    setChannelId(e.target.id);
    const messages = await dispatch(getMessages(e.target.id));
    setMessagesLoaded(messages);
  };

  const goBackToDMs = () => {
    history.push('/app')
  }


  return (
    isLoaded && (
      <>
      {showNewServerModal && (
        <Modal onClose={() => setShowNewServerModal(false)}>
            <AddServerForm setShowNewServerModal={setShowNewServerModal}/>
        </Modal>
      )}
        <div className="scrollbar relative z-50 flex w-full flex-row items-center gap-3 overflow-x-auto border-b border-borderMuted/50 bg-serverBg/80 px-3 py-2 text-lightGray shadow-soft-card backdrop-blur md:h-screen md:w-[5.25rem] md:flex-col md:items-center md:justify-start md:gap-4 md:overflow-x-visible md:overflow-y-auto md:border-b-0 md:border-r md:border-borderMuted/60 md:px-2 md:py-4 md:shadow-none">
          <div
            ref={dmButtonRef}
            onClick={goBackToDMs}
            id="DMs"
            onMouseEnter={() => setShowDMSpan(true)}
            onMouseLeave={() => setShowDMSpan(false)}
            className="group relative flex h-[3.4em] w-[3.4em] min-w-[3.4em] cursor-pointer items-center justify-center rounded-[50%] bg-chatBg/70 shadow-inner-card transition-all duration-300 hover:rounded-[30%] hover:bg-chatBg"
          >
            {showDMSpan && (
              <TooltipBubble title="Direct Messages" subtitle="Home base" triggerRef={dmButtonRef} />
            )}
            <img className="h-[2.3em] w-[2.3em] rounded-full object-cover transition-all duration-300 hover:rounded-[30%]" src={discordIcon} alt="direct messages" />
          </div>
          <hr className="hidden w-full border border-solid border-borderMuted/30 md:block" />
          {servers.map((server, i) => {
            if (!serverRefs.current[server.id]) {
              serverRefs.current[server.id] = React.createRef();
            }
            return (
              <div
                key={server.id}
                ref={serverRefs.current[server.id]}
                onMouseEnter={() => {
                  setChannelIdx(i)
                  setShowChannelName(true)
                }}
                onMouseLeave={() => {
                  setShowChannelName(false)
                  setChannelIdx(-1)
                }}
                className="group relative flex h-[3.4em] w-[3.4em] min-w-[3.4em] cursor-pointer items-center justify-center rounded-[50%] bg-chatBg/70 shadow-inner-card transition-all duration-300 hover:rounded-[30%] hover:bg-chatBg"
              >
                {showChannelName && channelIdx === i && (
                  <TooltipBubble title={server.server_name} triggerRef={serverRefs.current[server.id]} />
                )}
                <Link
                  to={`/app/${server.id}`}
                  className="flex h-full w-full items-center justify-center"
                >
                  <img className={`${!server.imageId ? 'h-[2.3em] w-[2.3em]' : 'h-full w-full'} rounded-full object-cover transition-all duration-300 hover:rounded-[30%]`} src={server.imageId ? images[server.imageId]?.url : discordIcon} alt={`${server.server_name}`} />
                </Link>
              </div>
            );
          })}
          <div
            ref={addServerRef}
            onClick={() => setShowNewServerModal(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative flex h-[3.4em] w-[3.4em] min-w-[3.4em] cursor-pointer items-center justify-center rounded-[50%] bg-chatBg/70 shadow-inner-card transition-all duration-300 hover:rounded-[30%] hover:bg-serverGreen"
          >
            {isHovered && (
              <TooltipBubble title="Add a Server" subtitle="Create space" triggerRef={addServerRef} />
            )}
            <img
              className="h-[2em] w-[2em] transition-transform duration-200 group-hover:rotate-90"
              src={isHovered ? whitePlusIcon : greenPlusIcon}
              alt=""
            />
          </div>
        </div>
      </>
    )
  );
};

export default Servers;
