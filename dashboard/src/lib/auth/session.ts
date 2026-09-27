import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "shofiqul-portfolio-super-secret-jwt-key-2026"
);

export const SESSION_COOKIE_NAME = "admin_session_token";

export interface SessionPayload {
  username: string;
  role: "admin" | "viewer";
  expiresAt: number;
}

export async function encryptSession(payload: Omit<SessionPayload, "expiresAt">) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  return new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    if (!process.env.JWT_SECRET) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return decryptSession(token);
}

export async function createSession(username: string, role: SessionPayload["role"] = "admin") {
  const token = await encryptSession({ username, role });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
