import React from 'react';
import './Modal.css'; // We will create this CSS file next

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-button">X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;