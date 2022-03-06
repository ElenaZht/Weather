import React from 'react';
import './modal.css';

const Modal = ({active, setActive, children}) => {
    return (
        <div data-testid="modal-container" className={active? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active? "content active" : "content"} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};
export default Modal;
