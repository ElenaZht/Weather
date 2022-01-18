import React, {useState} from 'react';
import './header.css';
import GoogleLogin from 'react-google-login';
import Modal from "./modal";

const Header = () => {
    let [user, setUser] = useState(localStorage.user? JSON.parse(localStorage.user) : {});

    let [isOpen, setIsOpen] = useState(false);
    let [isLogged, setIsLogged] = useState(false);

    let [accountName, setAccountName] = useState(localStorage.user && user.givenName? user.givenName[0].toUpperCase()+user.familyName[0].toUpperCase() : "");
    let [accountFullName, setAccountFullName] = useState(localStorage.user && user.name? user.name : "");
    let [accountEmail, setAccountEmail] = useState(localStorage.user && user.email? user.email : "");
    let [accountPhoto, setAccountPhoto] = useState(localStorage.user && user.imageUrl? user.imageUrl : "");
    let responseGoogle=(response)=>{
        if(response.profileObj){
            localStorage.setItem('user', JSON.stringify(response.profileObj));
            setAccountName((response.profileObj.givenName[0]+response.profileObj.familyName[0]).toUpperCase());
            setAccountFullName(response.profileObj.name);
            setIsLogged(true);
            setAccountEmail(response.profileObj.email);
            setAccountPhoto(response.profileObj.imageUrl);

        }
    };
    if(localStorage.user){
        isLogged = true;
    }
    let openModal = () => {
        setModalActive(true);
        setIsOpen(false);
    };
    let closeModal = () => {
        setModalActive(false);
        setIsOpen(true);
    };
    let logOut = () => {
        localStorage.clear();
        setModalActive(false);
        setIsLogged(false);
    };
    const [modalActive, setModalActive] = useState(false);
    return (
        <div className="main">
            <Modal active={modalActive} setActive={setModalActive}>
               <div className="dialog">
                   <div className="rotating-border">
                       <div data-testid = "user-photo" className="user-photo" style={{ backgroundImage: `url(${accountPhoto})` }}></div>
                   </div>
                   <div data-testid="user-name" className="user-name">{accountFullName}</div>
                   <div data-testid="user-email" className="user-email">{accountEmail}</div>
                   <hr/>
                   <div className="dialog-btns">
                       <button data-testid="logout" id="logoutBtn" onClick={logOut}>Log out</button>
                       <button data-testid="close-menu" id="closeBtn" onClick={closeModal}>Close</button>
                   </div>
               </div>
            </Modal>
            <div className="logo"></div>
            <div data-testid="google-button" className={isLogged? "collapse" : "google-btn fordevice" && isOpen? "collapse" : "google-btn fordevice"}>
                <GoogleLogin
                    clientId="58638988614-gk3vv82r0ouh1tfns4cj0bjr1m15bqi6.apps.googleusercontent.com"
                    buttonText="Log In"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
            <div className="nav">
                <div data-testid="burger-button" className={isOpen? "collapse" : "burger" } onClick={() => setIsOpen(true)}></div>
            </div>

            <ul data-testid="menu-list" className={isOpen? "navbar-collapse" : "skipping"} >
                <li data-testid="user-button" className={isLogged? "" : "collapse"}  onClick={openModal}><div className={isLogged? "account" : "collapse"}><span>{accountName}</span></div>Account</li>
                <div className={isLogged? "collapse" : "google-btn" && isOpen? "google-btn" : "collapse"}>
                    <GoogleLogin
                        clientId="58638988614-gk3vv82r0ouh1tfns4cj0bjr1m15bqi6.apps.googleusercontent.com"
                        buttonText="Log In"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />
                </div>
                <li>Search</li>
                <li>Saved</li>
                <li><div className="nav-close"  onClick={() => setIsOpen(false)}></div></li>
            </ul>

            <div className={isLogged? "account" : "collapse"} onClick={openModal}><span>{accountName}</span></div>
            <div className="search">
                <div className="search-icon"></div>
                <input placeholder="Search region.."/>
            </div>
        </div>
    );
};

export default Header;
