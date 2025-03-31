import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './share/app-component/App'
// import { GoogleOAuthProvider } from '@react-oauth/google';


const root = createRoot(document.getElementById('root'));
root.render(
    <App />
);