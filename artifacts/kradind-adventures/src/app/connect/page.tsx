import { Metadata } from "next";
import { readStore } from "@/lib/cms-store";
import { SocialMediaHub, SocialLinksConfig } from "@/components/social-media-hub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Connect With KRADIND Adventures • Official Social Media & QR Directory",
  description:
    "Official KRADIND Adventures directory. Scan QR code to access LinkedIn, Instagram, WhatsApp 24/7, YouTube, and explore Himalayan Expeditions & Tours.",
  openGraph: {
    title: "Connect With KRADIND Adventures • Official Social & QR Directory",
    description:
      "Connect with KRADIND Adventures across LinkedIn, Instagram, WhatsApp, YouTube, and explore Himalayan Expeditions & Tours.",
    url: "https://www.kradind.com/connect",
    siteName: "KRADIND Adventures",
    images: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "KRADIND Adventures Connect & Social Hub",
      },
    ],
  },
};

export default async function ConnectPage() {
  const store = await readStore();
  const contact = store?.homeSections?.contactAndFooter;

  const config: SocialLinksConfig = {
    linkedinUrl: contact?.linkedinUrl || "https://www.linkedin.com/company/krad-india/",
    instagramUrl: contact?.instagramUrl || "https://www.instagram.com/kradglobal/",
    whatsappLink: contact?.whatsappLink || "https://wa.me/919797941414",
    youtubeUrl: contact?.youtubeUrl || "https://www.youtube.com/@kradglobaltravels",
    facebookUrl: contact?.facebookUrl || "https://www.facebook.com/share/189E2RUcH4/",
    whatsappChannelUrl: "https://whatsapp.com/channel/0029Vb8H9BNKmCPWGI94Ro34",
    pinterestUrl: contact?.pinterestUrl || "https://in.pinterest.com/KradGlobalTravels/",
    supportPhone: contact?.supportPhone || "+91 9797941414",
    supportEmail: "Info@kradind.com",
    address: contact?.address || "Hall No. H -04, 410, Pratap Palace, Vasant Vihar, Indra Nagar Colony, Dehradun, Uttarakhand 248001",
  };

  return <SocialMediaHub initialConfig={config} />;
}
