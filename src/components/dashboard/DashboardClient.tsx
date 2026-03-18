"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { session } from "@/utils/session";

import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import MonthlyTarget       from "@/components/ecommerce/MonthlyTarget";
import DemographicCard     from "@/components/ecommerce/DemographicCard";
import LatestProducts      from "@/components/ecommerce/LatestProducts";

export default function DashboardClient() {
  const router = useRouter();

  useEffect(() => {
    if (!session.get() || !session.isAdmin()) {
      router.replace("/signin");
    }
  }, [router]);

  if (!session.get() || !session.isAdmin()) return null;

  return (
    <div className="space-y-6">

      <EcommerceMetrics />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>



        <div className="col-span-12 xl:col-span-7">
          <LatestProducts />
        </div>
      </div>
    </div>
  );
}