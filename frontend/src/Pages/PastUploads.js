// src/PastUploads.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS files/PastUploads.css';
import GoogleLoginButton from '../Components/GoogleLoginButton';

const PastUploads = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploads, setUploads] = useState([]); // State to hold past uploads
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/status', {
          credentials: 'include',
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    // Fetch past uploads if authenticated
    const fetchUploads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/toJson/research-papers');
        const data = await response.json();
        setUploads(data); // Set the uploads data
      } catch (error) {
        console.error('Failed to fetch past uploads:', error);
      }
    };

    checkAuthStatus();
    if (isAuthenticated) {
      fetchUploads();
    }
  }, [isAuthenticated]);

  // If the user isn't authenticated, show the login prompt
  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <h2>Please log in to view your past uploads</h2>
        <GoogleLoginButton />
      </div>
    );
  }

  // Function to handle navigation to render view with selected upload
  const handleSelectUpload = (upload) => {
    navigate(`/render-view/${upload._id}`, { state: { outputString: upload.outputString } });
  };

  return (
    <div className='wrapper'>
      <div className="headAndFirst">
        <h2>Past Uploads</h2>
        {uploads.length > 0 ? (
          <div className="recentUpload" onClick={() => handleSelectUpload(uploads[0])}>
            <a id="uploadWrapperLink">
              <h1>{uploads[0].title}</h1>
              <div id="dateID">
                <h3>{uploads[0].doi}</h3>
                <h3>{new Date(uploads[0].dateAccessed).toLocaleDateString()}</h3>
              </div>  
            </a>
          </div>
        ) : (
          <p>No uploads found.</p>
        )}
      </div>
      <div className="genUploads">
        {uploads.slice(1).map((upload) => (
          <div key={upload._id} className="upload-item" onClick={() => handleSelectUpload(upload)}>
            <a id="uploadWrapperLink">
              <h1>{upload.title}</h1>
              <div id="dateID">
                <h3>{upload.doi}</h3>
                <h3>{new Date(upload.dateAccessed).toLocaleDateString()}</h3>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastUploads;
