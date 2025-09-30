import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const protectedPath = isAdminRoute && !isLoginPage;

  const token = req.cookies.get("token")?.value;
  let isValidToken = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production");
      await jwtVerify(token, secret);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  // Redirect if trying to access protected page without valid token
  if (protectedPath && !isValidToken) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Redirect from login if already logged in
  if (isLoginPage && isValidToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };