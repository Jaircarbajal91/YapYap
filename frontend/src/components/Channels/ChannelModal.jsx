import { useState } from "react";
import Channels from "./index";
import { Modal } from "../../context/Modal";

export default function ChannelModal() {
    const [ showChannelModal, setShowChannelModal ] = useState(false);
    const [ showCreateChannel, setShowCreateChannel ] = useState(false);

    const closeChannelModal = () => {
        setShowChannelModal(false)
    }
    const openChannelModal = () => {
        setShowChannelModal(true)
    }


    return (
        <>
            <div
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
            {showChannelModal &&
                <Modal onClose={closeChannelModal}>
                    <Channels />
                </Modal>
            }
        </>
    )
}
