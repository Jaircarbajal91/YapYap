import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMessages } from '../../store/messages';
import Messages from '../Messages';

export default function ServerDetails({ sessionUser }) {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const server = useSelector(state => state.servers[serverId]);
    const server_name = server?.server_name;
    const channels = useSelector(state => state.servers?.[serverId]?.Channels);
    const messages = Object.values(useSelector(state => state.messages));
    const [channelId, setChannelId] = useState(null);
    const [messagesLoaded, setMessagesLoaded] = useState([]);

    async function selectChannel(e) {
        e.preventDefault();
        // display the messages of the channel that was clicked
        setChannelId(e.target.id);
        const messages = dispatch(getMessages(e.target.id));
        setMessagesLoaded(messages);
    }

    return (
        <div>
            <h1>{server_name}</h1>
            {channels && channels.map(channel => {
                return (
                <button key={channel.id} id={channel.id} className="text-lg" onClick={selectChannel}>
                    {channel.channel_name}
                </button>
            )})}
            {messages.length > 0 && <Messages messages={messages} channelId={channelId}/>}
        </div>
    );
}
