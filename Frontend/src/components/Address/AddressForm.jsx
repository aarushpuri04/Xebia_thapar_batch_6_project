
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, TextField, Button, CircularProgress, Typography, Box, Container } from '@mui/material';
import ManualAddressPopup from './ManualAddressPopUp';
import { useLocation, useNavigate } from 'react-router-dom';


const AddressForm = ({ setIsPopupOpen, isPopupOpen, addressData, setAddressData, isAddressEntered, setIsAddressEntered }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const location = useLocation();
  
  const { personalDetails } = location.state;

  const navigate = useNavigate();

  useEffect(() => {
    if (isPopupOpen) {
      setSuggestions([]);
    }
  }, [isPopupOpen]);

  const handleSelect = (value) => {
    setAddressData(value);
    setSuggestions([]);
    setIsAddressEntered(true);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value
    });

    if (value) {
      setLoading(true);
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
        setSuggestions(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
    setIsAddressEntered(false);
  };

  const validateAddress = (address) => {
    let errors = {};
    if (!address.houseOrBuildingName) errors.houseOrBuildingName = "House or Building Name is required.";
    if (!address.flatOrBuildingNumber) errors.flatOrBuildingNumber = "Flat or Building Number is required.";
    if (!address.streetName) errors.streetName = "Street Name is required.";
    if (!address.townOrCity) errors.townOrCity = "Town or City is required.";
    if (!address.state) errors.state = "State is required.";
    if (!address.postcode) errors.postcode = "Postcode is required.";
    if (!address.country) errors.country = "Country is required.";
    return errors;
  };

  const handleRemoveAddress = async () => {
    if (window.confirm('Are you sure you want to remove the address?')) {
      try {
        const url = `http://localhost:3000/api/customers`; // Replace with actual endpoint
        await axios.delete(url); // Use DELETE for removing
        setAddressData('');
        setIsAddressEntered(false);
        setErrors({});
        console.log('Address removed successfully');
      } catch (error) {
        console.error('Error removing address:', error);
        setErrors({ address: 'Failed to remove address' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateAddress(addressData);
    if (Object.keys(error).length > 0) {
      setErrors(error);
    } else {
      setErrors({});
      setIsAddressEntered(true);
      // Check if address data has actually changed
      const hasChanged = !Object.keys(addressData).every(key => addressData[key] === personalDetails.address[key]);
      if (hasChanged) {
        try {
          const combinedData = {
            ...personalDetails,
            address: addressData
          };

          // Use PUT to update the address (assuming address has a unique identifier)
          const url = `http://localhost:3000/api/customers`; // Replace with actual endpoint
          const response = await axios.put(url, combinedData);
          console.log('Response:', response.data);
          setIsAddressEntered(true);
          setErrors({});
          navigate('/addressManagement', { state: { customerId: response.data.customerId } });
        } catch (error) {
          console.error('Error updating address:', error);
          setErrors({ address: 'Failed to update address' });
        }
      } else {
        console.log('Address is already up-to-date, no update sent.');
        navigate('/addressManagement', { state: { customerId: personalDetails.customerId } });
      }
    }
  };

  return (
    <Container maxWidth="sm">
      {isAddressEntered ? (
         <Box border={1} padding={2} borderRadius={4} marginTop={10}>
        {/* //   <Typography variant="h6">Address:</Typography>
        //   <Typography>{JSON.stringify(addressData, null, 2)}</Typography>
        //   <Button variant="contained" color="primary" onClick={() => setIsPopupOpen(true)} style={{ marginRight: '10px' }}>
        //     Change Address
        //   </Button>
        //   <Button variant="outlined" color="secondary" onClick={handleRemoveAddress}>
        //     Remove Address
        //   </Button>
        //   <Button variant="contained" color="primary" onClick={handleNext} style={{ marginTop: '50px', marginLeft: '3px' }}>
        //     Next
        //   </Button> */}
       
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Search Address ..."
            value={addressData}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.address}
            helperText={errors.address}
          />
          {loading && <CircularProgress />}
          <List>
            {suggestions.map((suggestion) => (
              <ListItem button onClick={() => handleSelect(suggestion.display_name)} key={suggestion.place_id}>
                {suggestion.display_name}
              </ListItem>
            ))}
          </List>
          <Button onClick={() => setIsPopupOpen(true)} style={{ marginTop: '10px' ,width:'500px'}}>
            {isAddressEntered ? "Change Address" : "Enter Address Manually"}
          </Button>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '10px' }}>
            Submit
          </Button>
        </form>
      )}
      <ManualAddressPopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        addressData={addressData}
        setAddressData={setAddressData}
        setIsAddressEntered={setIsAddressEntered}
      />
    </Container>
  );
};

export default AddressForm;
