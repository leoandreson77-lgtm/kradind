import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Himalayan Treks & Domestic Tour Packages | KRADIND",
  description:
    "Discover certified Himalayan treks, high-altitude alpine expeditions, and domestic itineraries in Uttarakhand, Himachal, Ladakh, Rajasthan, and Kashmir.",
  alternates: {
    canonical: "/treks",
  },
  openGraph: {
    title: "Explore Himalayan Treks & Domestic Tour Packages | KRADIND",
    description:
      "Discover certified Himalayan treks, high-altitude alpine expeditions, and domestic itineraries in Uttarakhand, Himachal, Ladakh, Rajasthan, and Kashmir.",
    url: "https://kradind.com/treks",
    type: "website",
  },
};

export default function TreksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
