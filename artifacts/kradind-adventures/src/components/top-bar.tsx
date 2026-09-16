"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PhoneCall, ShieldCheck, Sparkles, BookOpen, Hotel, Info, MessageSquare } from "lucide-react";

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
      {/* Left: Support & Trust Badges */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <a
          href={`tel:${supportPhone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center gap-1.5 hover:text-emerald-300 transition whitespace-nowrap text-[11px] sm:text-xs"
          title="Direct Ground Support Desk"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="truncate">
            24/7 Support: <strong className="text-white font-bold">{supportPhone}</strong>
          </span>
        </a>
        <span className="hidden lg:inline text-white/20">|</span>
        <span className="hidden lg:inline text-slate-300 text-[11px]">{lntText}</span>
      </div>

      {/* Right: Secondary Links & Utility */}
      <div className="flex items-center space-x-3 sm:space-x-5 shrink-0 text-[11px] sm:text-xs">
        {/* Desktop Utility Nav Links */}
        <nav className="hidden md:flex items-center space-x-4 text-slate-300">
          <Link
            href="/travel-services"
            className="hover:text-emerald-300 transition whitespace-nowrap font-medium flex items-center gap-1"
          >
            <span>Travel Services</span>
          </Link>
          <span className="text-white/20">•</span>
          <Link
            href="/blog"
            className="hover:text-emerald-300 transition whitespace-nowrap font-medium flex items-center gap-1"
          >
            <span>Travel Blog</span>
          </Link>
          <span className="text-white/20">•</span>
          <Link
            href="/about-us"
            className="hover:text-emerald-300 transition whitespace-nowrap font-medium flex items-center gap-1"
          >
            <span>About Us</span>
          </Link>
          <span className="text-white/20">•</span>
          <Link
            href="/contact-us"
            className="hover:text-emerald-300 transition whitespace-nowrap font-medium flex items-center gap-1"
          >
            <span>Contact Us</span>
          </Link>
        </nav>

        {/* Currency Selector */}
        <div className="text-slate-400 flex items-center gap-1 border-l border-white/10 pl-3">
          <button
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            className="text-white font-bold hover:bg-white/20 bg-white/10 px-2 py-0.5 rounded text-[10px] sm:text-xs transition"
            title="Switch Currency"
          >
            {currency === "INR" ? "₹ INR" : "$ USD"}
          </button>
        </div>
      </div>
    </div>
  );
}
