import React, { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";
import { getTreksAsync } from "@/lib/cms-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trekking & Tour Packages in India | KRADIND Adventures",
  description:
    "Explore certified Himalayan treks, scenic domestic holiday tours, and weekend escapes across India with verified local guides and small batches.",
  alternates: {
    canonical: "https://kradind.com/treks",
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TreksPage() {
  const treks = await getTreksAsync();
  const publishedTreks = (treks || []).filter((t) => t.status === "Published");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
          Loading catalog...
        </div>
      }
    >
      <TreksContent initialTreks={publishedTreks} />
    </Suspense>
  );
}
