import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access public paths
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected paths
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For admin routes
  if (path.startsWith('/admin')) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
      if (decoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/',
    '/profile',
    '/admin/:path*',
    '/login',
    '/register'
  ]
}; 