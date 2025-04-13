import React, {useContext, useEffect, useState} from 'react';
import './header.css';
import Modal from "./modal";
import SavedRegions from '../../share/saved-regions/saved-regions';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchIsOpen, setSearchTherm } from '../../search_page/search-component/searchSlice.js';
import { defaultRegion } from '../region-area/regionSlice.js'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';



const Header = ({deleteMethod}) => {
    
    const mode = useSelector(state => state.mode.mode);
    const dispatch = useDispatch()
    const searchTherm = useSelector(state => state.search.searchTherm)
    const savedRegions = useSelector(state => state.region.myRegions);
    let [user, setUser] = useState(localStorage.user? JSON.parse(localStorage.user) : {});

    let [isOpen, setIsOpen] = useState(false);
    let [isLogged, setIsLogged] = useState(false);

    let [term, setTerm] = useState('');

    let [accountName, setAccountName] = useState(localStorage.user && user.given_name? user.given_name[0].toUpperCase()+user.family_name[0].toUpperCase() : "");
    let [accountFullName, setAccountFullName] = useState(localStorage.user && user.name? user.name : "");
    let [accountEmail, setAccountEmail] = useState(localStorage.user && user.email? user.email : "");
    let [accountPhoto, setAccountPhoto] = useState(localStorage.user && user.picture? user.picture : "");

    let responseGoogle=(response)=>{
        if(response.credential){
            const userData = jwtDecode(response.credential);
            localStorage.setItem('user', JSON.stringify(userData));
            setAccountName((userData.given_name[0]+userData.family_name[0]).toUpperCase());
            console.log('setAccountName as ', accountName)
            setAccountFullName(userData.name);
            setIsLogged(true);
            setAccountEmail(userData.email);
            setAccountPhoto(userData.picture);

        }
    };

    useEffect(
        () => {
            
            if(localStorage.user){
                toast.info(`You entered as ${JSON.parse( localStorage.user).name}`);

            }

        }, []
        
    );
    if(localStorage.user){
        isLogged = true;

    }
    useEffect(() => {
            if(!localStorage.user){
                toast.info(`Your region is recognized as ${defaultRegion.regionName}. For choose other regions Log In, please.`)

            }
    }, []
    );
    let openModal = () => {
        setModalActive(true);
        setIsOpen(false);
    };
    let closeModal = () => {
        setModalActive(false);
    };
    let logOut = () => {
        localStorage.removeItem('user');
        setModalActive(false);
        setIsLogged(false);
        toast.success('You logged out!');
    };
    let openRegions = () => {
        setRegionsModalActive(true);
        setIsOpen(false);
    };
    let closeRegions = () => {
        setRegionsModalActive(false);
    };
    let goBack = () => {
        setRegionsModalActive(false);
        setIsOpen(true);
    };
    let back = () => {
        dispatch(setSearchIsOpen(false))
    };
    let goSearch = () => {
        setIsOpen(false);
        dispatch(setSearchIsOpen(true))
    };
    let goDefiniteSearch = (text) => {
        if(text.length){
        dispatch(setSearchIsOpen(true))
        setTerm('');
        }

    };
    const [modalActive, setModalActive] = useState(false);
    const [regionsModalActive, setRegionsModalActive] = useState(false);
    return (
        <div className="main">
            <div  data-testid="user-profile-modal">
                <Modal active={modalActive} setActive={setModalActive} >
                    <div className="dialog">
                        <div className={mode==='night'? "rotating-borderNight" : "rotating-border"}>
                            <div data-testid = "user-photo" className="user-photo" style={{ backgroundImage: `url(${accountPhoto})` }}></div>
                        </div>
                        <div data-testid="user-name" className="user-name">{accountFullName}</div>
                        <div data-testid="user-email" className="user-email">{accountEmail}</div>
                        <hr/>
                        <div className="dialog-btns">
                            <button data-testid="logout" id="logoutBtn" onClick={logOut}>Log out</button>
                            <button data-testid="close-menu-header" id="closeBtn" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </Modal>
            </div>

            <Modal active={regionsModalActive} setActive={setRegionsModalActive}>
                <button className="closeBtn" data-testid="close-regions" id="closeRegionsBtn" onClick={closeRegions}>x</button>
                <button className="closeBtn" onClick={goBack}>Back to menu</button>
                <SavedRegions key={savedRegions.length+10} regions={savedRegions} closeDialog={closeRegions} deleteMethod={deleteMethod}/>

            </Modal>
            <div className="logo" onClick={() => back()}></div>

            <div data-testid="google-button" className={isLogged? "collapse" : "google-btn fordevice" && isOpen? "collapse" : "google-btn fordevice"}>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        responseGoogle(credentialResponse);
                    }}
                    onError={() => {
                        console.log('Login Failed');
                        toast.error('Log in failed. Try again')
                    }}
                />
            </div>
            <div className="nav">
                <div data-testid="burger-button" className={isOpen? "collapse" : "burger" } onClick={() => setIsOpen(true)}></div>
            </div>

            <ul data-testid="menu-list" className={isOpen? "navbar-collapse" : "skipping"} >
                <li data-testid="user-button" className={isLogged? "" : "collapse"}  onClick={openModal}><div className={isLogged? "account" : "collapse"} style={{background: mode==='night'? "#3C38FF" : '#FFC738'}}><span>{accountName}</span></div>Account</li>
                <div className={isLogged? "collapse" : "google-btn" && isOpen? "google-btn" : "collapse"}>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            responseGoogle(credentialResponse);
                        }}
                        onError={() => {
                            console.log('Login Failed');
                            toast.error('Log in failed. Try again')
                        }}
                    />
                </div>
                <li onClick={() => goSearch()}>Search</li>
                <li onClick={openRegions}>Saved</li>
                <li><div className="nav-close"  onClick={() => setIsOpen(false)}></div></li>
            </ul>
            <div className={isLogged? "account" : "collapse"} onClick={openModal} style={{background: mode==='night'? "#3C38FF" : '#FFC738'}}><span>{accountName}</span></div>
            <div className={mode==='night'? 'search-night':'search'}>
                <div className="search-icon" onClick={() => goDefiniteSearch(searchTherm)}></div>
                <input placeholder="Search city.." onChange={(event) => {dispatch(setSearchTherm(event.target.value));setTerm(event.target.value)}} value={term}/>
                <div className="rem-icon" onClick={() => {setTerm(''); dispatch(setSearchTherm(''))}}></div>
            </div>
        </div>
    );
};

export default Header;
