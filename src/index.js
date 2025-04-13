import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './share/app-component/App'
import store from './redux/store.js'
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';



const root = createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="137988949006-fspceburid1p5op66m90ktbkkdgj0nc4.apps.googleusercontent.com">
        <Provider store={store}>
            <App />
        </Provider>
    </GoogleOAuthProvider>

);