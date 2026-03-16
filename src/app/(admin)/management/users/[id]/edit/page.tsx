"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { updateUser } from "@/services/updateUserService";
import { getUserById, User } from "@/services/userService";

export default function EditUserForm() {
  const router  = useRouter();
  const params  = useParams();
  const userId  = Number(params.id);

  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);
  const [user,     setUser]     = useState<User | null>(null); // ✅ guardamos el usuario original

  const [formData, setFormData] = useState({
    name:        "",
    email:       "",
    tipoPersona: "NATURAL",
    actorType:   "RECICLADOR",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setFetching(true);
      setError(null);
      try {
        const data = await getUserById(userId);
        setUser(data);
        // ✅ Aquí se cargan los datos en el formulario
        setFormData({
          name:        data.name        ?? "",
          email:       data.email       ?? "",
          tipoPersona: data.tipoPersona ?? "NATURAL",
          actorType:   data.actorType   ?? "RECICLADOR",
        });
      } catch (err: any) {
        setError(err.message || "No se pudo cargar el usuario");
      } finally {
        setFetching(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateUser(userId, {
        name:        formData.name.trim(),
        email:       formData.email.trim().toLowerCase(),
        tipoPersona: formData.tipoPersona as "NATURAL" | "JURIDICA",
        actorType:   formData.actorType,
      });

      setSuccess(true);
      setTimeout(() => router.push("/management/users"), 1500);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el usuario");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pantalla de carga mientras trae los datos
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Cargando datos del usuario...</p>
      </div>
    );
  }

  // ✅ Si el usuario no existe
  if (!user && !fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-sm text-red-500">Usuario no encontrado.</p>
        <Link href="/management/users">
          <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Volver a usuarios
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-2xl">

      {/* Back */}
      <div className="mb-6">
        <Link
          href="/management/users"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Volver a usuarios
        </Link>
      </div>

      {/* Card */}
      <div className="p-8 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">

        {/* Header con info del usuario */}
        <div className="mb-8 pb-6 border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg shrink-0">
              {user?.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                Editar Usuario
              </h1>
              <p className="text-sm text-gray-400">
                ID #{userId} · {user?.enabled ? "✅ Activo" : "🔴 Suspendido"}
              </p>
            </div>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="mb-6 px-4 py-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
            Usuario actualizado correctamente. Redirigiendo...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">

            {/* Nombre */}
            <div>
              <Label>
                Nombre o Razón Social <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                value={formData.name}         // ✅ controlado
                onChange={handleChange}
                placeholder="Ej: EcoTransforma SAS"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label>
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}        // ✅ controlado
                onChange={handleChange}
                placeholder="empresa@email.com"
                required
              />
            </div>

            {/* Tipo Persona */}
            <div>
              <Label>
                Tipo de Persona <span className="text-red-500">*</span>
              </Label>
              <select
                name="tipoPersona"
                value={formData.tipoPersona}  // ✅ controlado
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NATURAL">Persona Natural</option>
                <option value="JURIDICA">Persona Jurídica</option>
              </select>
            </div>

            {/* Actor Type */}
            <div>
              <Label>
                Tipo de Actor <span className="text-red-500">*</span>
              </Label>
              <select
                name="actorType"
                value={formData.actorType}    // ✅ controlado
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="RECICLADOR">Reciclador</option>
                <option value="TRANSFORMADOR">Transformador</option>
                <option value="TRANSPORTADOR">Transportador</option>
                <option value="ADMIN_GENERAL">Administrador General</option>
              </select>
            </div>

            {/* Info readonly — solo visual */}
            <div className="rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.05] p-4 space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Información de la cuenta
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Roles</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user?.roles.map((r) => r.replace("ROLE_", "")).join(", ") || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Afiliado</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user?.afiliado ? "Sí" : "No"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Creado</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("es-CO", {
                        year: "numeric", month: "long", day: "2-digit",
                      })
                    : "—"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Link href="/management/users" className="flex-1">
                <button
                  type="button"
                  className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-transparent dark:border-gray-600 dark:hover:bg-white/[0.05] transition-colors"
                >
                  Cancelar
                </button>
              </Link>

              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}