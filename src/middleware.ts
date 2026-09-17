import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'omc_admin_session';

/**
 * Fast gate on /admin. This only checks that a session cookie is present —
 * middleware runs on the edge runtime where node:crypto is unavailable, so the
 * signature itself is verified server-side in the admin layout. Both layers
 * must pass before any admin page renders.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!request.cookies.get(ADMIN_COOKIE)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
