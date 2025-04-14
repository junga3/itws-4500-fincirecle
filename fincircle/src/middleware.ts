import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token;

  // protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');

  // redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    const callbackUrl = request.nextUrl.pathname.startsWith('/') ? request.nextUrl.pathname : '/login';
    redirectUrl.searchParams.set('callbackUrl', callbackUrl);
    return NextResponse.redirect(redirectUrl);
  }

  // redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// specify which routes the middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};