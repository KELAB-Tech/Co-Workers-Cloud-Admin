import { api } from "@/utils/api";

export interface User {
  id: number;
  name: string;
  email: string;
  tipoPersona: "NATURAL" | "JURIDICA";
  actorType: "ADMIN_GENERAL" | "RECICLADOR" | "TRANSFORMADOR" | "TRANSPORTADOR" | string;
  afiliado: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string | null;
  roles: string[]; // ✅ el backend devuelve Set<String>, no objetos
}

export interface PagedUsers {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getUsers = async (
  page = 0,
  size = 10,
  filters: {
    name?: string;
    email?: string;
    tipoPersona?: string;
    actorType?: string;
    enabled?: boolean;
  } = {}
): Promise<PagedUsers> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sortBy", "createdAt");
  params.set("sortDir", "desc");

  if (filters.name)        params.set("name", filters.name);
  if (filters.email)       params.set("email", filters.email);
  if (filters.tipoPersona) params.set("tipoPersona", filters.tipoPersona);
  if (filters.actorType)   params.set("actorType", filters.actorType);
  if (filters.enabled !== undefined) params.set("enabled", String(filters.enabled));

  return await api.get(`/admin/users?${params.toString()}`);
};

export const getUserById = async (id: number): Promise<User> => {
  return await api.get(`/admin/users/${id}`);
};

export const suspendUser = async (id: number): Promise<void> => {
  return await api.patch(`/admin/users/${id}/suspend`);
};

export const activateUser = async (id: number): Promise<void> => {
  return await api.patch(`/admin/users/${id}/activate`);
};