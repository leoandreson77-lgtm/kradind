import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | KRADIND Adventures",
  description:
    "Official Cancellation and Refund Policy of KRAD Global and KRADIND Adventures. Clear terms regarding trip cancellations, refunds, and supplier policies.",
  alternates: {
    canonical: "/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="cancellation" />
    </Suspense>
  );
}
