import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Website Disclaimer | KRADIND Adventures & KRAD Global",
  description:
    "Official Website Disclaimer of KRAD Global and KRADIND Adventures (www.kradind.com). Information accuracy, travel risks, and liability disclosures.",
  alternates: {
    canonical: "/website-disclaimer",
  },
  openGraph: {
    title: "Website Disclaimer | KRADIND Adventures",
    description:
      "Official Website Disclaimer of KRADIND Adventures and KRAD Global. Important notices regarding itinerary changes, pricing, and travel advisories.",
    url: "https://kradind.com/website-disclaimer",
    type: "website",
  },
};

export default function WebsiteDisclaimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading disclaimer...</div>}>
      <LegalPoliciesView defaultTab="disclaimer" />
    </Suspense>
  );
}
