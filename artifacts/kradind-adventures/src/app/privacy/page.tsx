import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Privacy Policy | KRADIND Adventures",
  description: "Official Privacy Policy of KRADIND Adventures & KRAD Global.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyAliasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="privacy" />
    </Suspense>
  );
}
