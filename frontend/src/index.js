import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './Components/Navbar';  // Import Navbar component
import Home from './Pages/Home';       // Import Home component
import Login from './Pages/Login';     // Import Login component
import PastUploads from './Pages/PastUploads'; // Import PastUploads component
import Upload from './Pages/Upload';
// Main App Component with Router
const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/past-uploads" element={<PastUploads />} />
      <Route path="/upload" element ={<Upload />} />
    </Routes>
  </Router>
);

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
