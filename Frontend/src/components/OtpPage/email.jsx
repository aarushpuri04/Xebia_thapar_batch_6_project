

import React, { useState } from 'react';
import './style.css'; // Import your CSS file
import { useLocation, useNavigate,} from 'react-router-dom';
import { useEffect } from 'react';


const EmailPage = () => {
  const [method, setMethod] = useState('email'); // State to manage selected method
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');



  const navigate = useNavigate();
   const location = useLocation();
   const { userId } = location.state;

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Simulate backend call or actual API call to send verification code
    try {
      const response = await fetch('http://localhost:3000/api/Verify-Email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ userId, email }), // Assuming you send email to backend
      });

      const data = await response.json();
      if (response.ok) {
        setVerificationSent(true);
        setVerificationStatus(data.msg);
      } else {
        setVerificationSent(false);
        setVerificationStatus(data.msg);
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  const handleContinue = async() => {
   
    try {
      
      const response = await fetch('http://127.0.0.1:3000/mail-verification?id=' + userId, {
        headers: {
          'Accept': 'application/json'
        }}); // Adjust endpoint as per your backend setup

      const data = await response.json();
       console.log("data",data.emailVerified);
 
  if (response.ok) {
    if (data.success) {
      if (data.emailVerified) {
        // Email is already verified, navigate to the next page
        alert('Email verified successfully! Moving to next page.');
        navigate('/phone', { state: { userId } });
      } else {
        // Email was verified in this request, notify the user
        alert('Email verified successfully! Moving to next page.');
        navigate('/phone', { state: { userId } });
      }
    } else {
      // Handle other success scenarios if needed
      alert(data.message); // Display any success messages from the backend
    }
  } else {
    // Handle non-200 responses
    alert('Failed to verify email. Please try again.');
  }
} catch (error) {
  console.error('Error verifying email:', error);
  alert('Failed to verify email. Please try again.');
}

  };

  return (
    <div className="container">
      <h1>One-time password</h1>
      <p>Please select how you'd like to receive your verification code.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Send a code by email to:</label>
          <input
            type="email"
            id="email-address"
            name="email-address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        {!verificationSent && (
          <button type="submit" className="btnsend">
            Send Verification code
          </button>
        )}
        {verificationSent && <p>{verificationStatus}</p>}
        {verificationSent && (
          <button type="button" className="btn" onClick={handleContinue}>
            Continue
          </button>
        )}
      </form>
    </div>
  );
};

export default EmailPage;

