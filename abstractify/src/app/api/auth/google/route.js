// /src/app/api/auth/google/route.js

import { NextResponse } from 'next/server';
import { passportAuth, login } from '@/lib/middleware';

export async function GET(req) {
  await passportAuth()(req, req.res);
  await login(req, req.res);
  return NextResponse.redirect(process.env.CLIENT_URL);  // Redirect to frontend after login
}
