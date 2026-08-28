import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session_token";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "shofiqul-portfolio-super-secret-jwt-key-2026"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isValidSession = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET, {
        algorithms: ["HS256"],
      });

      isValidSession = true;
    } catch {
      isValidSession = false;
    }
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard") && !isValidSession) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user away from /login to /dashboard
  if (pathname === "/login" && isValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};