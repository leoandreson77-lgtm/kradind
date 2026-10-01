import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";
import { getTreksAsync } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Domestic Trips & Tour Packages in India | KRADIND Adventures",
  description:
    "Explore handpicked domestic holiday packages across India — Uttarakhand, Himachal Pradesh, Kashmir, Ladakh, Rajasthan, Kerala, and Goa with certified tour managers.",
  alternates: {
    canonical: "https://kradind.com/domestic-trips",
  },
  openGraph: {
    title: "Domestic Trips & Tour Packages in India | KRADIND Adventures",
    description:
      "Explore handpicked domestic holiday packages across India with KRADIND Adventures.",
    url: "https://kradind.com/domestic-trips",
    type: "website",
  },
};

export default async function DomesticTripsPage() {
  const treks = await getTreksAsync();
  const publishedTreks = (treks || []).filter((t) => t.status === "Published");

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <TreksContent
        initialCategory="Domestic"
        initialTreks={publishedTreks}
        titleOverride="Domestic Trips & Holiday Tours Across India"
        subtitleOverride="Explore handpicked tours and itineraries across India's most enchanting mountain valleys, heritage palaces, and coastal paradises."
      />
    </Suspense>
  );
}
