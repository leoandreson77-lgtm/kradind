import type { Metadata } from "next";
import { treks } from "@/lib/travel-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trek =
    treks.find((t) => t.slug === slug) ||
    treks.find((t) => t.slug.includes(slug)) ||
    treks[0];

  const pageUrl = `https://kradind.com/treks/${slug}`;
  const title = `${trek.name} (${trek.duration}) | KRADIND Adventures`;
  const description =
    trek.overview ||
    `Book ${trek.name} in ${trek.region}. Duration: ${trek.duration}, Altitude: ${trek.altitude}, Difficulty: ${trek.difficulty}. Certified guides, small batches, verified trails.`;

  return {
    title,
    description,
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
  const trek =
    treks.find((t) => t.slug === slug) ||
    treks.find((t) => t.slug.includes(slug)) ||
    treks[0];

  const trekSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `https://kradind.com/treks/${slug}#trip`,
        name: trek.name,
        description: trek.overview || trek.description,
        touristType: ["Adventure Traveler", "Trekker", "High Altitude Hiker"],
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
          itemListElement: trek.itinerary?.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title || `Day ${item.day}`,
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
            name: "Himalayan Treks",
            item: "https://kradind.com/treks",
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
