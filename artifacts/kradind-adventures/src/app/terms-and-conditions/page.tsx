import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Terms & Conditions | KRADIND Adventures & KRAD Global",
  description:
    "Official Terms and Conditions governing tour bookings, expeditions, payments, and travel services with KRAD Global and KRADIND Adventures.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | KRADIND Adventures",
    description: "Official travel booking terms & conditions for KRADIND Adventures.",
    url: "https://kradind.com/terms-and-conditions",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading terms...</div>}>
      <LegalPoliciesView defaultTab="terms" />
    </Suspense>
  );
}
