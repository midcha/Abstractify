const React = require('react');
const PdfUpload = require('../Components/PdfUpload'); // Import PdfUpload component

const Upload = () => {
  return React.createElement('div', null, 
    React.createElement('h1', null, 'Upload Page'),
    React.createElement(PdfUpload, null) // Using PdfUpload component
  );
};

module.exports = Upload; // Export the Upload component
