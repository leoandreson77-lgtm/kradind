import type { Metadata } from "next";
import { treks } from "@/lib/travel-data";
import { getTreksAsync } from "@/lib/cms-store";

const SLUG_ALIASES: Record<string, string> = {
  "goa-tour-package": "goa-tour-package-4-nights-5-days",
  "goa-trip-package-4-nights-5-days": "goa-tour-package-4-nights-5-days",
  "meghalaya-tour-package": "meghalaya-tour-package-5-nights-6-days",
  "maharashtra-tour-package": "maharashtra-tour-package-4-nights-5-days",
  "kerala-tour-package": "kerala-tour-package-5-nights-6-days",
  "manali-tour-package": "manali-tour-package-4-nights-5-days",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = (slug || "").replace(/^\/+/, "");
  const lookupSlug = SLUG_ALIASES[rawSlug.toLowerCase()] || rawSlug;

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {}

  const trek =
    dynamicTreks.find((t) => t.slug === lookupSlug) ||
    treks.find((t) => t.slug === lookupSlug) ||
    dynamicTreks.find((t) => t.slug === rawSlug) ||
    treks.find((t) => t.slug === rawSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase()) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase());

  if (!trek) {
    return {
      title: "Package Not Found | KRADIND",
      description: "The tour package you are looking for is no longer active.",
    };
  }

  const pageUrl = `https://kradind.com/domestic/${lookupSlug}`;
  const title = trek.metaTitle || `${trek.name} (${trek.duration}) | Domestic Holiday | KRADIND`;
  const description =
    trek.metaDescription ||
    trek.overview ||
    `Book ${trek.name} in ${trek.region}. Duration: ${trek.duration}. Private transfers, verified stays, curated sightseeing.`;
  const keywords = trek.metaKeywords
    ? trek.metaKeywords.split(",").map((k: string) => k.trim())
    : [trek.name, trek.region, "domestic tour package", "holiday package", "KRADIND"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "KRADIND Adventures",
      images: [
        {
          url: trek.image || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: trek.imageAlt || trek.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [trek.image || "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"],
    },
  };
}

export default async function DomesticDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawSlug = (slug || "").replace(/^\/+/, "");
  const lookupSlug = SLUG_ALIASES[rawSlug.toLowerCase()] || rawSlug;

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {}

  const trek =
    dynamicTreks.find((t) => t.slug === lookupSlug) ||
    treks.find((t) => t.slug === lookupSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase()) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase());

  if (!trek) {
    return <>{children}</>;
  }

  const pageUrl = `https://kradind.com/domestic/${lookupSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trek.name,
    description: trek.metaDescription || trek.overview,
    touristType: ["Family", "Couples", "Solo Travelers"],
    image: trek.image,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      price: trek.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
    provider: {
      "@type": "Organization",
      name: "KRADIND Adventures",
      url: "https://kradind.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
