import React, { useState } from 'react';
import './style.css'; // Import your CSS file
import { useLocation, useNavigate,} from 'react-router-dom';
import axios from 'axios'


const PhonePage = () => {
  const [ phoneNumber, setPhoneNumber] = useState('');
   // State to manage selected method
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;


const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };


const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/send-otp', { userId, phoneNumber });
      if (response.data.success) {
        console.log('OTP sent successfully!');
        navigate('/otp',{state: {userId, phoneNumber}}); // Replace with your next page route
      } else {
        console.error('Failed to send OTP:', response.data.msg);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
  
    <div className="container">
    <h1>One-time password</h1>
    <p>Please select how you'd like to receive your verification code.</p>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="phone-number">Send a code by mobile phone number:</label>
        <input
          type="tel"
          id="phone-number"
          name="phone-number"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter your phone number"
        />
      </div>
      <button type="submit" className="btn">Continue</button>
    </form>
  </div>
  );
};

export default PhonePage;
