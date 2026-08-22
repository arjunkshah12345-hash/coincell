import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/demo" || request.nextUrl.pathname.startsWith("/demo/")) {
    return NextResponse.redirect(new URL("/scan", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/demo", "/demo/:path*"],
};
