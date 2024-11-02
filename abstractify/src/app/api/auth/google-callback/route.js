// /src/app/api/auth/google-callback/route.js

import { NextResponse } from 'next/server';
import { passportAuth } from '@/lib/middleware';

export async function GET(req) {
  await passportAuth()(req, req.res);
  return new Promise((resolve, reject) => {
    passport.authenticate('google', {
      successRedirect: process.env.CLIENT_URL,
      failureRedirect: '/api/auth/failure',
    })(req, req.res, (err) => {
      if (err) reject(NextResponse.json({ error: err.message }, { status: 500 }));
      resolve(NextResponse.redirect(process.env.CLIENT_URL));
    });
  });
}
