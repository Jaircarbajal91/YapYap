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
    const [channelsLoaded, setChannelsLoaded] = useState(servers?.[0]?.Channels);
    const [messagesLoaded, setMessagesLoaded] = useState([]);


    useEffect(() => {
        dispatch(getServers()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const selectServer = e => {
        e.preventDefault();
        // display the channels of the server that was clicked
        const targetServer = servers.find(server => server.id === parseInt(e.target.id))
        setChannelsLoaded(targetServer.Channels)
    }

    const selectChannel = async e => {
        e.preventDefault();
        // display the messages of the channel that was clicked
        const messages = await dispatch(getMessages(e.target.id));
        setMessagesLoaded(messages);
    }


    return isLoaded && (
        <div className="flex">
            {servers.map(server => {
                return (
                <button key={server.id} id={server.id} className="text-lg" onClick={selectServer}>
                    {server.server_name}
                </button>
            )})}
            {channelsLoaded && channelsLoaded.map(channel => {
                return (
                    <button onClick={selectChannel} key={channel.id} id={channel.id} className="text-lg">
                        {channel.channel_name}
                    </button>
                )
            })}
            {messages.length > 0 && <Messages messages={messages} />}
        </div>
    )
}

export default Servers;
