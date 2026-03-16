"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import {
  getStores, approveStore, suspendStore, Store,
} from "@/services/storeService";

export default function StoresTable() {
  const [stores, setStores]         = useState<Store[]>([]);
  const [loading, setLoading]       = useState(true);
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchName,   setSearchName]   = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const pageSize = 10;

  const fetchStores = async (currentPage = 0) => {
    setLoading(true);
    try {
      const data = await getStores(currentPage, pageSize, {
        name:   searchName || undefined,
        status: statusFilter || undefined,
      });
      setStores(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchStores(0);
  }, [statusFilter, searchName]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchStores(newPage);
  };

  const handleApprove = async (id: number) => {
    try {
      await approveStore(id);
      setMessage({ type: "success", text: "Tienda aprobada correctamente." });
      fetchStores(page);
    } catch {
      setMessage({ type: "error", text: "No se pudo aprobar la tienda." });
    }
  };

  const handleSuspend = async (id: number) => {
    if (!confirm("¿Suspender esta tienda?")) return;
    try {
      await suspendStore(id);
      setMessage({ type: "success", text: "Tienda suspendida." });
      fetchStores(page);
    } catch {
      setMessage({ type: "error", text: "No se pudo suspender la tienda." });
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Tiendas del Marketplace
          </h2>
          <p className="text-sm text-gray-500">{totalElements} tiendas registradas</p>
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div className={`px-4 py-3 text-sm rounded-lg border ${
          message.type === "success"
            ? "text-green-700 bg-green-50 border-green-200"
            : "text-red-700 bg-red-50 border-red-200"
        }`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-56 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
        />
        {["", "PENDING", "APPROVED", "SUSPENDED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? s === ""          ? "bg-blue-600 text-white"
                : s === "PENDING"   ? "bg-yellow-500 text-white"
                : s === "APPROVED"  ? "bg-green-600 text-white"
                :                     "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/[0.05] dark:text-gray-300"
            }`}
          >
            {s === "" ? "Todas" : s === "PENDING" ? "Pendientes" : s === "APPROVED" ? "Aprobadas" : "Suspendidas"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 text-center py-8">Cargando tiendas...</p>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {["Tienda", "Ciudad", "Teléfono", "Estado", "Acciones"].map((h) => (
                        <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {stores.length === 0 ? (
                      <TableRow>
                        <TableCell className="px-5 py-8 text-center text-sm text-gray-400">
                          No se encontraron tiendas.
                        </TableCell>
                      </TableRow>
                    ) : (
                      stores.map((store) => (
                        <TableRow key={store.id}>
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-200">
                                <img
                                  src={store.logoUrl || "/images/user/user-17.jpg"}
                                  alt={store.name}
                                  className="h-10 w-10 object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "/images/user/user-17.jpg"; }}
                                />
                              </div>
                              <div>
                                <span className="block font-medium text-gray-800 dark:text-white">{store.name}</span>
                                <span className="text-xs text-gray-500">{store.address}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-5 py-4 text-sm text-gray-500">{store.city}</TableCell>
                          <TableCell className="px-5 py-4 text-sm text-gray-500">{store.phone}</TableCell>

                          <TableCell className="px-5 py-4">
                            <Badge size="sm" color={
                              store.status === "APPROVED" ? "success"
                              : store.status === "PENDING" ? "warning"
                              : "error"
                            }>
                              {store.status === "APPROVED" ? "Aprobada"
                               : store.status === "PENDING" ? "Pendiente"
                               : "Suspendida"}
                            </Badge>
                          </TableCell>

                          <TableCell className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                disabled={store.status === "APPROVED"}
                                onClick={() => handleApprove(store.id)}
                                className="px-3 py-1 text-xs bg-green-500 text-white rounded disabled:opacity-40 hover:bg-green-600"
                              >
                                Aprobar
                              </button>
                              <button
                                disabled={store.status === "SUSPENDED"}
                                onClick={() => handleSuspend(store.id)}
                                className="px-3 py-1 text-xs bg-red-500 text-white rounded disabled:opacity-40 hover:bg-red-600"
                              >
                                Suspender
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
                Página {page + 1} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700"
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
                        : "border-gray-300 hover:bg-gray-50 dark:border-gray-700"
                    }`}
                  >
                    {p + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 dark:border-gray-700"
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