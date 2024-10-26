// /config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback', // Match your redirect URI
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the profile information to check or create a user in your database
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user to maintain session data
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
