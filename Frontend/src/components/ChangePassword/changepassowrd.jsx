// PasswordChange.js

import React, { useState } from 'react';
import './changepassword.css'; // Import CSS file
import axios from 'axios';

const PasswordChange = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setError(''); // Clear previous errors
        const { name, value } = e.target;
        if (name === 'currentPassword') setCurrentPassword(value);
        else if (name === 'newPassword') setNewPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Password validation rules
        const minLength = 5;
        const regexUpperCase = /[A-Z]/;
        const regexLowerCase = /[a-z]/;
        const regexNumber = /[0-9]/;
        const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        
        // Validation checks
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        if (newPassword.length < minLength) {
            setError('Password must be at least 5 characters long.');
            return;
        }
        
        if (!regexUpperCase.test(newPassword)) {
            setError('Password must contain at least one uppercase letter.');
            return;
        }
        
        if (!regexLowerCase.test(newPassword)) {
            setError('Password must contain at least one lowercase letter.');
            return;
        }
        
        if (!regexNumber.test(newPassword)) {
            setError('Password must contain at least one number.');
            return;
        }
        
        if (!regexSpecialChar.test(newPassword)) {
            setError('Password must contain at least one special character.');
            return;
        }
        
        // If all validations pass, clear errors and proceed with password change logic
        setError('');
        // Implement password change logic here (e.g., API call to backend)

        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage

            if (token) {
                console.log('Token exists in localStorage:', token);
                // Perform actions if token exists, such as redirecting to authenticated pages
              } else {
                console.log('Token not found in localStorage.');
                // Perform actions if token does not exist, such as redirecting to login page
              }

            // Make sure token is available
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      console.log(
        currentPassword,
        newPassword,
         confirmPassword);

            const response = await axios.post('http://localhost:3000/api/changepassword', {
                currentPassword,
                newPassword,
                confirm_password: confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setSuccess(response.data.msg);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            window.alert('Password updated successfully');

        } catch (error) {
        //     if (error.response && error.response.data) {
        //         setError(error.response.data.msg);
        //     } else {
        //         setError('An error occurred while updating the password.');
        //     }
        //    // Show alert for error
        if (error.response && error.response.data) {
            setError(error.response.data.msg); // Set error message from backend response
        } else if (error.message) {
            setError(error.message); // Set error message if no specific message from backend
        } else {
            setError('An unknown error occurred.'); // Fallback error message
        }
            window.alert('Failed to update password');
        }
    //

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };
    
    return (
        <div className="password-change">
            <div className="password-change-card">
                <h2 className="password-change-card-title">Change Password</h2>
                {error && <p className="password-change-error">{error}</p>}
                <form className="password-change-form" onSubmit={handleSubmit}>
                    <div className="password-change-form-group">
                        <label className="password-change-label" htmlFor="currentPassword">Current Password</label>
                        <input
                            className="password-change-input"
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="password-change-form-group">
                        <label className="password-change-label" htmlFor="newPassword">New Password</label>
                        <input
                            className="password-change-input"
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="password-change-form-group">
                        <label className="password-change-label" htmlFor="confirmPassword">Confirm New Password</label>
                        <input
                            className="password-change-input"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button className="password-change-submit-btn" type="submit">
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
    
};

export default PasswordChange;
