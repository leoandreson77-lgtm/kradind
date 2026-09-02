import type { Metadata } from "next";
import "./globals.css";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export const metadata: Metadata = {
  title: "KRADIND | Treks, Domestic & International Adventures",
  description:
    "Explore handpicked Himalayan treks, tropical road trips, live trail radar updates, and international backpacking circuits with KRADIND Adventures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
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
