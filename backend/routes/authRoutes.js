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

// Route to check authentication status and get user data
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.CLIENT_URL);  // Redirect back to the client on logout
  });
});

module.exports = router;
