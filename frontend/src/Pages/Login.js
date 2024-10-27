// src/Login.js
const React = require('react');
const GoogleLoginButton = require('../Components/GoogleLoginButton');

const Login = () => {
  return (
    <div>
      <h2>Login Page</h2>
      <GoogleLoginButton />
    </div>
  );
};

module.exports = Login;
