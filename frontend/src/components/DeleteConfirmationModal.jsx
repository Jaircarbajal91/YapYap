import { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete", 
  message = "Are you sure you want to delete this item?",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      <div
        ref={wrapperRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-[420px] bg-[#2f3136] z-[9999] rounded-lg overflow-hidden shadow-2xl border border-[#202225]"
      >
        <div className="flex flex-col w-full p-6">
          <h3 className="text-offWhite font-semibold text-xl mb-2">
            {title}
          </h3>
          <p className="text-lightGray text-sm mb-6">
            {message}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 bg-transparent text-lightGray hover:bg-[#202225] hover:text-offWhite"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium rounded-sm transition-all duration-200 bg-red-600 text-offWhite hover:bg-red-700 active:bg-red-800"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (typeof document !== "undefined" && document.body) {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return null;
};

export default DeleteConfirmationModal;
