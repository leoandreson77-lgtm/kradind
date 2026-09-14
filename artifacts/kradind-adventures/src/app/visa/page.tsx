import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Visa & International Travel Policy | KRADIND Adventures",
  description:
    "Official Visa and International Travel Documentation Disclaimer of KRAD Global and KRADIND Adventures (www.kradind.com). Immigration requirements, passport validity, and visa assistance disclosures.",
  alternates: {
    canonical: "/visa-policy",
  },
};

export default function VisaAliasPage() {
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
