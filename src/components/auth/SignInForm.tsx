"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function SignInForm() {

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    try {

      setLoading(true);
      setError("");

      const res = await login({
        email,
        password
      });

      console.log("LOGIN OK", res);

      // guardar token
      localStorage.setItem("token", res.token);

      // cookie para middleware
      document.cookie = `token=${res.token}; path=/; SameSite=Lax`;

      router.push("/");

    } catch (err: any) {

      console.error("Login error:", err);

      setError(
        err?.message || "Credenciales incorrectas"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md dark:text-white/90">
            Iniciar sesión
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Inicia sesión con tu cuenta de administrador para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="space-y-6">

            <div>
              <Label>Correo *</Label>
              <Input
                placeholder="info@gmail.com"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div>
              <Label>Contraseña *</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-500"
                >
                  {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                </span>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-sm dark:text-gray-400 text-gray-500">
                  Recuérdame
                </span>
              </div>

              <Link
                href="/reset-password"
                className="text-sm text-brand-500"
              >
                Olvidé mi contraseña
              </Link>

            </div>

            <Button
              className="w-full"
              size="sm"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

          </div>

        </form>

      </div>
    </div>
  );
}