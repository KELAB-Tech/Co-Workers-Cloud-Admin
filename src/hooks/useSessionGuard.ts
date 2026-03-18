"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { session } from "@/utils/session";

export function useSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    // Si no hay token al cargar → redirect inmediato
    if (!session.get()) {
      router.replace("/signin");
      return;
    }

    // Manejo del botón atrás y cambio manual de URL
    const handlePopState = () => {
      if (!session.get()) {
        history.pushState(null, "", "/signin");
        router.replace("/signin");
      }
    };

    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Timeout de inactividad
    const interval = setInterval(() => {
      if (session.isExpiredByInactivity()) {
        session.destroy();
      } else {
        session.touch();
      }
    }, 60_000); // revisa cada minuto

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearInterval(interval);
    };
  }, [router]);
}