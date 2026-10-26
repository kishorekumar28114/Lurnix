import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Using jose directly because middleware runs on Edge runtime and standard Node.js crypto (used in jsonwebtoken) is not available
const secretKey = process.env.JWT_SECRET || "default_secret_key_for_development_only";
const key = new TextEncoder().encode(secretKey);

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
      // Verify the JWT token
      await jwtVerify(sessionCookie, key, {
        algorithms: ["HS256"],
      });

      // Token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      return handleUnauthorized(request, isApiRoute);
    }
  }

  // Allow access to public routes (/, /login, /register, etc.)
  return NextResponse.next();
}

function handleUnauthorized(request: NextRequest, isApiRoute: boolean) {
  if (isApiRoute) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  } else {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL("/login", request.url));
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
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|assets/).*)",
  ],
};
