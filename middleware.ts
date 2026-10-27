import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and /api routes (except /api/auth)
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isApiRoute = pathname.startsWith("/api");
  const isAuthApiRoute = pathname.startsWith("/api/auth");

  if (isDashboardRoute || (isApiRoute && !isAuthApiRoute)) {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      return handleUnauthorized(request, isApiRoute);
    }

    try {
      const payload = await verifyToken(sessionCookie);
      if (!payload) {
        return handleUnauthorized(request, isApiRoute);
      }

      // Token is valid, allow request to proceed
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      return handleUnauthorized(request, isApiRoute);
    }
  }

  // Allow access to public routes
  return NextResponse.next();
}

function handleUnauthorized(request: NextRequest, isApiRoute: boolean) {
  if (isApiRoute) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  } else {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - assets (asset files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|assets/).*)",
  ],
};
