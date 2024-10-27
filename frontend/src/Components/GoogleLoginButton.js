const React = require('react');
require('../CSS files/Navbar.css');

function GoogleLoginButton() {
  const handleLogin = () => {
    window.open('http://localhost:5000/api/auth/google', '_self');
  };

  return <button className="login-button" onClick={handleLogin}>Login</button>;
}

module.exports = GoogleLoginButton;