const React = require('react');
const { useState, useEffect } = require('react');
const { Link } = require('react-router-dom');
require('../CSS files/Navbar.css');
const GoogleLoginButton = require('./GoogleLoginButton');

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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

    checkAuthStatus();
  }, []);

  return (
    <div className="navbar">
      <li className="home">
        <Link to="/" className="home-link">Home</Link>
      </li>
      <div className="rightLinks">
        {isAuthenticated ? (
          <Link to="/account" className="account-link">Account</Link>
        ) : (
          <GoogleLoginButton className="login" />
        )}
        <li className="uploads">
          <Link to="/upload" className="uploads">Upload PDF</Link>
        </li>
        <li className="uploads">
          <Link to="/past-uploads" className="upload-link">Past Uploads</Link>
        </li>
      </div>
    </div>
  );
}

module.exports = Navbar;