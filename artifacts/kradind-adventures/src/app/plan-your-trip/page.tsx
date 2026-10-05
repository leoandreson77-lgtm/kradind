"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PlanYourTripPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/booking?mode=custom");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
        <svg className="animate-spin h-6 w-6 text-[#FF6B35]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <span>Redirecting to Booking Portal (/booking)...</span>
      </div>
    </div>
  );
}
