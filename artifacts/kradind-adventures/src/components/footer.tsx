"use client";

import React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-12 pb-8 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-3">
          <Image
            src="/logo-emblem.png"
            alt="KRADIND"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base text-white brand-font leading-tight">
              KRAD<span className="text-emerald-400">IND</span>
            </span>
            <span className="text-[9px] tracking-[0.2em] font-semibold text-slate-400 uppercase">
              Explore ▲ Trek ▲ Travel
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-center sm:text-right">
          © 2026 KRADIND Pvt Ltd. Leading Certified Treks & Global Expeditions.
        </p>

      </div>
    </footer>
  );
}
