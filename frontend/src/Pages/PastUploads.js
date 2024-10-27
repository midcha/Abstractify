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
        <div className="recentUpload">
          <a id="uploadWrapperLink">
            <h3>
              RESEARCH PAPER TITLE
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non velit nec justo aliquet feugiat. Etiam in nulla varius, condimentum quam id, interdum enim. Aliquam ornare augue eu velit interdum, aliquam accumsan quam euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer nisl ipsum, vehicula nec euismod condimentum, efficitur id velit. Duis ultricies tellus vel lacus congue rutrum. Cras pulvinar rhoncus sodales. Nam dolor enim, dapibus vel mi lobortis, tempor efficitur mauris. Donec lobortis justo ac orci pharetra, et lobortis enim auctor. Nunc in eleifend nulla, nec accumsan urna.
            </p>
          </a>
        </div>
      </div>
      <div className="genUploads">
        <a id="uploadWrapperLink">
          <h3>
            RESEARCH PAPER TITLE
          </h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non velit nec justo aliquet feugiat. Etiam in nulla varius, condimentum quam id, interdum enim. Aliquam ornare augue eu velit interdum, aliquam accumsan quam euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer nisl ipsum, vehicula nec euismod condimentum, efficitur id velit. Duis ultricies tellus vel lacus congue rutrum. Cras pulvinar rhoncus sodales. Nam dolor enim, dapibus vel mi lobortis, tempor efficitur mauris. Donec lobortis justo ac orci pharetra, et lobortis enim auctor. Nunc in eleifend nulla, nec accumsan urna.
          </p>
        </a>
      </div>
    </div>
  );
};

export default PastUploads;
