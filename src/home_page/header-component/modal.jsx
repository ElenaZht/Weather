import React, {useContext, useEffect, useState} from 'react';
import './modal.css';
import ColorThemeContext from "../../contexts/color-theme-context.js";

const Modal = ({active, setActive, children}) => {
    const {theme, setTheme} = useContext(ColorThemeContext);
    let [night, setNight] = useState('content');
    useEffect(
        ()=>{
            if(theme==='night'){
                setNight('contentNight')
            }
        }, [theme]
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
