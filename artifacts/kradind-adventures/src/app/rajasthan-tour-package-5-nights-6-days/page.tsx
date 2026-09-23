import type { Metadata } from "next";
import { RajasthanTourClient } from "../rajasthan-tour-package-6-days/rajasthan-client";

export const metadata: Metadata = {
  title: "Rajasthan Tour Package – 6 Days | Jaipur Jodhpur Udaipur",
  description:
    "Book a 6-day Rajasthan tour covering Jaipur, Jodhpur & Udaipur with private car, 3-star stays and meals. Get your Rajasthan trip quote today.",
  keywords: [
    "Rajasthan Tour Package",
    "6 days Rajasthan tour package",
    "Jaipur Jodhpur Udaipur tour package",
    "Rajasthan tour package for couple",
    "Rajasthan tour package with private car",
    "Rajasthan 5 nights 6 days package",
    "Rajasthan holiday package",
    "Rajasthan trip package",
    "Rajasthan family tour",
    "Rajasthan couple tour",
    "Jaipur Jodhpur Udaipur itinerary",
    "Rajasthan sightseeing package",
    "Rajasthan private tour",
    "3 star Rajasthan tour package",
    "Jaipur Jodhpur Udaipur trip",
    "Rajasthan travel package from India",
  ],
  alternates: {
    canonical: "https://kradind.com/rajasthan-tour-package-5-nights-6-days",
  },
  openGraph: {
    title: "Rajasthan Tour Package – 6 Days | Jaipur Jodhpur Udaipur",
    description:
      "Book a 6-day Rajasthan tour covering Jaipur, Jodhpur & Udaipur with private car, 3-star stays and meals. Get your Rajasthan trip quote today.",
    url: "https://kradind.com/rajasthan-tour-package-5-nights-6-days",
    siteName: "KRADIND Adventures",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Rajasthan Tour Package – Jaipur, Jodhpur and Udaipur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajasthan Tour Package – 6 Days | Jaipur Jodhpur Udaipur",
    description:
      "Book a 6-day Rajasthan tour covering Jaipur, Jodhpur & Udaipur with private car, 3-star stays and meals. Get your Rajasthan trip quote today.",
    images: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function RajasthanTourPackage5N6DPage() {
  const pageUrl = "https://kradind.com/rajasthan-tour-package-5-nights-6-days";

  // Structured Data Schema for Search Engines (Schema.org JSON-LD)
  const tripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${pageUrl}#trip`,
    name: "Rajasthan Tour Package – 6 Days / 5 Nights",
    description:
      "See the royal side of Rajasthan on a private 6-day journey through Jaipur, Jodhpur and Udaipur with private Swift Dzire, 3-star stays and meals.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    touristType: ["Couples", "Families", "Culture Enthusiasts"],
    itinerary: [
      {
        "@type": "Day",
        name: "Day 1 – Jaipur Arrival & Local Sightseeing",
        description:
          "Arrival in Jaipur, transfer to hotel, visit City Palace, Jantar Mantar, Hawa Mahal and Old City Bazaars.",
      },
      {
        "@type": "Day",
        name: "Day 2 – Jaipur Forts & Sightseeing",
        description:
          "Explore Amber Fort, Jaigarh Fort, Jal Mahal photo stop, Nahargarh Fort sunset view and Birla Mandir.",
      },
      {
        "@type": "Day",
        name: "Day 3 – Jaipur to Jodhpur",
        description:
          "Scenic road journey to Jodhpur (~340 km), Clock Tower, Sardar Market, and blue-painted old city lanes.",
      },
      {
        "@type": "Day",
        name: "Day 4 – Jodhpur Sightseeing",
        description:
          "Full day in Jodhpur: Mehrangarh Fort, Jaswant Thada, Umaid Bhawan Palace museum and Mandore Gardens.",
      },
      {
        "@type": "Day",
        name: "Day 5 – Jodhpur to Udaipur via Ranakpur",
        description:
          "Drive to Udaipur via Ranakpur Jain Temple, evening lakeside stroll at Lake Pichola and Gangaur Ghat.",
      },
      {
        "@type": "Day",
        name: "Day 6 – Udaipur Sightseeing & Departure",
        description:
          "Visit Udaipur City Palace, Jagdish Temple, Saheliyon Ki Bari, Fateh Sagar Lake and transfer to Airport/Station.",
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
        name: "Breakfast Only Plan (2 Adults)",
        price: "42999",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        validFrom: "2026-01-01",
        url: pageUrl,
      },
      {
        "@type": "Offer",
        name: "Breakfast + Dinner Plan (2 Adults)",
        price: "49999",
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
        name: "What is included in the 6-day Rajasthan tour package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The package includes 5 nights of 3-star accommodation, private Swift Dzire transportation, Jaipur Airport/Railway Station pickup, Udaipur Airport/Railway Station drop, sightseeing and transfers listed in the itinerary, driver charges, fuel, tolls and standard parking. Breakfast is included in both plans, while the ₹49,999 option also includes dinner.",
        },
      },
      {
        "@type": "Question",
        name: "Is this Rajasthan tour package private for couples?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The package is planned for 2 adults / one couple with a private Swift Dzire. You do not have to share the vehicle with another tourist group. The vehicle is used for the confirmed sightseeing and intercity route.",
        },
      },
      {
        "@type": "Question",
        name: "Are fort entry tickets included in the Rajasthan package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Entry tickets for forts, palaces, museums, monuments and other tourist attractions are not included unless specifically mentioned in your final quotation. This includes attractions such as Amber Fort, Mehrangarh Fort and City Palace.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Lake Pichola boat ride included?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The Lake Pichola boat ride is an optional activity and its cost is separate. You can add it according to your preferred timing, availability and applicable local charges.",
        },
      },
      {
        "@type": "Question",
        name: "Can I customize this Jaipur Jodhpur Udaipur tour package?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The route can be adjusted depending on your travel dates and interests. You can discuss changes such as adding Pushkar, Ranakpur, Mount Abu, Jaisalmer or Ranthambore, subject to additional nights, vehicle requirements and revised pricing.",
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
        name: "Rajasthan",
        item: "https://kradind.com/destinations/rajasthan",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Rajasthan Tour Package – 6 Days / 5 Nights",
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
      <RajasthanTourClient />
    </>
  );
}
