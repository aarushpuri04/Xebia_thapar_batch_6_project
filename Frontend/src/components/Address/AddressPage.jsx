

import React, { useState ,useContext } from 'react';
import AddressForm from './AddressForm';
import ManualAddressPopup from './ManualAddressPopUp';
import './Modal.css'; 
import axios from 'axios';

import { useLocation } from 'react-router-dom';
import { blue } from '@mui/material/colors';


function AddressPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddressEntered, setIsAddressEntered] = useState(false);
  const location = useLocation();
  const { personalDetails } = location.state; // Extract personalDetails from props
  //console.log(JSON.stringify(personalDetails));

  //const [addressData, setAddressData] = useState('');

  const [addressData, setAddressData] = useState({
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

  // const handleAddressChange = (name, value) => {
  //   setAddressData(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };
  const handleAddressChange = (value) => {
    setAddressData(value);
   // console.log('Updated addressData:', value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form...');
    try {
      const combinedData = {
        ...personalDetails,
        address: addressData
      };

     // console.log( addressData);
     console.log('Combined Data:', combinedData); //

      const response = await axios.post('/api/customers', combinedData);
      console.log('Response:', response.data);
      // Handle success (e.g., navigate to a success page)
      //navigate('/success');
    } catch (error) {
      console.error('Error:', error.response.data);
      // Handle error (e.g., show an error message)
    }
  };

  // const handleAddressChange = (value) => {
  //   setAddressData(value);
  //   console.log('Updated addressData:', value);
  // };

  return (
    <div>
   <h1 > Home Address</h1>
      <AddressForm
        setIsPopupOpen={setIsPopupOpen}
        isPopupOpen={isPopupOpen}
        addressData={addressData}
        setAddressData={handleAddressChange}
        isAddressEntered={isAddressEntered}
        setIsAddressEntered={setIsAddressEntered}
        personalDetails={personalDetails}
        handleSubmit={handleSubmit}
      />
      {isPopupOpen && (
        <ManualAddressPopup
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          setAddressData={handleAddressChange}
          setIsAddressEntered={setIsAddressEntered}
        />
      )}
    </div>
  );
}

export default AddressPage;
