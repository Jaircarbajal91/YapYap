import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import ChannelForm from "./ChannelForm";
import { Modal } from "../../context/Modal";
import optionsIcon from '../../../assets/images/options.svg'

const TooltipBubble = ({ title, triggerRef }) => {
  const tooltipRef = useRef(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (triggerRef?.current && tooltipRef?.current) {
      const updatePosition = () => {
        if (!triggerRef?.current || !tooltipRef?.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        
        let tooltipWidth = 120; // Default estimate
        if (tooltipRef.current.offsetWidth > 0) {
          tooltipWidth = tooltipRef.current.offsetWidth;
        }
        
        // Position tooltip to the left of the trigger
        const left = triggerRect.left - tooltipWidth - 12; // 12px spacing
        const top = triggerRect.top + (triggerRect.height / 2);
        
        setPosition({ left, top });
      };
      
      const timeoutId = setTimeout(updatePosition, 0);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [triggerRef]);

  const tooltipContent = (
    <div 
      ref={tooltipRef}
      className="pointer-events-none fixed w-fit h-fit bg-black text-white rounded-md flex items-center px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      style={{ 
        left: `${position.left}px`, 
        top: `${position.top}px`, 
        transform: 'translateY(-50%)',
        zIndex: 2147483647,
        isolation: 'isolate',
        willChange: 'transform'
      }}
    >
      <span className="absolute right-[-0.375rem] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-sm bg-black" />
      <span className="relative uppercase tracking-[0.22em] font-semibold text-xs">{title}</span>
    </div>
  );

  // Render tooltip directly to document.body using Portal - this bypasses all stacking contexts
  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(tooltipContent, document.body);
  }
  return null;
};

export default function ChannelModal({ channel, formType }) {
    const [ showChannelModal, setShowChannelModal ] = useState(false);
    const [ showCreateChannel, setShowCreateChannel ] = useState(false);
    const createChannelRef = useRef(null);

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
                ref={createChannelRef}
                className="text-lightGray cursor-pointer text-2xl relative mr-1"
                onMouseEnter={() => setShowCreateChannel(true)}
                onMouseLeave={() => setShowCreateChannel(false)}
                onClick={openChannelModal}
            >
                +
                {showCreateChannel && (
                    <TooltipBubble title="Create Channel" triggerRef={createChannelRef} />
                )}
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
