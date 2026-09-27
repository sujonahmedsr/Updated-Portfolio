import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

type RouteContext = { params: Promise<{ segments: string[] }> };

async function forward(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  if (request.method !== "GET" && session.role !== "admin") {
    return NextResponse.json({ message: "Read-only access" }, { status: 403 });
  }

  const key = process.env.PRIVATE_DATA_API_KEY;
  const baseUrl = process.env.PRIVATE_DATA_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!key || !baseUrl) {
    return NextResponse.json({ message: "Private tools are not configured" }, { status: 503 });
  }

  const { segments } = await context.params;
  const upstreamUrl = new URL(`/api/private-tools/${segments.map(encodeURIComponent).join("/")}`, baseUrl);
  upstreamUrl.search = new URL(request.url).search;
  const headers = new Headers({ "x-private-data-key": key });
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();
  if (body) headers.set("content-type", request.headers.get("content-type") || "application/json");

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const responseBody = await response.text();
    return new NextResponse(responseBody, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") || "application/json", "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json({ message: "Private data service unavailable" }, { status: 502 });
  }
}

export const GET = forward;
export const POST = forward;
export const PATCH = forward;
export const DELETE = forward;