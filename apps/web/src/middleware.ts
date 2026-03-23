import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes (except /dashboard/login)
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Allow the login page
  if (pathname === "/dashboard/login") {
    const session = request.cookies.get("dashboard_session");
    if (session?.value === "authenticated") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check authentication for all other dashboard routes
  const session = request.cookies.get("dashboard_session");
  if (!session || session.value !== "authenticated") {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
