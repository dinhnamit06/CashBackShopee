import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const adminPaths = ["/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get("hoantien_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Admin check done in admin layout
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("hoantien_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
