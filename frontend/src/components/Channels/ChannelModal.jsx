import { useState } from "react";
import ChannelForm from "./ChannelForm";
import { Modal } from "../../context/Modal";
import optionsIcon from '../../../assets/images/options.svg'

export default function ChannelModal({ channel, formType }) {
    const [ showChannelModal, setShowChannelModal ] = useState(false);
    const [ showCreateChannel, setShowCreateChannel ] = useState(false);

    const closeChannelModal = (e) => {
        setShowChannelModal(false)
        e.stopPropagation()
    }
    const openChannelModal = (e) => {
        e.stopPropagation()
        setShowChannelModal(true)
    }

    return (
        <>
            {formType === 'Create' ? <div
                className="text-lightGray cursor-pointer text-2xl relative mr-1"
                onMouseEnter={() => setShowCreateChannel(true)}
                onMouseLeave={() => setShowCreateChannel(false)}
                onClick={openChannelModal}
            >
                +
                <div
                    className={`${showCreateChannel ? 'inline' : 'hidden'} absolute w-fit h-fit bg-black text-white rounded-md -right-3 z-50 flex items-center`}
                >
                    <div className="relative w-2 h-2 bg-black rotate-45 bottom-6 left-10"></div>
                    <span className="p-2 -ml-1 text-center capitalize font-bold text-xs">Create Channel</span>
                </div>
            </div>
            :
                <img
                  className='mr-1'
                  onClick={openChannelModal}
                  src={optionsIcon}
                  alt='options'
                />
            }
            {showChannelModal &&
                <Modal onClose={closeChannelModal}>
                    <ChannelForm setShowChannelModal={setShowChannelModal} formType={formType} channel={channel} />
                </Modal>
            }
        </>
    )
}
