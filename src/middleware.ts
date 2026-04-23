import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { authSecret } from "@/lib/auth-config";

export async function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (!isAdminPath) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: authSecret
  });
  const role = token?.role;

  if (isAdminPath && role !== "ADMIN" && role !== "STAFF") {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
