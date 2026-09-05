import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Expeditions Team & 24/7 Helpline | KRADIND Adventures",
  description:
    "Connect with KRADIND Adventures 24/7 helpline for trail updates, custom departure planning, private batches, and emergency expedition support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Expeditions Team & 24/7 Helpline | KRADIND Adventures",
    description:
      "Connect with KRADIND Adventures 24/7 helpline for trail updates, custom departure planning, private batches, and emergency expedition support.",
    url: "https://kradind.com/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
