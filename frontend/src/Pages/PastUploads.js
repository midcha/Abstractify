const React = require('react');
const { useEffect, useState } = require('react');
require('../CSS files/PastUploads.css'); // Ensure you use require for CSS

const PastUploads = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    // Fetch past uploads on mount
    const fetchUploads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/uploads', {
          credentials: 'include',
        });
        const data = await response.json();
        setUploads(data.uploads || []); // Assuming the response structure
      } catch (error) {
        console.error('Failed to fetch uploads:', error);
      }
    };

    fetchUploads();
  }, []);

  return React.createElement(
    'div',
    { className: 'past-uploads' },
    React.createElement('h1', null, 'Past Uploads'),
    uploads.length > 0 ? (
      React.createElement(
        'ul',
        null,
        uploads.map(upload =>
          React.createElement('li', { key: upload.id }, upload.title) // Assuming uploads have an id and title
        )
      )
    ) : (
      React.createElement('p', null, 'No uploads found.')
    )
  );
};

module.exports = PastUploads;
