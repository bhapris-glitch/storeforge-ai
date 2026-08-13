import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/pricing',
  '/about',
  '/terms',
];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/store-builder',
  '/branding',
  '/products',
  '/themes',
  '/analytics',
  '/billing',
  '/settings',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

export function middleware(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals and static files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public pages don't require authentication.
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Only apply authentication checks to protected pages.
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  /*
   * Authentication can be stored in either:
   *
   * 1. HTTP-only cookie: token
   * 2. HTTP-only cookie: accessToken
   *
   * The backend remains the authoritative authentication layer.
   */
  const token =
    request.cookies.get('token')?.value ||
    request.cookies.get('accessToken')?.value;

  if (!token) {
    const loginUrl = new URL(
      '/login',
      request.url
    );

    loginUrl.searchParams.set(
      'redirect',
      pathname
    );

    return NextResponse.redirect(
      loginUrl
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on application routes,
     * excluding Next.js internals and common static assets.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
