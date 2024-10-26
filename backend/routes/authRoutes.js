// /routes/authRoutes.js

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to initiate Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route to handle Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: process.env.CLIENT_URL,  // Redirect to frontend on success
  failureRedirect: '/api/auth/failure',     // Redirect on failure
}));

// Optional route for handling failed logins
router.get('/failure', (req, res) => {
  res.send('Failed to authenticate.');
});

module.exports = router;
