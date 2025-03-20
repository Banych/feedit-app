import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/r/:path/submit', '/r/create', '/settings'];

const isProtectedPath = (path: string) => {
  return protectedPaths.some((protectedPath) => {
    const regex = new RegExp(protectedPath.replace(/:[^/]+/g, '[^/]+'));
    return regex.test(path);
  });
};

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || '',
    secureCookie: process.env.NODE_ENV === 'production' ? true : false,
  });

  if (!token && isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  const headers = new Headers(req.headers);
  headers.set('x-pathname', req.nextUrl.pathname);

  return NextResponse.next({
    request: {
      ...req,
      headers,
    },
  });
}
