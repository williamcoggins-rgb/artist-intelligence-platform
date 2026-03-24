import { NextRequest, NextResponse } from "next/server";
import { validatePassword, SESSION_COOKIE, SESSION_TOKEN } from "@/lib/dashboard/auth";
import { apiLog, errorMeta } from "@/lib/logger";

const ROUTE = "/api/dashboard-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.password) {
      apiLog("warn", ROUTE, "Missing password in login attempt");
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    if (!validatePassword(body.password)) {
      apiLog("warn", ROUTE, "Failed login attempt", {
        ip: request.headers.get("x-forwarded-for"),
      });
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    apiLog("info", ROUTE, "Dashboard login successful");
    return response;
  } catch (error) {
    apiLog("error", ROUTE, "Dashboard auth failed", errorMeta(error));
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(SESSION_COOKIE);
  apiLog("info", ROUTE, "Dashboard logout");
  return response;
}
