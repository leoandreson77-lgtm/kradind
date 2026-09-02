"use client";

import React, { useState } from "react";
import Link from "next/link";

export function TopBar({
  config,
}: {
  config?: { supportPhone?: string; leaveNoTrace?: string };
}) {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const supportPhone = config?.supportPhone || "+91 75002 22141";
  const lntText = config?.leaveNoTrace || "🌱 Leave No Trace Certified Operator";

  return (
    <div className="bg-[#0b241d] text-slate-300 text-xs py-2 px-4 sm:px-8 flex justify-between items-center border-b border-white/10">
      <div className="flex items-center space-x-4">
        <a
          href={`tel:${supportPhone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center gap-1.5 hover:text-emerald-300 transition"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          24/7 Support: <strong className="text-white font-bold">{supportPhone}</strong>
        </a>
        <span className="hidden md:inline text-white/30">|</span>
        <span className="hidden md:inline">{lntText}</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-slate-400">
          Currency:{" "}
          <button
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="text-white font-bold hover:underline ml-1"
          >
            {currency === "INR" ? "INR (₹)" : "USD ($)"}
          </button>
        </div>
        <Link href="#live-radar" className="hover:text-emerald-300 transition">
          Live Trail Status
        </Link>
      </div>
    </div>
  );
}
