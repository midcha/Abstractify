// src/Login.js
import React from 'react';

const Login = () => {
  return (
    <div>
      <h2>Login Page</h2>
      <p>Please log in to access your account.</p>
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
