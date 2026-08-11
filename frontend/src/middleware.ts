import { NextRequest, NextResponse } from 'next/server';


// ============================================================================
// ROUTE CONFIGURATION
// ============================================================================

const PUBLIC_ROUTES = [
  '/login',
  '/register',
];

const PROTECTED_PREFIXES = [
  '/dashboard',
];


// ============================================================================
// HELPERS
// ============================================================================

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}


function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      pathname.startsWith(`${prefix}/`)
  );
}


// ============================================================================
// MIDDLEWARE
// ============================================================================

export function middleware(
  request: NextRequest
) {

  const { pathname } = request.nextUrl;


  // --------------------------------------------------------------------------
  // Ignore Next.js internal routes and static files
  // --------------------------------------------------------------------------

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }


  // --------------------------------------------------------------------------
  // Authentication token
  // --------------------------------------------------------------------------
  //
  // The backend will ultimately be responsible for validating the JWT.
  //
  // For frontend route protection we only check whether a token exists.
  //
  // Never treat this check as authorization.
  //

  const token =
    request.cookies.get('storeforge_token')?.value;


  // --------------------------------------------------------------------------
  // Protected dashboard routes
  // --------------------------------------------------------------------------

  if (
    isProtectedRoute(pathname) &&
    !token
  ) {

    const loginUrl =
      new URL(
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


  // --------------------------------------------------------------------------
  // Prevent authenticated users from unnecessarily returning to login
  // --------------------------------------------------------------------------

  if (
    isPublicRoute(pathname) &&
    token
  ) {

    return NextResponse.redirect(
      new URL(
        '/dashboard',
        request.url
      )
    );

  }


  return NextResponse.next();
}


// ============================================================================
// MATCHER
// ============================================================================

export const config = {

  matcher: [
    /*
     * Run middleware on application routes while excluding:
     * - _next/static
     * - _next/image
     * - favicon
     * - common static assets
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'

  ]

};
