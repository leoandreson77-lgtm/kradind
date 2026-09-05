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
          message: `Landing Page Campaign: ${data?.page.title} | Travelers: ${leadTravelers} | Note: ${leadMessage || "None"}`,
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
    notFound();
  }

  const { page, featuredTreks } = data;
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

      {/* 1. HERO EXPEDITION SECTION */}
      {sections.hero && (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background image & deep gradients */}
          <div className="absolute inset-0 z-0">
            <Image
              src={page.heroImage}
              alt={page.title}
              fill
              priority
              className="object-cover object-center transform scale-105 animate-pulse duration-[10000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/30 via-transparent to-black/80" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
            {/* Top Badge */}
            {page.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg shadow-emerald-950/50">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>{page.badge}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-md">
              {page.title}
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
              {page.subtitle}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <a
                href="#lead-form"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/50 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>{page.leadFormConfig?.ctaText || "Claim Early Bird Offer"}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm sm:text-base rounded-2xl backdrop-blur-md transition flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="w-5 h-5 text-emerald-400" />
                <span>Chat with Expedition Leader</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                NIM/HMI Certified Leaders
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Medical Oxygen & Oximeters
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Small Safe Batches (Max 14)
              </span>
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
                  Apply coupon on checkout or mention when inquiring
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(page.promoOffer?.code || "WINTER2026")}
                className="flex items-center gap-2 bg-slate-950/70 hover:bg-slate-950 border border-emerald-400/40 text-emerald-300 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold transition"
              >
                <span>{page.promoOffer.code}</span>
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Countdown clock boxes */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-center">
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl min-w-[58px]">
                <span className="block text-lg sm:text-xl font-extrabold text-white font-mono">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Days</span>
              </div>
              <span className="text-emerald-400 font-bold text-lg">:</span>
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl min-w-[58px]">
                <span className="block text-lg sm:text-xl font-extrabold text-white font-mono">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Hours</span>
              </div>
              <span className="text-emerald-400 font-bold text-lg">:</span>
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl min-w-[58px]">
                <span className="block text-lg sm:text-xl font-extrabold text-white font-mono">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Mins</span>
              </div>
              <span className="text-emerald-400 font-bold text-lg">:</span>
              <div className="bg-slate-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-xl min-w-[58px]">
                <span className="block text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Secs</span>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. KEY EXPEDITION HIGHLIGHTS GRID */}
      {sections.highlights && page.highlights?.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Why This Expedition
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered For The Unforgettable
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              From high-altitude safety protocols to gourmet mountain feasts, every detail is handled with precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.highlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {getHighlightIcon(item.icon)}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED EXPEDITION PACKAGES & BATCHES */}
      {sections.treks && featuredTreks && featuredTreks.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Curated Departures
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Trek Packages
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Select your departure dates and reserve your slot before batches fill up.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTreks.map((trek) => (
              <div
                key={trek.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/60 transition shadow-xl group flex flex-col justify-between"
              >
                <div>
                  {/* Trek Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={trek.image}
                      alt={trek.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>{trek.location}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white/90 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {trek.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                        {trek.altitude}
                      </span>
                    </div>
                  </div>

                  {/* Trek Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                      {trek.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {trek.tagline}
                    </p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Starting from</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-extrabold text-white">
                            ₹{trek.price?.toLocaleString()}
                          </span>
                          {trek.originalPrice && (
                            <span className="text-xs text-slate-500 line-through">
                              ₹{trek.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {trek.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      setSelectedTrekName(trek.name);
                      setBookingOpen(true);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-md"
                  >
                    Reserve Dates & Batches
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. INCLUSIONS & GEAR COVERED */}
      {sections.inclusions && page.inclusions?.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                100% Transparent Package
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                What’s Included in This Expedition
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {page.inclusions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {page.exclusions && page.exclusions.length > 0 && (
              <div className="pt-6 border-t border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Not Included
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-500">
                  {page.exclusions.map((ex, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 6. INSTANT LEAD CAPTURE & DOSSIER FORM */}
      {sections.leadForm && (
        <section id="lead-form" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden">
            
            {/* Glow accent */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-3 mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Instant Priority Access
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {page.leadFormConfig?.title || "Get Custom Itinerary & Free Quote"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                {page.leadFormConfig?.subtitle || "Speak with our Senior Expedition Leader within 15 minutes."}
              </p>
            </div>

            {leadSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/50 p-8 rounded-2xl text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Our Himalayan expedition desk will call or WhatsApp you at{" "}
                  <strong className="text-emerald-400">{leadPhone}</strong> with available batch dates and discount quotation.
                </p>
                <div className="pt-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-lg"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    <span>Chat Instantly on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl px-4 py-3 text-sm transition outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl px-4 py-3 text-sm transition outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl px-4 py-3 text-sm transition outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Number of Trekkers
                    </label>
                    <select
                      value={leadTravelers}
                      onChange={(e) => setLeadTravelers(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl px-4 py-3 text-sm transition outline-none"
                    >
                      <option value="1">1 Solo Trekker</option>
                      <option value="2">2 Trekkers (Couple / Friends)</option>
                      <option value="3-5">3 - 5 Trekkers (Small Group)</option>
                      <option value="6-10">6 - 10 Trekkers (Group Discount)</option>
                      <option value="10+">10+ Trekkers (Corporate / Custom)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Dates or Special Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="e.g. Planning for Diwali week / Need snow gear / Private tent"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white rounded-xl px-4 py-2.5 text-sm transition outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-xl transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {leadSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>{page.leadFormConfig?.ctaText || "Claim My Slot & Get Quote"}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </section>
      )}

      {/* 7. ADVENTURER TESTIMONIALS */}
      {sections.testimonials && page.testimonials && page.testimonials.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
              Verified Trekkers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Voices From The Trail
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
          <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Exclusive Campaign</span>
          <span className="text-xs font-extrabold text-emerald-400">
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

          <a
            href="#lead-form"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow whitespace-nowrap"
          >
            Book / Enquire
          </a>
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
