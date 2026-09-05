import type { Metadata } from "next";
import { readStore } from "@/lib/cms-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = readStore();
  const page = store.landingPages?.find((p) => p.slug === slug);

  if (!page) {
    return {
      title: "Sacred Yatra & Expeditions | KRADIND Adventures",
      alternates: {
        canonical: `/lp/${slug}`,
      },
    };
  }

  const pageUrl = `https://kradind.com/lp/${slug}`;
  const title = `${page.title} | KRADIND Adventures`;
  const description = `${page.subtitle} Book verified packages with certified wilderness leaders, premium hotel stays, and VIP darshan assistance.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/lp/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: page.heroImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [page.heroImage],
    },
  };
}

export default async function LandingPageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = readStore();
  const page = store.landingPages?.find((p) => p.slug === slug);

  const faqSchema =
    page?.faqs && page.faqs.length > 0
      ? {
          "@type": "FAQPage",
          "@id": `https://kradind.com/lp/${slug}#faq`,
          mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  const tripSchema = page
    ? {
        "@type": "TouristTrip",
        "@id": `https://kradind.com/lp/${slug}#trip`,
        name: page.title,
        description: page.subtitle,
        image: page.heroImage,
        provider: {
          "@type": "TravelAgency",
          "@id": "https://kradind.com/#organization",
          name: "KRADIND Adventures",
          url: "https://kradind.com",
        },
        offers: {
          "@type": "Offer",
          price: page.promoOffer?.code ? "14999" : "18999",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          validFrom: "2026-01-01",
          url: `https://kradind.com/lp/${slug}`,
        },
      }
    : null;

  const breadcrumbSchema = page
    ? {
        "@type": "BreadcrumbList",
        "@id": `https://kradind.com/lp/${slug}#breadcrumb`,
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
            name: "Pilgrimage & Sacred Yatras",
            item: "https://kradind.com/treks",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.title,
            item: `https://kradind.com/lp/${slug}`,
          },
        ],
      }
    : null;

  const graph = [tripSchema, faqSchema, breadcrumbSchema].filter(Boolean);

  return (
    <>
      {graph.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": graph,
            }),
          }}
        />
      )}
      {children}
    </>
  );
}
