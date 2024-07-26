

import React, { useState } from 'react';
import './forgetpassword.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [verificationSent, setVerificationSent] = useState(false); // State to track if verification has been sent
  const [verificationStatus, setVerificationStatus] = useState(''); // State to store the status message
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email to backend
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
      setVerificationSent(false);
      setVerificationStatus('Error sending verification code. Please try again.');
    }
  };

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Forget Password</h1>
      {!verificationSent ? (
        <>
          <p>Enter your email address below. We will send you a link to reset your password.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email"></label>
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
            <button type="submit" className="btnsend">
              Reset password
            </button>
          </form>
        </>
      ) : (
        <>
          <p>{verificationStatus}</p>
          <button type="button" className="btn" onClick={handleContinue}>
            Go back to login
          </button>
        </>
      )}
    </div>
  );
};

export default ForgetPasswordPage;


