import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget       from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart   from "@/components/ecommerce/MonthlySalesChart";
import DemographicCard     from "@/components/ecommerce/DemographicCard";
import LatestProducts      from "@/components/ecommerce/LatestProducts";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard — Co-Workers Cloud",
};

export default function Ecommerce() {
  return (
    <div className="space-y-6">

      {/* KPIs — 6 tarjetas */}
      <EcommerceMetrics />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* Top tiendas */}
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        {/* Salud del inventario */}
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        {/* Últimos productos */}
        <div className="col-span-12 xl:col-span-7">
          <LatestProducts />
        </div>


      </div>
    </div>
  );
}