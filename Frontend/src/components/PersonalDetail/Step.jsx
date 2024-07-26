import React from 'react';
import './detail_style.css'; // Import your CSS file
const Step = ({ id, title, active }) => {
    return (
        <div className={`step ${active ? 'active' : ''}`} id={id}>{title}</div>
    );
}

export default Step;
