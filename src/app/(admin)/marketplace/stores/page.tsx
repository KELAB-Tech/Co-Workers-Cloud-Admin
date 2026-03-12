"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";

import {
  getStores,
  getPendingStores,
  approveStore,
  suspendStore,
  Store,
} from "@/services/storeService";

import Alert from "@/components/ui/alert/Alert";

type FilterType = "all" | "pending" | "approved" | "suspended";

export default function StoresTable() {

  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [filter, setFilter] = useState<FilterType>("all");

  const [alert, setAlert] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  // evitar hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchStores();
  }, [mounted, filter]);

  const fetchStores = async () => {
    setLoading(true);

    try {
      let data: Store[] = [];

      if (filter === "pending") {
        data = await getPendingStores();
      } else {
        data = await getStores();
      }

      if (filter === "approved") {
        data = data.filter((s) => s.status === "APPROVED");
      }

      if (filter === "suspended") {
        data = data.filter((s) => s.status === "SUSPENDED");
      }

      setStores(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveStore(id);

      setAlert({
        variant: "success",
        title: "Tienda aprobada",
        message: "La tienda fue aprobada correctamente.",
      });

      fetchStores();
    } catch (error) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "No se pudo aprobar la tienda.",
      });
    }
  };

  const handleSuspend = async (id: number) => {
    const confirm = window.confirm(
      "¿Seguro deseas suspender esta tienda?"
    );

    if (!confirm) return;

    try {
      await suspendStore(id);

      setAlert({
        variant: "warning",
        title: "Tienda suspendida",
        message: "La tienda fue suspendida correctamente.",
      });

      fetchStores();
    } catch (error) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "No se pudo suspender la tienda.",
      });
    }
  };

  if (!mounted) return null;

  if (loading) {
    return <p className="text-gray-500">Cargando tiendas...</p>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Tiendas del Marketplace
          </h2>

          <p className="text-sm text-gray-500 dark:text-white">
            Administra las tiendas registradas en la plataforma.
          </p>
        </div>

      </div>

      {/* ALERT */}
      {alert && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
        />
      )}

      {/* FILTER TABS */}
      <div className="flex gap-2">

        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setFilter("suspended")}
          className={`px-3 py-1 rounded text-sm ${
            filter === "suspended"
              ? "bg-red-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Suspended
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:bg-white/[0.03] dark:border-gray-800">

        <div className="max-w-full overflow-x-auto">

          <div className="min-w-[1100px]">

            <Table className="border border-gray-200 dark:border-white/[0.05]">
              <TableHeader className="border-b border-gray-200 dark:border-white/[0.05]">
                <TableRow className="divide-x divide-gray-200 dark:divide-white/[0.05]">
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Store
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    City
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
                {stores.map((store) => (
                  <TableRow
                    key={store.id}
                    className="divide-x divide-gray-200 dark:divide-white/[0.05]"
                  >
                    <TableCell className="px-5 py-4 dark:text-gray-100 border-r border-gray-200 dark:border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full border border-gray-200 dark:border-white/[0.05]">
                          <Image
                            width={40}
                            height={40}
                            src={store.logoUrl || "/images/user/user-17.jpg"}
                            alt={store.name}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 dark:text-white">
                            {store.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-100">
                            {store.address}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-5 py-4 dark:text-gray-100 border-r border-gray-200 dark:border-white/[0.05]">
                      {store.city}
                    </TableCell>

                    <TableCell className="px-5 py-4 dark:text-gray-100 border-r border-gray-200 dark:border-white/[0.05]">
                      {store.phone}
                    </TableCell>

                    <TableCell className="px-5 py-4 border-r border-gray-200 dark:border-white/[0.05]">
                      <Badge
                        size="sm"
                        color={
                          store.status === "APPROVED"
                            ? "success"
                            : store.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                      >
                        {store.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          disabled={store.status === "APPROVED"}
                          onClick={() => handleApprove(store.id)}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded disabled:opacity-50 border border-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleSuspend(store.id)}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded border border-red-600"
                        >
                          Suspend
                        </button>
                        <button className="px-3 py-1 text-xs bg-gray-500 text-white rounded border border-gray-600">
                          View
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>


          </div>

        </div>

      </div>

    </div>
  );
}