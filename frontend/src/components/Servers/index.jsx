import React, { useEffect, useState } from "react";
import { getServers } from "../../store/servers";
import { getChannels } from "../../store/channels";
import { useDispatch, useSelector } from "react-redux";


const Servers = ({ sessionUser }) => {
    const dispatch = useDispatch();
    const servers = Object.values(useSelector((state) => state.servers));
    const [isLoaded, setIsLoaded] = useState(false);
    const [channelsLoaded, setChannelsLoaded] = useState(servers?.[0]?.Channels);
    const [channelId, setChannelId] = useState(servers?.[0]?.Channels?.[0]);
    console.log(servers)


    useEffect(() => {
        dispatch(getServers()).then(() => setIsLoaded(true));
    }, [dispatch]);

    const selectServer = e => {
        e.preventDefault();
        // display the channels of the server that was clicked
        const targetServer = servers.find(server => server.id === parseInt(e.target.id))
        setChannelsLoaded(targetServer.Channels)
    }

    const selectChannel = e => {
        e.preventDefault();
        // display the messages of the channel that was clicked
        setChannelId(e.target.id);
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
                    <button key={channel.id} id={channel.id} className="text-lg">
                        {channel.channel_name}
                    </button>
                )
            })}
            {channelId && <Messages channelSelected={channelSelected} />}
        </div>
    )
}

export default Servers;
