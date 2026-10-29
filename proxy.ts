import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  const isAuthRoute = url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up");
  const isPrivateRoute = url.pathname.startsWith("/home") || url.pathname.startsWith("/feedback") || url.pathname.startsWith("/admin") || url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/api/feedback") || url.pathname.startsWith("/api/admin");

  if (token && isAuthRoute) return NextResponse.redirect(new URL("/home", request.url));
  if (!token && isPrivateRoute) {
    if (url.pathname.startsWith("/api/")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (token && url.pathname.startsWith("/admin") && token.role !== "admin") return NextResponse.redirect(new URL("/home", request.url));
  if (!token && url.pathname === "/") return NextResponse.redirect(new URL("/sign-in", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/home/:path*", "/feedback/:path*", "/admin/:path*", "/dashboard/:path*", "/api/feedback/:path*", "/api/admin/:path*"],
};
