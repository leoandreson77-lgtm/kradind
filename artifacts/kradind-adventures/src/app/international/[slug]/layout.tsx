import type { Metadata } from "next";
import { treks } from "@/lib/travel-data";
import { getTreksAsync } from "@/lib/cms-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawSlug = (slug || "").replace(/^\/+/, "");
  const lookupSlug = rawSlug.toLowerCase();

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {}

  const trek =
    dynamicTreks.find((t) => t.slug === lookupSlug) ||
    treks.find((t) => t.slug === lookupSlug) ||
    dynamicTreks.find((t) => t.slug === rawSlug) ||
    treks.find((t) => t.slug === rawSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug);

  if (!trek) {
    return {
      title: "Tour Not Found | KRADIND",
      description: "The international tour package you are looking for is no longer active.",
    };
  }

  const pageUrl = `https://kradind.com/international/${lookupSlug}`;
  const title = trek.metaTitle || `${trek.name} (${trek.duration}) | International Tour | KRADIND`;
  const description =
    trek.metaDescription ||
    trek.overview ||
    `Explore ${trek.name}. Duration: ${trek.duration}. Complete international visa guidance, verified hotels, and private transfers.`;
  const keywords = trek.metaKeywords
    ? trek.metaKeywords.split(",").map((k: string) => k.trim())
    : [trek.name, trek.region, "international tour package", "holiday package", "KRADIND"];

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
          url: trek.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
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
      images: [trek.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"],
    },
  };
}

export default async function InternationalDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawSlug = (slug || "").replace(/^\/+/, "");
  const lookupSlug = rawSlug.toLowerCase();

  let dynamicTreks: any[] = [];
  try {
    dynamicTreks = await getTreksAsync();
  } catch {}

  const trek =
    dynamicTreks.find((t) => t.slug === lookupSlug) ||
    treks.find((t) => t.slug === lookupSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug);

  if (!trek) {
    return <>{children}</>;
  }

  const pageUrl = `https://kradind.com/international/${lookupSlug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trek.name,
    description: trek.metaDescription || trek.overview,
    touristType: ["Family", "Couples", "Solo Travelers", "Adventurers"],
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
