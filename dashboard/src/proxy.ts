import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "admin_session_token";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let role: "admin" | "viewer" | null = null;

  if (token && process.env.JWT_SECRET) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ["HS256"],
      });
      role = payload.role === "viewer" ? "viewer" : payload.role === "admin" ? "admin" : null;
    } catch {
      role = null;
    }
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard") && !role) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("from", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user away from /login to /dashboard
  if (pathname === "/login" && role) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (role === "viewer" && pathname.startsWith("/dashboard") && !["/dashboard/read-only", "/dashboard/personal"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard/read-only", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};