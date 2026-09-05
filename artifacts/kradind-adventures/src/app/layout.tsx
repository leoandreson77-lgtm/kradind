import type { Metadata } from "next";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kradind.com"),
  title: "KRADIND | Treks, Domestic & International Adventures",
  description:
    "Explore handpicked Himalayan treks, tropical road trips, live trail radar updates, and international backpacking circuits with KRADIND Adventures.",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased font-sans relative">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
