import React, { useState } from 'react';
import './style.css'; // Import your CSS file
import { useLocation, useNavigate,} from 'react-router-dom';
import axios from 'axios'


const OTPPage = () => {
  const [otp, setOtp] = useState('');
 const navigate = useNavigate();
 const location = useLocation();

const { userId, phoneNumber } = location.state;

const handleOTPChange = (event) => {
    setOtp(event.target.value);
  };

const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/verify-otp', { phoneNumber, otp });
      if (response.data.success) {
        console.log('OTP verified successfully!');
        navigate('/documentUpload',{state: {userId} }); // Replace with your next page route
      } else {
        console.error('Failed to verify OTP:', response.data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="container">
      <h1>One-time password</h1>
      <p>Please enter your verification code.</p>
      <form onSubmit={handleSubmit}>
       
        <div className="form-group">
        
          <input
             onChange={handleOTPChange}
             placeholder="Enter your code here"
          />
        </div>
        <button type="submit" className="btn">Continue</button>
      </form>
    </div>
  );
};

export default OTPPage;
