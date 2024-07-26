

import React, { useState } from 'react';
import './detail_style.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const DetailForm = () => {
  const navigate = useNavigate();

  // State variables for form fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle case where dateString might be undefined
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  

  const validateForm = () => {
    let isValid = true;

    // Regular expression to check if string contains only alphabetic characters
    const alphaRegex = /^[a-zA-Z]+$/;

    // Validate First Name
    if (!firstName.trim().match(alphaRegex)) {
      document.getElementById('first-name-error').textContent = 'First name should contain only alphabetic characters';
      document.getElementById('first-name-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('first-name-error').style.display = 'none';
    }

    // Validate Last Name
    if (!lastName.trim().match(alphaRegex)) {
      document.getElementById('last-name-error').textContent = 'Last name should contain only alphabetic characters';
      document.getElementById('last-name-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('last-name-error').style.display = 'none';
    }

    // Validate Middle Name if provided
    if (middleName.trim() !== '' && !middleName.trim().match(alphaRegex)) {
      document.getElementById('middle-name-error').textContent = 'Middle name should contain only alphabetic characters';
      document.getElementById('middle-name-error').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('middle-name-error').style.display = 'none';
    }

    // Validate Date of Birth
    if (!dob) {
      document.getElementById('dob-error').textContent = 'Date of birth is required';
      document.getElementById('dob-error').style.display = 'block';
      isValid = false;
    } else {
      // Validate date format (DD-MM-YYYY)
      const dobRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(\d{4})$/; // DD-MM-YYYY format validation
      if (!formatDate(dob).match(dobRegex)) {
        document.getElementById('dob-error').textContent = 'Date of birth should be in DD-MM-YYYY format';
        document.getElementById('dob-error').style.display = 'block';
        isValid = false;
      } else {
        // Check for valid month and day
        const parts = formatDate(dob).split('-');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (month < 1 || month > 12 || day < 1 || day > 31) {
          document.getElementById('dob-error').textContent = 'Invalid date. Please enter a valid date.';
          document.getElementById('dob-error').style.display = 'block';
          isValid = false;
        } else {
          // Validate age (must be at least 18 years old)
          const formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`; // Format to YYYY-MM-DD for Date object
          const dobDate = new Date(formattedDob);
          const age = calculateAge(dobDate);

          if (age < 18) {
            document.getElementById('dob-error').textContent = 'You must be at least 18 years old';
            document.getElementById('dob-error').style.display = 'block';
            isValid = false;
          } else {
            document.getElementById('dob-error').style.display = 'none';
          }
        }
      }
    }

    return isValid;
  };

  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const handleNextClick = () => {
    const isValid = validateForm();

    if (isValid) {
      // Proceed to the next step (update progress bar and form content)
      // document.getElementById('personal-details-step').classList.remove('active');
      // document.getElementById('account-details-step').classList.add('active');

      // // Update progress bar
      // document.getElementById('progress').style.width = '50%';

      // Prepare personalDetails object to pass to next page
      const personalDetails = {
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        dob: formatDate(dob),
      };

      // Navigate to the next page with personalDetails as state
      navigate('/address', { state: { personalDetails } });
    }
  };

  return (
    <div className="form-content">
      <h2>Personal Details</h2>
      <p>Tell about yourself</p>
      <form id="personal-details-form">
        <div className="form-group">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            name="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <span className="error-message" id="first-name-error"></span>
        </div>
        <div className="form-group">
          <label htmlFor="middle-name">Middle Name</label>
          <input
            type="text"
            id="middle-name"
            name="middle-name"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          <span className="error-message" id="middle-name-error"></span>
        </div>
        <div className="form-group">
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            name="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <span className="error-message" id="last-name-error"></span>
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            // type="text" // Change to text for custom validation
            type="date"
            id="dob"
            name="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="DD-MM-YYYY"
            required
            style={{ width: '400px',height:"40px" }}
          />
          <span className="error-message" id="dob-error"></span>
        </div>
        <button className="button-next" type="button" onClick={handleNextClick}>
          Next
        </button>
      </form>
    </div>
  );
};

export default DetailForm;
