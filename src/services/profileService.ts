import { api } from "@/utils/api";

export interface MyProfile {
  id: number;
  name: string;
  email: string;
  tipoPersona: "NATURAL" | "JURIDICA";
  actorType: string;
  roles: string[];
  afiliado: boolean;
  enabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateMyProfilePayload {
  name: string;
  email: string;
}

export const getMyProfile = async (): Promise<MyProfile> => {
  return await api.get("/users/me");
};

export const updateMyProfile = async (
  payload: UpdateMyProfilePayload
): Promise<MyProfile> => {
  return await api.put("/users/me", payload);
};