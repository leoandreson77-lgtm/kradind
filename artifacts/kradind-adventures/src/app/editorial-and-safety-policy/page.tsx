import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Editorial & Safety Policy | KRADIND Adventures",
  description:
    "Official Editorial and Safety Policy of KRADIND Adventures (www.kradind.com). Learn how our certified mountaineers verify itineraries and trail radar.",
  alternates: {
    canonical: "/editorial-and-safety-policy",
  },
  openGraph: {
    title: "Editorial & Safety Policy | KRADIND Adventures",
    description:
      "Official Editorial & Safety Policy of KRADIND Adventures. Fact-checked by certified NIM/HMI mountaineering expedition directors.",
    url: "https://kradind.com/editorial-and-safety-policy",
    type: "website",
  },
};

export default function EditorialAndSafetyPolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
          Loading editorial policy...
        </div>
      }
    >
      <LegalPoliciesView defaultTab="editorial" />
    </Suspense>
  );
}
