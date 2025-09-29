// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // You'll need to install this: npm install jose

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("Middleware - Token:", token ? "Present" : "Missing"); // Debug log
  console.log("Middleware - Path:", pathname); // Debug log

  // If no token and trying to access protected /admin path (except login)
  if (!token && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    console.log("Redirecting to login - no token"); // Debug log
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If token exists and trying to access login page, verify the token first
  if (token && pathname === "/admin/login") {
    try {
      // Use the same secret as your backend
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      // Token is valid, redirect to dashboard
      console.log("Valid token, redirecting to dashboard"); // Debug log
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } catch (error) {
      console.log("Invalid token, allowing login page"); // Debug log
      // Token is invalid, allow access to login page
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Paths that middleware runs on
export const config = {
  matcher: ["/admin/:path*"],
};