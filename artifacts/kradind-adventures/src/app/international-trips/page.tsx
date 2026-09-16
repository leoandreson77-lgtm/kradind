import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

export const metadata: Metadata = {
  title: "International Trips & Holiday Tour Packages | KRADIND Adventures",
  description:
    "Explore handpicked international tour packages across Nepal, Bali, Thailand, Dubai, Vietnam, Singapore, and Maldives with visa assistance and premium stays.",
  alternates: {
    canonical: "https://kradind.com/international-trips",
  },
  openGraph: {
    title: "International Trips & Holiday Tour Packages | KRADIND Adventures",
    description:
      "Explore handpicked international tour packages with KRADIND Adventures.",
    url: "https://kradind.com/international-trips",
    type: "website",
  },
};

export default function InternationalTripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <TreksContent
        initialCategory="International"
        titleOverride="International Holiday Trips & World Tours"
        subtitleOverride="Immerse yourself in vibrant global destinations — from the Himalayas of Nepal and tropical shores of Bali to futuristic Dubai and serene Maldives."
      />
    </Suspense>
  );
}
