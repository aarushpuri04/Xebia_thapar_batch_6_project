

import React, { useState, useEffect } from 'react';
import './employment.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EmploymentCitizenshipForm = () => {
    const [activeTab, setActiveTab] = useState('');
    const [showCitizenshipForm, setShowCitizenshipForm] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const location = useLocation();
    const { userId } = location.state;
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formObject = {};
        formData.forEach((value, key) => {
            const camelCaseKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            formObject[camelCaseKey] = value;
        });

        // Add 'type' field based on activeTab
        formObject['type'] = activeTab;

        // Add userId to formObject
        formObject['userId'] = userId;

        console.log('Form submitted:', formObject);

        try {
            // Determine endpoint based on form type
            const endpoint = e.target.id === 'citizenship-form' ? 'http://localhost:3000/api/citizenship' : 'http://localhost:3000/api/employment';

            // Send data to the backend
            const response = await axios.post(endpoint, formObject);
            console.log('Backend response:', response.data);
            alert('Form submitted successfully!');

            // Show the citizenship form after employment form is submitted
            if (e.target.id !== 'citizenship-form') {
                setShowCitizenshipForm(true);
            } else {
                // Navigate to the next page upon successful citizenship form submission
                navigate('/signup',{state : {userId}}); // Replace '/next-page' with your desired route
            }
        } catch (error) {
            console.error('Failed to submit form:', error);
            if (error.response && error.response.data && error.response.data.error) {
                // Handle specific validation errors
                if (error.response.data.error === 'Validation error') {
                    let validationDetails = error.response.data.details;
                    if (typeof validationDetails === 'object') {
                        // Convert object to string for better display
                        validationDetails = JSON.stringify(validationDetails, null, 2);
                    }
                    alert(`Validation Error:\n${validationDetails}`);
                } else {
                    alert(`Error: ${error.response.data.error}`);
                }
            } else {
                alert('Failed to submit form. Please try again later.');
            }
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setShowCitizenshipForm(false); // Hide citizenship form when switching tabs
        clearFormInputs(); // Clear form inputs when switching tabs
    };

    const clearFormInputs = () => {
        const form = document.getElementById(`${activeTab}-form`);
        if (form) {
            form.reset(); // Reset form inputs
        }
    };

    useEffect(() => {
        if (showCitizenshipForm) {
            populateCountryOptions();
            setTimeout(() => {
                const citizenshipContainer = document.getElementById("citizenship-container");
                if (citizenshipContainer) {
                    window.scrollTo({
                        top: citizenshipContainer.offsetTop,
                        behavior: "smooth"
                    });
                }
            }, 0);
        }
    }, [showCitizenshipForm]);

    const populateCountryOptions = () => {
        const countries = [
            "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
            "Japan", "China", "India", "Brazil", "South Africa", "New Zealand", "Mexico",
            "Russia", "Italy", "Spain", "Netherlands", "Sweden", "Norway", "Finland", "Denmark"
        ];

        const nationalitySelect = document.getElementById('nationality');
        const taxResidencySelect = document.getElementById('tax-residency');
        if (nationalitySelect && taxResidencySelect) {
            nationalitySelect.innerHTML = '';
            taxResidencySelect.innerHTML = '';
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.text = country;
                nationalitySelect.appendChild(option);
                taxResidencySelect.appendChild(option.cloneNode(true));
            });
        }
    };

    const formTemplates = {
        'full-time': (
            <form id="full-time-form" onSubmit={handleSubmit}>
                <h2>Full-Time Employment Details</h2>
                <label htmlFor="company">Company Name:</label>
                <input type="text" id="company" name="company" required />
                <label htmlFor="position">Position:</label>
                <input type="text" id="position" name="position" required />
                <label htmlFor="start-date">Start Date:</label>
                <input type="text" id="start-date" name="start-date" placeholder="DD-MM-YYYY" required />
                <label htmlFor="salary">Annual Salary:</label>
                <input type="text" id="salary" name="salary" required />
                <input type="submit" value="Submit" />
            </form>
        ),
        'part-time': (
            <form id="part-time-form" onSubmit={handleSubmit}>
                <h2>Part-Time Employment Details</h2>
                <label htmlFor="company">Company Name:</label>
                <input type="text" id="company" name="company" required />
                <label htmlFor="position">Position:</label>
                <input type="text" id="position" name="position" required />
                <label htmlFor="hours">Hours per Week:</label>
                <input type="text" id="hours" name="hours" required />
                <label htmlFor="hourly-rate">Hourly Rate:</label>
                <input type="text" id="hourly-rate" name="hourly-rate" required />
                <input type="submit" value="Submit" />
            </form>
        ),
        'self-employed': (
            <form id="self-employed-form" onSubmit={handleSubmit}>
                <h2>Self-Employment Details</h2>
                <label htmlFor="business-name">Business Name:</label>
                <input type="text" id="business-name" name="business-name" required />
                <label htmlFor="industry">Industry:</label>
                <input type="text" id="industry" name="industry" required />
                <label htmlFor="years-business">Years in Business:</label>
                <input type="text" id="years-business" name="years-business" required />
                <label htmlFor="annual-income">Annual Income:</label>
                <input type="text" id="annual-income" name="annual-income" required />
                <input type="submit" value="Submit" />
            </form>
        ),
        'retired': (
            <form id="retired-form" onSubmit={handleSubmit}>
                <h2>Retirement Details</h2>
                <label htmlFor="retirement-date">Retirement Date:</label>
                <input type="text" id="retirement-date" name="retirement-date" placeholder="DD-MM-YYYY" required />
                <label htmlFor="previous-occupation">Previous Occupation:</label>
                <input type="text" id="previous-occupation" name="previous-occupation" required />
                <label htmlFor="pension">Monthly Pension:</label>
                <input type="text" id="pension" name="pension" required />
                <input type="submit" value="Submit" />
            </form>
        ),
        'student': (
            <form id="student-form" onSubmit={handleSubmit}>
                <h2>Student Details</h2>
                <label htmlFor="school">School/University Name:</label>
                <input type="text" id="school" name="school" required />
                <label htmlFor="major">Major/Field of Study:</label>
                <input type="text" id="major" name="major" required />
                <label htmlFor="graduation-year">Expected Graduation Year:</label>
                <input type="text" id="graduation-year" name="graduation-year"  required />
                <label htmlFor="part-time-job">Do you have a part-time job?</label>
                <select id="part-time-job" name="part-time-job" required>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <input type="submit" value="Submit" />
            </form>
        ),
        'not-employed': (
            <form id="not-employed-form" onSubmit={handleSubmit}>
                <h2>Not Employed Details</h2>
                <label htmlFor="last-job">Last Job (if any):</label>
                <input type="text" id="last-job" name="last-job" />
                <label htmlFor="reason">Reason for Not Working:</label>
                <input type="text" id="reason" name="reason" required />
                <label htmlFor="seeking-work">Are you currently seeking work?</label>
                <select id="seeking-work" name="seeking-work" required>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <input type="submit" value="Submit" />
            </form>
        )
    };

    return (
        <div className='employment'>
            <div className="container">
                <h1>Employment Details</h1>
                <div className="tabs">
                    {Object.keys(formTemplates).map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>
                <div id="form-container">
                    {activeTab && formTemplates[activeTab]}
                </div>
                {showCitizenshipForm && (
                    <div id="citizenship-container">
                        <form id="citizenship-form" onSubmit={handleSubmit}>
                            <h2>Citizenship Details</h2>
                            <label htmlFor="nationality">What's your country of nationality/citizenship?</label>
                            <select id="nationality" name="nationality" required></select>
                            <label htmlFor="tax-residency">In which country are you a tax resident?</label>
                            <select id="tax-residency" name="tax-residency" required></select>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmploymentCitizenshipForm;
