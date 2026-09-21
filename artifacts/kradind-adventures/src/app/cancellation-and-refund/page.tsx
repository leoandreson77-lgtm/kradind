import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | KRADIND Adventures & KRAD Global",
  description:
    "Official Cancellation and Refund Policy of KRAD Global and KRADIND Adventures. Understand trek and tour cancellation slabs and refund procedures.",
  alternates: {
    canonical: "/cancellation-and-refund-policy",
  },
};

export default function CancellationAndRefundAliasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="cancellation" />
    </Suspense>
  );
}
