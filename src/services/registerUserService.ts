import { api } from "@/utils/api";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  tipoPersona: "NATURAL" | "JURIDICA";
  actorType: string;
  afiliado: boolean;
}

export const registerUser = async (payload: RegisterUserPayload): Promise<void> => {
  return await api("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};