import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import PastUploads from './Pages/PastUploads';
import Upload from './Pages/Upload';
import Account from './Pages/Account';
import RenderView from './Pages/RenderView'; // Import RenderView

// Main App Component with Router
const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/past-uploads" element={<PastUploads />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/account" element={<Account />} />
      <Route path="/render-view/:fileName" element={<RenderView />} /> {/* Add this route */}
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
