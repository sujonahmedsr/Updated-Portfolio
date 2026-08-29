import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || "admin";
    const expectedPassword = process.env.ADMIN_PASSWORD || "X123";

    if (username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }

    await createSession(username);

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
