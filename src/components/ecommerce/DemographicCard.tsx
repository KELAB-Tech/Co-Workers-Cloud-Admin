"use client";

import { useState, useEffect } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { getDashboard, TopStore } from "@/services/dashboardService";

export default function DemographicCard() {
  const [stores,  setStores]  = useState<TopStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen,  setIsOpen]  = useState(false);

  useEffect(() => {
    getDashboard()
      .then((d) => setStores(d.topStores))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calcular el máximo para las barras proporcionales
  const maxCount = Math.max(...stores.map((s) => s.productCount), 1);

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const colors = ["bg-blue-500", "bg-green-500", "bg-amber-500", "bg-purple-500", "bg-rose-500"];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">

      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Tiendas
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Tiendas con más productos publicados
          </p>
        </div>
        <div className="relative inline-block">
          <button onClick={() => setIsOpen(!isOpen)} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-44 p-2">
            <DropdownItem onItemClick={() => setIsOpen(false)}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5">
              Administrar Tiendas
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-10 bg-gray-100 rounded-lg dark:bg-gray-800" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <p className="text-sm text-center text-gray-400 py-8">No hay tiendas aún.</p>
      ) : (
        <div className="space-y-5">
          {stores.map((store, index) => {
            const percent = Math.round((store.productCount / maxCount) * 100);
            return (
              <div key={store.storeId} className="flex items-center gap-4">

                {/* Inicial */}
                <div className={`w-9 h-9 rounded-full ${colors[index % colors.length]} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                  {getInitials(store.storeName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate max-w-[160px]">
                      {store.storeName}
                    </p>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-2 shrink-0">
                      {store.productCount} productos
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}