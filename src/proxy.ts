import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
  exp?: number;
  roles?: string[];
  authorities?: string[];
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

function hasAdminRole(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  const roles: string[] = payload.roles ?? payload.authorities ?? [];
  return roles.includes("ROLE_ADMIN");
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/signin", "/signup"];
  const isPublic = publicRoutes.some(r => pathname.startsWith(r));

  // Sin token → signin
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (token) {
    // Token expirado
    if (isTokenExpired(token)) {
      const res = NextResponse.redirect(new URL("/signin", request.url));
      res.cookies.delete("token");
      return res;
    }

    // Token válido pero sin rol admin → signin
    if (!isPublic && !hasAdminRole(token)) {
      const res = NextResponse.redirect(new URL("/signin?error=unauthorized", request.url));
      res.cookies.delete("token");
      return res;
    }

    // Ya logueado e intenta entrar a signin → dashboard
    if (isPublic && hasAdminRole(token)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons|assets).*)",
  ],
};