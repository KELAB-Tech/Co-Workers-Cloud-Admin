"use client";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "../ui/table";
import Link from "next/link";
import { getDashboard, LastProduct } from "@/services/dashboardService";

export default function LatestProducts() {
  const [products, setProducts] = useState<LastProduct[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getDashboard()
      .then((d) => setProducts(d.lastProducts))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Últimos Productos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Los 5 productos más recientes
          </p>
        </div>
        <Link href="/marketplace/products">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.05]">
            Ver todos
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3 py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse h-12 bg-gray-100 rounded-lg dark:bg-gray-800" />
          ))}
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow className="bg-gray-50 dark:bg-gray-900">
                <TableCell isHeader className="text-xs font-medium text-gray-500 px-4 py-3">#</TableCell>
                <TableCell isHeader className="text-xs font-medium text-gray-500 px-4 py-3">Producto</TableCell>
                <TableCell isHeader className="text-xs font-medium text-gray-500 px-4 py-3">Tienda</TableCell>
                <TableCell isHeader className="text-xs font-medium text-gray-500 px-4 py-3 text-right">Precio</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map((product, index) => (
                <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">

                  <TableCell className="px-4 py-3 text-sm text-gray-400">
                    {index + 1}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <span className="font-medium text-gray-800 dark:text-white/90 text-sm">
                      {product.name}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {product.storeName}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white/90 text-right">
                    ${product.price.toLocaleString("es-CO")}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}