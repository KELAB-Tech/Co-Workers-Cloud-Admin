import { api } from "@/utils/api";

export interface LastProduct {
  id: number;
  name: string;
  storeName: string;
  price: number;
}

export interface TopStore {
  storeId: number;
  storeName: string;
  productCount: number;
}

export interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalStores: number;
  approvedStores: number;
  pendingStores: number;
  suspendedStores: number;
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  featuredProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  productsCreatedToday: number;
  lastProducts: LastProduct[];
  topStores: TopStore[];
}

export const getDashboard = async (): Promise<DashboardData> => {
  return await api.get("/admin/dashboard");
};