import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Decodifica el payload del JWT sin librería (solo base64)
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    // Padding para base64
    const padded = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function hasAdminRole(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  // Spring Security guarda los roles en "roles" o "authorities"
  const roles: string[] =
    payload.roles ??
    payload.authorities ??
    payload.scope?.split(" ") ??
    [];

  return roles.includes("ROLE_ADMIN");
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  // exp está en segundos, Date.now() en milisegundos
  return Date.now() >= payload.exp * 1000;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/signin"];
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));

  // Sin token → a signin
  if (!token && !isPublic) {
    const response = NextResponse.redirect(new URL("/signin", request.url));
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  if (token) {
    // ✅ Token expirado → limpiar cookie y redirigir
    if (isTokenExpired(token)) {
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("token");
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return response;
    }

    // ✅ Token válido pero sin rol ADMIN → acceso denegado
    if (!isPublic && !hasAdminRole(token)) {
      const response = NextResponse.redirect(new URL("/signin?error=unauthorized", request.url));
      response.cookies.delete("token"); // limpiamos la cookie inválida
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
      return response;
    }

    // Ya logueado como admin intentando entrar a signin
    if (isPublic && hasAdminRole(token)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Ruta protegida con token válido y rol correcto
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|icons|assets).*)",
  ],
};