

import React, { useState } from 'react';
import { Button, Container, Typography, Box, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const AddressManagementPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    houseOrBuildingName: '',
    subBuildingName: '',
    flatOrBuildingNumber: '',
    streetName: '',
    secondaryStreetName: '',
    townOrCity: '',
    state: '',
    postcode: '',
    country: '',
  });
  const [alertMessage, setAlertMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleNext = () => {
    navigate('/email', { state: { userId } });
    console.log('customerId-- ', userId);
  };

  const handleChangeAddress = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/updateAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, address }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Address updated successfully:', responseData);
        setAlertMessage('Address updated successfully'); // Set success message
        setShowForm(false);
      } else {
        setAlertMessage('Error updating address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      setAlertMessage('Error updating address');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box border={1} padding={2} borderRadius={4} marginTop={10} width={600}>
        <Typography variant="h6">Change Address:</Typography>
        <Box display="flex" flexDirection="column" alignItems="center" marginTop={2}>

        <Button
          variant="contained"
          color="primary"
          onClick={handleChangeAddress}
          style={{ marginBottom: '20px',width:'300px' }}
        >
          Change Address
        </Button>
        {/* <Button variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
          Remove Address
        </Button> */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          // style={{ marginTop: '10px',marginRight: '130px'  }}
          style={{width:'300px'}}
        >
          Continue
        </Button>
</Box>
        <Dialog open={showForm} onClose={handleClose}>
          <DialogTitle>Update Address</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill in the address details below to update your address.
            </DialogContentText>
            {Object.keys(address).map((key) => (
              <TextField
                key={key}
                name={key}
                label={key}
                value={address[key]}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {alertMessage && (
          <Typography variant="body2" color="error" style={{ marginTop: '10px' }}>
            {alertMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default AddressManagementPage;


