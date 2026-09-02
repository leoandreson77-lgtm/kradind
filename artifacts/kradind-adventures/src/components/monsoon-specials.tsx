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

  const title = config?.title || "Monsoon Specials & Valley Blooms";
  const promoCode = config?.promoCode || "MONSOON2026";
  const discountPercent = config?.discountPercent || 20;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onClaimCoupon) onClaimCoupon(promoCode);
  };

  return (
    <section className="bg-emerald-950 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Promo Box */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <span className="text-teal-300 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <CloudRain className="w-4 h-4" /> Seasonal Wilderness Exclusives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 brand-font">
              {title}
            </h2>
          </div>

          <button
            onClick={handleCopyCode}
            className="bg-teal-900/60 hover:bg-teal-900 border border-teal-500/30 px-4 py-2 rounded-xl text-xs text-teal-200 transition text-left sm:text-right cursor-pointer"
          >
            Use Promo:{" "}
            <strong className="text-white font-mono bg-teal-800/80 px-2 py-0.5 rounded">
              {promoCode}
            </strong>{" "}
            {copied ? (
              <span className="text-emerald-400 font-bold ml-1 flex-inline items-center gap-1">
                <Check className="w-3.5 h-3.5 inline" /> Copied!
              </span>
            ) : (
              `for ${discountPercent}% Instant OFF`
            )}
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-slate-900/80 border border-teal-500/20 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-teal-500/40 transition">
            <div>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-500/30 uppercase">
                Valley in Full Bloom
              </span>
              <h3 className="text-base font-bold mt-2">Valley of Flowers & Hemkund</h3>
              <p className="text-xs text-slate-300 mt-1">
                Walking inside carpeted floral valleys with 500+ alpine varieties.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 line-through">₹12,499</span>
                <span className="text-base font-extrabold text-teal-300 ml-1">₹9,999</span>
              </div>
              <Link
                href="/treks/valley-of-flowers"
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
              >
                Claim Offer
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/80 border border-teal-500/20 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-teal-500/40 transition">
            <div>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-500/30 uppercase">
                Rain-Shadow Circuit
              </span>
              <h3 className="text-base font-bold mt-2">Hampta Pass Crossover</h3>
              <p className="text-xs text-slate-300 mt-1">
                From the lush green forests of Kullu to the moonscapes of Spiti.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 line-through">₹13,999</span>
                <span className="text-base font-extrabold text-teal-300 ml-1">₹11,199</span>
              </div>
              <Link
                href="/treks/hampta-pass"
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
              >
                Claim Offer
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/80 border border-teal-500/20 rounded-2xl overflow-hidden p-5 flex flex-col justify-between hover:border-teal-500/40 transition">
            <div>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-500/30 uppercase">
                High Pass Expedition
              </span>
              <h3 className="text-base font-bold mt-2">Pin Bhaba Pass (16,105 ft)</h3>
              <p className="text-xs text-slate-300 mt-1">
                Dramatic crossover from emerald Bhaba valley into Pin Spiti canyon.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 line-through">₹19,500</span>
                <span className="text-base font-extrabold text-teal-300 ml-1">₹15,600</span>
              </div>
              <Link
                href="/treks/hampta-pass"
                className="bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
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
