import React, { useState, useEffect } from 'react';
import { Modal, Backdrop, TextField, Button } from '@mui/material';
import './Modal.css'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ManualAddressPopup = ({ isPopupOpen, setIsPopupOpen, addressData, setAddressData, setIsAddressEntered }) => {
  const [manualAddress, setManualAddress] = useState({
    houseOrBuildingName: '',
    subBuildingName: '',
    flatOrBuildingNumber: '',
    streetName: '',
    secondaryStreetName: '',
    townOrCity: '',
    state: '',
    postcode: '',
    country: ''
  });
  const [errors, setErrors] = useState({});
  // const [customerId, setCustomerId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { personalDetails } = location.state;


  useEffect(() => {
    if (addressData && typeof addressData === 'string') {
      const addressParts = addressData.split(', ');
      setManualAddress({
        houseOrBuildingName: addressParts[0] || '',
        subBuildingName: addressParts[1] || '',
        flatOrBuildingNumber: addressParts[2] || '',
        streetName: addressParts[3] || '',
        secondaryStreetName: addressParts[4] || '',
        townOrCity: addressParts[5] || '',
        state: addressParts[6] || '',
        postcode: addressParts[7] || '',
        country: addressParts[8] || ''
      });
    }
  }, [addressData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManualAddress({
      ...manualAddress,
      [name]: value
    });
    // Update addressData in parent component
    setAddressData({
      ...manualAddress,
      [name]: value
    });
  };

  const validateManualAddress = (address) => {
    let errors = {};
    if (!address.houseOrBuildingName) errors.houseOrBuildingName = "House or Building Name is required.";
    if (!address.flatOrBuildingNumber) errors.flatOrBuildingNumber = "Flat or Building Number is required.";
    if (!address.streetName) errors.streetName = "Street Name is required.";
    if (!address.townOrCity) errors.townOrCity = "Town or City is required.";
    else if (!/^[a-zA-Z]+$/.test(address.townOrCity)) errors.townOrCity = "TownOrCity should contain only alphabetic characters.";
    if (!address.state) errors.state = "State is required.";
    else if (!/^[a-zA-Z]+$/.test(address.state)) errors.state = "State should contain only alphabetic characters.";
    if (!address.postcode) errors.postcode = "Postcode is required.";
    if (!address.country) errors.country = "Country is required.";
    else if (!/^[a-zA-Z]+$/.test(address.country)) errors.country = "Country should contain only alphabetic characters.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateManualAddress(manualAddress);

    if (manualAddress.postcode && !/^\d{5}$/.test(manualAddress.postcode)) {
      validationErrors.postcode = "Postcode must be a 5-digit number.";
    }
    

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      const fullAddress = `${manualAddress.houseOrBuildingName}, ${manualAddress.subBuildingName}, ${manualAddress.flatOrBuildingNumber}, ${manualAddress.streetName}, ${manualAddress.secondaryStreetName}, ${manualAddress.townOrCity}, ${manualAddress.state}, ${manualAddress.postcode}, ${manualAddress.country}`;
      setAddressData(fullAddress);
      setIsAddressEntered(true);
      setIsPopupOpen(false);

      // Log the updated addressData
      console.log('updated addressData:', fullAddress);

      try {
        const combinedData = {
          ...personalDetails,
         // address: fullAddress
         address: {
          houseOrBuildingName: manualAddress.houseOrBuildingName,
          subBuildingName: manualAddress.subBuildingName,
          flatOrBuildingNumber: manualAddress.flatOrBuildingNumber,
          streetName: manualAddress.streetName,
          secondaryStreetName: manualAddress.secondaryStreetName,
          townOrCity: manualAddress.townOrCity,
          state: manualAddress.state,
          postcode: manualAddress.postcode,
          country: manualAddress.country
        }
        };
    

        console.log('Combined Data:', combinedData); // Log combinedData to check its value

        const response = await axios.post('http://localhost:3000/api/customers', combinedData);
        console.log('Response:', response.data); // Log API response
        // Capture and store the customer ID from the response
        // setCustomerId(response.data.customerId);
        // console.log("Customer ID:", customerId); // Log the customer ID
        
        const userId = response.data.userId;
        console.log('Extracted customerId:', userId); // Log the extracted customerId
        // setCustomerId(response.data.customerId);
         //console.log("Customer ID:", customerId); // Log the customer ID
       // navigate('/documentUpload', { state: { customerId } });
      
       navigate('/addressManagement',  { state: { userId } });

        

        setIsAddressEntered(true);
        setErrors({});
      } catch (error) {
        console.error('Error submitting address:', error);
        setErrors({ address: 'Failed to submit address' }); // Handle error
      }
    }
  };

  return (
    <Modal
      open={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className="modal-container">
        <h2>Enter Address Manually</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            name="houseOrBuildingName"
            label="House or Building Name"
            value={manualAddress.houseOrBuildingName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.houseOrBuildingName}
            helperText={errors.houseOrBuildingName}
          />
          <TextField
            name="subBuildingName"
            label="Sub Building Name"
            value={manualAddress.subBuildingName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.subBuildingName}
            helperText={errors.subBuildingName}
          />
          <TextField
            name="flatOrBuildingNumber"
            label="Flat or Building Number"
            value={manualAddress.flatOrBuildingNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.flatOrBuildingNumber}
            helperText={errors.flatOrBuildingNumber}
          />
          <TextField
            name="streetName"
            label="Street Name"
            value={manualAddress.streetName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.streetName}
            helperText={errors.streetName}
          />
          <TextField
            name="secondaryStreetName"
            label="Secondary Street Name"
            value={manualAddress.secondaryStreetName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.secondaryStreetName}
            helperText={errors.secondaryStreetName}
          />
          <TextField
            name="townOrCity"
            label="Town or City"
            value={manualAddress.townOrCity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.townOrCity}
            helperText={errors.townOrCity}
          />
          <TextField
            name="state"
            label="State"
            value={manualAddress.state}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.state}
            helperText={errors.state}
          />
          <TextField
            name="postcode"
            label="Postcode"
            value={manualAddress.postcode}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.postcode}
            helperText={errors.postcode}
          />
          <TextField
            name="country"
            label="Country"
            value={manualAddress.country}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.country}
            helperText={errors.country}
          />
          <Button type="submit" variant="contained" color="primary">Submit</Button>
          <Button variant="outlined" color="secondary" onClick={() => setIsPopupOpen(false)}>Close</Button>
        </form>
      </div>
    </Modal>
  );
};

export default ManualAddressPopup;
