import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FormattedText } from "@/components/formatted-text";
import { getLandingPagesAsync, LandingPageData } from "@/lib/cms-store";
import { getImageAlt } from "@/lib/image-alt";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  Users,
  Mountain,
  Flame,
  HelpCircle,
  PhoneCall,
  Search,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Signature Mountain Expeditions & Exclusive Campaigns | KRAD Global",
  description:
    "Explore KRAD Global's signature high-altitude expeditions and limited-slot campaigns. Certified wilderness leaders, chef-crafted meals, safety kits, and exclusive early-bird discounts.",
  keywords: [
    "Himalayan expeditions",
    "signature trek campaigns",
    "limited slot trekking India",
    "Kedarkantha winter summit",
    "Chopta Chandrashila expedition",
    "KRAD Global expeditions",
    "high altitude trekking packages",
  ],
  alternates: {
    canonical: "/lp",
  },
  openGraph: {
    title: "Signature Mountain Expeditions & Exclusive Campaigns | KRAD Global",
    description:
      "Explore KRAD Global's signature high-altitude expeditions and limited-slot campaigns. Certified wilderness leaders, chef-crafted meals, safety kits, and exclusive early-bird discounts.",
    url: "https://kradind.com/lp",
    siteName: "KRAD Global",
    images: [
      {
        url: "/logo.png",
        width: 1475,
        height: 950,
        alt: "KRAD Global Signature Expeditions",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Signature Mountain Expeditions & Exclusive Campaigns | KRAD Global",
    description:
      "Explore KRAD Global's signature high-altitude expeditions and limited-slot campaigns. Certified wilderness leaders, chef-crafted meals, safety kits, and exclusive early-bird discounts.",
    images: ["/logo.png"],
  },
};

export const revalidate = 60;

function getCampaignAlt(camp: LandingPageData) {
  return (
    camp.heroImageAlt ||
    camp.imageAlt ||
    getImageAlt(camp, "trekking") ||
    `${camp.title} Himalayan Expedition`
  );
}

export default async function LandingPagesDirectoryPage() {
  const allLandingPages = await getLandingPagesAsync();
  const publishedPages = (allLandingPages || []).filter(
    (lp) => lp.status === "Published"
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {/* HERO SECTION */}
        <section className="relative py-16 md:py-24 overflow-hidden border-b border-slate-900 bg-radial-[ellipse_at_top,_var(--tw-gradient-stops)] from-emerald-950/40 via-slate-950 to-slate-950">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-extrabold uppercase tracking-widest backdrop-blur-md mb-6 shadow-lg shadow-emerald-950/40">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>LIMITED-CAPACITY EXPEDITIONS &amp; CAMPAIGNS</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto brand-font">
              Signature Summit <span className="text-[#FF6B35]">Campaigns</span> &amp; Early-Bird Departures
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Specialized high-altitude itineraries with strictly capped 15-member batches, certified WFR leaders, automated oxygen backups, and early-bird fee waivers.
            </p>

            {/* Trust Metric Counters */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <span className="block text-2xl sm:text-3xl font-black text-emerald-400">100%</span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Certified Mountain Leaders</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <span className="block text-2xl sm:text-3xl font-black text-[#FF6B35]">Max 15</span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Trekkers Per Summit Batch</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <span className="block text-2xl sm:text-3xl font-black text-sky-400">4-Season</span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Triple-Layer Alpine Tents</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <span className="block text-2xl sm:text-3xl font-black text-amber-400">4.9 ★</span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium">Verified Climber Reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* CAMPAIGNS DIRECTORY GRID */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Active Expeditions ({publishedPages.length})
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select an expedition below to view day-by-day terrain, inclusions, safety equipment, and secure promotional codes.
              </p>
            </div>

            <Link
              href="/treks"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Explore All Regular Treks &amp; Tours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {publishedPages.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-4">
              <Mountain className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No active campaigns at the moment</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Check back shortly or browse our complete Himalayan treks catalog for open departures.
              </p>
              <Link
                href="/treks"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-xl hover:bg-[#164e3f] transition"
              >
                Browse Treks Catalog
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {publishedPages.map((camp) => (
                <article
                  key={camp.id || camp.slug}
                  className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 backdrop-blur-md hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/50 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Container */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                    <img
                      src={camp.heroImage}
                      alt={getCampaignAlt(camp)}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/90 text-slate-950 backdrop-blur-md shadow-md">
                        {camp.badge || "EXCLUSIVE EXPEDITION"}
                      </span>

                      {camp.promoOffer?.tag && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FF6B35] text-white flex items-center gap-1 shadow-md">
                          <Tag className="w-3 h-3" />
                          <span>{camp.promoOffer.tag}</span>
                        </span>
                      )}
                    </div>

                    {/* Promo Offer Overlay Bar */}
                    {camp.promoOffer?.discountText && (
                      <div className="absolute bottom-3 left-4 right-4 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5 truncate">
                          <Flame className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                          <span className="truncate">{camp.promoOffer.discountText}</span>
                        </span>
                        {camp.promoOffer.code && (
                          <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 border border-white/10 shrink-0 ml-2">
                            CODE: {camp.promoOffer.code}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
                        {camp.title}
                      </h3>

                      <div className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                        <FormattedText text={camp.subtitle} />
                      </div>

                      {/* Feature Highlights Pills */}
                      {camp.highlights && camp.highlights.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {camp.highlights.slice(0, 4).map((hl, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/50 border border-slate-800 text-[11px] text-slate-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-semibold truncate">{hl.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/lp/${camp.slug}`}
                        className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-emerald-950/40"
                      >
                        <span>Explore Expedition</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <a
                        href={`https://wa.me/917500222141?text=${encodeURIComponent(
                          `Hi KRADIND! I'm interested in the ${camp.title} signature expedition. Please share available dates and dossier.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition border border-slate-700"
                        title="Chat on WhatsApp"
                      >
                        <FaWhatsapp className="w-4 h-4 text-emerald-400" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 4 CORE PILLARS OF KRADIND EXPEDITIONS */}
        <section className="py-16 bg-slate-900/60 border-t border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Safety First Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Why Experienced Trekkers Choose Our Signature Campaigns
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Wilderness First Aid</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every expedition is led by certified NIM/HMI guides trained in acute mountain sickness (AMS) mitigation and high-altitude emergency protocols.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Chef-Cooked Trail Nutrition</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hot, energizing carbohydrate-balanced meals cooked fresh at campsites with clean filtered water to fuel tough summit pushes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Strictly 15 Trekkers/Batch</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No overcrowding. A 1:5 guide-to-trekker ratio guarantees individual pace monitoring, safety checks, and personalized mountain mentorship.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Mountain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Premium Alpine Gear</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Triple-layer four-season alpine tents, sub-zero down sleeping bags with fresh liners, and heavy-duty crampons and gaiters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM FAQ SECTION */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Signature Expeditions FAQ
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                How do signature campaigns differ from regular treks?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Signature campaigns are premium, limited-batch expeditions designed for maximum safety and comfort. They include smaller batch caps (15 maximum), higher staff ratios, enhanced hot meal menus, oxygen cylinder backups, and early-bird fee reductions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                How do I claim early-bird promotional codes?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Click on any campaign card above to visit the dedicated expedition page. You can copy the active coupon code or submit the instant inquiry form to lock in your discounted rate.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h3 className="font-bold text-white text-sm sm:text-base">
                Can I request custom dates for our group or corporate team?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Yes! We organize private signature batches for corporate leadership programs, college groups, and families. Contact our expedition desk at +91 7500222141 to customize dates and transit.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
