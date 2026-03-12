import { api } from "@/utils/api";

interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (data: LoginRequest) => {

  const result = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return result;
};