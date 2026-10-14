import type { Metadata } from "next";
import { treks } from "@/lib/travel-data";
import { getTreksAsync } from "@/lib/cms-store";
import { isDomesticPackage } from "@/lib/package-sections";

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
      description: "The tour package or expedition you are looking for is no longer active.",
    };
  }

  const pageUrl = `https://kradind.com/treks/${lookupSlug}`;
  const title = trek.metaTitle || `${trek.name} (${trek.duration}) | KRADIND Adventures`;
  const description =
    trek.metaDescription ||
    trek.overview ||
    `Book ${trek.name} in ${trek.region}. Duration: ${trek.duration}, Altitude: ${trek.altitude}, Difficulty: ${trek.difficulty}. Certified guides, small batches, verified trails.`;
  const keywords = trek.metaKeywords
    ? trek.metaKeywords.split(",").map((k: string) => k.trim())
    : [
        trek.name,
        trek.region,
        "tour package",
        "holiday package",
        "KRAD Global",
        "KRADIND Adventures",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/treks/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: trek.image,
          width: 1200,
          height: 630,
          alt: trek.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [trek.image],
    },
  };
}

export default async function TrekDetailLayout({
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
    dynamicTreks.find((t) => t.slug === rawSlug) ||
    treks.find((t) => t.slug === rawSlug) ||
    dynamicTreks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase()) ||
    treks.find((t) => t.slug?.toLowerCase() === lookupSlug.toLowerCase());

  if (!trek) {
    return <>{children}</>;
  }

  const trekSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `https://kradind.com/treks/${slug}#trip`,
        name: trek.name,
        description: trek.overview || trek.tagline || "",
        touristType: isDomesticPackage(trek)
          ? ["Holiday Traveler", "Family Vacationer", "Leisure Explorer"]
          : ["Adventure Traveler", "Trekker", "High Altitude Hiker"],
        offers: {
          "@type": "Offer",
          price: trek.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: "2026-01-01",
          url: `https://kradind.com/treks/${slug}`,
        },
        provider: {
          "@type": "TravelAgency",
          "@id": "https://kradind.com/#organization",
          name: "KRADIND Adventures",
          url: "https://kradind.com",
        },
        image: trek.image,
        itinerary: {
          "@type": "ItemList",
          numberOfItems: trek.itinerary?.length || 0,
          itemListElement: (trek.itinerary || []).map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title || `Day ${item.day || index + 1}`,
            description: item.description,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://kradind.com/treks/${slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kradind.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isDomesticPackage(trek) ? "Domestic Tour Packages" : "Himalayan Treks",
            item: isDomesticPackage(trek) ? "https://kradind.com/domestic-trips" : "https://kradind.com/treks",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: trek.name,
            item: `https://kradind.com/treks/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(trekSchema),
        }}
      />
      {children}
    </>
  );
}
