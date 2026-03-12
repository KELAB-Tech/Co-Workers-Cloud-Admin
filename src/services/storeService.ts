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

/**
 * Obtener todas las tiendas
 */
export const getStores = async (): Promise<Store[]> => {
  return await api("/store");
};

/**
 * Aprobar tienda
 */
export const approveStore = async (id: number) => {
  return await api(`/admin/stores/${id}/approve`, {
    method: "PUT",
  });
};

/**
 * Suspender tienda
 */
export const suspendStore = async (id: number) => {
  return await api(`/admin/${id}/suspend`, {
    method: "PUT",
  });
};

/**
 * Obtener tienda por ID
 */
export const getStoreById = async (id: number): Promise<Store> => {
  return await api(`/store/${id}`);
};
/**
 * Obtener tiendas pendientes de aprobación
 */
export const getPendingStores = async (): Promise<Store[]> => {
  return await api("/admin/pending");
};