import { api } from "@/utils/api";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  mainImageUrl: string;
  status: string;
  featured: boolean;
}

export const getAllProducts = async () => {
  return await api("/admin/products");
};

export const activateProduct = async (productId: number) => {
  return await api(`/products/admin/${productId}/activate`, {
    method: "PATCH",
  });
};

export const deactivateProduct = async (productId: number) => {
  return await api(`/products/admin/${productId}/deactivate`, {
    method: "PATCH",
  });
};

export const toggleFeatured = async (productId: number) => {
  return await api(`/products/admin/${productId}/toggle-featured`, {
    method: "PATCH",
  });
};