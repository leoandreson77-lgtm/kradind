import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | KRADIND Adventures & KRAD Global",
  description:
    "Official Cancellation and Refund Policy of KRAD Global and KRADIND Adventures (www.kradind.com). Clear terms regarding Himalayan trek cancellations, tour refunds, and supplier policies.",
  alternates: {
    canonical: "/cancellation-and-refund-policy",
  },
  openGraph: {
    title: "Cancellation & Refund Policy | KRADIND Adventures",
    description:
      "Official Cancellation & Refund Policy of KRADIND Adventures. Transparent cancellation slabs, refund schedules, and supplier terms.",
    url: "https://kradind.com/cancellation-and-refund-policy",
    type: "website",
  },
};

export default function CancellationAndRefundPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="cancellation" />
    </Suspense>
  );
}
