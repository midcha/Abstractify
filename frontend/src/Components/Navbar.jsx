// src/Navbar.js
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import styles from '../CSS files/Navbar.module.css';

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const toggleMenu = () => {
    setMenuVisible(prevState => !prevState);
    setHasOpened(true);
  };

  return(
    <div className={styles.navbar}>
      <button id={styles.dropdown} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      {menuVisible && <div className={styles.overlay} onClick={toggleMenu} />}
      <div className={`${styles.links} ${menuVisible ? styles.show : (hasOpened ? styles.hide : styles.hidden)}`}>
        <a href="/Upload">Upload</a>
        <a href="/Login">Login</a>
        <a href="About">About</a>
      </div>
    </div>
    
  );
};

export default Navbar;
