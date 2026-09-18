import type { Metadata } from "next";
import { KeralaTourClient } from "./kerala-client";

export const metadata: Metadata = {
  title: "Kerala Tour Package – 5 Nights / 6 Days | Munnar Thekkady Alleppey Houseboat",
  description:
    "Book a 5 Nights Kerala Tour Package for 2 with Munnar, Thekkady, Alleppey houseboat and Kochi. Private car, 3-star stay & meals. Get a quote.",
  keywords: [
    "Kerala Tour Package",
    "Kerala tour package for couple",
    "Kerala 5 nights 6 days package",
    "Kochi Munnar Thekkady Alleppey tour package",
    "Kerala tour package with houseboat",
    "Kerala honeymoon package 5 nights 6 days",
    "Munnar tour package",
    "Thekkady tour package",
    "Alleppey houseboat package",
    "Kochi sightseeing",
    "Kerala private tour",
    "Kerala holiday package for couples",
    "Kerala trip package from Kochi",
    "Kerala 3 star tour package",
    "Munnar Thekkady Alleppey itinerary",
  ],
  alternates: {
    canonical: "https://kradind.com/kerala-tour-package-5-nights-6-days",
  },
  openGraph: {
    title: "Kerala Tour Package – 5 Nights / 6 Days | Munnar Thekkady Alleppey Houseboat",
    description:
      "Book a 5 Nights Kerala Tour Package for 2 with Munnar, Thekkady, Alleppey houseboat and Kochi. Private car, 3-star stay & meals. Get a quote.",
    url: "https://kradind.com/kerala-tour-package-5-nights-6-days",
    siteName: "KRADIND Adventures",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Kerala Tour Package – Munnar, Thekkady and Alleppey Houseboat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kerala Tour Package – 5 Nights / 6 Days | Munnar Thekkady Alleppey Houseboat",
    description:
      "Book a 5 Nights Kerala Tour Package for 2 with Munnar, Thekkady, Alleppey houseboat and Kochi. Private car, 3-star stay & meals. Get a quote.",
    images: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function KeralaTourPackagePage() {
  const pageUrl = "https://kradind.com/kerala-tour-package-5-nights-6-days";

  // Structured Data Schema for Search Engines (Schema.org JSON-LD)
  const tripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${pageUrl}#trip`,
    name: "Kerala Tour Package – 5 Nights / 6 Days",
    description:
      "A well-planned Kerala holiday for couples covering Munnar tea gardens, Thekkady spices, an Alleppey traditional houseboat stay, and Kochi heritage with private Swift Dzire and 3-star stays.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    touristType: ["Couples", "Honeymooners", "Families", "Nature Lovers"],
    itinerary: [
      {
        "@type": "Day",
        name: "Day 1: Kochi to Munnar – Waterfalls, Tea Hills & Scenic Drive",
        description: "Arrival at Kochi, scenic drive to Munnar (~125-140 km), stopping at Cheeyappara and Valara waterfalls, spice plantations, and viewpoints. Check-in to 3-star Munnar hotel. Dinner included.",
      },
      {
        "@type": "Day",
        name: "Day 2: Munnar Full-Day Sightseeing",
        description: "Full day Munnar exploration: Eravikulam National Park (subject to calving season), Tea Museum, Mattupetty Dam, Echo Point, Kundala Lake and tea gardens. Breakfast & dinner included.",
      },
      {
        "@type": "Day",
        name: "Day 3: Munnar to Thekkady – Hills, Spices & Wildlife",
        description: "Drive to Thekkady (~110-125 km) through cardamom and pepper plantations. Optional Periyar Lake boat ride, spice plantation tour, and Kathakali/Kalaripayattu show. Breakfast & dinner included.",
      },
      {
        "@type": "Day",
        name: "Day 4: Thekkady to Alleppey – Overnight Houseboat",
        description: "Drive to Alleppey (~140-160 km) and board a traditional Kerala houseboat. Cruise through Vembanad Lake and backwaters. Full houseboat meals: lunch, evening tea/snacks, dinner and breakfast.",
      },
      {
        "@type": "Day",
        name: "Day 5: Alleppey to Kochi – Backwaters to Fort Kochi",
        description: "Morning cruise and breakfast on houseboat. Check-out and drive to Kochi (~55-65 km). Sightseeing of Fort Kochi, Chinese Fishing Nets, St. Francis Church, Mattancherry, and Jew Town. Breakfast & dinner included.",
      },
      {
        "@type": "Day",
        name: "Day 6: Kochi Sightseeing & Departure",
        description: "Breakfast at hotel, optional visits to Marine Drive or Lulu Mall, and transfer to Kochi International Airport or Ernakulam Railway Station.",
      },
    ],
    provider: {
      "@type": "TravelAgency",
      name: "KRADIND Adventures",
      url: "https://kradind.com",
      telephone: "+91-7500222141",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Kerala Tour Package for 2 Adults (Breakfast + Dinner + Houseboat Meals)",
        price: "60000",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validFrom: "2026-01-01",
        url: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the cost of this 5 nights 6 days Kerala tour package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The package costs ₹60,000 for 2 adults, which works out to ₹30,000 per person. It includes 3-star accommodation, private Swift Dzire transportation, breakfast and dinner at hotels, plus one night in an Alleppey houseboat with full houseboat meals (lunch, evening tea/snacks, dinner, and breakfast).",
        },
      },
      {
        "@type": "Question",
        name: "What places are covered in this Kerala tour package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The route covers Kochi, Munnar, Thekkady and Alleppey. You get two nights in Munnar, one night in Thekkady, one night on an Alleppey houseboat, and one night in Kochi.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Kerala tour package private for couples?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. This package is planned for 2 adults travelling in a private Swift Dzire. The vehicle is not shared with another tourist group.",
        },
      },
      {
        "@type": "Question",
        name: "Is Periyar boating included in the package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Periyar Lake boating is an optional activity and is not included in the standard ₹60,000 package. Tickets and applicable charges can be paid separately, subject to availability.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Alleppey houseboat stay included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The package includes one night on an Alleppey houseboat. The houseboat plan includes lunch, evening tea/snacks and dinner, along with breakfast as specified in the itinerary.",
        },
      },
      {
        "@type": "Question",
        name: "What is the best time to visit Kerala?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "October to February is generally a comfortable period for this route, with pleasant conditions in Munnar and Thekkady and suitable weather for backwater travel. Kerala can also be visited during the monsoon (June to September) for lush greenery, but travellers should expect rain.",
        },
      },
      {
        "@type": "Question",
        name: "Are Eravikulam National Park and other entry tickets included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Attraction entry fees are excluded unless specifically mentioned in your booking confirmation. Eravikulam National Park is also subject to seasonal closure during the Nilgiri tahr calving season (generally around February and March), so an alternative sightseeing stop may be used when required.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize this Kerala tour package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can request changes to the hotel category, meal plan, destinations, sightseeing and number of nights. Popular additions include Kumarakom, Kovalam, Varkala, Marari, Vagamon and Athirappilly.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
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
        name: "Domestic Trips",
        item: "https://kradind.com/domestic-trips",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Kerala",
        item: "https://kradind.com/destinations/kerala",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Kerala Tour Package – 5 Nights / 6 Days",
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data for Googlebot & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([tripSchema, faqSchema, breadcrumbSchema]),
        }}
      />
      <KeralaTourClient />
    </>
  );
}
