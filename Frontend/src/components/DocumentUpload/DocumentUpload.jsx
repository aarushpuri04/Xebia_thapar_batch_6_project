
import React, { useState,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import './DocumentUpload.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DocumentUpload = () => {
  const [selectedDocType, setSelectedDocType] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [errors, setErrors] = useState([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state;
  

  const maxFileSize = 3 * 1024 * 1024; 

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.size > maxFileSize) {
      setErrors([...errors, 'File size exceeds 3MB']);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedDocuments([
        ...uploadedDocuments,
        { type: selectedDocType, file, url: e.target.result }
      ]);
      setSelectedDocType('');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (type) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.type !== type));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: 'application/pdf, image/jpeg, image/jpg',
    disabled: !selectedDocType,
  });

  const handleSelectChange = (e) => {
    setSelectedDocType(e.target.value);
    setErrors([]); // Clear errors when changing document type
  };

  const availableDocTypes = ['PAN Card', 'Aadhar Card'].filter(
    (docType) => !uploadedDocuments.some((doc) => doc.type === docType)
  );

  const isSubmitDisabled = uploadedDocuments.length < 2;

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('userId', userId); // Include customer ID
    uploadedDocuments.forEach(doc => {
      formData.append('documents', doc.file);
      formData.append('type', doc.type); // Append the type for each document
    });
  console.log("form:",uploadedDocuments);
    try {
      const response = await axios.post('http://localhost:3000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Documents uploaded successfully');
      console.log('Response:', response.data);
      alert('Documents uploaded successfully');
      navigate('/employment',{ state: { userId }});

    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Failed to upload documents');
    }
  };

  return (
    <div className="doccontainer">
      <h1>Document Upload</h1>
      <div className="select-container">
        <label htmlFor="docType">Select Document Type: </label>
        <select
          id="docType"
          value={selectedDocType}
          onChange={handleSelectChange}
        >
          <option value="">--Select--</option>
          {availableDocTypes.map((docType, index) => (
            <option key={index} value={docType}>
              {docType}
            </option>
          ))}
        </select>
      </div>
      <div
        {...getRootProps({
          className: `dropzone ${isDragActive ? 'active' : ''} ${!selectedDocType ? 'disabled' : ''}`,
        })}
      >
        <input {...getInputProps()} />
        {selectedDocType ? (
          <p>Drag 'n' drop a file here, or click to select one</p>
        ) : (
          <p>Please select a document type first</p>
        )}
      </div>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>
              {error}
            </p>
          ))}
        </div>
      )}
      <div>
        <h2>Uploaded Documents</h2>
        <table className="uploaded-table">
          <thead>
            <tr>
              <th>Document Type</th>
              <th>File Name</th>
              <th>Download Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedDocuments.map((doc, index) => (
              <tr key={index}>
                <td>{doc.type}</td>
                <td>{doc.file.name}</td>
                <td>
                  <a href={doc.url} download>
                    Download
                  </a>
                </td>
                <td>
                  <button className="button"onClick={() => handleRemove(doc.type)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className={`submit-button ${isSubmitDisabled ? 'disabled' : ''}`}
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default DocumentUpload;
