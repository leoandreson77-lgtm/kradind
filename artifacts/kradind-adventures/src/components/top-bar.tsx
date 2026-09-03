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
    <div className="bg-[#0b241d] text-slate-300 text-xs py-2 px-3 sm:px-6 lg:px-8 flex justify-between items-center border-b border-white/10 overflow-hidden">
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <a
          href={`tel:${supportPhone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center gap-1.5 hover:text-emerald-300 transition whitespace-nowrap text-[11px] sm:text-xs"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="truncate">
            24/7 Support: <strong className="text-white font-bold">{supportPhone}</strong>
          </span>
        </a>
        <span className="hidden md:inline text-white/30">|</span>
        <span className="hidden md:inline">{lntText}</span>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 shrink-0 text-[11px] sm:text-xs">
        <div className="text-slate-400">
          <button
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="text-white font-bold hover:underline bg-white/10 px-2 py-0.5 rounded text-[10px] sm:text-xs"
          >
            {currency === "INR" ? "₹ INR" : "$ USD"}
          </button>
        </div>
        <Link href="#live-radar" className="hidden sm:inline hover:text-emerald-300 transition">
          Live Trail Status
        </Link>
      </div>
    </div>
  );
}
