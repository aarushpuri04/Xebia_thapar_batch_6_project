
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css'; // Import your CSS file for styling
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGreaterThan } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState({
    customer: false,
    address: false,
    employment: false,
    documents: false,
    citizenship: false,
    contact: false
  });
  const [editedData, setEditedData] = useState({});
  const token = localStorage.getItem('token'); // Get token from localStorage

  if (!token) {
    throw new Error('No token found. Please log in again.');
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProfileData(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'Error fetching profile');
      }
    };

    fetchProfile();
  }, [token]); // Depend only on token changes

  const toggleEditMode = (section) => {
    // Initialize editedData when entering edit mode
    setEditedData((prevData) => ({
      ...prevData,
      [section]: profileData[section] || {}
    }));
    setEditMode({ ...editMode, [section]: !editMode[section] });
  };

  
  const closeEditMode = (section) => {
    console.log('Closing edit mode for section:', section);
    setEditMode((prevMode) => ({
      ...prevMode,
      [section]: false
    }));
  };
  
  const handleInputChange = (e, section, field) => {

    setEditedData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: e.target.value
      }
    }));
  };

 
  const handleEmplymentInputChange = (e, section, field, type) => {
    const value = e.target.value;
    setEditedData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
        type: type // Ensure type is included in the section update
      }
    }));
  };
  
  
 
  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle case where dateString might be undefined
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Handle invalid date
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  

  const saveProfileChanges = async (section) => {
    try {
      console.log('Saving changes for section:', section);
      console.log('Data being sent:', editedData[section]);
      const formattedDob = formatDate(editedData[section].dob);
  
      const response = await axios.post('http://localhost:3000/api/editname', {
        firstName: editedData[section].firstName,
        middleName: editedData[section].middleName,
        lastName: editedData[section].lastName,
        dob: formattedDob,

      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('API Response:', response.data);
  
      if (response.data.success) {
        // Fetch updated profile data
        const profileResponse = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProfileData(profileResponse.data);
        closeEditMode('customer');
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.response ? err.response.data.error : 'Error saving changes');
    }
  };

  const saveAddressChanges = async (section) => {
    try {
      console.log('Saving changes for section:', section);
      console.log('Data being sent:', editedData[section]);

      // Prepare the address data
    const addressData = {
      houseOrBuildingName: editedData[section].houseOrBuildingName,
      subBuildingName: editedData[section].subBuildingName,
      flatOrBuildingNumber: editedData[section].flatOrBuildingNumber,
      streetName: editedData[section].streetName,
      secondaryStreetName: editedData[section].secondaryStreetName,
      townOrCity: editedData[section].townOrCity,
      state: editedData[section].state,
      postcode: editedData[section].postcode,
      country: editedData[section].country
    };
       
      const response = await axios.post('http://localhost:3000/api/editaddress', {

        address:addressData

      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('API Response:', response.data);
  
      if (response.data.success) {
        // Fetch updated profile data
        const profileResponse = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProfileData(profileResponse.data);
         closeEditMode('address');
        
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      setError(err.response ? err.response.data.error : 'Error saving changes');
    }
  };

  const saveCitizenshipChanges = async (section) => {
    try {
      console.log('Saving changes for section:', section);
      console.log('Data being sent:', editedData[section]);

      // Prepare the address data
    const citizenshipData= {
      nationality: editedData[section].nationality,
      taxResidency:  editedData[section].taxResidency
    };
    console.log('Citizenship Data:', citizenshipData);
      const response = await axios.post('http://localhost:3000/api/editcitizenship', {

        citizenship:citizenshipData

      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log('API Response:', response.data);
  
      if (response.data.success) {
        // Fetch updated profile data
        const profileResponse = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setProfileData(profileResponse.data);
         // Close edit mode after updating profile data
      closeEditMode('citizenship');
      } else {
        setError(response.data.msg);
      }
    } catch (err) {
      // console.error('Error saving changes:', err);
      console.error('Error response:', err.response ? err.response.data : err);
      setError(err.response ? err.response.data.error : 'Error saving changes');
    }
  };

 
  const saveContactChanges = async (section) => {
    try {
        console.log('Saving changes for section:', section);
        console.log('Data being sent:', editedData[section]);

       

        const response = await axios.post('http://localhost:3000/api/editcontact', {
           
          email: editedData[section].email,
         phone: editedData[section].phone,
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
            const profileResponse = await axios.get('http://localhost:3000/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setProfileData(profileResponse.data);
            closeEditMode('contact');
        } else {
            setError(response.data.msg);
        }
    } catch (err) {
        console.error('Error saving changes:', err);
        setError(err.response ? err.response.data.error : 'Error saving changes');
    }
};

const saveEmploymentChanges = async (section) => {
  try {
    console.log('Saving changes for section:', section);
    console.log('Data being sent:', editedData[section]);
    console.log('date being sent:', editedData[section].startDate);

    const formatStartDate = formatDate(editedData[section].startDate);
    console.log("formatStartDate",formatStartDate)
   const formatretirementDate=formatDate(editedData[section].retirementDate );

    // Prepare the employment data based on the type
    const employmentData = {
      type: editedData[section].type,
      company: editedData[section].company || '',
      position: editedData[section].position || '',
      startDate: formatStartDate || '',
      salary: editedData[section].salary || '',
      hours: editedData[section].hours || '',
      hourlyRate: editedData[section].hourlyRate || '',
      businessName: editedData[section].businessName || '',
      industry: editedData[section].industry || '',
      yearsBusiness: editedData[section].yearsBusiness || '',
      annualIncome: editedData[section].annualIncome || '',
      retirementDate: formatretirementDate || '',
      previousOccupation: editedData[section].previousOccupation || '',
      pension: editedData[section].pension || '',
      school: editedData[section].school || '',
      major: editedData[section].major || '',
      graduationYear: editedData[section].graduationYear || '',
      partTimeJob: editedData[section].partTimeJob || '',
      lastJob: editedData[section].lastJob || '',
      reason: editedData[section].reason || '',
      seekingWork: editedData[section].seekingWork || ''
    };

    const response = await axios.post('http://localhost:3000/api/editemployment', {
      employment: employmentData
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data);

    if (response.data.success) {
      // Fetch updated profile data
      const profileResponse = await axios.get('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setProfileData(profileResponse.data);
      closeEditMode('employment');
    } else {
      setError(response.data.msg);
    }
  } catch (err) {
    console.error('Error saving changes:', err);
    setError(err.response ? err.response.data.error : 'Error saving changes');
  }
};


 
  
 

  if (error) {
    return <div className="profile-error">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="profile-loading">Loading...</div>;
  }

  const { customer } = profileData;

  return (
    <div className='profile-body'>
      <div className="profile-container">
        <h1 className="profile-title">Personal Details</h1>
        <div className="profile-row">
          <section className="profile-section">
            <div className="profile-card">
              <h2>Customer Details</h2>
              <button className="edit-button" onClick={() => toggleEditMode('customer')}>Edit</button>
                   {editMode.customer ? (
                <div className="profile-edit">
                  <p><strong>First Name:</strong> 
                    <input 
                      type="text" 
                      defaultValue={customer.firstName} 
                      onChange={(e) => handleInputChange(e, 'customer', 'firstName')} 
                    />
                  </p>
                  <p><strong>Middle Name:</strong> 
                    <input 
                      type="text" 
                      defaultValue={customer.middleName} 
                      onChange={(e) => handleInputChange(e, 'customer', 'middleName')} 
                    />
                  </p>
                  <p><strong>Last Name:</strong> 
                    <input 
                      type="text" 
                      defaultValue={customer.lastName} 
                      onChange={(e) => handleInputChange(e, 'customer', 'lastName')} 
                    />
                  </p>
                  <p><strong>DOB:</strong> 
                    <input 
                      type="date" 
                      defaultValue={new Date(customer.dob)} 
                      onChange={(e) => handleInputChange(e, 'customer', 'dob')} 
                    />
                  </p>
                  <button className="save-button" onClick={() => saveProfileChanges('customer')}>Save</button>
                  <button className="close-button" onClick={() => closeEditMode('customer')}>Close</button>
                </div>
              ) : (
                <div className="profile-details">
                  <p><strong>First Name:</strong> {customer.firstName}</p>
                  <p><strong>Middle Name:</strong> {customer.middleName}</p>
                  <p><strong>Last Name</strong>: {customer.lastName}</p>
                  <p><strong>DOB:</strong> {customer.dob}</p>
                </div>
              )}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-card-address">
              <h2>Address</h2>
              <button className="edit-button" onClick={() => toggleEditMode('address')}>Edit</button>
              {editMode.address ? (
                <div className="profile-edit">
                  <p><strong>House Or Building Name:</strong> <input type="text" defaultValue={customer.address.houseOrBuildingName}   onChange={(e) => handleInputChange(e, 'customer', 'houseOrBuildingName')} /></p>
                  <p><strong>Sub Building Name:</strong> <input type="text" defaultValue={customer.address.subBuildingName}   onChange={(e) => handleInputChange(e, 'customer', 'subBuildingName')} /></p>
                  <p><strong>Flat Or Building Number:</strong> <input type="text" defaultValue={customer.address.flatOrBuildingNumber} onChange={(e) => handleInputChange(e, 'customer', 'flatOrBuildingNumber')} /></p>
                  <p><strong>Street Name:</strong> <input type="text" defaultValue={customer.address.streetName} onChange={(e) => handleInputChange(e, 'customer', 'streetName')}/></p>
                  <p><strong>Secondary Street Name:</strong> <input type="text" defaultValue={customer.address.secondaryStreetName} onChange={(e) => handleInputChange(e, 'customer', 'secondaryStreetName')}/></p>
                  <p><strong>Town Or City:</strong> <input type="text" defaultValue={customer.address.townOrCity} onChange={(e) => handleInputChange(e, 'customer', 'townOrCity')} /></p>
                  <p><strong>State:</strong> <input type="text" defaultValue={customer.address.state} onChange={(e) => handleInputChange(e, 'customer', 'state')}/></p>
                  <p><strong>Postcode:</strong> <input type="text" defaultValue={customer.address.postcode} onChange={(e) => handleInputChange(e, 'customer', 'postcode')} /></p>
                  <p><strong>Country:</strong> <input type="text" defaultValue={customer.address.country} onChange={(e) => handleInputChange(e, 'customer', 'country')}/></p>
                  <button className="save-button" onClick={() => saveAddressChanges('customer')}>Save</button>
                  <button className="close-button" onClick={() => closeEditMode('address')}>Close</button>

                </div>
              ) : (
                <div className="profile-address">
                   <p><strong>House Or Building Name:</strong> {customer.address.houseOrBuildingName}</p>
                   <p><strong>Sub Building Name:</strong> {customer.address.subBuildingName}</p>
                   <p><strong>Flat Or Building Number:</strong> {customer.address.flatOrBuildingNumber}</p>
                   <p><strong>Street Name:</strong> {customer.address.streetName}</p>
                  <p><strong>Secondary Street Name:</strong> {customer.address.secondaryStreetName}</p>
                  <p><strong>Town Or City:</strong> {customer.address.townOrCity}</p>
                 <p><strong>State:</strong> {customer.address.state}</p>
                 <p><strong>Postcode:</strong> {customer.address.postcode}</p>
                 <p><strong>Country:</strong> {customer.address.country}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className='doc-row'>
          <section className="profile-section">
            <div className="profile-card-emp">
              <h2>Employment Details</h2>
              <button className="edit-button" onClick={() => toggleEditMode('employment')}>Edit</button>
              {editMode.employment ? (
                <div className="profile-edit">
                  {customer.employment.type === 'full-time'  && (
                    <>
                      <p><strong>Company Name:</strong> <input type="text" defaultValue={customer.employment.company}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'company','full-time')}/></p>
                      <p><strong>Position:</strong> <input type="text" defaultValue={customer.employment.position}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'position','full-time')} /></p>
                      <p><strong>Start Date:</strong> <input type="date" defaultValue={new Date(customer.employment.startDate)}  onChange={(e) => handleEmplymentInputChange(e, 'customer', 'startDate','full-time')} /></p>
                      <p><strong>Annual Salary:</strong> <input type="text" defaultValue={customer.employment.salary}  onChange={(e) => handleEmplymentInputChange(e, 'customer', 'salary','full-time')} /></p>
                    </>
                  )}
                  {customer.employment.type === 'part-time' && (
                    <>
                      <p><strong>Company Name:</strong> <input type="text" defaultValue={customer.employment.company}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'company','part-time')}/></p>
                      <p><strong>Position:</strong> <input type="text" defaultValue={customer.employment.position}   onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'position','part-time')}/></p>
                      <p><strong>Hours per Week:</strong> <input type="text" defaultValue={customer.employment.hours}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'hours','part-time')} /></p>
                      <p><strong>Hourly Rate:</strong> <input type="text" defaultValue={customer.employment.hourlyRate}   onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'hourlyRate','part-time')}/></p>
                    </>
                  )}
                  {customer.employment.type === 'self-employed' && (
                    <>
                      <p><strong>Business Name:</strong> <input type="text" defaultValue={customer.employment.businessName} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'businessName','self-employed')} /></p>
                      <p><strong>Industry:</strong> <input type="text" defaultValue={customer.employment.industry}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'industry','self-employed')}/></p>
                      <p><strong>Years in Business:</strong> <input type="text" defaultValue={customer.employment.yearsBusiness} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'yearsBusiness','self-employed')} /></p>
                      <p><strong>Annual Income:</strong> <input type="text" defaultValue={customer.employment.annualIncome} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'annualIncome','self-employed')} /></p>
                    </>
                  )}
                  {customer.employment.type === 'retired' && (
                    <>
                      <p><strong>Retirement Date:</strong> <input type="date" defaultValue={customer.employment.retirementDate} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'retirementDate', 'retired')}/></p>
                      <p><strong>Previous Occupation:</strong> <input type="text" defaultValue={customer.employment.previousOccupation} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'previousOccupation' ,'retired')} /></p>
                      <p><strong>Monthly Pension:</strong> <input type="text" defaultValue={customer.employment.pension} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'pension', 'retired')} /></p>
                    </>
                  )}
                  {customer.employment.type === 'student' && (
                    <>
                      <p><strong>School/University Name:</strong> <input type="text" defaultValue={customer.employment.school} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'school','student')} /></p>
                      <p><strong>Major/Field of Study:</strong> <input type="text" defaultValue={customer.employment.major}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'major','student')}/></p>
                      <p><strong>Expected Graduation Year:</strong> <input type="text" defaultValue={customer.employment.graduationYear} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'graduationYear','student')} /></p>
                      <p><strong>Part-Time Job:</strong> <input type="text" defaultValue={customer.employment.partTimeJob} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'partTimeJob','student')} /></p>
                    </>
                  )}
                  {customer.employment.type === 'not-employed' && (
                    <>
                      <p><strong>Last Job (if any):</strong> <input type="text" defaultValue={customer.employment.lastJob}  onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'lastJob','not-employed')}/></p>
                      <p><strong>Reason for Not Working:</strong> <input type="text" defaultValue={customer.employment.reason} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'reason','not-employed')} /></p>
                      <p><strong>Seeking Work:</strong> <input type="text" defaultValue={customer.employment.seekingWork} onChange={(e) =>  handleEmplymentInputChange(e, 'customer', 'seekingWork','not-employed')} /></p>
                    </>
                  )}
                  <button className="save-button" onClick={() => saveEmploymentChanges('customer')}>Save</button>
                  <button className="close-button" onClick={() => closeEditMode('employment')}>Close</button>

                </div>
              ) : (
                <div className="profile-employment">
                  {customer.employment.type === 'full-time' && (
                    <>
                      <p><strong>Company Name:</strong> {customer.employment.company}</p>
                      <p><strong>Position:</strong> {customer.employment.position}</p>
                      <p><strong>Start Date:</strong> {customer.employment.startDate}</p>
                      <p><strong>Annual Salary:</strong> {customer.employment.salary}</p>
                    </>
                  )}
                  {customer.employment.type === 'part-time' && (
                    <>
                      <p><strong>Company Name:</strong> {customer.employment.company}</p>
                      <p><strong>Position:</strong> {customer.employment.position}</p>
                      <p><strong>Hours per Week:</strong> {customer.employment.hours}</p>
                      <p><strong>Hourly Rate:</strong> {customer.employment.hourlyRate}</p>
                    </>
                  )}
                  {customer.employment.type === 'self-employed' && (
                    <>
                      <p><strong>Business Name:</strong> {customer.employment.businessName}</p>
                      <p><strong>Industry:</strong> {customer.employment.industry}</p>
                      <p><strong>Years in Business:</strong> {customer.employment.yearsBusiness}</p>
                      <p><strong>Annual Income:</strong> {customer.employment.annualIncome}</p>
                    </>
                  )}
                  {customer.employment.type === 'retired' && (
                    <>
                      <p><strong>Retirement Date:</strong> {customer.employment.retirementDate}</p>
                      <p><strong>Previous Occupation:</strong> {customer.employment.previousOccupation}</p>
                      <p><strong>Monthly Pension:</strong> {customer.employment.pension}</p>
                    </>
                  )}
                  {customer.employment.type === 'student' && (
                    <>
                      <p><strong>School/University Name:</strong> {customer.employment.school}</p>
                      <p><strong>Major/Field of Study:</strong> {customer.employment.major}</p>
                      <p><strong>Expected Graduation Year:</strong> {customer.employment.graduationYear}</p>
                      <p><strong>Part-Time Job:</strong> {customer.employment.partTimeJob}</p>
                    </>
                  )}
                  {customer.employment.type === 'not-employed' && (
                    <>
                      <p><strong>Last Job (if any):</strong> {customer.employment.lastJob}</p>
                      <p><strong>Reason for Not Working:</strong> {customer.employment.reason}</p>
                      <p><strong>Seeking Work:</strong> {customer.employment.seekingWork}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* <section className="profile-section">
            <div className="profile-card-doc">
              <h2>Documents</h2>
              <button className="edit-button" onClick={() => toggleEditMode('documents')}>Edit</button>
              {editMode.documents ? (
                <div className="profile-edit">
                  <button className="save-button">Save</button>
                  <button className="close-button" onClick={() => closeEditMode('documents')}>Close</button>

                </div>
              ) : (
                <div>
                  {customer.documents.length > 0 ? (
                    customer.documents.map(doc => (
                      <div key={doc._id} className="profile-document">
                        <p><strong>Type:</strong> {doc.type}</p>
                        <p><strong>File Name:</strong> {doc.fileName}</p>
                        <p><strong>Download Link</strong>: <a href={doc.downloadLink} target="_blank" rel="noopener noreferrer">{doc.fileName}</a></p>
                        <p><strong>Uploaded At:</strong> {new Date(doc.uploadedAt).toLocaleString()}</p>
                      </div>
                    ))
                  ) : (
                    <p>No documents uploaded.</p>
                  )}
                </div>
              )}
            </div> */}
          {/* </section> */}
          <section className="profile-section">
          <div className="profile-card-personaldetails">
            <h2>Contact Details</h2>
            <button className="edit-button" onClick={() => toggleEditMode('contact')}>Edit</button>
            {editMode.contact ? (
              <div className="profile-edit">
                <p><strong>Email:</strong> <input type="email" defaultValue={customer.email} onChange={(e) => handleInputChange(e, 'customer', 'email')}  /></p>
                <p><strong>Phone Number:</strong> <input type="tel" defaultValue={customer.phone} onChange={(e) => handleInputChange(e, 'customer', 'phone')} /></p>
                <button className="save-button"  onClick={() => saveContactChanges('customer')} >Save</button>
                <button className="close-button" onClick={() => closeEditMode('contact')}>Close</button>

              </div>
            ) : (
              <div className="profile-details">
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone Number:</strong> {customer.phone}</p>
              </div>
            )}
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-card-citizen">
            <h2>Nationality & Tax Residency</h2>
            <button className="edit-button" onClick={() => toggleEditMode('citizenship')}>Edit</button>
            {editMode.citizenship ? (
              <div className="profile-edit">
                <p><strong>Nationality:</strong> <input type="text" defaultValue={customer.citizenship.nationality}  onChange={(e) => handleInputChange(e, 'customer', 'nationality')} /></p>
                <p><strong>Tax Residency:</strong> <input type="text" defaultValue={customer.citizenship.taxResidency} onChange={(e) => handleInputChange(e, 'customer', 'taxResidency')}  /></p>
                <button className="save-button" onClick={() => saveCitizenshipChanges('customer')}>Save</button>
                <button className="close-button" onClick={() => closeEditMode('citizenship')}>Close</button>

              </div>
            ) : (
              <div className="profile-details">
                <p><strong>Nationality:</strong> {customer.citizenship.nationality}</p>
                <p><strong>Tax Residency:</strong> {customer.citizenship.taxResidency}</p>
              </div>
            )}
          </div>
        </section>
        </div>

        {/* <section className="profile-section">
          <div className="profile-card-citizen">
            <h2>Nationality & Tax Residency</h2>
            <button className="edit-button" onClick={() => toggleEditMode('citizenship')}>Edit</button>
            {editMode.citizenship ? (
              <div className="profile-edit">
                <p><strong>Nationality:</strong> <input type="text" defaultValue={customer.citizenship.nationality}  onChange={(e) => handleInputChange(e, 'customer', 'nationality')} /></p>
                <p><strong>Tax Residency:</strong> <input type="text" defaultValue={customer.citizenship.taxResidency} onChange={(e) => handleInputChange(e, 'customer', 'taxResidency')}  /></p>
                <button className="save-button" onClick={() => saveCitizenshipChanges('customer')}>Save</button>
                <button className="close-button" onClick={() => closeEditMode('citizenship')}>Close</button>

              </div>
            ) : (
              <div className="profile-details">
                <p><strong>Nationality:</strong> {customer.citizenship.nationality}</p>
                <p><strong>Tax Residency:</strong> {customer.citizenship.taxResidency}</p>
              </div>
            )}
          </div>
        </section> */}

        {/* <section className="profile-section">
          <div className="profile-card-personaldetails">
            <h2>Contact Details</h2>
            <button className="edit-button" onClick={() => toggleEditMode('contact')}>Edit</button>
            {editMode.contact ? (
              <div className="profile-edit">
                <p><strong>Email:</strong> <input type="email" defaultValue={customer.email} onChange={(e) => handleInputChange(e, 'customer', 'email')}  /></p>
                <p><strong>Phone Number:</strong> <input type="tel" defaultValue={customer.phone} onChange={(e) => handleInputChange(e, 'customer', 'phone')} /></p>
                <button className="save-button"  onClick={() => saveContactChanges('customer')} >Save</button>
                <button className="close-button" onClick={() => closeEditMode('contact')}>Close</button>

              </div>
            ) : (
              <div className="profile-details">
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Phone Number:</strong> {customer.phone}</p>
              </div>
            )}
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default ProfilePage;