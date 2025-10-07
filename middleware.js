import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const protectedPath = isAdminRoute && !isLoginPage;

  // Forward cookie
  const cookieHeader = req.headers.get("cookie");
  const fetchHeaders = { "Content-Type": "application/json" };
  if (cookieHeader) fetchHeaders["Cookie"] = cookieHeader;

  if (isAdminRoute) {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: fetchHeaders,
      });

      if (res.ok) {
        const user = await res.json();

        // Logged in → block login page
        if (isLoginPage) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      } else {
        // Not logged in → redirect protected pages
        if (protectedPath) {
          return NextResponse.redirect(new URL("/admin/login", req.url));
        }
      }
    } catch (err) {
      console.error("Middleware error:", err);
      if (protectedPath) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
