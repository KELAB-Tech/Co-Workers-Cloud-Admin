"use client";

import { useState } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const topStores = [
    {
      name: "EcoTransforma Marketplace",
      products: 12,
      percent: 80,
    },
    {
      name: "GreenTech Store",
      products: 9,
      percent: 60,
    },
    {
      name: "BioMarket",
      products: 7,
      percent: 45,
    },
    {
      name: "EcoVida Shop",
      products: 5,
      percent: 30,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Tiendas del Marketplace
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Tiendas con más productos publicados
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>

          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Ver Detalles
            </DropdownItem>

            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Administrar Tiendas
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="space-y-6 mt-6">

        {topStores.map((store, index) => (

          <div
            key={index}
            className="flex items-center justify-between"
          >

            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                {store.name}
              </p>

              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {store.products} productos publicados
              </span>
            </div>

            <div className="flex w-full max-w-[140px] items-center gap-3">

              <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">

                <div
                  className="absolute left-0 top-0 flex h-full items-center justify-center rounded-sm bg-brand-500"
                  style={{ width: `${store.percent}%` }}
                ></div>

              </div>

              <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {store.percent}%
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}