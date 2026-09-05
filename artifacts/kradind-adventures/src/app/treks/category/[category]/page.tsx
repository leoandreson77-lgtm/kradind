import type { Metadata } from "next";
import { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";
import { treks } from "@/lib/travel-data";

function formatCategoryName(slug: string): string {
  const map: Record<string, string> = {
    domestic: "Domestic",
    uttarakhand: "Uttarakhand",
    himachal: "Himachal",
    ladakh: "Ladakh",
    rajasthan: "Rajasthan",
    kerala: "Kerala",
    meghalaya: "Meghalaya",
    sikkim: "Sikkim",
    assam: "Assam",
    goa: "Goa",
    maharashtra: "Maharashtra",
    northeast: "Northeast",
    international: "International",
    weekend: "Weekend",
    himalayas: "Himalayas",
    monsoon: "Monsoon",
  };
  return map[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const catName = formatCategoryName(category);
  const pageUrl = `https://kradind.com/treks/category/${category.toLowerCase()}`;
  const title = `${catName} Treks & Tour Packages | KRADIND Adventures`;
  const description = `Explore handpicked and verified ${catName} treks, alpine circuits, and cultural tour packages with certified wilderness mountaineers and small batches.`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: "https://kradind.com/logo.png",
          width: 1475,
          height: 950,
          alt: `${catName} Treks - KRADIND Adventures`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://kradind.com/logo.png"],
    },
  };
}

export default async function CategoryTreksPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const catName = formatCategoryName(category);

  // Filter matching treks for schema
  const matchingTreks = treks.filter((t) => {
    const c = catName.toLowerCase();
    return (
      t.category.toLowerCase().includes(c) ||
      t.categories.some((cat) => cat.toLowerCase().includes(c)) ||
      t.location.toLowerCase().includes(c) ||
      t.region.toLowerCase().includes(c)
    );
  });

  const categorySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": `https://kradind.com/treks/category/${category.toLowerCase()}#itemlist`,
        name: `${catName} Treks & Tour Packages`,
        description: `Verified ${catName} treks and expeditions organized by KRADIND Adventures.`,
        numberOfItems: matchingTreks.length,
        itemListElement: matchingTreks.map((t, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: t.name,
          url: `https://kradind.com/treks/${t.slug}`,
          image: t.image,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://kradind.com/treks/category/${category.toLowerCase()}#breadcrumb`,
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
            name: "Treks",
            item: "https://kradind.com/treks",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${catName} Trips`,
            item: `https://kradind.com/treks/category/${category.toLowerCase()}`,
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
          __html: JSON.stringify(categorySchema),
        }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
            Loading {catName} trips...
          </div>
        }
      >
        <TreksContent initialCategory={catName} />
      </Suspense>
    </>
  );
}
