"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { session } from "@/utils/session";

export function useSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    // Bloquea el botón atrás: si no hay token, redirige siempre a signin
    const handlePopState = () => {
      if (!session.get()) {
        history.pushState(null, "", "/signin");
        router.replace("/signin");
      }
    };

    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);
}