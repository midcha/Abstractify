// /src/app/api/auth/status/route.js

import { passportAuth } from '@/lib/middleware';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await passportAuth()(req, req.res);
  const isAuthenticated = req.isAuthenticated && req.isAuthenticated();
  return NextResponse.json({ isAuthenticated, user: req.user || null });
}
