"use client";

import React from "react";
import { MountainSnow } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-12 pb-8 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
          <MountainSnow className="w-5 h-5 text-[#FF6B35]" />
          <span className="font-extrabold text-sm text-white brand-font">
            KRADIND Adventures
          </span>
        </div>

        <p className="text-slate-500 text-center sm:text-right">
          © 2026 KRADIND Pvt Ltd. Leading Certified Treks & Global Expeditions.
        </p>

      </div>
    </footer>
  );
}
