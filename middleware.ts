import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

const protectedPaths = ["/dashboard", "/play", "/profile", "/inventory", "/shop", "/achievements", "/settings"];
const adminPaths = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = protectedPaths.some((path) => pathname.startsWith(path));
  const needsAdmin = adminPaths.some((path) => pathname.startsWith(path));
  if (!needsAuth && !needsAdmin) return NextResponse.next();

  const user = await verifyAccessToken(req.cookies.get("sf_access")?.value);
  if (!user) return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(pathname)}`, req.url));
  if (needsAdmin && user.role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/play/:path*", "/profile/:path*", "/inventory/:path*", "/shop/:path*", "/achievements/:path*", "/settings/:path*", "/admin/:path*"]
};
