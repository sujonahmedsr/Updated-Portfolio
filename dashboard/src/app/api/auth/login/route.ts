import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const demoUsername = process.env.DEMO_USERNAME;
    const demoPassword = process.env.DEMO_PASSWORD;

    const isAdmin = Boolean(expectedUsername && expectedPassword && username === expectedUsername && password === expectedPassword);
    const isViewer = Boolean(demoUsername && demoPassword && username === demoUsername && password === demoPassword);
    if (!isAdmin && !isViewer) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }

    await createSession(username, isAdmin ? "admin" : "viewer");

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      role: isAdmin ? "admin" : "viewer",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
