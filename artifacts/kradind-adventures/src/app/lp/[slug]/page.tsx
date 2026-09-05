"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import {
  LandingPageData,
  LandingPageHighlight,
  LandingPageFAQ,
  LandingPageTestimonial,
  TrekData,
} from "@/lib/cms-store";
import {
  Mountain,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Copy,
  Check,
  PhoneCall,
  Send,
  ArrowRight,
  Flame,
  Snowflake,
  Compass,
  Users,
  CompassIcon,
  Tag,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function LandingPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [data, setData] = useState<{
    page: LandingPageData;
    featuredTreks: TrekData[];
    otherCampaigns?: LandingPageData[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTrekName, setSelectedTrekName] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedCode, setCopiedCode] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadTravelers, setLeadTravelers] = useState("2");
  const [leadDatePreference, setLeadDatePreference] = useState("");
  const [leadTrekInterest, setLeadTrekInterest] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch(`/api/landing-pages/${slug}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const json = await res.json();
        setData(json);
        if (json.page.featuredTrekSlugs?.length > 0) {
          setLeadTrekInterest(json.page.featuredTrekSlugs[0]);
        }
      } catch (err) {
        console.error("Failed to load landing page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  // Countdown clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      alert("Please provide your name and WhatsApp phone number.");
      return;
    }

    setLeadSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          email: leadEmail || "not-provided@kradind.com",
          trekInterest: leadTrekInterest || data?.page.title,
          message: `Landing Campaign: ${data?.page.title} | Travelers: ${leadTravelers} | Preferred Dates: ${leadDatePreference || "Flexible"} | Note: ${leadMessage || "Direct enquiry"}`,
          source: `Landing Page: /lp/${data?.page.slug}`,
        }),
      });

      if (res.ok) {
        setLeadSuccess(true);
      } else {
        alert("Failed to submit inquiry. Please contact us on WhatsApp directly.");
      }
    } catch {
      alert("Network error. Please WhatsApp us directly.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide text-slate-300">
            Loading Himalayan Expedition...
          </span>
        </div>
      </div>
    );
  }

  if (!data || !data.page) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4 text-center">
        <Mountain className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold">Expedition Not Found</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-md">
          The landing page you are looking for may have expired or been rescheduled.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition"
        >
          Return to Homepage
        </Link>
      </div>
    );
  }

  const { page, featuredTreks, otherCampaigns } = data;
  const sections = page.sectionsEnabled || {
    hero: true,
    countdown: true,
    highlights: true,
    treks: true,
    inclusions: true,
    leadForm: true,
    testimonials: true,
    faqs: true,
  };

  const whatsappHref =
    page.whatsappNumber && page.whatsappNumber !== "917500222141"
      ? `https://wa.me/${page.whatsappNumber}?text=${encodeURIComponent(
          page.whatsappMessage || `Hi KRADIND! I'm interested in the ${page.title} expedition.`
        )}`
      : "https://wa.link/n3u8c0";

  const getHighlightIcon = (iconName?: string) => {
    switch (iconName) {
      case "Snowflake":
        return <Snowflake className="w-6 h-6 text-sky-400" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case "Flame":
        return <Flame className="w-6 h-6 text-amber-400" />;
      case "Compass":
        return <Compass className="w-6 h-6 text-teal-400" />;
      case "Sparkles":
        return <Sparkles className="w-6 h-6 text-purple-400" />;
      default:
        return <Mountain className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <TopBar />
      <Header onBookClick={() => setBookingOpen(true)} />

      {/* 1. HERO EXPEDITION SECTION WITH INTEGRATED ABOVE-THE-FOLD LEAD FORM */}
      {sections.hero && (
        <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden py-12 lg:py-20">
          {/* Background image & deep gradients */}
          <div className="absolute inset-0 z-0">
            <Image
              src={page.heroImage}
              alt={page.title}
              fill
              priority
              quality={80}
              className="object-cover object-center transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/75" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-transparent to-black/90" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Heading, Badges, Summary, Trust points (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Top Badge */}
                {page.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-emerald-950/50">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{page.badge}</span>
                  </div>
                )}

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
                  {page.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                  {page.subtitle}
                </p>

                {/* Trust Points Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>NIM/HMI Certified Guides</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Oxygen & Safety First</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All Meals & Alpine Stays</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Max 15 Trekkers/Batch</span>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>Chat with Expedition Leader</span>
                  </a>

                  <a
                    href="tel:+917500222141"
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-2xl backdrop-blur-md transition flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>24/7 Helpline: +91 7500222141</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Prominent Above-the-fold Lead Inquiry Form (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/40 p-6 sm:p-7 rounded-3xl shadow-2xl shadow-emerald-950/60 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                  {leadSuccess ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      <h3 className="text-xl font-black text-white">Inquiry Received!</h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                        Thank you! Our senior expedition coordinator is preparing your custom dossier and will WhatsApp you shortly.
                      </p>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold shadow hover:brightness-110 transition"
                      >
                        <FaWhatsapp className="w-4 h-4" />
                        <span>Instant WhatsApp Follow-up</span>
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6B35] block">
                          Instant Response • Free Dossier
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-tight mt-0.5">
                          {page.leadFormConfig?.title || "Get Custom Dossier & Quotation"}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {page.leadFormConfig?.subtitle || "Leave your details to receive full itinerary and discounted price breakdown."}
                        </p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Full Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            WhatsApp No. <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            No. of People
                          </label>
                          <select
                            value={leadTravelers}
                            onChange={(e) => setLeadTravelers(e.target.value)}
                            className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="1">1 Person (Solo)</option>
                            <option value="2">2 Persons (Couple/Friends)</option>
                            <option value="3-5">3 - 5 Persons (Small Group)</option>
                            <option value="6+">6+ Persons (Family/Corporate)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Preferred Travel Month / Dates
                        </label>
                        <input
                          type="text"
                          value={leadDatePreference}
                          onChange={(e) => setLeadDatePreference(e.target.value)}
                          placeholder="e.g. May 2026 / 1st Week of Oct"
                          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                      >
                        {leadSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>{page.leadFormConfig?.ctaText || "Claim Offer & Get Dossier"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>100% Privacy • Instant PDF & WhatsApp Itinerary</span>
                      </div>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 2. LIMITED-TIME OFFER & LIVE COUNTDOWN RIBBON */}
      {sections.countdown && page.promoOffer && (
        <section className="bg-gradient-to-r from-emerald-900 via-[#0F3A2E] to-slate-900 border-y border-emerald-500/30 py-6 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Promo text & code */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-extrabold text-xs rounded-full uppercase tracking-wider">
                {page.promoOffer.tag || "LIMITED OFFER"}
              </span>
              <div>
                <p className="text-white font-extrabold text-base sm:text-lg">
                  {page.promoOffer.discountText}
                </p>
                <p className="text-emerald-200 text-xs">
                  Apply coupon on booking to claim early-bird slot benefits.
                </p>
              </div>

              {page.promoOffer.code && (
                <button
                  onClick={() => handleCopyCode(page.promoOffer!.code)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-black/60 border border-emerald-400/40 rounded-xl text-emerald-300 text-xs font-mono font-bold transition"
                  title="Click to copy coupon code"
                >
                  <span>{page.promoOffer.code}</span>
                  {copiedCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 sm:gap-3 text-center">
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-2 rounded-xl min-w-[54px]">
                <span className="text-lg sm:text-2xl font-black text-white font-mono block">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Days
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-xl">:</span>
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-2 rounded-xl min-w-[54px]">
                <span className="text-lg sm:text-2xl font-black text-white font-mono block">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Hours
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-xl">:</span>
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-2 rounded-xl min-w-[54px]">
                <span className="text-lg sm:text-2xl font-black text-white font-mono block">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Mins
                </span>
              </div>
              <span className="text-emerald-400 font-bold text-xl">:</span>
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-2 rounded-xl min-w-[54px]">
                <span className="text-lg sm:text-2xl font-black text-emerald-400 font-mono block">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">
                  Secs
                </span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. EXPEDITION VALUE HIGHLIGHTS */}
      {sections.highlights && page.highlights?.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B35]">
              The KRADIND Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Climbers & Pilgrims Trust KRADIND
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Meticulously planned logistics, certified mountain medical leadership, and chef-cooked high-altitude meals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.highlights.map((hl, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 p-6 rounded-2xl transition duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-emerald-950/40"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition">
                    {getHighlightIcon(hl.icon)}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {hl.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {hl.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED EXPEDITION TREK CARDS */}
      {sections.treks && featuredTreks.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Official Departures
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Featured Trekking Packages & Itineraries
              </h2>
            </div>
            <Link
              href="/treks"
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore All 20+ Departures</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTreks.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition group hover:shadow-2xl hover:shadow-emerald-950/40"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#0F3A2E] text-emerald-300 border border-emerald-500/30">
                      {t.badge || "FEATURED"}
                    </span>

                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-xs font-bold bg-black/60 backdrop-blur-md text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{t.rating || 4.9}</span>
                    </span>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.location}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {t.duration}
                      </span>
                      <span>•</span>
                      <span>{t.altitude}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-400">{t.difficulty}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-emerald-300 transition line-clamp-1">
                      {t.name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {t.tagline || t.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">All Inclusive</span>
                    <span className="text-base sm:text-lg font-extrabold text-emerald-300">
                      ₹{t.price?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTrekName(t.name);
                      setBookingOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition active:scale-95"
                  >
                    Select Batch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. INCLUSIONS & EXCLUSIONS CHECKLIST */}
      {sections.inclusions && page.inclusions?.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B35]">
              Full Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              What Is Included In Your Expedition
            </h2>
            <p className="text-xs text-slate-400">
              No hidden fees, no surprise rental surcharges at basecamp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="bg-slate-900/60 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Included in Every Booking</span>
              </div>
              <ul className="space-y-3">
                {page.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Excluded / Optional Add-ons</span>
              </div>
              <ul className="space-y-3">
                {(page.exclusions || [
                  "Personal porter or mule charges for backpack offloading",
                  "Transportation from home city to base camp (can be arranged on request)",
                  "Personal insurance, meals during transit, and items of personal nature",
                ]).map((exc, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                      —
                    </span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 6. EXPLORE OUR OTHER SIGNATURE EXPEDITIONS & DESTINATIONS */}
      {otherCampaigns && otherCampaigns.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF6B35] bg-[#FF6B35]/10 px-3 py-1 rounded-full border border-[#FF6B35]/30">
              Explore More Destinations
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Other Signature Expeditions & Sacred Yatras
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Discover more hand-crafted Himalayan circuits, sacred Char Dham pilgrimages, and exclusive seasonal departures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCampaigns.map((camp) => (
              <Link
                key={camp.id}
                href={`/lp/${camp.slug}`}
                className="group bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                    <Image
                      src={camp.heroImage}
                      alt={camp.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading="lazy"
                      quality={70}
                      className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#FF6B35] border border-[#FF6B35]/30">
                        {camp.badge || "EXPEDITION"}
                      </span>
                    </div>

                    {camp.promoOffer?.code && (
                      <div className="absolute bottom-2.5 right-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40">
                          {camp.promoOffer.code}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition line-clamp-1">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {camp.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400">
                    {camp.promoOffer?.discountText || "Limited Slots"}
                  </span>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition">
                    <span>Explore Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 7. ADVENTURER TESTIMONIALS */}
      {sections.testimonials && page.testimonials && page.testimonials.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Verified Pilgrims & Trekkers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Voices From The Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4"
              >
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="font-bold text-white block">{t.name}</span>
                    <span className="text-slate-500">{t.city}</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">{t.batch}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. EXPEDITION FAQS ACCORDION */}
      {sections.faqs && page.faqs && page.faqs.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {page.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-white hover:text-emerald-400 transition"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* STICKY BOTTOM MOBILE ACTION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Special Offer</span>
          <span className="text-xs font-extrabold text-emerald-400 line-clamp-1">
            {page.promoOffer?.discountText || "Early Bird Batches Open"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-[#25D366] text-white rounded-xl shadow"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>

          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow whitespace-nowrap"
          >
            Enquire Now
          </button>
        </div>
      </div>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialTrek={selectedTrekName || featuredTreks[0]?.name || "Kedarkantha Summit Trek"}
      />
    </div>
  );
}
