// /src/app/api/auth/logout/route.js

import { passportAuth, logout } from '@/lib/middleware';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await passportAuth()(req, req.res);
  await logout(req);
  return NextResponse.redirect(process.env.CLIENT_URL);
}
