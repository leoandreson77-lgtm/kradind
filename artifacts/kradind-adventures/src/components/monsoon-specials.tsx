"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
          <Link
            href="/treks/meghalaya-tour-package"
            className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition group cursor-pointer"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=600&q=80"
                alt="Popular India holiday destination featured by KRAD Global"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={70}
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                Waterfall Paradise
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
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
                <span
                  className="bg-emerald-400 group-hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow inline-block"
                >
                  Claim Offer
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Hampta Pass */}
          <Link
            href="/treks/hampta-pass"
            className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition group cursor-pointer"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <Image
                src="/monsoon-rain.webp"
                alt="Himalayan trekking package by KRAD Global"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={70}
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                Rain-Shadow Crossover
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
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
                <span
                  className="bg-emerald-400 group-hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow inline-block"
                >
                  Claim Offer
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3: Kerala */}
          <Link
            href="/treks/kerala-tour-package"
            className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition group cursor-pointer"
          >
            <div className="relative h-44 w-full overflow-hidden bg-slate-950">
              <Image
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80"
                alt="Customized holiday package by KRAD Global"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={70}
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 bg-emerald-500/90 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase shadow">
                Tea Hills & Backwaters
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                  Kerala Backwaters &amp; Hills Tour
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
                <span
                  className="bg-emerald-400 group-hover:bg-emerald-300 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition shadow inline-block"
                >
                  Claim Offer
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
