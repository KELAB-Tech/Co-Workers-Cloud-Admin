import { api } from "@/utils/api";

export interface UpdateUserPayload {
  name: string;
  email: string;
  password?: string;
  tipoPersona: "NATURAL" | "JURIDICA";
  actorType: string;
  afiliado: boolean;
}

export const updateUser = async (id: number, payload: UpdateUserPayload): Promise<void> => {
  return await api(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};