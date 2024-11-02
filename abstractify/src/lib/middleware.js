// /src/lib/middleware.js

import nextConnect from 'next-connect';
import passport from './passport';
import session from 'express-session';
import { promisify } from 'util';

const MongoDBStore = require('connect-mongodb-session')(session);

// Create a MongoDB session store if using MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});

store.on('error', function(error) {
  console.error("Session store error:", error);
});

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Use a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
  store, // Optional, for MongoDB-backed sessions
});

// Promisify req.login and req.logout for Next.js compatibility
const login = promisify(passport.authenticate('google'));
const logout = promisify(passport.session());

function passportAuth() {
  return nextConnect()
    .use(sessionMiddleware)
    .use(passport.initialize())
    .use(passport.session());
}

export { passportAuth, login, logout };
