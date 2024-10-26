import React from 'react';
import '../CSS files/Navbar.css';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self'); // Redirect to the backend's Google OAuth route
  };

  return <button className="login" onClick={handleLogin}>Login</button>;
};

export default GoogleLoginButton;