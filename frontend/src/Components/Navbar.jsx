// src/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS files/Navbar.css';
import GoogleLoginButton from '../Components/GoogleLoginButton';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  return (
    <div className="navbar">
      {isAuthenticated ? (
        <Link to="/account" className="account-link">Account</Link> // Link to account page if authenticated
      ) : (
        <GoogleLoginButton className="login" /> // Login button if not authenticated
      )}
      <li className="uploads">
        <Link to="/upload" className="uploads">Upload PDF</Link>
      </li>
      <li className="uploads">
        <Link to="/past-uploads" className="upload-link">Past Uploads</Link>
      </li>
    </div>
  );
};

export default Navbar;
