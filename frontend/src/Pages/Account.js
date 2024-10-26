import React, { useEffect, useState } from 'react';

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
          console.log('User data:', data.user); // Debug log to see the structure
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

  // Helper function to format the full name
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

  // Helper function to get email - handles both direct email property and nested emails array
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
        <>
          <h1>Welcome, {getFullName(user)}</h1>
          <p>Email: {getEmail(user)}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Account;