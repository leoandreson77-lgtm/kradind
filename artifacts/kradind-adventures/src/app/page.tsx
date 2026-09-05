import { HomeView } from "@/components/home-view";
import { readStore } from "@/lib/cms-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KRADIND Adventures | Certified Himalayan Treks & High-Altitude Expeditions",
  description:
    "India's premier certified high-altitude expedition operator. Specializing in small-batch eco-treks, Himalayan alpine circuits, and tailored experiential travel with certified wilderness leaders.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KRADIND Adventures | Certified Himalayan Treks & High-Altitude Expeditions",
    description:
      "India's premier certified high-altitude expedition operator. Specializing in small-batch eco-treks, Himalayan alpine circuits, and tailored experiential travel with certified wilderness leaders.",
    url: "https://kradind.com",
    siteName: "KRADIND Adventures",
    images: [
      {
        url: "/logo.png",
        width: 1475,
        height: 950,
        alt: "KRADIND Adventures",
      },
    ],
    type: "website",
  },
};

export default function HomePage() {
  const store = readStore();
  return (
    <HomeView
      initialSections={store.homeSections}
      initialReports={store.trailReports}
      initialCampaigns={store.landingPages}
    />
  );
}
