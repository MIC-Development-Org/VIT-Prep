import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;

  // Protect /admin and /moderator routes: authentication required (PRD FR-16)
  if (pathname.startsWith('/admin') || pathname.startsWith('/moderator')) {
    if (!isLoggedIn) {
      const signInUrl = new URL('/auth/signin', req.nextUrl.origin);
      signInUrl.searchParams.set('callbackUrl', req.nextUrl.href);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/moderator/:path*', '/admin/:path*'],
};
