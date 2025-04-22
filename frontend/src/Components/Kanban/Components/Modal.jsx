import React from "react";
import "../CSS/Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
