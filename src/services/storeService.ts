import { api } from "@/utils/api";

export interface Store {
  id: number;
  name: string;
  description: string;
  phone: string;
  city: string;
  address: string;
  logoUrl: string;
  status: "APPROVED" | "PENDING" | "SUSPENDED";
  active: boolean;
}

export interface PagedStores {
  content: Store[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getStores = async (
  page = 0,
  size = 10,
  filters: {
    city?: string;
    name?: string;
    status?: string;
    actorType?: string;
  } = {}
): Promise<PagedStores> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("sortBy", "createdAt");
  params.set("sortDir", "desc");

  if (filters.city)      params.set("city", filters.city);
  if (filters.name)      params.set("name", filters.name);
  if (filters.status)    params.set("status", filters.status);
  if (filters.actorType) params.set("actorType", filters.actorType);

  return await api.get(`/admin/stores?${params.toString()}`);
};

export const getPendingStores = async (
  page = 0,
  size = 10
): Promise<PagedStores> => {
  return await api.get(`/admin/stores/pending?page=${page}&size=${size}`);
};

export const approveStore = async (id: number): Promise<Store> => {
  return await api.put(`/admin/stores/${id}/approve`, {}); // ✅ body vacío, no el método
};

export const suspendStore = async (id: number): Promise<Store> => {
  return await api.put(`/admin/stores/${id}/suspend`, {}); // ✅ body vacío
};

export const getStoreById = async (id: number): Promise<Store> => {
  return await api.get(`/store/${id}`);
};