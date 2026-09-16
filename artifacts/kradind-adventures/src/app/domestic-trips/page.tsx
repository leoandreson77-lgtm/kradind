import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

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

export default function DomesticTripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <TreksContent
        initialCategory="Domestic"
        titleOverride="Domestic Trips & Holiday Tours Across India"
        subtitleOverride="Explore handpicked tours and itineraries across India's most enchanting mountain valleys, heritage palaces, and coastal paradises."
      />
    </Suspense>
  );
}
