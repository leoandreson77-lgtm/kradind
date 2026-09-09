import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Terms & Conditions | KRADIND Adventures",
  description: "Official travel booking terms & conditions for KRADIND Adventures.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsAliasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading terms...</div>}>
      <LegalPoliciesView defaultTab="terms" />
    </Suspense>
  );
}
