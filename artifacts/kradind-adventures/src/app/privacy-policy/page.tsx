import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Privacy Policy | KRADIND Adventures & KRAD Global",
  description:
    "Official Privacy Policy of KRAD Global and KRADIND Adventures (www.kradind.com). Learn how we collect, protect, and handle your travel and personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | KRADIND Adventures & KRAD Global",
    description:
      "Official Privacy Policy of KRAD Global and KRADIND Adventures. Learn how we protect and handle your travel data.",
    url: "https://kradind.com/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="privacy" />
    </Suspense>
  );
}
