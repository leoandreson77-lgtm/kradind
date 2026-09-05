import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Certified Mountaineers & Wilderness Guides | KRADIND",
  description:
    "Learn about KRADIND Adventures: founded by veteran Himalayan mountaineers and certified wilderness first responders to pioneer safe, eco-conscious alpine expeditions.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Certified Mountaineers & Wilderness Guides | KRADIND",
    description:
      "Learn about KRADIND Adventures: founded by veteran Himalayan mountaineers and certified wilderness first responders to pioneer safe, eco-conscious alpine expeditions.",
    url: "https://kradind.com/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
