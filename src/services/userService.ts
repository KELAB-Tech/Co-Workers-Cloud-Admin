import { api } from "@/utils/api";

export interface UserRole {
  id: number;
  name: string;
}

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
  roles: UserRole[];
}

export const getUsers = async (): Promise<User[]> => {
  return await api("/admin/users");
};

export const suspendUser = async (id: number): Promise<void> => {
  return await api(`/admin/${id}/suspend`, { method: "PATCH" });
};

export const activateUser = async (id: number): Promise<void> => {
  return await api(`/admin/${id}/activate`, { method: "PATCH" });
};

export const resetPassword = async (id: number): Promise<void> => {
  return await api(`/admin/users/${id}/reset-password`, { method: "POST" });
};