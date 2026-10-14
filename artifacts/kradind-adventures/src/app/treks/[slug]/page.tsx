import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { treks } from "@/lib/travel-data";
import { getTreksAsync, readStore, TrekData } from "@/lib/cms-store";
import { TreksContent } from "@/components/treks-catalog";
import { TrekDetailClient } from "./trek-detail-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const REGIONAL_TREK_CATEGORIES: Record<string, { name: string; title: string; subtitle: string }> = {
  uttarakhand: {
    name: "Uttarakhand",
    title: "Uttarakhand Treks & Expeditions",
    subtitle: "Discover high Himalayan meadows, sacred pilgrim trails, and alpine passes in Garhwal & Kumaon.",
  },
  "himachal-pradesh": {
    name: "Himachal",
    title: "Himachal Pradesh Treks & Trails",
    subtitle: "Trek through pine forests, glacial rivers, and dramatic crossover passes between Kullu & Spiti.",
  },
  himachal: {
    name: "Himachal",
    title: "Himachal Pradesh Treks & Trails",
    subtitle: "Trek through pine forests, glacial rivers, and dramatic crossover passes between Kullu & Spiti.",
  },
  kashmir: {
    name: "Kashmir",
    title: "Kashmir Alpine & Great Lakes Treks",
    subtitle: "Experience high-altitude lakes, turquoise waters, and lush alpine valleys in the Pir Panjal range.",
  },
  ladakh: {
    name: "Ladakh",
    title: "Ladakh High Altitude Expeditions",
    subtitle: "High-pass circuits, moonscapes, and remote Buddhist valley trails at 13,000 to 18,000 feet.",
  },
  nepal: {
    name: "International",
    title: "Nepal Himalayan Expeditions",
    subtitle: "World-class trekking routes across the Annapurna and Everest circuits with experienced Sherpas.",
  },
  "high-altitude": {
    name: "Himalayas",
    title: "High Altitude Himalayan Treks",
    subtitle: "Demanding 13,000+ Ft summits, glacial crossing trails, and technical ridge hikes for adventurous trekkers.",
  },
  weekend: {
    name: "Weekend",
    title: "Weekend & Short Treks in India",
    subtitle: "Quick 2-to-3-day escapes with stunning panoramic views, camping, and easy-to-moderate trails.",
  },
  rajasthan: {
    name: "Rajasthan",
    title: "Rajasthan Heritage Treks & Tour Packages",
    subtitle: "Timeless Rajput forts, opulent lake palaces, camel safaris, and golden sand dunes in Jaipur, Udaipur & Jaisalmer.",
  },
  kerala: {
    name: "Kerala",
    title: "Kerala Backwaters & Hill Tour Packages",
    subtitle: "Emerald tea plantations of Munnar, serene Alleppey backwater houseboats, and tranquil Arabian coastline.",
  },
};

const SLUG_ALIASES: Record<string, string> = {
  "goa-tour-package": "goa-tour-package-4-nights-5-days",
  "goa-trip-package-4-nights-5-days": "goa-tour-package-4-nights-5-days",
  "meghalaya-tour-package": "meghalaya-tour-package-5-nights-6-days",
  "maharashtra-tour-package": "maharashtra-tour-package-4-nights-5-days",
  "kerala-tour-package": "kerala-tour-package-5-nights-6-days",
  "manali-tour-package": "manali-tour-package-4-nights-5-days",
};

export default async function TrekDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawSlug = (slug || "chopta-tungnath-chandrashila").replace(/^\/+/, "");
  const normalizedSlug = rawSlug.toLowerCase();

  if (normalizedSlug === "rajasthan-tour-package-6-days" || normalizedSlug === "rajasthan-tour-package-5-nights-6-days") {
    const { redirect } = await import("next/navigation");
    redirect("/rajasthan-tour-package-6-days");
  }

  const regionalConfig = REGIONAL_TREK_CATEGORIES[normalizedSlug];
  if (regionalConfig) {
    return (
      <TreksContent
        initialCategory={regionalConfig.name}
        titleOverride={regionalConfig.title}
        subtitleOverride={regionalConfig.subtitle}
      />
    );
  }

  const lookupSlug = SLUG_ALIASES[normalizedSlug] || normalizedSlug;

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {
    const store = readStore();
    dynamicTreks = store.treks || [];
  }

  const trek =
    dynamicTreks.find((t) => t.slug === lookupSlug) ||
    treks.find((t) => t.slug === lookupSlug) ||
    dynamicTreks.find((t) => t.slug === rawSlug) ||
    treks.find((t) => t.slug === rawSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase()) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase());

  if (!trek) {
    notFound();
  }

  return <TrekDetailClient initialTrek={trek as unknown as TrekData} slug={lookupSlug} />;
}
