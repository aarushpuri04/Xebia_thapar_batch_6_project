
import React from 'react';
import './styles.css'; // Import your CSS file
import logo from './pngtree-online-banking-concept-with-the-businessman-online-banking-concept-with-businessman-photo-image_2041611.jpg';



const Banner = ({ scrollToApplication  }) => {
    return (


        <section className='banner'>
            <img src={logo} alt="Banner Image" />
            <div className='rate-box' style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: 'small' }}>OUR RATES</h2>
                <div className='rates'>
                    <div className='rate1'>
                        <p style={{ fontSize: 'small' }}> AER<br /><b style={{ fontSize: 'medium' }}>1.50%</b></p>
                    </div>
                    <div className='rate2'>
                        <p style={{ fontSize: 'small' }}> MONTHLY GROSS<br /><b style={{ fontSize: 'medium' }}>0.10%</b></p>
                    </div>
                </div>
                <button id='applyNowBtn' style={{ fontSize: 'small' }} onClick={scrollToApplication }>Apply Now</button>
            </div>
        </section>
       
    );
}

export default Banner;

