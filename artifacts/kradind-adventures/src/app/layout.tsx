import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { VoiceAssistant } from "@/components/voice-assistant";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-brand",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0F3A2E",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kradind.com"),
  title: {
    default: "KRAD Global | Tour & Travel Company in Dehradun | India",
    template: "%s | KRAD Global",
  },
  description:
    "KRAD Global is a Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, treks and memorable travel experiences.",
  keywords: [
    "tour and travel company in Dehradun",
    "travel agency in Dehradun",
    "tour operator in Dehradun",
    "domestic tour packages",
    "international tour packages",
    "India tour packages",
    "customized tour packages",
    "KRAD Global",
    "Dehradun travel and tour services",
    "Himalayan trekking package",
    "customized holiday package",
    "tour packages in Dehradun",
    "KRADIND Adventures",
  ],
  authors: [
    { name: "KRAD Global", url: "https://kradind.com" },
    { name: "KRADIND Expedition Team", url: "https://kradind.com/about" },
  ],
  creator: "KRAD Global",
  publisher: "KRAD Global",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "T3Scitqdc9Jqk5rp2LCXSF-69t8Q-zpZlgql9ZjxpGI",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "KRAD Global | Tour & Travel Company in Dehradun | India",
    description:
      "KRAD Global is a Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, treks and memorable travel experiences.",
    url: "https://kradind.com",
    siteName: "KRAD Global",
    images: [
      {
        url: "/logo.png",
        width: 1475,
        height: 950,
        alt: "KRAD Global tour and travel company logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KRAD Global | Tour & Travel Company in Dehradun | India",
    description:
      "KRAD Global is a Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, treks and memorable travel experiences.",
    images: ["/logo.png"],
  },
};

const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kradind.com/#organization",
      name: "KRAD Global",
      legalName: "KRAD Global Travels / KRADIND Adventures Private Limited",
      alternateName: ["KRADIND Adventures", "KRAD Global Travels", "KRADIND"],
      url: "https://kradind.com",
      logo: {
        "@type": "ImageObject",
        "@id": "https://kradind.com/#logo",
        url: "https://kradind.com/logo-emblem.png",
        caption: "KRAD Global tour and travel company logo",
      },
      image: "https://kradind.com/logo.png",
      description:
        "KRAD Global is a Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, treks and memorable travel experiences.",
      telephone: "+917500222141",
      email: "support@kradind.com",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "2480",
        bestRating: "5",
        worstRating: "1",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rajpur Road, Jakhan",
        addressLocality: "Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248001",
        addressCountry: "IN",
      },
      sameAs: [
        "https://wa.link/n3u8c0",
        "https://www.instagram.com/kradglobal/",
        "https://www.facebook.com/share/189E2RUcH4/",
        "https://www.youtube.com/@kradglobaltravels",
        "https://x.com/KradGlobalTour",
        "https://www.threads.net/@kradglobal",
        "https://in.pinterest.com/KradGlobalTravels/",
      ],
    },
    {
      "@type": "TravelAgency",
      "@id": "https://kradind.com/#travelagency",
      name: "KRAD Global - Tour & Travel Company in Dehradun",
      alternateName: ["KRADIND Adventures", "KRAD Global Travels"],
      url: "https://kradind.com",
      image: "https://kradind.com/logo.png",
      logo: "https://kradind.com/logo-emblem.png",
      description:
        "KRAD Global is a Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, treks and memorable travel experiences.",
      telephone: "+917500222141",
      email: "support@kradind.com",
      priceRange: "₹₹",
      currenciesAccepted: "INR, USD",
      paymentAccepted: "Credit Card, UPI, Net Banking",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hall No. H-04, 401 Pratap Palace, Indiranagar Colony",
        addressLocality: "Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248001",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Dehradun" },
        { "@type": "AdministrativeArea", name: "Uttarakhand" },
        { "@type": "Country", name: "India" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tour & Travel Packages",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Domestic Tour Packages",
              description: "Domestic tour package in India by KRAD Global",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "International Tour Packages",
              description: "International tour package by KRAD Global",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Himalayan Trekking Packages",
              description: "Himalayan trekking package by KRAD Global",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Customized Holiday Packages",
              description: "Customized holiday package by KRAD Global",
            },
          },
        ],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://kradind.com/#localbusiness",
      name: "KRADIND Adventures",
      legalName: "KRADIND Adventures Private Limited",
      alternateName: ["KRADIND", "KRAD Global Travels"],
      url: "https://kradind.com",
      image: "https://kradind.com/logo.png",
      logo: "https://kradind.com/logo-emblem.png",
      description:
        "India's premier certified high-altitude expedition operator. Specializing in small-batch eco-treks, Himalayan alpine circuits, and tailored experiential travel with certified wilderness leaders.",
      telephone: "+91 75002 22141",
      email: "support@kradind.com",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rajpur Road, Jakhan",
        addressLocality: "Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248001",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 30.3165,
        longitude: 78.0322,
      },
      openingHoursSpecification: [
        {
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
      ],
      sameAs: [
        "https://wa.link/n3u8c0",
        "https://www.instagram.com/kradglobal/",
        "https://www.facebook.com/share/189E2RUcH4/",
        "https://www.youtube.com/@kradglobaltravels",
        "https://x.com/KradGlobalTour",
        "https://www.threads.net/@kradglobal",
        "https://in.pinterest.com/KradGlobalTravels/",
      ],
    },
    {
      "@type": "TravelAgency",
      "@id": "https://kradind.com/#travelagency",
      name: "KRADIND Adventures",
      url: "https://kradind.com",
      priceRange: "₹₹",
      telephone: "+91 75002 22141",
      parentOrganization: {
        "@type": "Organization",
        "@id": "https://kradind.com/#organization",
        name: "KRADIND Adventures",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://kradind.com/#website",
      url: "https://kradind.com",
      name: "KRADIND Adventures",
      description:
        "Himalayan Treks, Domestic & International Adventures, Live Ground Radar",
      datePublished: "2026-01-01T00:00:00+05:30",
      dateModified: "2026-09-14T12:00:00+05:30",
      publisher: {
        "@type": "Organization",
        "@id": "https://kradind.com/#organization",
        name: "KRADIND Adventures",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://kradind.com/treks?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} scroll-smooth overflow-x-clip w-full max-w-full`}>
      <head>
        <meta name="google-site-verification" content="T3Scitqdc9Jqk5rp2LCXSF-69t8Q-zpZlgql9ZjxpGI" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        
        {/* AI Discoverability / GEO Index */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Content Index" />
        <link rel="help" type="text/plain" href="/llms.txt" title="AI Agent Documentation" />

        {/* Preconnect to external image CDN for fast mobile LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Preload initial hero LCP image (optimized modern WebP) for instant discovery */}
        <link rel="preload" as="image" href="/ocean-sunrise.webp" fetchPriority="high" type="image/webp" />
        {/* Global JSON-LD Schema (Organization & WebSite with SearchAction) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData),
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased font-sans relative overflow-x-clip w-full max-w-full">
        {/* Accessible Skip Navigation Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2.5 focus:bg-emerald-800 focus:text-white focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-bold text-xs uppercase tracking-wider transition-all"
        >
          Skip to main content
        </a>

        {/* Google tag (gtag.js) deferred with lazyOnload to keep mobile TBT at 0ms */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-3RPQZ9Y3M2"
        />
        <Script id="google-analytics-gtag" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3RPQZ9Y3M2');
          `}
        </Script>

        {children}
        <FloatingWhatsApp />
        <VoiceAssistant />
      </body>
    </html>
  );
}
