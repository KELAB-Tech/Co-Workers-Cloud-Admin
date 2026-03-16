"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import { getUsers, suspendUser, activateUser, User } from "@/services/userService";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric", month: "short", day: "2-digit",
  });

const actorTypeLabel: Record<string, string> = {
  ADMIN_GENERAL:  "Admin General",
  RECICLADOR:     "Reciclador",
  TRANSFORMADOR:  "Transformador",
  TRANSPORTADOR:  "Transportador",
};

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

export default function UsersTable() {
  const [users, setUsers]           = useState<User[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  // Paginación
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Filtros
  const [search, setSearch]         = useState("");
  const [actorFilter, setActorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");

  const fetchUsers = async (currentPage = 0) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getUsers(currentPage, pageSize, {
        name: search || undefined,
        actorType: actorFilter || undefined,
        enabled: statusFilter === "" ? undefined : statusFilter === "true",
      });

      setUsers(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchUsers(0);
  }, [search, actorFilter, statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchUsers(newPage);
  };

  const handleSuspend = async (id: number) => {
    if (!confirm("¿Suspender este usuario?")) return;
    try {
      await suspendUser(id);
      fetchUsers(page);
    } catch (err: any) {
      alert(err.message || "Error al suspender usuario");
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("¿Activar este usuario?")) return;
    try {
      await activateUser(id);
      fetchUsers(page);
    } catch (err: any) {
      alert(err.message || "Error al activar usuario");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500">{totalElements} usuarios registrados</p>
        </div>
        <Link href="/management/users/create">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            + Create User
          </button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg w-64 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
        />

        <select
          value={actorFilter}
          onChange={(e) => setActorFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="">Todos los actores</option>
          <option value="RECICLADOR">Reciclador</option>
          <option value="TRANSFORMADOR">Transformador</option>
          <option value="TRANSPORTADOR">Transportador</option>
          <option value="ADMIN_GENERAL">Admin General</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | "true" | "false")}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Suspendidos</option>
        </select>
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm text-gray-500 text-center py-8">Cargando usuarios...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[1200px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {["User","Email","Roles","Actor Type","Tipo Persona","Creado","Estado","Acciones"].map((h) => (
                        <TableCell key={h} isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell className="px-5 py-8 text-center text-sm text-gray-400 col-span-8">
                          No se encontraron usuarios.
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>

                          {/* User */}
                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
                                {getInitials(user.name)}
                              </div>
                              <span className="font-medium text-gray-800 dark:text-white text-sm">
                                {user.name}
                              </span>
                            </div>
                          </TableCell>

                          {/* Email */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            {user.email}
                          </TableCell>

                          {/* Roles — ✅ son strings directamente */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            {user.roles.map((r) => r.replace("ROLE_", "")).join(", ")}
                          </TableCell>

                          {/* Actor Type */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            {actorTypeLabel[user.actorType] ?? user.actorType}
                          </TableCell>

                          {/* Tipo Persona */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            {user.tipoPersona === "NATURAL" ? "Persona Natural" : "Persona Jurídica"}
                          </TableCell>

                          {/* Created */}
                          <TableCell className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="px-4 py-3">
                            <Badge size="sm" color={user.enabled ? "success" : "error"}>
                              {user.enabled ? "Activo" : "Suspendido"}
                            </Badge>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="px-4 py-3">
                            <div className="flex gap-2 flex-wrap">
                              <Link href={`/management/users/${user.id}/edit`}>
                                <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                  Edit
                                </button>
                              </Link>

                              {user.enabled ? (
                                <button
                                  onClick={() => handleSuspend(user.id)}
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  Suspend
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(user.id)}
                                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  Activate
                                </button>
                              )}
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
                Página {page + 1} de {totalPages} — {totalElements} usuarios
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