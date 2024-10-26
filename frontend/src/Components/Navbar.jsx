// src/Navbar.js
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../CSS files/Navbar.css';
import GoogleLoginButton from '../Components/GoogleLoginButton';
import PastUploads from '../Pages/PastUploads';


const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState);
    setHasOpened(true);
  };

  return(
    <div className="navbar">
      <GoogleLoginButton className="login"></GoogleLoginButton>
      <li className="uploads">
        <Link to="/past-uploads" className="upload-link">Uploads</Link>
      </li>
    </div>
    
  );
};

export default Navbar;
