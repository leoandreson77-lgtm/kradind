import { HomeView } from "@/components/home-view";
import {
  readStore,
  getHomeSectionsAsync,
  getTreksAsync,
  getTrailReportsAsync,
  getLandingPagesAsync,
} from "@/lib/cms-store";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  try {
    const [sections, treks, reports, campaigns] = await Promise.all([
      getHomeSectionsAsync(),
      getTreksAsync(),
      getTrailReportsAsync(),
      getLandingPagesAsync(),
    ]);

    const publishedTreks = (treks || []).filter((t) => t.status === "Published");
    const publishedCampaigns = (campaigns || []).filter((c) => c.status === "Published");

    return (
      <HomeView
        initialSections={sections}
        initialReports={reports}
        initialCampaigns={publishedCampaigns}
        initialTreks={publishedTreks}
      />
    );
  } catch (err) {
    console.error("HomePage SSR load error:", err);
    const store = readStore();
    const publishedTreks = (store.treks || []).filter((t) => t.status === "Published");
    return (
      <HomeView
        initialSections={store.homeSections}
        initialReports={store.trailReports}
        initialCampaigns={store.landingPages}
        initialTreks={publishedTreks}
      />
    );
  }
}
