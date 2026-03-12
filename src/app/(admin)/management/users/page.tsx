"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";
import { getUsers, suspendUser, activateUser, resetPassword, User } from "@/services/userService";

// Helpers
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

const actorTypeLabel: Record<string, string> = {
  ADMIN_GENERAL: "Admin General",
  RECICLADOR: "Reciclador",
  TRANSFORMADOR: "Transformador",
  TRANSPORTADOR: "Transportador",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSuspend = async (id: number) => {
    if (!confirm("¿Suspender este usuario?")) return;
    try {
      await suspendUser(id);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || "Error al suspender usuario");
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm("¿Activar este usuario?")) return;
    try {
      await activateUser(id);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || "Error al activar usuario");
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!confirm("¿Resetear contraseña de este usuario?")) return;
    try {
      await resetPassword(id);
      alert("Contraseña reseteada correctamente");
    } catch (err: any) {
      alert(err.message || "Error al resetear contraseña");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Users
          </h2>
          <p className="text-sm text-gray-500">
            Manage platform users and their permissions
          </p>
        </div>
        <Link href="/management/users/create">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            + Create User
          </button>
        </Link>
      </div>

      {/* States */}
      {loading && (
        <p className="text-sm text-gray-500 text-center py-8">Loading users...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1200px]">

              <Table>

                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      User
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Email
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Role
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Actor Type
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Tipo Persona
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Created
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Status
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <TableRow key={user.id}>

                      {/* User */}
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                            {getInitials(user.name)}
                          </div>
                          <span className="font-medium text-gray-800 text-theme-sm">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        {user.email}
                      </TableCell>

                      {/* Role */}
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        {user.roles.map((r) => r.name.replace("ROLE_", "")).join(", ")}
                      </TableCell>

                      {/* Actor Type */}
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        {actorTypeLabel[user.actorType] ?? user.actorType}
                      </TableCell>

                      {/* Tipo Persona */}
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        {user.tipoPersona}
                      </TableCell>

                      {/* Created */}
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3">
                        <Badge
                          size="sm"
                          color={user.enabled ? "success" : "error"}
                        >
                          {user.enabled ? "Active" : "Suspended"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">

                          {/* Edit */}
                          <Link href={`/management/users/${user.id}/edit`}>
                            <button className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                              Edit
                            </button>
                          </Link>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleResetPassword(user.id)}
                            className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Reset Password
                          </button>

                          {/* Activate — only when suspended */}
                          {!user.enabled && (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Activate
                            </button>
                          )}

                          {/* Suspend — only when active */}
                          {user.enabled && (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Suspend
                            </button>
                          )}

                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>

              </Table>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}