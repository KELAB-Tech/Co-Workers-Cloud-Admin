"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { registerUser } from "@/services/registerUserService";

export default function CreateUserForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [afiliado, setAfiliado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tipoPersona: "NATURAL",
    actorType: "RECICLADOR",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
    const randomPass = Array.from({ length: 12 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    setFormData({ ...formData, password: randomPass });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser({
        ...formData,
        tipoPersona: formData.tipoPersona as "NATURAL" | "JURIDICA",
        afiliado,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/management/users");
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto">

      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/management/users"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Volver a usuarios
        </Link>
      </div>

      {/* Card */}
      <div className="p-8 bg-white border border-gray-200 rounded-xl dark:bg-white/[0.03] dark:border-white/[0.05]">

        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">
            Crear Usuario
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Crea una cuenta para una empresa dentro del marketplace.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 px-4 py-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
            ✅ Usuario creado exitosamente. Redirigiendo...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-700 dark:text-red-400">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">

            {/* Nombre */}
            <div>
              <Label>
                Nombre o Razón Social<span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                placeholder="Ej: EcoTransforma SAS"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Tipo persona */}
            <div>
              <Label>
                Tipo de Persona<span className="text-error-500">*</span>
              </Label>
              <select
                name="tipoPersona"
                value={formData.tipoPersona}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="NATURAL">Persona Natural</option>
                <option value="JURIDICA">Persona Jurídica</option>
              </select>
            </div>

            {/* Actor type */}
            <div>
              <Label>
                Tipo de Actor<span className="text-error-500">*</span>
              </Label>
              <select
                name="actorType"
                value={formData.actorType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
              >
                <option value="RECICLADOR">Reciclador</option>
                <option value="TRANSFORMADOR">Transformador</option>
                <option value="TRANSPORTADOR">Transportador</option>
                <option value="ADMIN_GENERAL">Administrador General</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <Label>
                Correo electrónico<span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="empresa@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label>
                Contraseña<span className="text-error-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={generatePassword}
                className="mt-2 text-sm text-brand-500 hover:text-brand-600"
              >
                Generar contraseña automática
              </button>
            </div>

            {/* Afiliado */}
            <div className="flex items-center gap-3">
              <Checkbox
                className="w-5 h-5"
                checked={afiliado}
                onChange={setAfiliado}
              />
              <p className="text-gray-500 dark:text-gray-400">
                Usuario afiliado
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || success}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creando usuario..." : "Crear Usuario"}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}