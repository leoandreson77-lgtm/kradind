import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

const DESTINATION_MAP: Record<string, { name: string; title: string; subtitle: string; category: string }> = {
  uttarakhand: {
    name: "Uttarakhand",
    title: "Uttarakhand Travel Destination & Tour Packages",
    subtitle: "Sacred Himalayan temples, high alpine meadows (Bugyals), and pristine pine forests in Garhwal & Kumaon.",
    category: "Uttarakhand",
  },
  "himachal-pradesh": {
    name: "Himachal Pradesh",
    title: "Himachal Pradesh Travel Destination & Tours",
    subtitle: "Majestic snow peaks, scenic hill valleys, pine forests, and crossover passes in Manali, Kullu & Spiti.",
    category: "Himachal",
  },
  himachal: {
    name: "Himachal Pradesh",
    title: "Himachal Pradesh Travel Destination & Tours",
    subtitle: "Majestic snow peaks, scenic hill valleys, pine forests, and crossover passes in Manali, Kullu & Spiti.",
    category: "Himachal",
  },
  kashmir: {
    name: "Kashmir",
    title: "Kashmir Travel Destination & Holidays",
    subtitle: "Valley of flowers, romantic shikara rides on Dal Lake, and snow-filled pine valleys of Gulmarg & Pahalgam.",
    category: "Ladakh",
  },
  ladakh: {
    name: "Ladakh",
    title: "Ladakh Travel Destination & Expeditions",
    subtitle: "High-altitude cold desert, ancient Tibetan monasteries, Khardung La, and sapphire Pangong Tso.",
    category: "Ladakh",
  },
  rajasthan: {
    name: "Rajasthan",
    title: "Rajasthan Heritage Destination & Desert Safaris",
    subtitle: "Timeless Rajput forts, opulent lake palaces, camel safaris, and golden sand dunes in Jaipur, Udaipur & Jaisalmer.",
    category: "Rajasthan",
  },
  kerala: {
    name: "Kerala",
    title: "Kerala Travel Destination & Backwater Holidays",
    subtitle: "Emerald tea plantations of Munnar, serene Alleppey backwater houseboats, and tranquil Arabian coastline.",
    category: "Kerala",
  },
  goa: {
    name: "Goa",
    title: "Goa Beach Destination & Coastal Holidays",
    subtitle: "Golden beaches, historic churches, coastal spice farms, and pulsating water adventures.",
    category: "Goa",
  },
  nepal: {
    name: "Nepal",
    title: "Nepal Himalayan Travel Destination",
    subtitle: "The roof of the world, Buddhist stupas, lush Pokhara lakes, and world-class Himalayan trekking circuits.",
    category: "International",
  },
};

function getDestinationInfo(slug: string) {
  const key = slug.toLowerCase();
  if (DESTINATION_MAP[key]) return DESTINATION_MAP[key];
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    name: formatted,
    title: `${formatted} Travel Destination & Tour Packages`,
    subtitle: `Explore handpicked tours, treks, and holiday packages in ${formatted} with KRADIND Adventures.`,
    category: formatted,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ destination: string }>;
}): Promise<Metadata> {
  const { destination } = await params;
  const info = getDestinationInfo(destination);

  return {
    title: `${info.title} | KRADIND Adventures`,
    description: info.subtitle,
    alternates: {
      canonical: `https://kradind.com/destinations/${destination.toLowerCase()}`,
    },
    openGraph: {
      title: `${info.title} | KRADIND Adventures`,
      description: info.subtitle,
      url: `https://kradind.com/destinations/${destination.toLowerCase()}`,
      type: "website",
    },
  };
}

export default async function SingleDestinationPage({
  params,
}: {
  params: Promise<{ destination: string }>;
}) {
  const { destination } = await params;
  const info = getDestinationInfo(destination);

  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse" />}>
      <TreksContent
        initialCategory={info.category}
        titleOverride={info.title}
        subtitleOverride={info.subtitle}
      />
    </Suspense>
  );
}
