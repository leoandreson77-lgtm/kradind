"use client";

import React, { Suspense } from "react";
import { TreksContent } from "@/components/treks-catalog";

export default function TreksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
          Loading catalog...
        </div>
      }
    >
      <TreksContent />
    </Suspense>
  );
}
