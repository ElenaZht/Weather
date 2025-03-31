import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './share/app-component/App'
import store from './redux/store.js'
import { Provider } from 'react-redux';
// import { GoogleOAuthProvider } from '@react-oauth/google';


const root = createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);