import { authMiddleware } from "@clerk/nextjs";
import { routeAccessMap } from "./lib/settings";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    const role = auth.sessionClaims?.metadata?.role as string;
    
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      return Response.redirect(signInUrl);
    }

    for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
      const pattern = new RegExp(route);
      if (pattern.test(req.nextUrl.pathname) && !allowedRoles.includes(role)) {
        return Response.redirect(new URL(`/${role}`, req.url));
      }
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};