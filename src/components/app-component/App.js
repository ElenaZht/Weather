import React, {useState} from 'react';
import './app.css';
import Header from '../header-component/header.js';
function App() {

  return (
    <div className="App">
      <div className="container">
        <Header/>
        <p className="signature">Elena Zhytomirskaya, 2022</p>
      </div>
    </div>
  );
}

export default App;
