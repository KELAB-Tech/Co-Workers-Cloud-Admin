import { api } from "@/utils/api";
import { session } from "@/utils/session";

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {
  const result = await api.post("/auth/login", data);

  if (!result?.token) {
    throw new Error("No se recibió token del servidor");
  }

  // ✅ Validar que tenga rol ADMIN antes de guardar sesión
  const roles: string[] = result.roles ?? [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  if (!isAdmin) {
    // No guardamos nada — rechazamos de inmediato
    throw new Error("No tienes permisos para acceder al panel de administración.");
  }

  // Solo si es admin guardamos la sesión
  session.set(result.token);

  // Guardamos info básica del usuario
  localStorage.setItem("user", JSON.stringify({
    email:      result.email,
    roles:      result.roles,
    actorType:  result.actorType,
    tipoPersona: result.tipoPersona,
  }));

  return result;
};