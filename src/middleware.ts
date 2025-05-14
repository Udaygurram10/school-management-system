import { ClerkMiddleware, getAuth, withClerkMiddleware } from '@clerk/nextjs/server';
import { routeAccessMap } from './lib/settings';
import { NextResponse } from 'next/server';

const clerkMiddleware: ClerkMiddleware = async (request) => {
  const auth = await getAuth(request);

  if (!auth.userId && !request.nextUrl.pathname.startsWith('/sign-in')) {
    const signInUrl = new URL('/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  const role = auth.sessionClaims?.metadata?.role as string;

  for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
    const pattern = new RegExp(route);
    if (pattern.test(request.nextUrl.pathname) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }
  
  return NextResponse.next();
};

export default withClerkMiddleware(clerkMiddleware);

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};