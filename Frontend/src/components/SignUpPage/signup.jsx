

// import React, { useState } from 'react';
// import './signup.css'; // Import your CSS file

// const SignUp = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [usernameError, setUsernameError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [confirmPasswordError, setConfirmPasswordError] = useState('');

//     const usernameRegex = /^[a-zA-Z0-9]{8,20}$/;
//     const passwordRegex = /^(?=.\d)(?=.[A-Z]).{8,}$/;

//     const handleUsernameChange = (e) => {
//         setUsername(e.target.value);
//         validateUsername(e.target.value);
//     };

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//         validatePassword(e.target.value);
//     };

//     const handleConfirmPasswordChange = (e) => {
//         setConfirmPassword(e.target.value);
//         validateConfirmPassword(e.target.value);
//     };

//     const validateUsername = (value) => {
//         if (!value.trim()) {
//             setUsernameError('Username is required');
//         } else if (!usernameRegex.test(value)) {
//             setUsernameError('Invalid username');
//         } else {
//             setUsernameError('');
//         }
//     };

//     const validatePassword = (value) => {
//         if (!value.trim()) {
//             setPasswordError('Password is required');
//         } else if (!passwordRegex.test(value)) {
//             setPasswordError('Invalid password');
//         } else {
//             setPasswordError('');
//         }
//     };

//     const validateConfirmPassword = (value) => {
//         if (!value.trim()) {
//             setConfirmPasswordError('Confirm Password is required');
//         } else if (value !== password) {
//             setConfirmPasswordError('Passwords do not match');
//         } else {
//             setConfirmPasswordError('');
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         // Validate all fields
//         validateUsername(username);
//         validatePassword(password);
//         validateConfirmPassword(confirmPassword);

//         // Check if form is valid
//         if (!usernameError && !passwordError && !confirmPasswordError) {
//             alert('Form submitted successfully!');
//             // Add further logic here (e.g., API call, authentication)
//         } else {
//             alert('Please ensure all fields are correctly filled out.');
//         }
//     };

//     return (
//         <div className="login-container">
//             <form onSubmit={handleSubmit}>
//                 <h2><span style={{ color: 'red' }}>05</span> Create your login details</h2>
//                 <p>Keep your details safe - you'll need them later</p>
//                 <hr />
//                 <p>Please create a username and password to log into your new account.</p>

//                 <label htmlFor="username">Username*</label>
//                 <input
//                     type="text"
//                     id="username"
//                     name="username"
//                     value={username}
//                     onChange={handleUsernameChange}
//                     required
//                 />
//                 <ul id="usernameRequirements">
//                     <li className={username.length >= 8 && username.length <= 20 ? 'valid' : 'invalid'}>
//                         Must be 8-20 characters long
//                     </li>
//                     <li className={/^[a-zA-Z0-9]*$/.test(username) ? 'valid' : 'invalid'}>
//                         No special characters or spaces
//                     </li>
//                 </ul>
//                 <small className="error">{usernameError}</small>

//                 <label htmlFor="password">Password*</label>
//                 <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={password}
//                     onChange={handlePasswordChange}
//                     required
//                 />
//                 <ul id="passwordRequirements">
//                     <li className={password.length >= 8 ? 'valid' : 'invalid'}>At least 8 characters long</li>
//                     <li className={/\d/.test(password) ? 'valid' : 'invalid'}>Contain at least one number</li>
//                     <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>Contain at least one uppercase letter</li>
//                 </ul>
//                 <small className="error">{passwordError}</small>

//                 <label htmlFor="confirmPassword">Confirm Password*</label>
//                 <input
//                     type="password"
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={confirmPassword}
//                     onChange={handleConfirmPasswordChange}
//                     required
//                 />
//                 <small className="error">{confirmPasswordError}</small>
//                 <br />
//                 &#10687; Please enter the same password
//                 <br />
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// };
// export default SignUp;

import React, { useState } from 'react';
import './signup.css'; // Import your CSS file
import { useLocation, useNavigate,} from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const navigate = useNavigate();
   const location = useLocation();
   const { userId } = location.state;

    const usernameRegex = /^[a-zA-Z0-9]{8,20}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        validateUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validateConfirmPassword(e.target.value);
    };

    const validateUsername = (value) => {
        if (!value.trim()) {
            setUsernameError('Username is required');
        } else if (!usernameRegex.test(value)) {
            setUsernameError('Invalid username');
        } else {
            setUsernameError('');
        }
    };

    const validatePassword = (value) => {
        if (!value.trim()) {
            setPasswordError('Password is required');
        } else if (!passwordRegex.test(value)) {
            setPasswordError('Invalid password');
        } else {
            setPasswordError('');
        }
    };

    const validateConfirmPassword = (value) => {
        if (!value.trim()) {
            setConfirmPasswordError('Confirm Password is required');
        } else if (value !== password) {
            setConfirmPasswordError('Passwords do not match');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        validateUsername(username);
        validatePassword(password);
        validateConfirmPassword(confirmPassword);

        // Check if form is valid
        if (!usernameError && !passwordError && !confirmPasswordError) {
            // Prepare data object to send to backend
            const signupData = {
                userId: userId,
                username: username,
                password: password,
                confirmPassword:confirmPassword
               
            };

            try {
                // Replace 'your-api-endpoint' with your actual API endpoint
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(signupData),
                });
              console.log(signupData);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Handle successful signup
                alert('Signup successful!'); // You can replace this with a redirect or further logic
                navigate('/registersuccess');

                // Reset form fields after successful submission (optional)
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setUsernameError('');
                setPasswordError('');
                setConfirmPasswordError('');

            } catch (error) {
                console.error('Error:', error);
                alert('Signup failed. Please try again.'); // Handle error state
            }
        } else {
            alert('Please ensure all fields are correctly filled out.');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2><span style={{ color: 'red' }}></span> Create your login details</h2>
                <p>Keep your details safe - you'll need them later</p>
                <hr />
                <p>Please create a username and password to log into your new account.</p>

                <label htmlFor="username">Username*</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                <ul id="usernameRequirements">
                    <li className={username.length >= 8 && username.length <= 20 ? 'valid' : 'invalid'}>
                        Must be 8-20 characters long
                    </li>
                    <li className={/^[a-zA-Z0-9]*$/.test(username) ? 'valid' : 'invalid'}>
                        No special characters or spaces
                    </li>
                </ul>
                <small className="error">{usernameError}</small>

                <label htmlFor="password">Password*</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <ul id="passwordRequirements">
                    <li className={password.length >= 8 ? 'valid' : 'invalid'}>At least 8 characters long</li>
                    <li className={/\d/.test(password) ? 'valid' : 'invalid'}>Contain at least one number</li>
                    <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>Contain at least one uppercase letter</li>
                </ul>
                <small className="error">{passwordError}</small>

                <label htmlFor="confirmPassword">Confirm Password*</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                />
                <small className="error">{confirmPasswordError}</small>
                {/* <br />
                &#10687; Please enter the same password
                <br /> */}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SignUp;


