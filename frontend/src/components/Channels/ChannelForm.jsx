import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createChannel, updateChannel } from '../../store/channels';

export default function ChannelForm({ setShowChannelModal, formType, channel }) {
    let formActionButtons;
    const modalTitle = formType === 'Create' ? 'Create Channel' : 'Update Channel';
    const { serverId } = useParams();
    const dispatch = useDispatch();
    const server = useSelector(state => state.servers)[serverId]
    const [input, setInput] = useState(channel ? channel.channel_name : '');
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState([]);

    // toggles button access depending on length of input
    useEffect(() => {
        setIsDisabled(input?.length < 3);
    }, [input]);

    // changes modal content background on render
    useEffect(() => {
        const modalContent = document.getElementById('modal-content')
        modalContent.style.backgroundColor = '#2F3338'
    }, [])

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createChannel(input, serverId))
            setShowChannelModal(false)
        } catch(err) {
            const errorsObj = await err.json()
            setErrors(errorsObj.errors)
        }
    };
    const handleUpdateChannel = async (e) => {
        console.log(channel.id, input)
        e.preventDefault();
        try {
            await dispatch(updateChannel(channel.id, input))
            setShowChannelModal(false)
        } catch(err) {
            const errorsObj = await err.json()
            setErrors([errorsObj.message])
        }
    }

    // TODO Update channel form re renders on mouse click in modal (don't know why)
    if (formType === 'Create') {
        formActionButtons =
            <button
                className={`border-2 text-sm border-[#5865F2] bg-[#5865F2] text-offWhite p-2 rounded-sm disabled: ${isDisabled ? 'opacity-70' : 'opacity-100'}`}
                disabled={isDisabled}
                type="submit"
            >
                Create Channel
            </button>
    } else {
        // TODO turn delete button into separate modal/component in order to also have delete confirmation
        formActionButtons =
            <>
                <button
                    className={`border-2 border-[#5865F2] bg-[#5865F2] text-offWhite p-2 rounded-md disabled: ${isDisabled ? 'opacity-70' : 'opacity-100'}`}
                    disabled={isDisabled}
                    type="submit"
                >
                    Update Channel
                </button>
                <button
                    className={`border-2 border-lightRed bg-lightRed text-offWhite p-2 rounded-md`}
                >
                    Delete Channel
                </button>
            </>
    }

    return (
        <div className='bg-[#303338] flex flex-col items-center min-w-[25em] w-[26em] h-[17em] p-4 rounded-lg'>
            <div
                className=' w-full h-[30%] flex flex-col items-start justify-start'
            >
                <div
                    className=' text-offWhite text-2xl'
                >
                    {modalTitle}
                </div>
                <div
                    className='text-lightGray'
                >
                    in {server.server_name}
                </div>
            </div>
            {errors && errors.map((error) => (
                <div className='text-lightRed capitalize'>
                    {error}
                </div>
            ))}
            <form
                className='w-full h-[70%] flex flex-col justify-center'
                onSubmit={formType === 'Create' ? handleCreateChannel : handleUpdateChannel}
            >
                <div
                    className='text-offWhite mb-1 text-sm font-medium'
                >
                    CHANNEL NAME
                </div>
                <div
                    className='w-full border-2 border-serverBg rounded-sm h-10'
                >
                    <input
                        placeholder='new-channel'
                        className='px-2 pl-5 w-full focus:outline-none rounded-md h-full bg-serverBg text-offWhite'
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </div>
            </form>
            <div
                className='w-full flex justify-end'
            >
                {formActionButtons}
            </div>
        </div>
    )
}
