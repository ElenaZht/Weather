import React, { useEffect, useState} from 'react';
import './modal.css';
import { useSelector } from 'react-redux';

const Modal = ({active, setActive, children}) => {
    const mode = useSelector(state => state.mode.mode)
    let [night, setNight] = useState('content');
    useEffect(
        ()=>{
            if(mode==='night'){
                setNight('contentNight')
            }
        }, [mode]
    );
    return (
        <div data-testid="modal-container" className={active? "modal active" : "modal"} onClick={() => setActive(false)}>
            <div className={active? night+' active' : night} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};
export default Modal;
