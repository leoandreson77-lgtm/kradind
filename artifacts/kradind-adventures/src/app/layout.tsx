import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

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
  title: "KRADIND | Treks, Domestic & International Adventures",
  description:
    "Explore handpicked Himalayan treks, tropical road trips, live trail radar updates, and international backpacking circuits with KRADIND Adventures.",
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
    title: "KRADIND | Treks, Domestic & International Adventures",
    description:
      "Explore handpicked Himalayan treks, tropical road trips, live trail radar updates, and international backpacking circuits with KRADIND Adventures.",
    url: "https://kradind.com",
    siteName: "KRADIND Adventures",
    images: [
      {
        url: "/logo.png",
        width: 1475,
        height: 950,
        alt: "KRADIND Adventures Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "TravelAgency"],
      "@id": "https://kradind.com/#organization",
      name: "KRADIND Adventures",
      alternateName: ["KRADIND", "KRAD Global Travels"],
      url: "https://kradind.com",
      logo: {
        "@type": "ImageObject",
        "@id": "https://kradind.com/#logo",
        url: "https://kradind.com/logo-emblem.png",
        caption: "KRADIND Adventures",
      },
      image: "https://kradind.com/logo.png",
      description:
        "India's premier certified high-altitude expedition operator. Specializing in small-batch eco-treks, Himalayan alpine circuits, and tailored experiential travel with certified wilderness leaders.",
      telephone: "+917500222141",
      email: "support@kradind.com",
      priceRange: "₹₹",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Base Operations, Sankri Village & Dehradun Basecamp",
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
        "https://wa.link/n3u8c0",
        "https://www.instagram.com/kradglobal/",
        "https://www.facebook.com/share/189E2RUcH4/",
        "https://youtube.com/@kradglobaltravels?si=jZDwhsl-h42P_YZW",
        "https://x.com/KradGlobalTour",
        "https://www.threads.com/@kradglobal",
        "https://in.pinterest.com/KradGlobalTravels/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://kradind.com/#website",
      url: "https://kradind.com",
      name: "KRADIND Adventures",
      description:
        "Himalayan Treks, Domestic & International Adventures, Live Ground Radar",
      publisher: {
        "@id": "https://kradind.com/#organization",
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
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <meta name="google-site-verification" content="T3Scitqdc9Jqk5rp2LCXSF-69t8Q-zpZlgql9ZjxpGI" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        {/* Preconnect to external image CDN for fast mobile LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/* Global JSON-LD Schema (Organization & WebSite with SearchAction) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData),
          }}
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased font-sans relative">
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
      </body>
    </html>
  );
}
