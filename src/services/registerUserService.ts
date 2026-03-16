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
  return await api.post("/auth/register", payload);
};