"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CloudRain, Check } from "lucide-react";

export function MonsoonSpecials({
  onClaimCoupon,
  config,
}: {
  onClaimCoupon?: (code: string) => void;
  config?: { enabled?: boolean; title?: string; promoCode?: string; discountPercent?: number };
}) {
  const [copied, setCopied] = useState(false);

  if (config && config.enabled === false) {
    return null;
  }

  const title = config?.title || "Monsoon Specials & Lush Valley Escapes";
  const promoCode = config?.promoCode || "MONSOON2026";
  const discountPercent = config?.discountPercent || 20;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onClaimCoupon) onClaimCoupon(promoCode);
  };

  return (
    <section className="bg-[#0b241d] text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Promo Box */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <span className="text-emerald-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-emerald-400" /> Seasonal Wilderness Exclusives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 brand-font">
              {title}
            </h2>
          </div>

          <button
            onClick={handleCopyCode}
            className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs text-emerald-200 transition text-left sm:text-right cursor-pointer"
          >
            Use Promo:{" "}
            <strong className="text-white font-mono bg-emerald-800/80 px-2 py-0.5 rounded">
              {promoCode}
            </strong>{" "}
            {copied ? (
              <span className="text-emerald-400 font-bold ml-1 inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 inline" /> Copied!
              </span>
            ) : (
              `for ${discountPercent}% Instant OFF`
            )}
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Meghalaya */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-500/40 transition group">
            <div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                Waterfall Paradise
              </span>
              <h3 className="text-base font-bold mt-2 group-hover:text-emerald-300 transition">
                Meghalaya Abode of Clouds Tour
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Living root bridges, roaring Cherrapunji falls, and crystal-clear Umngot waters.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 line-through">₹21,499</span>
                <span className="text-base font-extrabold text-emerald-300 ml-1">₹16,999</span>
              </div>
              <Link
                href="/treks/meghalaya-tour-package"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow"
              >
                Claim Offer
              </Link>
            </div>
          </div>

          {/* Card 2: Hampta Pass */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-500/40 transition group">
            <div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                Rain-Shadow Crossover
              </span>
              <h3 className="text-base font-bold mt-2 group-hover:text-emerald-300 transition">
                Hampta Pass Crossover Trek
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Dramatic transition from green Kullu meadows into the high barren valleys of Spiti.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 line-through">₹12,999</span>
                <span className="text-base font-extrabold text-emerald-300 ml-1">₹9,999</span>
              </div>
              <Link
                href="/treks/hampta-pass"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow"
              >
                Claim Offer
              </Link>
            </div>
          </div>

          {/* Card 3: Kerala */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-emerald-500/40 transition group">
            <div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                Tea Hills & Backwaters
              </span>
              <h3 className="text-base font-bold mt-2 group-hover:text-emerald-300 transition">
                Kerala Backwaters & Hills Tour
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Misty tea hills of Munnar, spice hills of Thekkady, and private Alleppey houseboat.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 line-through">₹23,999</span>
                <span className="text-base font-extrabold text-emerald-300 ml-1">₹18,499</span>
              </div>
              <Link
                href="/treks/kerala-tour-package"
                className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow"
              >
                Claim Offer
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
