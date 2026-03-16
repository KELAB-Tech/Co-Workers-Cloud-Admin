import { api } from "@/utils/api";

export interface UpdateUserPayload {
  name: string;
  email: string;
  tipoPersona: "NATURAL" | "JURIDICA";
  actorType: string;
  // ✅ sin password ni afiliado — el backend no los acepta en este endpoint
}

export interface UpdateUserResponse {
  id: number;
  name: string;
  email: string;
  tipoPersona: string;
  actorType: string;
  roles: string[];
  afiliado: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<UpdateUserResponse> => {
  return await api.put(`/admin/users/${id}`, payload);
};