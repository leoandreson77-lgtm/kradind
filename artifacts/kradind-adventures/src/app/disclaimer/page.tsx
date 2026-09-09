import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Website & Travel Disclaimer | KRADIND Adventures",
  description:
    "Official Website & International Travel Disclaimer of KRAD Global and KRADIND Adventures (www.kradind.com). Information accuracy, travel risks, and visa disclosures.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading disclaimer...</div>}>
      <LegalPoliciesView defaultTab="disclaimer" />
    </Suspense>
  );
}
