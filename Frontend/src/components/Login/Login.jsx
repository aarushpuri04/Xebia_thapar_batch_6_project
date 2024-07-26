

import React, { useState } from 'react';
import './Login.css'; 
import { Link } from 'react-router-dom'; 
import { useLocation, useNavigate } from 'react-router-dom';



const Login = () => {
    // State variables to hold username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    // const location = useLocation();
    // const { userId } = location.state;
    const navigate = useNavigate(); // Hook for navigation


    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // Construct the data object to send to the API
        const loginData = {
            username: username,
            password: password
        };

        try {
            // Replace 'your-api-endpoint' with your actual API endpoint
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });
            console.log(loginData)

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            // Handle the API response as needed
            console.log('Login successful:', responseData);
            setAlertMessage('Login successful'); // Set success message

            // In your login function, store the token
                 localStorage.setItem('token', responseData.token);
                 navigate('/account');

        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Login failed. Please try again.'); // Set error messag
            // Handle error state or display error message to user
        }
    };

    return (
        <div className="Login">
            <form id="login" onSubmit={handleSubmit}>
                <label style={{ fontSize: '2vw' }}><b>LOGIN</b></label><br />
                {/* <label style={{ fontSize: '1.5vw' }}>Please login to access your account</label><br /><br />
                <hr /><br /> */}
                 <label style={{ fontSize: '1.5vw' }}>Please login to access your account</label><br /><br />
                 <br />
                <div className="horizontal-line"></div><br /> {/* Styled div acting as a line */}


                <label style={{ fontSize: '1vw' }}>USERNAME</label>
                <input 
                    type="text" 
                    name="Uname" 
                    id="Uname" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                /><br /><br />

                <label style={{ fontSize: '1vw' }}>PASSWORD</label>
                <input 
                    type="password" 
                    name="Pass" 
                    id="Pass" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br /><br />

                <input type="submit" value="Log In Here" className="Login-button" /><br /><br />
                <Link to="/forgetpassword">Forgot your login details?</Link>
            </form>
            {alertMessage && (
                <div className={`alert ${alertMessage.includes('failed') ? 'alert-error' : 'alert-success'}`}>
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default Login;
