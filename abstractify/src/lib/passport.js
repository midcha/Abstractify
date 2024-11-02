// /src/lib/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

let isInitialized = false;

function initializePassport() {
  if (isInitialized) return;  // Ensure Passport is only initialized once
  isInitialized = true;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_URL}/api/auth/google-callback`, // Match your redirect URI
      },
      (accessToken, refreshToken, profile, done) => {
        // Use profile information to check or create a user in your database
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
}

initializePassport();

module.exports = passport;
