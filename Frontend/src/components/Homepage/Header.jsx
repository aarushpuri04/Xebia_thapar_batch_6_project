
import React from 'react';
import  './styles.css'; // Import your CSS file
import logoImg from './Screenshot 2024-06-15 at 12.23.30 AM.png';
import { Link } from 'react-router-dom'; 

const Header = ({ scrollToApplication  }) => {
    console.log('Header is rendering'); // Add this line
    return (
        // <header >
        <header className='header'>
            <div className='logo'>
                <h1><img src={logoImg} alt="logo_img" style={{ width: '250px', height: '70px' }} /></h1>
            </div>
            <div className='auth-links' style={{ fontSize: '20px',marginRight:"50px" }}>
                <Link to="/login">Login</Link>
                {/* <Link to="/personal-details" >Register</Link> */}
                
            </div>
            
        </header>
        
    );
}

export default Header;

