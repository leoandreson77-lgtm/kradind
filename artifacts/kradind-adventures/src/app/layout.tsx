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
