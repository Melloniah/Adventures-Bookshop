// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect /admin paths (ignore static assets)
  const protectedPath = pathname.startsWith("/admin") && pathname !== "/admin/login";

  // Get token: first from req.cookies, fallback to cookie header (httpOnly safe)
  const token = req.cookies.get("token")?.value;
  const cookieHeader = req.headers.get("cookie") || "";
  const rawToken = token || cookieHeader.match(/token=([^;]+)/)?.[1];

  // Validate token
  let isValidToken = false;
  if (rawToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(rawToken, secret);
      isValidToken = true;
    } catch (err) {
      isValidToken = false;
    }
  }

  // Redirect unauthenticated users trying to access protected pages
  if (!isValidToken && protectedPath) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (isValidToken && pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // All other requests pass through
  return NextResponse.next();
}

// Apply middleware only to /admin paths
export const config = {
  matcher: ["/admin/:path*"],
};
