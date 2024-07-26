// src/PrivacySecurity.js

import React from 'react';
//import './PrivacySecurity.css'; // Create a CSS file for styling
import './PrivacySecurity.css';
import { Link } from 'react-router-dom'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGreaterThan } from '@fortawesome/free-solid-svg-icons';
// import { FaLongArrowAltLeft } from "react-icons/fa";

function PrivacySecurity() {
  return (
    <div className="Wrapper">
      <div className="Container">
        <div className="Header">
        <h4>  Privacy and Security (Change Password)</h4>
        </div>
      </div>
      <div className="back-button-container">
      <Link to="/account"> <FontAwesomeIcon icon={faArrowLeft} />   </Link>       
            <span className="back-button-text"> Back</span>
          </div>
          <div className="change-password-section">
            <h2>Privacy & Security</h2>
      <div className="containerM">
        <div className="Content">
          <div>
            <p>Change password <span className="greater-icon">
             <Link to="/passwordchange">  <FontAwesomeIcon icon={faGreaterThan} /></Link> 

              </span> </p>
            
            <p>Update your password to keep your account safe and protect your data.</p>
              
              </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacySecurity;

