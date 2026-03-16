"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";

export default function UserAddressCard() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 animate-pulse h-32" />
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Estado de la Cuenta
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Estado</p>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            profile?.enabled
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {profile?.enabled ? "Cuenta activa" : "🔴 Cuenta suspendida"}
          </span>
        </div>

        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Miembro desde</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("es-CO", {
                  year: "numeric", month: "long", day: "2-digit",
                })
              : "—"}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Última actualización</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.updatedAt
              ? new Date(profile.updatedAt).toLocaleDateString("es-CO", {
                  year: "numeric", month: "long", day: "2-digit",
                })
              : "Sin cambios recientes"}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">Afiliado</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {profile?.afiliado ? "✅ Sí" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}