import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedPaths = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next();

  /*
  const token = request.cookies.get('churnai-token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  */

  // Attach a dummy userId header for Demo Mode
  const response = NextResponse.next();
  response.headers.set('x-user-id', 'demo-user-id');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
