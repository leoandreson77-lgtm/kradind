"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Star,
  AlertTriangle,
  Landmark,
  BadgeCheck,
  Shield,
  Stethoscope,
  ExternalLink,
} from "lucide-react";
import { HomeSectionsConfig } from "@/lib/cms-store";
import { FormattedText } from "@/components/formatted-text";

export function EEATAuthoritySection({ config }: { config?: HomeSectionsConfig["eeat"] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const defaultFaqs = [
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
        
        {/* ========================================================================= */}
        {/* 1. AUTHOR EXPERTISE SIGNALS: Verified Bio, Mountain Credentials & Role    */}
        {/* ========================================================================= */}
        <div
          className="author-expertise-card author-bio bg-gradient-to-br from-slate-900 via-[#0B241D] to-[#0F3A2E] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-500/30 relative overflow-hidden"
          itemScope
          itemType="https://schema.org/Person"
          itemProp="author"
        >
          <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            {/* Author Profile Information & Credentials */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
              <div className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400/60 shadow-lg bg-emerald-950 shrink-0">
                <img
                  src="/logo-emblem.webp"
                  alt="KRAD Global & KRADIND Expedition Leadership Directorate"
                  width={112}
                  height={112}
                  loading="lazy"
                  decoding="async"
                  itemProp="image"
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{config?.badge || "Verified Author & Expedition Leader Profile"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-300">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    <span>Editorial Review: </span>
                    <time dateTime="2026-10-15" className="text-white font-bold">
                      {config?.lastReviewed || "15 October 2026"}
                    </time>
                  </span>
                </div>

                {/* Author Name with Schema */}
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight" itemProp="name">
                  {config?.title || "Capt. Rajesh Negi & KRADIND Expedition Leadership Directorate"}
                </h3>
                
                {/* Author Job Title & Affiliation with Schema */}
                <p className="text-xs sm:text-sm text-emerald-300 font-semibold" itemProp="jobTitle">
                  {config?.role || "Chief High-Altitude Expedition Leader • Mountain Safety & Search Directorate • NIM & HMI Certified"}
                </p>

                {/* Author Credentials List */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] sm:text-[11px] font-bold text-slate-200">
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🎓 NIM Advanced Mountaineering Course (Grade 'A')
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🩺 Wilderness First Aid (WFA / CPR) Certified
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🏔️ 60+ High-Altitude Himalayan Summits
                  </span>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    🌱 Leave No Trace (LNT) Master Educator
                  </span>
                </div>

                {/* Author Bio Paragraph with Schema Description */}
                <p className="text-xs sm:text-[13px] text-slate-300 max-w-3xl leading-relaxed pt-1.5" itemProp="description">
                  {config?.description ||
                    "With over 12+ years of Himalayan field leadership, Capt. Rajesh Negi and the KRADIND expedition leadership team personally inspect, verify, and lead high-altitude alpine routes across Uttarakhand, Himachal Pradesh, Ladakh, and Nepal. Having guided over 14,000+ trekkers safely with a verified zero-fatality safety record, our leadership integrates daily VHF mountain weather checks, high-altitude medical protocols, and certified Leave No Trace eco-care into every traveler departure."}
                </p>

                <div className="pt-1">
                  <Link
                    href="/about"
                    rel="author"
                    itemProp="url"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition"
                  >
                    <span>Read Full Expedition Leader Bio, Author Credentials &amp; Safety Record</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Editorial Policy Badge */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href={config?.policyLinkUrl || "/editorial-policy"}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-md"
              >
                <FileCheck className="w-4 h-4" />
                <span>{config?.policyLinkText || "Editorial & Safety Verification Policy"}</span>
              </Link>
              
              <div className="flex items-center justify-center gap-2 text-[11px] text-emerald-300 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{config?.auditBadgeText || "Fact-Checked & NIM/HMI Field Audited"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TRUST SIGNALS & CERTIFICATIONS: Badges, Reviews & Accreditations       */}
        {/* ========================================================================= */}
        <div id="trust-signals" data-testid="trust-signals" className="trust-signals-grid space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FF6B35]">
                Independent Accreditations &amp; Traveler Trust
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 brand-font tracking-tight mt-0.5">
                Official Certifications, Reviews &amp; Safety Seals
              </h3>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
              ✓ Verified Operator Credentials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Trust Badge 1: Verified Customer Reviews */}
            <div
              className="trust-badge p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs hover:shadow-md transition-shadow"
              itemScope
              itemType="https://schema.org/AggregateRating"
              itemProp="aggregateRating"
            >
              <meta itemProp="ratingValue" content="4.9" />
              <meta itemProp="reviewCount" content="2480" />
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="worstRating" content="1" />
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 bg-amber-200/70 text-amber-950 rounded-md">
                  Google &amp; TripAdvisor
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                4.9 / 5.0 Verified Reviews
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rated 4.9 stars by over <strong>2,480+ verified trekkers</strong> for summit safety, transparent pricing, and nutritious high-altitude meals.
              </p>
            </div>

            {/* Trust Badge 2: Govt. Registration & License */}
            <div className="trust-badge p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                  Lic. UT-TRV-2024-914
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Govt. Registered Operator
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Officially licensed by <strong>Uttarakhand Tourism Development Board (UTDB)</strong>, Govt. of Uttarakhand for Himalayan mountaineering operations.
              </p>
            </div>

            {/* Trust Badge 3: Medical Emergency & First Aid */}
            <div className="trust-badge p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-blue-700" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md">
                  Medical Oxygen &amp; Kit
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Wilderness First Aid (WFA)
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Certified high-altitude guides equipped with portable oxygen cylinders, pulse oximeters, trauma kits, and Gamow hyperbaric AMS protocols.
              </p>
            </div>

            {/* Trust Badge 4: ICICI Bank Escrow Deposit & LNT Eco-Care */}
            <div className="trust-badge p-5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-purple-700" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-900 rounded-md">
                  ICICI Escrow Account
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">
                Protected Advance Deposits
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% secure payment through verified corporate ICICI banking with transparent cancellation voucher protections.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. VISIBLE YMYL DISCLAIMERS: Medical, Safety & Commercial Notices          */}
        {/* ========================================================================= */}
        <aside
          className="ymyl-disclaimers-section ymyl-disclaimer bg-amber-50/80 border border-amber-300/90 rounded-3xl p-6 sm:p-8 space-y-5"
          role="complementary"
          aria-label="Official Travel, Medical, and Booking Disclaimers"
        >
          <div className="flex items-center gap-2.5 text-amber-950">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black brand-font text-amber-950 leading-tight">
                Important Travel, Medical &amp; YMYL Safety Disclaimers
              </h3>
              <p className="text-xs text-amber-800">
                Please review these essential health, mountain risk, and booking terms prior to reserving high-altitude treks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1 text-xs text-amber-950">
            {/* YMYL Disclaimer 1: High Altitude Medical */}
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
              <span className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                <span>🩺</span> Medical &amp; Altitude Health Advisory
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                High-altitude Himalayan trekking (8,000 ft to 16,000+ ft) demands vigorous physical stamina and carries inherent physiological risks, including Acute Mountain Sickness (AMS), HAPE, and HACE. Trekkers are strictly advised to consult a certified physician before departure and disclose any pre-existing health conditions. While KRADIND teams carry emergency oxygen and first-aid kits, participation is voluntary and at the traveler's own informed discretion.
              </p>
            </div>

            {/* YMYL Disclaimer 2: Alpine Weather & Force Majeure */}
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
              <span className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                <span>🏔️</span> Weather &amp; Force Majeure Trail Safety
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                Himalayan mountain weather conditions, sudden blizzards, landslides, or state government route closures are beyond operator control. In the interest of participant safety, certified expedition leaders reserve the right to alter route schedules, campsites, or terminate ascents. Alternate safe routes or credit vouchers are provided in accordance with our official booking terms.
              </p>
            </div>

            {/* YMYL Disclaimer 3: Commercial & Booking Terms */}
            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
              <span className="font-extrabold text-amber-900 flex items-center gap-1.5 uppercase text-[11px] tracking-wide">
                <span>💳</span> Booking, Pricing &amp; Legal Terms
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                Tour package rates, seasonal batch dates, and inclusions are subject to official verification. All token deposits and payment transactions are safeguarded under our official Cancellation, Rescheduling &amp; Refund Policy. KRAD Global is a legally registered corporate travel operator headquartered in Dehradun, Uttarakhand.
              </p>
            </div>
          </div>

          {/* Quick Legal Policy Links */}
          <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-amber-950 text-[11px]">
              Official Policy Documentation:
            </span>
            <div className="flex flex-wrap items-center gap-3 font-semibold text-[11px] text-amber-900">
              <Link href="/website-disclaimer" className="hover:underline flex items-center gap-1">
                <span>Website Disclaimer</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </Link>
              <span className="text-amber-300">•</span>
              <Link href="/editorial-and-safety-policy" className="hover:underline flex items-center gap-1">
                <span>Editorial &amp; Safety Policy</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </Link>
              <span className="text-amber-300">•</span>
              <Link href="/cancellation-and-refund-policy" className="hover:underline flex items-center gap-1">
                <span>Cancellation &amp; Refund Terms</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </Link>
              <span className="text-amber-300">•</span>
              <Link href="/booking-and-payment-policy" className="hover:underline flex items-center gap-1">
                <span>Booking &amp; Payment Policy</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </Link>
              <span className="text-amber-300">•</span>
              <Link href="/terms-and-conditions" className="hover:underline flex items-center gap-1">
                <span>Terms &amp; Conditions</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </Link>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* 4. Narrative Expedition Guide & High-Value Trekker FAQs                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-1 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B35]">
              Wilderness Knowledge Base
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight brand-font">
              Himalayan Expeditions &amp; Trail Readiness
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Get ready for your Himalayan trip with clear advice on packing, best seasons, fitness prep, and safety steps from our certified expedition leadership.
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
            {(config?.faqs && config.faqs.length > 0 ? config.faqs : defaultFaqs).map((item, idx) => {
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
                      <FormattedText text={item.a} />
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
