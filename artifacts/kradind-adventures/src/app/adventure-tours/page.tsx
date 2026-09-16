import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

export const metadata: Metadata = {
  title: "Adventure Tours & Outdoor Expeditions | KRADIND Adventures",
  description:
    "Thrilling adventure tours across the Himalayas and India: camping, alpine hiking, winter snow treks, mountaineering expeditions, and high altitude circuits.",
  alternates: {
    canonical: "https://kradind.com/adventure-tours",
  },
  openGraph: {
    title: "Adventure Tours & Outdoor Expeditions | KRADIND Adventures",
    description:
      "Thrilling adventure tours across the Himalayas and India with KRADIND Adventures.",
    url: "https://kradind.com/adventure-tours",
    type: "website",
  },
};

export default function AdventureToursPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <TreksContent
        initialCategory="Himalayas"
        titleOverride="Adventure Tours & Mountaineering Expeditions"
        subtitleOverride="Push your boundaries with guided wilderness camping, snow treks, alpine trail hiking, and high-altitude Himalayan crossings led by certified mountaineers."
      />
    </Suspense>
  );
}
