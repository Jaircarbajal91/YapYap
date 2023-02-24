import React, { useEffect, useState } from "react";
import { getServers } from "../../store/servers";
import Messages from "../Messages";
import { getMessages } from "../../store/messages";
import { useDispatch, useSelector } from "react-redux";
import AddServerForm from "./AddServerForm";
import greenPlusIcon from "../../../assets/images/greenPlusCcon.svg";
import whitePlusIcon from "../../../assets/images/whitePlusIcon.svg";
import { Modal } from "../../context/Modal";

const Servers = ({ sessionUser }) => {
  const dispatch = useDispatch();
  const servers = Object.values(useSelector((state) => state.servers));
  const messages = Object.values(useSelector((state) => state.messages));
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState(servers?.[0]?.Channels);
  const [channelId, setChannelId] = useState(channels?.[0]?.id);
  const [messagesLoaded, setMessagesLoaded] = useState([]);
  const [showNewServerModal, setShowNewServerModal] = useState(false);

  useEffect(() => {
    dispatch(getServers()).then(() => setIsLoaded(true));
  }, [dispatch]);

  const selectServer = (e) => {
    e.preventDefault();
    // display the channels of the server that was clicked
    const targetServer = servers.find(
      (server) => server.id === parseInt(e.target.id)
    );
    setChannels(targetServer.Channels);
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
            <AddServerForm />
        </Modal>
      )}
        <div className="flex flex-col gap-3 items-center justify-start bg-serverBg text-lightGray max-w-[4%] min-w-[4%] h-screen max-h-screen">
          {servers.map((server) => {
            return (
              <button
                key={server.id}
                id={server.id}
                className="text-lg"
                onClick={selectServer}
              >
                {server.server_name}
              </button>
            );
          })}
          {/* {channels && channels.map(channel => {
                return (
                <button key={channel.id} id={channel.id} className="text-lg" onClick={selectChannel}>
                    {channel.channel_name}
                </button>
            )})}
            {messages.length > 0 && <Messages messages={messages} channelId={channelId}/>} */}
          <div
            onClick={() => setShowNewServerModal(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex justify-center items-center cursor-pointer w-[3.6em] h-[3.6em] rounded-[50%] bg-chatBg transform-all ease-in-out duration-300 hover:transition-all hover:bg-serverGreen hover:rounded-[30%]"
          >
            <img
              className="w-[2em] h-[2em] plus-icon"
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
