import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Policies & Legal Center | KRADIND Adventures",
  description:
    "Explore all official legal documentation, Privacy Policy, Terms & Conditions, Cancellation terms, and Payment Security policies for KRAD Global.",
  alternates: {
    canonical: "/policies",
  },
};

export default function PoliciesHubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policies...</div>}>
      <LegalPoliciesView defaultTab="privacy" />
    </Suspense>
  );
}
