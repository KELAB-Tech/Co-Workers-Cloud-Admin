"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { getDashboard, DashboardData } from "@/services/dashboardService";
import React from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyTarget() {
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [isOpen,  setIsOpen]  = useState(false);

  useEffect(() => {
    getDashboard().then(setData).catch(console.error);
  }, []);

  const total   = data?.totalProducts    ?? 0;
  const active  = data?.activeProducts   ?? 0;
  const oos     = data?.outOfStockProducts ?? 0;
  const percent = total ? Math.round((active / total) * 100) : 0;

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle:   85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name:  { show: false },
          value: {
            fontSize: "36px", fontWeight: "600",
            offsetY: -40, color: "#1D2939",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill:   { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Productos activos"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">

        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Salud del inventario
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Porcentaje de productos activos
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
              <DropdownItem onItemClick={() => setIsOpen(false)}
                className="flex w-full text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5">
                Ver productos
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={[percent]} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {active} activos
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {active} de {total} productos activos en la plataforma
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        {[
          { label: "Total",    value: total },
          { label: "Activos",  value: active },
          { label: "Sin stock", value: oos },
        ].map(({ label, value }, i, arr) => (
          <React.Fragment key={label}>
            <div>
              <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">{label}</p>
              <p className="text-center text-lg font-semibold text-gray-800 dark:text-white/90">{value}</p>
            </div>
            {i < arr.length - 1 && <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}