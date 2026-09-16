import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

const COUNTRY_MAP: Record<string, { name: string; title: string; subtitle: string; category: string }> = {
  nepal: {
    name: "Nepal",
    title: "Nepal Tour Packages & Himalayan Expeditions",
    subtitle: "Explore Kathmandu's ancient temples, Pokhara's peaceful lakes, and Everest panoramic trails.",
    category: "International",
  },
  bali: {
    name: "Bali",
    title: "Bali Holiday Tour Packages & Island Getaways",
    subtitle: "Discover Ubud's lush terraces, Seminyak's sunsets, Nusa Penida's cliffs, and tropical beach resorts.",
    category: "International",
  },
  thailand: {
    name: "Thailand",
    title: "Thailand Holiday Tour Packages",
    subtitle: "Experience Bangkok's grand palaces, Phuket's turquoise waters, and Krabi's towering limestone cliffs.",
    category: "International",
  },
  dubai: {
    name: "Dubai",
    title: "Dubai Tour Packages & Desert Safaris",
    subtitle: "Ascend the Burj Khalifa, cruise Dubai Marina, and enjoy thrilling dune bashing in Arabian sands.",
    category: "International",
  },
  vietnam: {
    name: "Vietnam",
    title: "Vietnam Holiday Tour Packages",
    subtitle: "Cruise mystical Ha Long Bay, stroll Hoi An's lantern-lit streets, and explore Hanoi's French Quarter.",
    category: "International",
  },
  singapore: {
    name: "Singapore",
    title: "Singapore Tour Packages & City Breaks",
    subtitle: "Visit Gardens by the Bay, Sentosa Island, Universal Studios, and world-class luxury waterfront shopping.",
    category: "International",
  },
  maldives: {
    name: "Maldives",
    title: "Maldives Holiday Tour Packages & Overwater Villas",
    subtitle: "Indulge in private water villas, pristine coral reefs, crystal lagoons, and world-class island hospitality.",
    category: "International",
  },
};

function getCountryInfo(slug: string) {
  const key = slug.toLowerCase();
  if (COUNTRY_MAP[key]) return COUNTRY_MAP[key];
  const formatted = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
  return {
    name: formatted,
    title: `${formatted} Tour Packages & Holidays`,
    subtitle: `Customized international tour packages and holiday itineraries in ${formatted} by KRADIND Adventures.`,
    category: "International",
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const info = getCountryInfo(country);

  return {
    title: `${info.title} | KRADIND Adventures`,
    description: info.subtitle,
    alternates: {
      canonical: `https://kradind.com/international-trips/${country.toLowerCase()}`,
    },
    openGraph: {
      title: `${info.title} | KRADIND Adventures`,
      description: info.subtitle,
      url: `https://kradind.com/international-trips/${country.toLowerCase()}`,
      type: "website",
    },
  };
}

export default async function InternationalCountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const info = getCountryInfo(country);

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
