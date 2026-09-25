import { HomeView } from "@/components/home-view";
import {
  readStore,
  getHomeSectionsAsync,
  getTreksAsync,
  getTrailReportsAsync,
  getLandingPagesAsync,
  TrekData,
} from "@/lib/cms-store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KRAD Global | Tour & Travel Company in Dehradun | India",
  description:
    "KRAD Global is a premier tour and travel company in Dehradun offering domestic and international tour packages, customized holidays, and Himalayan treks.",
  keywords: [
    "tour and travel company in Dehradun",
    "travel agency in Dehradun",
    "tour operator in Dehradun",
    "domestic tour packages",
    "international tour packages",
    "India tour packages",
    "customized tour packages",
    "KRAD Global",
    "Dehradun travel and tour services",
    "Himalayan trekking package",
    "customized holiday package",
    "tour packages in Dehradun",
    "KRADIND Adventures",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KRAD Global | Tour & Travel Company in Dehradun | India",
    description:
      "KRAD Global is a premier tour and travel company in Dehradun offering domestic and international tour packages, customized holidays, and Himalayan treks.",
    url: "https://kradind.com",
    siteName: "KRAD Global",
    images: [
      {
        url: "/logo.png",
        width: 1475,
        height: 950,
        alt: "KRAD Global tour and travel company logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KRAD Global | Tour & Travel Company in Dehradun | India",
    description:
      "KRAD Global is a premier tour and travel company in Dehradun offering domestic and international tour packages, customized holidays, and Himalayan treks.",
    images: ["/logo.png"],
  },
};

// Enable ISR (Incremental Static Regeneration) - serves cached HTML in < 40ms TTFB and revalidates in background
export const revalidate = 60;

export default async function HomePage() {
  try {
    const [sections, treks, reports, campaigns] = await Promise.all([
      getHomeSectionsAsync(),
      getTreksAsync(),
      getTrailReportsAsync(),
      getLandingPagesAsync(),
    ]);

    const publishedTreks = (treks || []).filter((t) => t.status === "Published");
    // Strip heavy itinerary, inclusions, faqs to shrink inline JS payload from 152KB to <25KB
    const lightweightHomeTreks: TrekData[] = publishedTreks.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      badge: t.badge,
      rating: t.rating,
      reviewCount: t.reviewCount,
      location: t.location,
      region: t.region,
      duration: t.duration,
      difficulty: t.difficulty,
      altitude: t.altitude,
      tagline: t.tagline,
      price: t.price,
      originalPrice: t.originalPrice,
      image: t.image,
      imageAlt: t.imageAlt,
      gallery: [],
      categories: t.categories,
      status: t.status,
      batches: [],
      itinerary: [],
    }));

    const publishedCampaigns = (campaigns || []).filter((c) => c.status === "Published");

    return (
      <HomeView
        initialSections={sections}
        initialReports={reports}
        initialCampaigns={publishedCampaigns}
        initialTreks={lightweightHomeTreks}
      />
    );
  } catch (err) {
    console.error("HomePage SSR load error:", err);
    const store = readStore();
    const publishedTreks = (store.treks || []).filter((t) => t.status === "Published");
    const lightweightHomeTreks: TrekData[] = publishedTreks.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      badge: t.badge,
      rating: t.rating,
      reviewCount: t.reviewCount,
      location: t.location,
      region: t.region,
      duration: t.duration,
      difficulty: t.difficulty,
      altitude: t.altitude,
      tagline: t.tagline,
      price: t.price,
      originalPrice: t.originalPrice,
      image: t.image,
      imageAlt: t.imageAlt,
      gallery: [],
      categories: t.categories,
      status: t.status,
      batches: [],
      itinerary: [],
    }));

    return (
      <HomeView
        initialSections={store.homeSections}
        initialReports={store.trailReports}
        initialCampaigns={store.landingPages}
        initialTreks={lightweightHomeTreks}
      />
    );
  }
}
