import { api } from "@/utils/api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  mainImageUrl: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  storeName: string;
  storeCity: string;
  status: string;
  featured: boolean;
}

export interface PagedProducts {
  content: Product[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export const getAllProducts = async (
  page = 0,
  size = 10,
  sortBy = "createdAt",
  sortDir = "desc"
): Promise<PagedProducts> => {
  return await api.get(
    `/admin/products?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
  );
};

export const activateProduct = async (productId: number): Promise<void> => {
  return await api.patch(`/products/admin/${productId}/activate`);
};

export const deactivateProduct = async (productId: number): Promise<void> => {
  return await api.patch(`/products/admin/${productId}/deactivate`);
};

export const toggleFeatured = async (productId: number): Promise<void> => {
  return await api.patch(`/products/admin/${productId}/toggle-featured`);
};