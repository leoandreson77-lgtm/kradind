"use client";

import React from "react";
import Image from "next/image";

export function PrintHeader() {
  return (
    <div className="hidden print:flex print-header items-center justify-between pb-4 mb-5 border-b-2 border-[#0F3A2E]/25 bg-white w-full px-1">
      {/* Official Brand Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="KRADIND Adventures - Official Logo"
          width={220}
          height={70}
          priority
          className="h-14 sm:h-16 w-auto object-contain"
        />
      </div>

      {/* Operator Credentials & Contacts */}
      <div className="text-right text-xs text-slate-700 leading-tight space-y-0.5">
        <strong className="text-[#0F3A2E] text-sm block font-extrabold tracking-tight">
          KRAD Global Travels / KRADIND Adventures
        </strong>
        <span className="block text-slate-500 text-[11px]">
          Govt. Registered Adventure Tour Operator • Uttarakhand, India
        </span>
        <span className="block text-slate-600 text-[11px] font-semibold pt-0.5">
          📞 +91 9797941414 • ✉️ contact@kradind.com • 🌐 www.kradind.com
        </span>
      </div>
    </div>
  );
}

export function PrintFooter() {
  return (
    <div className="hidden print:flex print-footer items-center justify-between pt-4 mt-8 border-t-2 border-slate-200 text-[10px] text-slate-500 w-full px-1">
      <span>© {new Date().getFullYear()} KRAD Global Travels / KRADIND Adventures. All rights reserved.</span>
      <span>Registered Tour Operator • Dehradun, Uttarakhand • +91 9797941414 • www.kradind.com</span>
    </div>
  );
}
