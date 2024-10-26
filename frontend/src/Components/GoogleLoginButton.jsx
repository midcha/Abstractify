import React from 'react';

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self'); // Redirect to the backend's Google OAuth route
  };

  return <button onClick={handleLogin}>Login with Google</button>;
};

export default GoogleLoginButton;