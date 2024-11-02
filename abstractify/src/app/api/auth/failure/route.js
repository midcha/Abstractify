// /src/app/api/auth/failure/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.text('Failed to authenticate.');
}
