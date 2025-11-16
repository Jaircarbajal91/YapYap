import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { createChannel, updateChannel, deleteChannel } from '../../store/channels';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

export default function ChannelForm({ setShowChannelModal, formType, channel }) {
    let formActionButtons;
    const modalTitle = formType === 'Create' ? 'Create Channel' : 'Update Channel';
    const { serverId, channelId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const server = useSelector(state => state.servers)[serverId]
    const [input, setInput] = useState(channel ? channel.channel_name : '');
    const [isDisabled, setIsDisabled] = useState(true);
    const [errors, setErrors] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // toggles button access depending on length of input
    useEffect(() => {
        setIsDisabled(input?.length < 3);
    }, [input]);

    // changes modal content background on render
    useEffect(() => {
        const modalContent = document.getElementById('modal-content')
        if (modalContent) {
            modalContent.style.backgroundColor = 'transparent'
        }
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
        e.preventDefault();
        try {
            await dispatch(updateChannel(channel.id, input))
            setShowChannelModal(false)
        } catch(err) {
            setErrors([err.message || 'Failed to update channel'])
        }
    }

    const handleDeleteChannel = async () => {
        try {
            await dispatch(deleteChannel(channel.id))
            setShowChannelModal(false)
            // Navigate away if we're currently viewing the deleted channel
            if (channelId && parseInt(channelId) === channel.id) {
                history.push(`/servers/${serverId}`)
            }
        } catch(err) {
            setErrors([err.message || 'Failed to delete channel'])
            setShowDeleteModal(false)
        }
    }

    // TODO Update channel form re renders on mouse click in modal (don't know why)
    if (formType === 'Create') {
        formActionButtons =
            <button
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 ${
                    isDisabled 
                        ? 'bg-[#5865F2]/50 text-offWhite/50 cursor-not-allowed' 
                        : 'bg-[#5865F2] text-offWhite hover:bg-[#4752C4] active:bg-[#3C45A5]'
                }`}
                disabled={isDisabled}
                type="submit"
            >
                Create Channel
            </button>
    } else {
        formActionButtons =
            <>
                <button
                    className={`px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 ${
                        isDisabled 
                            ? 'bg-[#5865F2]/50 text-offWhite/50 cursor-not-allowed' 
                            : 'bg-[#5865F2] text-offWhite hover:bg-[#4752C4] active:bg-[#3C45A5]'
                    }`}
                    disabled={isDisabled}
                    type="submit"
                >
                    Update Channel
                </button>
                <button
                    className='px-4 py-2 text-sm font-medium rounded-sm bg-lightRed text-offWhite hover:bg-red-600 active:bg-red-700 transition-all duration-200'
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDeleteModal(true);
                    }}
                >
                    Delete Channel
                </button>
            </>
    }

    return (
        <>
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteChannel}
                title="Delete Channel"
                message={`Are you sure you want to delete #${channel?.channel_name}? This action cannot be undone.`}
                confirmText="Delete Channel"
            />
            <div className='bg-[#2f3136] flex flex-col min-w-[25em] w-[26em] p-6 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)]'>
                <div className='w-full flex flex-col items-start justify-start mb-6'>
                    <h2 className='text-offWhite text-2xl font-semibold mb-1'>
                        {modalTitle}
                    </h2>
                    <p className='text-lightGray text-sm'>
                        in {server?.server_name || ''}
                    </p>
                </div>
                
                {errors && errors.length > 0 && (
                    <div className='mb-4'>
                        {errors.map((error, idx) => (
                            <div key={idx} className='text-lightRed text-sm capitalize'>
                                {error}
                            </div>
                        ))}
                    </div>
                )}
                
                <form
                    className='w-full flex flex-col gap-6'
                    onSubmit={formType === 'Create' ? handleCreateChannel : handleUpdateChannel}
                >
                    <div className='flex flex-col gap-2'>
                        <label
                            className='text-offWhite text-xs font-semibold uppercase tracking-wider'
                        >
                            CHANNEL NAME
                        </label>
                        <input
                            placeholder='new-channel'
                            className='px-4 py-2.5 w-full focus:outline-none rounded-sm h-10 bg-[#202225] text-offWhite border-none focus:ring-0 placeholder:text-gray-500'
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            autoFocus
                        />
                    </div>
                    
                    <div className='w-full flex justify-end gap-3 mt-2'>
                        {formActionButtons}
                    </div>
                </form>
            </div>
        </>
    )
}
