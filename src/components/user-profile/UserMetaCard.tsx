"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useProfile } from "@/hooks/useProfile";
import { updateMyProfile } from "@/services/profileService";

const actorLabel: Record<string, string> = {
  ADMIN_GENERAL:  "Administrador General",
  RECICLADOR:     "Reciclador",
  TRANSFORMADOR:  "Transformador",
  TRANSPORTADOR:  "Transportador",
};

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { profile, loading, getInitials } = useProfile();

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setName(profile?.name  ?? "");
    setEmail(profile?.email ?? "");
    setError(null);
    setSuccess(false);
    openModal();
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateMyProfile({ name: name.trim(), email: email.trim().toLowerCase() });
      setSuccess(true);
      setTimeout(() => {
        closeModal();
        window.location.reload(); // refresca el perfil en el dropdown
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 animate-pulse h-28" />
    );
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">

            {/* ✅ Inicial en lugar de foto */}
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0 border-2 border-blue-200">
              {profile ? getInitials(profile.name) : "A"}
            </div>

            <div>
              <h4 className="mb-1 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {profile?.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {actorLabel[profile?.actorType ?? ""] ?? profile?.actorType}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile?.email}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  profile?.enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}>
                  {profile?.enabled ? "Activo" : "Suspendido"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpen}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill=""/>
            </svg>
            Editar
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-900 lg:p-10">
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Editar Perfil
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Actualiza tu nombre y correo electrónico.
            </p>
          </div>

          {success && (
            <div className="mb-4 px-4 py-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
              ✅ Perfil actualizado correctamente.
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              ❌ {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label>Nombre <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <Label>Correo electrónico <span className="text-red-500">*</span></Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-8 justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving || success}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}