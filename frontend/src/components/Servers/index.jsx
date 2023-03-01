import React, { useEffect, useState } from "react";
import { getServers } from "../../store/servers";
import Messages from "../Messages";
import { getMessages } from "../../store/messages";
import { useDispatch, useSelector } from "react-redux";
import AddServerForm from "./AddServerForm";
import greenPlusIcon from "../../../assets/images/greenPlusIcon.svg";
import whitePlusIcon from "../../../assets/images/whitePlusIcon.svg";
import discordIcon from "../../../assets/images/discordIcon.svg";
import { Modal } from "../../context/Modal";
import { getImages } from "../../store/aws_images";
import { useHistory } from "react-router-dom";

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

  useEffect(() => {
    setIsLoaded(false)
    dispatch(getImages()).then(() => setIsLoaded(true))
  }, [dispatch, showNewServerModal]);

  useEffect(() => {
    dispatch(getServers()).then(() => setIsLoaded(true));
  }, [dispatch]);


  const selectServer = (e) => {
    e.preventDefault();
    // display the channels of the server that was clicked
    const targetServer = servers.find(
      server => server.id === parseInt(e.target.id)
    );
    setChannels(targetServer.Channels);
    history.push(`/app/${targetServer.id}`);
  };

  const selectChannel = async (e) => {
    e.preventDefault();
    // display the messages of the channel that was clicked
    setChannelId(e.target.id);
    const messages = await dispatch(getMessages(e.target.id));
    setMessagesLoaded(messages);
  };


  return (
    isLoaded && (
      <>
      {showNewServerModal && (
        <Modal onClose={() => setShowNewServerModal(false)}>
            <AddServerForm setShowNewServerModal={setShowNewServerModal}/>
        </Modal>
      )}
        <div className="flex flex-col gap-2 items-center justify-start bg-serverBg text-lightGray max-w-[4%] w-[3%] min-w-fit py-2 px-1 min-h-screen max-h-screen overflow-auto">
          <div
            id="DMs"
            onMouseEnter={() => setShowDMSpan(true)}
            onMouseLeave={() => setShowDMSpan(false)}
            onClick=''
            className="flex justify-center items-center cursor-pointer min-w-[3.6em] min-h-[3.6em] w-[3.6em] h-[3.6em] rounded-[50%] bg-chatBg transform-all ease-in-out duration-300 hover:transition-all hover:rounded-[30%] "
          >
            <div className={`${showDMSpan ? 'inline' : 'hidden'} absolute w-fit h-fit bg-black text-white rounded-md left-[4.5em] z-50 flex items-center`}>
              <div className="relative w-2 h-2 bg-black rotate-45 -left-1"></div>
              <span className="p-2 -ml-1 text-center capitalize font-bold">Direct Messages</span>
            </div>
            <img className={`w-[2.5em] h-[2.5em] max-w-[100%] max-h-[100%] object-cover rounded-full hover:rounded-[30%] ease-in-out cursor-pointer`} src={discordIcon} alt="direct messages" />
          </div>
          <hr className="border border-solid border-darkGrey w-[50%]" />
          {servers.map((server, i) => {
            return (
              <div
                key={server.id}
                id={server.id}
                onMouseEnter={() => {
                  setChannelIdx(i)
                  setShowChannelName(true)
                }}
                onMouseLeave={() => {
                  setShowChannelName(false)
                  setChannelIdx(-1)
                }}
                className="flex justify-center items-center cursor-pointer min-w-[3.6em] min-h-[3.6em] w-[3.6em] h-[3.6em] rounded-[50%] bg-chatBg transform-all ease-in-out duration-300 hover:transition-all hover:rounded-[30%] "
                onClick={selectServer}
              >
                <div className={`${showChannelName && channelIdx === i ? 'inline' : 'hidden'} absolute w-fit h-fit bg-black text-white rounded-md left-[4.5em] z-50 flex items-center`}>
                  <div className="relative w-2 h-2 bg-black rotate-45 -left-1"></div>
                  <span className="p-2 -ml-1 text-center capitalize font-bold">{server.server_name}</span>
                </div>
                <img className={`${!server.imageId ? 'w-[2.5em] h-[2.5em]' : 'min-w-[100%] min-h-[100%] w-[100%] h-[100%]'} max-w-[100%] max-h-[100%] object-cover rounded-full hover:rounded-[30%] ease-in-out`} src={server.imageId ? images[server.imageId].url : discordIcon} alt={`${server.server_name}`} />

              </div>
            );
          })}
          <div
            onClick={() => setShowNewServerModal(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex
                      justify-center
                      items-center
                      cursor-pointer
                      w-[3.6em]
                      h-[3.6em]
                      rounded-[50%] bg-chatBg transform-all ease-in-out duration-300 hover:transition-all hover:bg-serverGreen hover:rounded-[30%]"
          >
             <div className={`${isHovered ? 'inline' : 'hidden'} absolute w-fit h-fit bg-black text-white rounded-md left-[4.5em] z-50 flex items-center`}>
              <div className="relative w-2 h-2 bg-black rotate-45 -left-1"></div>
              <span className="p-2 -ml-1 text-center capitalize font-bold">Add a Server</span>
            </div>
            <img
              className="w-[2em] h-[2em] plus-icon"
              src={isHovered ? whitePlusIcon : greenPlusIcon}
              alt=""
            />
          </div>
        </div>
        {/* {channels && channels.map(channel => {
                return (
                <button key={channel.id} id={channel.id} className="text-lg" onClick={selectChannel}>
                    {channel.channel_name}
                </button>
            )})}
            {messages.length > 0 && <Messages messages={messages} channelId={channelId}/>} */}
      </>
    )
  );
};

export default Servers;
