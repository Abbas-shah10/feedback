import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const secureCookie = request.cookies.get("__Secure-next-auth.session-token");
  const cookie = secureCookie || request.cookies.get("next-auth.session-token");

  if (!cookie && (request.nextUrl.pathname.startsWith("/home") || request.nextUrl.pathname.startsWith("/feedback") || request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/feedback"))) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/feedback/:path*", "/admin/:path*", "/api/feedback/:path*", "/api/admin/:path*"],
};
