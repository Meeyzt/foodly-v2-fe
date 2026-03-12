import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessPath, roleHome, type UserRole } from "@/shared/auth/roles";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("auth_role")?.value as UserRole | undefined;
  const { pathname } = request.nextUrl;

  if (!token && (pathname.startsWith("/customer") || pathname.startsWith("/staff") || pathname.startsWith("/manager"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && role && pathname === "/") {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  if (!canAccessPath(pathname, role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/customer/:path*", "/staff/:path*", "/manager/:path*"],
};
