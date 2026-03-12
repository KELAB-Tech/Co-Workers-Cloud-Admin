import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // rutas públicas
  const publicRoutes = ["/signin"];

  const isPublic = publicRoutes.includes(pathname);

  // Si entra a "/" sin login
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Si NO hay token y la ruta NO es pública
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Si ya está logueado y entra al signin
  if (token && pathname === "/signin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons|assets).*)",
  ],
};