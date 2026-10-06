import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoogleMapLocator } from "@/components/google-map-locator";

export const metadata: Metadata = {
  title: "Office Locator & Google Maps | KRAD GLOBAL & KRADIND Adventures",
  description:
    "Find our registered headquarters & expedition basecamp in Dehradun, Uttarakhand. Hall No. H -04, 410 Pratap Palace, Indiranagar Colony. Call +91 9797941414.",
  alternates: {
    canonical: "https://kradind.com/locator",
  },
  openGraph: {
    title: "KRAD GLOBAL Headquarters & Office Locator | Google Maps",
    description:
      "Locate KRAD GLOBAL & KRADIND Adventures in Dehradun, Uttarakhand. Verified Google Maps location, office hours, and direct navigation.",
    url: "https://kradind.com/locator",
    type: "website",
  },
};

export default function LocatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "KRAD GLOBAL",
    alternateName: "KRADIND Adventures",
    image: "https://kradind.com/logo.webp",
    "@id": "https://kradind.com/#travelagency",
    url: "https://kradind.com",
    telephone: "+91 9797941414",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hall No. H -04, 410, Pratap Palace, Vasant Vihar, Indra Nagar Colony",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 30.3190771,
      longitude: 78.0017444,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [
      "https://wa.me/919797941414",
      "https://www.google.com/maps/search/?api=1&query=KRAD+GLOBAL&query_place_id=ChIJ9VntEfArCTkRhMH-ZPcikyc",
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-10">
        <GoogleMapLocator showTitle={true} />
      </main>

      <Footer />
    </div>
  );
}
