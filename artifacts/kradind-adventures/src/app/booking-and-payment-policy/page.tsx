import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Booking & Payment Policy | KRADIND Adventures & KRAD Global",
  description:
    "Official Booking and Payment Policy of KRAD Global and KRADIND Adventures (www.kradind.com). Secure booking procedures, payment schedules, and anti-fraud advisories.",
  alternates: {
    canonical: "/booking-and-payment-policy",
  },
  openGraph: {
    title: "Booking & Payment Policy | KRADIND Adventures",
    description:
      "Official Booking and Payment Policy of KRAD Global and KRADIND Adventures. Secure checkout, authorized payment channels, and consumer protection.",
    url: "https://kradind.com/booking-and-payment-policy",
    type: "website",
  },
};

export default function BookingAndPaymentPolicyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading policy...</div>}>
      <LegalPoliciesView defaultTab="booking" />
    </Suspense>
  );
}
