// RegistrationSuccess.js

import React from 'react';
import { Link } from 'react-router-dom';
import './registration.css'; // Import CSS file for styling

const RegistrationSuccess = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <h2>Registration Successful!</h2>
        <p>Your account has been successfully registered.</p>
        <br>
        </br>
        {/* <p>Move to home page for further logging into your account</p> */}
        <Link to="/" className="success-button">Go to Home Page </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
