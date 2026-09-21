import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Booking & Payment Policy | KRADIND Adventures & KRAD Global",
  description:
    "Official Booking and Payment Policy of KRAD Global and KRADIND Adventures. Secure payment process and fraud advisory.",
  alternates: {
    canonical: "/booking-and-payment-policy",
  },
};

export default function BookingAndPaymentAliasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="booking" />
    </Suspense>
  );
}
