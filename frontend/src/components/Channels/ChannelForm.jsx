import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { createChannel } from '../../store/channels';

export default function ChannelForm({ setShowChannelModal }) {
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const [channel, setChannel] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setIsDisabled(channel.length < 3);
    }, [channel]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createChannel(channel, serverId));
            setShowChannelModal(false)
        } catch(err) {
            const errorsObj = await err.json()
            setErrors(errorsObj.errors)
        }
    };

    return (
        <div className='flex flex-col items-center min-w-[25em] w-[25em] h-[15em] p-5'>
            <div
                className='font-bold text-2xl h-[30%] flex items-center'
            >
                Create Channel
            </div>
            {errors && errors.map((error) => (
                <div className='text-lightRed capitalize'>
                    {error}
                </div>
            ))}
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
