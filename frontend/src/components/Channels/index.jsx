import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { createChannel } from '../../store/channels';

export default function Channels() {
    const { serverId } = useParams();
    const channels = useSelector(state => state.servers?.[serverId]?.Channels);
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const [channel, setChannel] = useState('');
    const [channelsDisplayed, setChannelsDisplayed] = useState(channels);
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState([]);

    // useEffect(() => {
    //     dispatch(getChannels(serverId));
    // }, [dispatch, serverId]);

    useEffect(() => {
        setChannelsDisplayed(channels);
    }, [channels]);

    useEffect(() => {
        const errors = [];
        if (channel.length === 0) errors.push('Channel name cannot be empty');
        setIsDisabled(errors.length > 0);
        setErrors(errors);
    }, [channel]);

    function createChannel(e) {
        e.preventDefault();
        dispatch(createChannel(channel, serverId));
        setChannel('');
    };

    return (
        <>


        </>

        // <div>
        //     <h1>Channels</h1>
        //     <ul>
        //         {channels.map(channel => (
        //             <li key={channel.id}>{channel.name}</li>
        //         ))}
        //     </ul>
        //     <form onSubmit={createChannel}>
        //         <input
        //             type="text"
        //             value={channel}
        //             onChange={e => setChannel(e.target.value)}
        //         />
        //         <button disabled={isDisabled} type="submit">Create Channel</button>
        //     </form>
        // </div>
    )
}
