"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import {
  getAllProducts, activateProduct, deactivateProduct, toggleFeatured, Product,
} from "@/services/productService";

export default function ProductsTable() {
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const pageSize = 10;

  const fetchProducts = async (currentPage = 0) => {
    setLoading(true);
    try {
      const data = await getAllProducts(currentPage, pageSize);
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Error cargando productos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchProducts(newPage);
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleActivate = async (id: number) => {
    try {
      await activateProduct(id);
      showMessage("success", "Producto activado.");
      fetchProducts(page);
    } catch {
      showMessage("error", "No se pudo activar el producto.");
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateProduct(id);
      showMessage("success", "Producto desactivado.");
      fetchProducts(page);
    } catch {
      showMessage("error", "No se pudo desactivar el producto.");
    }
  };

  const handleFeatured = async (id: number) => {
    try {
      await toggleFeatured(id);
      showMessage("success", "Featured actualizado.");
      fetchProducts(page);
    } catch {
      showMessage("error", "No se pudo actualizar featured.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Productos del Marketplace
          </h2>
          <p className="text-sm text-gray-500">
            {totalElements} productos registrados
          </p>
        </div>
      </div>

      {/* Mensaje feedback */}
      {message && (
        <div className={`px-4 py-3 text-sm rounded-lg border ${
          message.type === "success"
            ? "text-green-700 bg-green-50 border-green-200"
            : "text-red-700 bg-red-50 border-red-200"
        }`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Cargando productos...</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1100px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {["Producto", "Precio", "Stock", "Estado", "Featured", "Acciones"].map((h) => (
                        <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell className="px-5 py-8 text-center text-sm text-gray-400">
                          No se encontraron productos.
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>

                          {/* Producto */}
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                {product.mainImageUrl ? (
                                  <img
                                    src={product.mainImageUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-lg">
                                    {product.categoryIcon || "📦"}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-gray-800 dark:text-white max-w-[180px]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                  {product.storeName} · {product.storeCity}
                                </p>
                                {product.categoryName && (
                                  <span className="text-[10px] text-blue-600 font-medium">
                                    {product.categoryIcon} {product.categoryName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Precio */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            ${product.price.toLocaleString("es-CO")}
                          </TableCell>

                          {/* Stock */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            <span className={product.stock === 0 ? "text-red-500 font-medium" : ""}>
                              {product.stock}
                            </span>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="px-4 py-3">
                            <Badge size="sm" color={
                              product.status === "ACTIVE"   ? "success"
                              : product.status === "PENDING" ? "warning"
                              : "error"
                            }>
                              {product.status === "ACTIVE"       ? "Activo"
                               : product.status === "INACTIVE"   ? "Inactivo"
                               : product.status === "OUT_OF_STOCK" ? "Sin stock"
                               : product.status}
                            </Badge>
                          </TableCell>

                          {/* Featured */}
                          <TableCell className="px-4 py-3 text-sm">
                            {product.featured
                              ? <span className="text-yellow-500 font-medium">⭐ Destacado</span>
                              : <span className="text-gray-300">—</span>
                            }
                          </TableCell>

                          {/* Acciones */}
                          <TableCell className="px-4 py-3">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleActivate(product.id)}
                                disabled={product.status === "ACTIVE"}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-40"
                              >
                                Activar
                              </button>
                              <button
                                onClick={() => handleDeactivate(product.id)}
                                disabled={product.status === "INACTIVE"}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-40"
                              >
                                Desactivar
                              </button>
                              <button
                                onClick={() => handleFeatured(product.id)}
                                className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                              >
                                {product.featured ? "Quitar ⭐" : "Destacar"}
                              </button>
                            </div>
                          </TableCell>

                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-gray-500">
                Página {page + 1} de {totalPages} — {totalElements} productos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.05]"
                >
                  ← Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 text-sm rounded-lg border ${
                      p === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.05]"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}