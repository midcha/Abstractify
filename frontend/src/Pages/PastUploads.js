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
      </div>
    );
  }

  return (
    <div className='wrapper'>
      <div className="headAndFirst">
        <h2>Past Uploads</h2>
        <div className="recentUpload">
          <a id="uploadWrapperLink">
            <h1>
              RESEARCH PAPER TITLE
            </h1>
            <div id="dateID">
              <h3>
                ID
              </h3>
              <h3>
                __/__/____
              </h3>
            </div>  
          </a>
        </div>
      </div>
      <div className="genUploads">
        <a id="uploadWrapperLink">
              <h1>
                RESEARCH PAPER TITLE
              </h1>
              <div id="dateID">
                <h3>
                  ID
                </h3>
                <h3>
                  __/__/____
                </h3>
              </div>  
            </a>
      </div>
    </div>
  );
};

export default PastUploads;
