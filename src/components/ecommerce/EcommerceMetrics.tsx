"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { StoreIcon } from "lucide-react";
import { api } from "@/utils/api";

type DashboardMetrics = {
  totalUsers: number;
  activeUsers: number;
  totalStores: number;
  approvedStores: number;
  totalProducts: number;
  activeProducts: number;
};

export const EcommerceMetrics = () => {

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadDashboard() {
      try {

        const data = await api("/admin/dashboard");

        console.log("Dashboard:", data);

        setMetrics({
          totalUsers: data.totalUsers,
          activeUsers: data.activeUsers,
          totalStores: data.totalStores,
          approvedStores: data.approvedStores,
          totalProducts: data.totalProducts,
          activeProducts: data.activeProducts,
        });

      } catch (error) {

        console.error("Dashboard error:", error);

      } finally {

        setLoading(false);

      }
    }

    loadDashboard();

  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div className="p-6">No dashboard data</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">

      {/* USERS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Usuarios
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.totalUsers}
            </h4>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {metrics.activeUsers} activos
          </Badge>
        </div>
      </div>

      {/* STORES */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <StoreIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tiendas
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.totalStores}
            </h4>
          </div>

          <Badge color="success">
            {metrics.approvedStores} aprobadas
          </Badge>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Productos
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.totalProducts}
            </h4>
          </div>

          <Badge color="success">
            {metrics.activeProducts} activos
          </Badge>
        </div>
      </div>

      {/* ACTIVE PRODUCTS */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Productos Activos
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.activeProducts}
            </h4>
          </div>

          <Badge color="success">
            OK
          </Badge>
        </div>
      </div>

    </div>
  );
};