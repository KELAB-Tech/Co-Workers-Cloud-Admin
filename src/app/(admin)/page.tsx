// src/app/(admin)/page.tsx
import type { Metadata } from "next";
import DashboardClient from "@/components/dashboard/DashboardClient"; // componente cliente separado

export const metadata: Metadata = {
  title: "Dashboard — Co-Workers Cloud",
};

export default function DashboardPage() {
  return <DashboardClient />;
}