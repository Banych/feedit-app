import { getAuthSession } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }
}

export const config = {
  matcher: ['/r/:path/submit', '/r/create'],
};
