// src/PastUploads.js
import React from 'react';
import '../CSS files/PastUploads.css';

const PastUploads = () => {
  return (
    <div className='wrapper'>
      <div className="headAndFirst">
        <h2>Past Uploads</h2>
        <div className="firstUpload">
          hello this is the frirst upload
        </div>
      </div>
      <p>Here you can view your past uploads.</p>
      <ul>
        <li>Upload 1</li>
        <li>Upload 2</li>
        <li>Upload 3</li>
      </ul>
    </div>
  );
};

export default PastUploads;
