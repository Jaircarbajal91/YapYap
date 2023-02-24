import React, { useEffect, useState } from "react";
import { getServers } from "../../store/servers";
import Messages from "../Messages";
import { getMessages } from "../../store/messages";
import { useDispatch, useSelector } from "react-redux";



const Servers = ({ sessionUser }) => {
    const dispatch = useDispatch();
    const servers = Object.values(useSelector((state) => state.servers));
    const messages = Object.values(useSelector(state => state.messages));
    const [isLoaded, setIsLoaded] = useState(false);
    const [channels, setChannels] = useState(servers?.[0]?.Channels);
    const [channelId, setChannelId] = useState(channels?.[0]?.id);
    const [messagesLoaded, setMessagesLoaded] = useState([]);


    useEffect(() => {
        dispatch(getServers()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const selectServer = e => {
        e.preventDefault();
        // display the channels of the server that was clicked
        const targetServer = servers.find(server => server.id === parseInt(e.target.id))
        setChannels(targetServer.Channels)
    }

    const selectChannel = async e => {
        e.preventDefault();
        // display the messages of the channel that was clicked
        setChannelId(e.target.id);
        const messages = await dispatch(getMessages(e.target.id));
        setMessagesLoaded(messages);
    }


    return isLoaded && (
        <div className="flex bg-gray text-lightGray h-screen max-h-screen">
            {servers.map(server => {
                return (
                <button key={server.id} id={server.id} className="text-lg" onClick={selectServer}>
                    {server.server_name}
                </button>
            )})}
            {channels && channels.map(channel => {
                return (
                <button key={channel.id} id={channel.id} className="text-lg" onClick={selectChannel}>
                    {channel.channel_name}
                </button>
            )})}
            {messages.length > 0 && <Messages messages={messages} channelId={channelId}/>}
        </div>
    )
}

export default Servers;
