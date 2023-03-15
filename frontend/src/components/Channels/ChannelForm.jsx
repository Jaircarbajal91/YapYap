import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { createChannel } from '../../store/channels';

export default function ChannelForm({ setShowChannelModal }) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createChannel(channel, serverId));
        setShowChannelModal(false)
    };

    return (
        <div className='flex flex-col items-center min-w-[25em] w-[25em] h-[15em] p-5'>
            <div
                className='font-bold text-2xl h-[30%] flex items-center'
            >
                Create Channel
            </div>
            <form
                className='w-full h-[70%] flex flex-col justify-evenly'
                onSubmit={handleSubmit}
            >
                <div
                    className='w-full border-2 border-[#cfcece] rounded-md h-10'
                >
                    <input
                        placeholder='Channel Name'
                        className='px-2 w-full focus:outline-none rounded-md h-full'
                        type="text"
                        value={channel}
                        onChange={e => setChannel(e.target.value)}
                    />
                </div>
                <button
                    className={`border-2 border-[#5865F2] bg-[#5865F2] text-offWhite p-2 rounded-md disabled: ${isDisabled ? 'opacity-70' : 'opacity-100'}`}
                    disabled={isDisabled}
                    type="submit"
                >
                    Create Channel
                </button>
            </form>
        </div>
    )
}
