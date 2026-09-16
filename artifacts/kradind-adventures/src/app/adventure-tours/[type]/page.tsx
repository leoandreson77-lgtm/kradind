import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

const ADVENTURE_TYPE_MAP: Record<string, { name: string; title: string; subtitle: string; category: string }> = {
  camping: {
    name: "Camping",
    title: "Wilderness Camping & Alpine Glamping Tours",
    subtitle: "Camp under millions of stars beside gushing Himalayan rivers, pine forests, and high-altitude mountain meadows.",
    category: "Weekend",
  },
  hiking: {
    name: "Hiking",
    title: "Scenic Alpine Hiking Tours & Nature Trails",
    subtitle: "Accessible day hikes, ridge walks, and scenic trails perfect for adventure lovers, families, and nature photographers.",
    category: "Weekend",
  },
  "snow-treks": {
    name: "Snow Treks",
    title: "Winter Snow Treks & Summit Expeditions",
    subtitle: "Navigate pristine white snowfields with microspikes, gaiters, and certified mountain safety leaders.",
    category: "Himalayas",
  },
  expeditions: {
    name: "Expeditions",
    title: "Himalayan Mountaineering Expeditions & High Passes",
    subtitle: "Cross high-altitude passes and challenging glaciated terrains with full technical logistical support.",
    category: "Himalayas",
  },
  "high-altitude": {
    name: "High Altitude",
    title: "High Altitude Adventures & 13,000+ Ft Circuits",
    subtitle: "Acclimatized alpine treks through thin mountain air, glacial lakes, and sweeping panoramic views of Himalayan giants.",
    category: "Himalayas",
  },
};

function getAdventureInfo(slug: string) {
  const key = slug.toLowerCase();
  if (ADVENTURE_TYPE_MAP[key]) return ADVENTURE_TYPE_MAP[key];
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    name: formatted,
    title: `${formatted} Adventure Tours`,
    subtitle: `Guided outdoor adventures, treks, and thrilling tours in ${formatted} with KRADIND Adventures.`,
    category: "Himalayas",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const info = getAdventureInfo(type);

  return {
    title: `${info.title} | KRADIND Adventures`,
    description: info.subtitle,
    alternates: {
      canonical: `https://kradind.com/adventure-tours/${type.toLowerCase()}`,
    },
    openGraph: {
      title: `${info.title} | KRADIND Adventures`,
      description: info.subtitle,
      url: `https://kradind.com/adventure-tours/${type.toLowerCase()}`,
      type: "website",
    },
  };
}

export default async function AdventureTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const info = getAdventureInfo(type);

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
