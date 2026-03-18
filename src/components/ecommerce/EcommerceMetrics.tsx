"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { StoreIcon } from "lucide-react";
import { getDashboard, DashboardData } from "@/services/dashboardService";

function MetricCard({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  badge: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            {value.toLocaleString("es-CO")}
          </h4>
        </div>
        {badge}
      </div>
    </div>
  );
}

export const EcommerceMetrics = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // GRID: 1 col móvil, 2 col sm, 3 col md+, 2 filas de 3 cards
  const gridClass =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6";

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Usuarios",
      value: data.totalUsers,
      badge: (
        <Badge color="success">
          <ArrowUpIcon />
          {data.activeUsers} activos
        </Badge>
      ),
    },
    {
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Suspendidos",
      value: data.suspendedUsers,
      badge: (
        <Badge color={data.suspendedUsers > 0 ? "error" : "success"}>
          {data.suspendedUsers === 0 ? "Ninguno" : "Revisar"}
        </Badge>
      ),
    },
    {
      icon: <StoreIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Tiendas",
      value: data.totalStores,
      badge: <Badge color="success">{data.approvedStores} aprobadas</Badge>,
    },
    {
      icon: <StoreIcon className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Tiendas Pendientes",
      value: data.pendingStores,
      badge: (
        <Badge color={data.pendingStores > 0 ? "warning" : "success"}>
          {data.pendingStores > 0 ? "Revisar" : "Al día"}
        </Badge>
      ),
    },
    {
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Productos",
      value: data.totalProducts,
      badge: <Badge color="success">{data.activeProducts} activos</Badge>,
    },
    {
      icon: <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />,
      label: "Destacados",
      value: data.featuredProducts,
      badge: <Badge color="warning">⭐ featured</Badge>,
    },
  ];

  return (
    <div className={gridClass}>
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
};