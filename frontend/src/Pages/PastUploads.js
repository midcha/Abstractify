// src/PastUploads.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS files/PastUploads.css';
import GoogleLoginButton from '../Components/GoogleLoginButton';

const PastUploads = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/status', {
          credentials: 'include', // Important if using cookies for session management
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      }
    };

    checkAuthStatus();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <h2>Please log in to view your past uploads</h2>
        <GoogleLoginButton />
      </div>
    );
  }

  return (
    <div className='wrapper'>
      <div className="headAndFirst">
        <h2>Past Uploads</h2>
        <div className="firstUpload">
          hello this is the first upload
        </div>
      </div>
      <p>Here you can view your past uploads.</p>
      <ul>
        <li>Upload 1</li>
        <li>Upload 2</li>
        <li>Upload 3</li>
      </ul>
    </div>
  );
};

export default PastUploads;
