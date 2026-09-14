import { Metadata } from "next";
import { Suspense } from "react";
import { LegalPoliciesView } from "@/components/legal-policies-view";

export const metadata: Metadata = {
  title: "Editorial & Safety Policy | KRADIND Adventures",
  description:
    "Official Editorial, Fact-Checking, and Wilderness Safety Standards of KRADIND Adventures. Learn how our certified mountaineers verify itineraries and trail radar.",
  alternates: {
    canonical: "/editorial-policy",
  },
  openGraph: {
    title: "Editorial & Safety Policy | KRADIND Adventures",
    description:
      "Official Editorial and Trail Safety Standards of KRADIND Adventures. Fact-checked by certified NIM/HMI mountaineering expedition directors.",
    url: "https://kradind.com/editorial-policy",
    type: "website",
  },
};

export default function EditorialPolicyPage() {
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
