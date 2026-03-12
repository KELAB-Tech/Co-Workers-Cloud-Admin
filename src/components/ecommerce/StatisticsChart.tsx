"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {

  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20"><path d="M12.5 15L7.5 10L12.5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20"><path d="M7.5 15L12.5 10L7.5 5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []);

  const options: ApexOptions = {

    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },

    colors: [
      "#465FFF", // Usuarios
      "#22C55E", // Productos
      "#F59E0B", // Tiendas
    ],

    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: [3, 3, 3],
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
      },
    },

    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },

    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      enabled: true,
    },

    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
      },
    },
  };

  const series = [
    {
      name: "Usuarios",
      data: [5, 8, 12, 18, 25, 30, 35, 40, 50, 65, 80, 95],
    },
    {
      name: "Productos",
      data: [2, 5, 8, 15, 20, 25, 30, 40, 55, 70, 90, 110],
    },
    {
      name: "Tiendas",
      data: [1, 2, 4, 6, 8, 10, 12, 15, 18, 22, 26, 30],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">

        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Crecimiento de la plataforma
          </h3>

          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Usuarios, productos y tiendas registradas por mes
          </p>
        </div>

        <div className="flex items-center gap-3 sm:justify-end">

          <ChartTab />

          <div className="relative inline-flex items-center">

            <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:translate-x-0 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />

            <input
              ref={datePickerRef}
              className="h-10 w-10 lg:w-40 lg:h-auto lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
              placeholder="Select date range"
            />

          </div>

        </div>

      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">

        <div className="min-w-[1000px] xl:min-w-full">

          <Chart
            options={options}
            series={series}
            type="area"
            height={310}
          />

        </div>

      </div>

    </div>
  );
}