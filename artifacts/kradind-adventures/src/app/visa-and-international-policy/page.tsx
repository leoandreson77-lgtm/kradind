import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Visa & International Policy | KRADIND Adventures & KRAD Global",
  description:
    "Official Visa and International Policy of KRAD Global and KRADIND Adventures (www.kradind.com). Immigration requirements, passport validity, and visa assistance disclosures.",
  alternates: {
    canonical: "/visa-and-international-policy",
  },
  openGraph: {
    title: "Visa & International Policy | KRADIND Adventures",
    description:
      "Official Visa & International Policy of KRAD Global and KRADIND Adventures. Understand visa guidelines, passport validity, and entry requirements.",
    url: "https://kradind.com/visa-and-international-policy",
    type: "website",
  },
};

export default function VisaAndInternationalPolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
          Loading visa policy...
        </div>
      }
    >
      <LegalPoliciesView defaultTab="visa" />
    </Suspense>
  );
}
