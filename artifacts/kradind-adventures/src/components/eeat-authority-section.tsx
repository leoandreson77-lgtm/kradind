"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Award,
  Calendar,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Compass,
  HeartHandshake,
  Activity,
  FileCheck,
} from "lucide-react";

export function EEATAuthoritySection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does KRADIND Adventures verify high-altitude trail safety and weather?",
      a: "Our certified expedition leaders maintain direct VHF radio and satellite communication with base camps across Uttarakhand, Himachal Pradesh, and Ladakh. Every 24 hours, our ground coordinators inspect ridge stability, avalanche risks, and fresh snow levels before batch movements. When conditions change, updates are posted immediately to our Live Ground Radar.",
    },
    {
      q: "What medical and safety equipment is carried on Himalayan treks?",
      a: "Every departure carries high-altitude medical oxygen cylinders, pulse oximeters, automated first-aid trauma kits, and Gamow hyperbaric emergency protocols. All expedition directors are graduates of the Nehru Institute of Mountaineering (NIM) and hold Wilderness First Aid (WFA) certification to manage Acute Mountain Sickness (AMS) and high-altitude emergencies.",
    },
    {
      q: "What is your batch size policy and Leave No Trace (LNT) standard?",
      a: "We operate with a strict cap of 15 trekkers per batch to preserve trail silence, minimize alpine degradation, and provide 1:5 guide-to-trekker safety ratios. Under our Leave No Trace protocol, our teams collect and pack back all non-biodegradable waste from camps and mountain ridges for certified recycling in Dehradun.",
    },
    {
      q: "Why choose KRAD Global as your tour and travel company in Dehradun?",
      a: "KRAD Global is a trusted Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, Himalayan treks, and complete travel planning. We provide local Himalayan expertise, verified accommodations, licensed wilderness leaders, and 24/7 ground assistance.",
    },
    {
      q: "How can beginner trekkers prepare for their first Himalayan summit?",
      a: "We recommend four to six weeks of cardiovascular conditioning, including stair climbing, brisk walking, and core strengthening. Our trek desk provides customized training guides, gear rental checklists, and personalized consultations to ensure you have the correct footwear, layered clothing, and physical stamina before your departure.",
    },
  ];

  return (
    <section className="bg-white border-t border-b border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 1. Author Byline & Expedition Leadership Authority */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0F3A2E] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            {/* Author Profile */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-lg bg-emerald-950 shrink-0">
                <Image
                  src="/logo-emblem.png"
                  alt="KRAD Global tour and travel company logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Expedition Authority &amp; Curation
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-300">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>Last Reviewed: </span>
                    <time dateTime="2026-09-14" className="text-white font-bold">14 September 2026</time>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Curated by KRADIND Expedition Team
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Chief Expedition Directorate • Nehru Institute of Mountaineering (NIM) Certified Leaders • WFA Certified
                </p>

                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed pt-1">
                  Leading certified high-altitude alpine expeditions across Garhwal, Himachal, and Ladakh with over a decade of technical mountain terrain leadership and comprehensive mountain weather monitoring.
                </p>
              </div>
            </div>

            {/* Quick Badges & Editorial Policy Link */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/editorial-policy"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md"
              >
                <FileCheck className="w-4 h-4" />
                <span>Read Our Editorial &amp; Safety Policy</span>
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fact-Checked &amp; NIM/HMI Audited</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Trust Signals, Certifications & Safety Protocol */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F3A2E] flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">4.9 / 5 Verified Rating</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consistently rated top-tier by over 2,480+ trekkers across India for certified safety, authentic trail guidance, and hygienic summit camps.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-700" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Wilderness First Aid (WFA)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All guides undergo rigorous Wilderness First Aid training, carry dedicated oxygen canisters, pulse oximeters, and adhere to strict AMS protocols.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-amber-700" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Leave No Trace (LNT)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              We operate small-batch departures under strict LNT eco-principles, keeping alpine bugyals, high passes, and pristine water streams plastic-free.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Compass className="w-5 h-5 text-purple-700" />
              </div>
              <Image
                src="/logo-horizontal.png"
                alt="Dehradun travel and tour services by KRAD Global"
                width={120}
                height={30}
                className="h-6 w-auto object-contain opacity-80"
              />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Tour &amp; Travel Company in Dehradun</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              KRAD Global is headquartered in Dehradun, Uttarakhand, providing domestic and international tour packages, customized holidays, treks, and Dehradun travel and tour services.
            </p>
          </div>
        </div>

        {/* 3. Narrative Expedition Guide & High-Value Trekker FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B35]">
              Wilderness Knowledge Base
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight brand-font">
              Himalayan Expeditions &amp; Trail Readiness
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Planning your high-altitude trek requires thorough understanding of elevation gains, weather windows, acclimatization, and local trail regulations. Here are essential insights verified by our expedition desk.
            </p>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3A2E] hover:text-[#FF6B35] transition"
              >
                <span>Learn more about KRADIND Adventures story</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Accordion FAQs */}
          <div className="lg:col-span-2 space-y-3">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-[#0F3A2E] transition cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item.q}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
