const React = require('react');
const ReactDOM = require('react-dom/client');
const { BrowserRouter: Router, Routes, Route } = require('react-router-dom');
require('./index.css');
const reportWebVitals = require('./reportWebVitals');
const Navbar = require('./Components/Navbar'); // Import Navbar component
const Home = require('./Pages/Home'); // Import Home component
const PastUploads = require('./Pages/PastUploads'); // Import PastUploads component
const Upload = require('./Pages/Upload'); // Import Upload component
const Account = require('./Pages/Account'); // Import Account component

// Main App Component with Router
const App = () => {
  return React.createElement(Router, null,
    React.createElement(Navbar, null),
    React.createElement(Routes, null,
      React.createElement(Route, { path: "/", element: React.createElement(Home) }),
      React.createElement(Route, { path: "/past-uploads", element: React.createElement(PastUploads) }),
      React.createElement(Route, { path: "/upload", element: React.createElement(Upload) }),
      React.createElement(Route, { path: "/account", element: React.createElement(Account) })
    )
  );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(React.StrictMode, null, React.createElement(App))
);

reportWebVitals();
