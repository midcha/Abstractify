// Account.js (keeping it simple)
import React, { useEffect, useState } from 'react';
import '../CSS files/Account.css';

const Account = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details on mount
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/status', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.isAuthenticated) {
          console.log('User data:', data.user);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    window.open('http://localhost:5000/api/auth/logout', '_self');
  };

  const getFullName = (user) => {
    if (user.name.givenName && user.name.familyName) {
      return `${user.name.givenName} ${user.name.familyName}`;
    } else if (user.name.givenName) {
      return user.name.givenName;
    } else if (user.name.familyName) {
      return user.name.familyName;
    }
    return 'Unknown';
  };

  const getFirstName = (user) => {
    if (user.name.givenName && user.name.familyName) {
      return `${user.name.givenName}`;
    } else if (user.name.familyName) {
      return user.name.familyName;
    }
    return 'Unknown';
  };

  const getEmail = (user) => {
    if (user.emails && user.emails.length > 0) {
      return user.emails[0].value;
    }
    if (user.email) {
      return user.email;
    }
    return 'No email available';
  };

  return (
    <div className="account-page">
      {user ? (
        <div className="account-content">
          <h1>Welcome, <span className="highlight">{getFirstName(user)}</span></h1>
          <div className="user-info">
            <p>Email: {getEmail(user)}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default Account;