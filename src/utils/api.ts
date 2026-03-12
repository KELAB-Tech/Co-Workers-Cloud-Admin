export const API_URL = "http://localhost:8080/api";

export const api = async (endpoint: string, options: RequestInit = {}) => {

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};