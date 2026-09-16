import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

const REGION_MAP: Record<string, { name: string; title: string; subtitle: string; category: string }> = {
  uttarakhand: {
    name: "Uttarakhand",
    title: "Uttarakhand Tour Packages & Holidays",
    subtitle: "Explore scenic hill stations, holy shrines, lakes, and wildlife sanctuaries in Garhwal & Kumaon.",
    category: "Uttarakhand",
  },
  "himachal-pradesh": {
    name: "Himachal Pradesh",
    title: "Himachal Pradesh Tour Packages & Holidays",
    subtitle: "Experience snow-capped peaks, pine valleys, and vibrant culture in Manali, Shimla, and Dharamshala.",
    category: "Himachal",
  },
  himachal: {
    name: "Himachal Pradesh",
    title: "Himachal Pradesh Tour Packages & Holidays",
    subtitle: "Experience snow-capped peaks, pine valleys, and vibrant culture in Manali, Shimla, and Dharamshala.",
    category: "Himachal",
  },
  kashmir: {
    name: "Kashmir",
    title: "Kashmir Tour Packages & Honeymoon Escapes",
    subtitle: "Enjoy Dal Lake shikara rides, Gulmarg gondolas, and pristine meadows of Pahalgam and Sonamarg.",
    category: "Ladakh",
  },
  ladakh: {
    name: "Ladakh",
    title: "Ladakh Tour Packages & Road Trips",
    subtitle: "Journey across the world's highest motorable passes, Pangong Tso, and Nubra Valley dunes.",
    category: "Ladakh",
  },
  rajasthan: {
    name: "Rajasthan",
    title: "Rajasthan Heritage & Desert Holiday Packages",
    subtitle: "Marvel at opulent royal palaces, majestic hill forts, and starry desert dunes in Jaipur, Udaipur & Jaisalmer.",
    category: "Rajasthan",
  },
  kerala: {
    name: "Kerala",
    title: "Kerala Holiday Tour Packages & Backwaters",
    subtitle: "Cruise Alleppey backwaters in luxury houseboats, wander Munnar tea estates, and relax in Wayanad.",
    category: "Kerala",
  },
  goa: {
    name: "Goa",
    title: "Goa Holiday Tour Packages & Beach Getaways",
    subtitle: "Unwind at golden sand beaches, historic Portuguese churches, vibrant flea markets, and water sports.",
    category: "Goa",
  },
};

function getRegionInfo(slug: string) {
  const key = slug.toLowerCase();
  if (REGION_MAP[key]) return REGION_MAP[key];
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    name: formatted,
    title: `${formatted} Tour Packages & Holidays`,
    subtitle: `Discover customized tour packages and memorable holidays in ${formatted} with KRADIND Adventures.`,
    category: formatted,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const info = getRegionInfo(region);

  return {
    title: `${info.title} | KRADIND Adventures`,
    description: info.subtitle,
    alternates: {
      canonical: `https://kradind.com/domestic-trips/${region.toLowerCase()}`,
    },
    openGraph: {
      title: `${info.title} | KRADIND Adventures`,
      description: info.subtitle,
      url: `https://kradind.com/domestic-trips/${region.toLowerCase()}`,
      type: "website",
    },
  };
}

export default async function DomesticRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const info = getRegionInfo(region);

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
