"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";

const actorLabel: Record<string, string> = {
  ADMIN_GENERAL:  "Administrador General",
  RECICLADOR:     "Reciclador",
  TRANSFORMADOR:  "Transformador",
  TRANSPORTADOR:  "Transportador",
};

export default function UserInfoCard() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 animate-pulse h-40" />
    );
  }

  const fields = [
    { label: "Nombre completo",  value: profile?.name },
    { label: "Correo electrónico", value: profile?.email },
    { label: "Tipo de Actor",    value: actorLabel[profile?.actorType ?? ""] ?? profile?.actorType },
    { label: "Tipo de Persona",  value: profile?.tipoPersona === "NATURAL" ? "Persona Natural" : "Persona Jurídica" },
    { label: "Roles",            value: profile?.roles.map((r) => r.replace("ROLE_", "")).join(", ") },
    { label: "Afiliado",         value: profile?.afiliado ? "Sí" : "No" },
  ];

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
        Información Personal
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        {fields.map(({ label, value }) => (
          <div key={label}>
            <p className="mb-1 text-xs leading-normal text-gray-500 dark:text-gray-400">
              {label}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {value || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}