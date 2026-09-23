"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Printer,
  X,
  Calendar,
  Clock,
  Mountain,
  MapPin,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Phone,
  Mail,
  Globe,
  Share2,
  Download,
  Award,
  Users,
  AlertTriangle,
  FileText,
  Sparkles,
  Check,
  Lock,
  Send,
  MessageCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { TrekData, TrekItineraryDay } from "@/lib/cms-store";

export interface ItineraryPdfProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TrekData | any;
  // Optional sales customizer overrides
  customClientName?: string;
  customPax?: number;
  customPrice?: number;
  customSeason?: string;
  customNotes?: string;
  customDays?: TrekItineraryDay[];
}

export function ItineraryPdfModal({
  isOpen,
  onClose,
  tour,
  customClientName = "Valued Traveler",
  customPax = 2,
  customPrice,
  customSeason = "All Seasons",
  customNotes,
  customDays,
}: ItineraryPdfProps) {
  // If a custom client name was specified by sales/admin, consider it sales mode (no gate needed)
  const isSalesMode = Boolean(customClientName && customClientName !== "Valued Traveler");

  const [clientName, setClientName] = useState(customClientName);
  const [paxCount, setPaxCount] = useState(customPax);
  const [pricePerPerson, setPricePerPerson] = useState<number>(
    customPrice !== undefined ? customPrice : tour?.price || 9999
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Lead / Query Generation Gate State
  const [hasCapturedQuery, setHasCapturedQuery] = useState(isSalesMode);
  const [showQueryGate, setShowQueryGate] = useState(!isSalesMode);

  // Lead Form State
  const [queryName, setQueryName] = useState("");
  const [queryPhone, setQueryPhone] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [queryMonth, setQueryMonth] = useState("Next 1-2 Months");
  const [queryPax, setQueryPax] = useState(customPax || 2);
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccessId, setLeadSuccessId] = useState<string | null>(null);
  const [leadError, setLeadError] = useState("");

  // Check if lead was already captured in localStorage for this browser
  useEffect(() => {
    if (typeof window !== "undefined" && !isSalesMode) {
      const saved = localStorage.getItem("kradind_lead_user");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed?.name) {
            setClientName(parsed.name);
            setQueryName(parsed.name);
            setQueryPhone(parsed.phone || "");
            setQueryEmail(parsed.email || "");
            setHasCapturedQuery(true);
            setShowQueryGate(false);
          }
        } catch {}
      }
    }
  }, [isSalesMode]);

  // Intercept keyboard print shortcuts (Ctrl+P / Cmd+P) if query hasn't been captured
  useEffect(() => {
    if (!isOpen || hasCapturedQuery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        setShowQueryGate(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, hasCapturedQuery]);

  if (!isOpen || !tour) return null;

  const effectiveDays: TrekItineraryDay[] =
    customDays && customDays.length > 0 ? customDays : tour.itinerary || [];
  const totalPrice = pricePerPerson * paxCount;
  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const quoteRefId = `KRAD-${tour.slug ? tour.slug.substring(0, 4).toUpperCase() : "TOUR"}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const handlePrint = () => {
    // If client has not submitted lead query yet, intercept and prompt lead form
    if (!hasCapturedQuery) {
      setShowQueryGate(true);
      return;
    }
    window.print();
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSubmitLeadQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryName.trim() || queryName.trim().length < 2) {
      setLeadError("Please enter your full name.");
      return;
    }
    if (!queryPhone.trim() || queryPhone.trim().length < 8) {
      setLeadError("Please enter a valid 10-digit WhatsApp/phone number.");
      return;
    }
    if (!queryEmail.trim() || !queryEmail.includes("@")) {
      setLeadError("Please provide a valid email address.");
      return;
    }

    setSubmittingLead(true);
    setLeadError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: queryName.trim(),
          email: queryEmail.trim(),
          phone: queryPhone.trim(),
          trekInterest: `${tour.name} (${tour.duration || "Multi-day"})`,
          message: `Query generated before downloading PDF itinerary. Group Size: ${queryPax} travelers. Travel Period: ${queryMonth}. Quoted Rate: ₹${pricePerPerson.toLocaleString("en-IN")}/person (Total: ₹${(pricePerPerson * queryPax).toLocaleString("en-IN")}).`,
          source: `PDF Itinerary Download - ${tour.name}`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const leadId = data.id || `LD-${Math.floor(1000 + Math.random() * 9000)}`;
        setLeadSuccessId(leadId);
        setHasCapturedQuery(true);
        setClientName(queryName.trim());
        setPaxCount(queryPax);

        // Save in localStorage so user isn't prompted again on this device
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "kradind_lead_user",
            JSON.stringify({
              name: queryName.trim(),
              phone: queryPhone.trim(),
              email: queryEmail.trim(),
            })
          );
        }

        // Close lead gate after brief celebration and immediately trigger print
        setTimeout(() => {
          setShowQueryGate(false);
          window.print();
        }, 850);
      } else {
        setLeadError(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch {
      setLeadError("Network connection error. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello KRADIND Adventures! I just submitted an inquiry for "${tour.name}" (${tour.duration}). Please share the official itinerary PDF and best group price on WhatsApp.`
    );
    window.open(`https://wa.me/917500222141?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Printable Styles Injection */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all non-printable elements */
          header,
          footer,
          nav,
          .no-print,
          button,
          .floating-whatsapp,
          aside {
            display: none !important;
          }
          /* Ensure modal backdrop and containers do not block printing */
          .fixed {
            position: static !important;
          }
          .itinerary-pdf-container {
            max-width: 100% !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .page-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 itinerary-pdf-container print:my-0 print:border-none print:shadow-none print:rounded-none">
        {/* Top Control Bar (Screen Only - Hidden When Printing) */}
        <div className="no-print bg-[#0F3A2E] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold block leading-tight">
                Official Client Itinerary & Quotation
              </span>
              <span className="text-[11px] text-emerald-300/80 font-normal">
                Includes Branded Logo, Background Security Watermark & Custom Details
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e05320] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition cursor-pointer"
              title="Copy Tour Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? "Copied!" : "Share"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Customizer Bar for Client Name & Pax (Screen Only) */}
        <div className="no-print bg-emerald-50/80 border-b border-emerald-100 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-semibold">
            <Sparkles className="w-4 h-4 text-[#FF6B35]" />
            <span>Customize Document Details:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Client Name:</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 w-36 sm:w-44 focus:ring-1 focus:ring-[#0F3A2E]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Travellers:</span>
              <input
                type="number"
                min={1}
                max={99}
                value={paxCount}
                onChange={(e) => setPaxCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 w-16 text-center focus:ring-1 focus:ring-[#0F3A2E]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Rate / Pax:</span>
              <input
                type="number"
                step={100}
                value={pricePerPerson}
                onChange={(e) => setPricePerPerson(parseInt(e.target.value) || 0)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 w-24 text-center focus:ring-1 focus:ring-[#0F3A2E]"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE DOCUMENT BODY (A4 READY) */}
        {/* ========================================================================= */}
        <div ref={printAreaRef} className="relative p-6 sm:p-10 text-slate-800 bg-white">
          {/* ===================================================================== */}
          {/* BACKGROUND SECURITY WATERMARK */}
          {/* ===================================================================== */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex flex-col justify-around select-none opacity-[0.045] print:opacity-[0.055]"
          >
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="transform -rotate-25 whitespace-nowrap text-center text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-widest text-[#0F3A2E]"
              >
                KRADIND ADVENTURES • CERTIFIED TOUR OPERATOR • OFFICIAL ITINERARY
              </div>
            ))}
          </div>

          <div className="relative z-10 space-y-7">
            {/* 1. DOCUMENT HEADER WITH OFFICIAL LOGO & CONTACT INFO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-emerald-900/20">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="KRADIND Adventures - Official Logo"
                  width={200}
                  height={65}
                  priority
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>

              {/* Operator Details */}
              <div className="text-left sm:text-right space-y-0.5 text-xs text-slate-600">
                <div className="font-extrabold text-[#0F3A2E] text-sm tracking-tight">
                  KRAD Global Travels / KRADIND Adventures
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Govt. Registered Adventure Tour Operator • Uttarakhand, India
                </div>
                <div className="flex flex-wrap sm:justify-end gap-x-3 gap-y-0.5 text-[11px] pt-1 text-slate-700">
                  <span className="flex items-center gap-1 font-semibold">
                    <Phone className="w-3 h-3 text-emerald-700" /> +91 7500222141
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-700" /> contact@kradind.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-700" /> www.kradind.com
                  </span>
                </div>
              </div>
            </div>

            {/* 2. CLIENT QUOTATION & METADATA BAR */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs page-break-inside-avoid">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Specially Prepared For
                </span>
                <strong className="text-[#0F3A2E] text-sm sm:text-base font-extrabold block truncate">
                  {clientName || "Valued Traveler"}
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Group Size: {paxCount} {paxCount === 1 ? "Person" : "Persons"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tour Reference & Date
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm font-bold block font-mono">
                  {quoteRefId}
                </strong>
                <span className="text-slate-500 text-[11px]">Issued: {issueDate}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Travel Season / Batch
                </span>
                <strong className="text-slate-800 text-xs sm:text-sm font-bold block">
                  {customSeason}
                </strong>
                <span className="text-emerald-700 text-[11px] font-semibold">
                  Valid for 15 Days
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Commercial Quotation
                </span>
                <strong className="text-[#FF6B35] text-base sm:text-lg font-extrabold block">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </strong>
                <span className="text-slate-500 text-[10px]">
                  (₹{pricePerPerson.toLocaleString("en-IN")} / Person all-inclusive)
                </span>
              </div>
            </div>

            {/* 3. TOUR TITLE & EXECUTIVE SUMMARY */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {tour.category || "Himalayan Expedition"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Grade: {tour.difficulty || "Moderate"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {tour.badge || "Verified Route"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3A2E] tracking-tight">
                {tour.name}
              </h1>

              {tour.tagline && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{tour.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* 4. EXPEDITION STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 page-break-inside-avoid">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Duration</span>
                  <strong className="text-xs font-bold text-slate-900">{tour.duration}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Max Altitude</span>
                  <strong className="text-xs font-bold text-slate-900">{tour.altitude}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Region</span>
                  <strong className="text-xs font-bold text-slate-900">{tour.region}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pickup & Drop</span>
                  <strong className="text-xs font-bold text-slate-900 truncate block max-w-[130px]">
                    {tour.pickupPoint || tour.location}
                  </strong>
                </div>
              </div>
            </div>

            {/* Optional Seasonal Custom Notes */}
            {customNotes && (
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 page-break-inside-avoid">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Seasonal Custom Advisory & Inclusions:</strong>
                  <span className="mt-0.5 block leading-relaxed">{customNotes}</span>
                </div>
              </div>
            )}

            {/* 5. DAY BY DAY ITINERARY TABLE */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h2 className="text-sm sm:text-base font-extrabold text-[#0F3A2E] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FF6B35]" />
                  <span>Comprehensive Day-by-Day Expedition Schedule</span>
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {effectiveDays.length} Scheduled Days
                </span>
              </div>

              <div className="space-y-3.5">
                {effectiveDays.map((dayItem: TrekItineraryDay) => (
                  <div
                    key={dayItem.day}
                    className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 page-break-inside-avoid text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-slate-200/60">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0F3A2E] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {dayItem.day}
                        </span>
                        <strong className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {dayItem.title}
                        </strong>
                      </div>

                      {/* Day Stats Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-600 sm:justify-end">
                        {dayItem.distance && (
                          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                            📏 {dayItem.distance}
                          </span>
                        )}
                        {dayItem.altitude && (
                          <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                            🏔️ {dayItem.altitude}
                          </span>
                        )}
                        {dayItem.stay && (
                          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
                            ⛺ {dayItem.stay}
                          </span>
                        )}
                        {dayItem.meal && (
                          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                            🍽️ {dayItem.meal}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-xs">
                      {dayItem.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. INCLUSIONS & EXCLUSIONS 2-COLUMN TABLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 page-break-inside-avoid">
              {/* Inclusions */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 border-b border-emerald-200 pb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Package Inclusions</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  {tour.inclusions && tour.inclusions.length > 0 ? (
                    tour.inclusions.map((inc: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>Certified Expedition Leader & Experienced Local Mountain Guides</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>All meals during expedition (nutritious vegetarian & egg dishes)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>Dome tents, sub-zero sleeping bags & insulated foam mattresses</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>Forest permits, camping fees & environmental entry taxes</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold shrink-0">✓</span>
                        <span>Medical kit, pulse oximeter, and emergency oxygen cylinder</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 border-b border-rose-200 pb-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Package Exclusions</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  {tour.exclusions && tour.exclusions.length > 0 ? (
                    tour.exclusions.map((exc: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>Personal trekking gear (backpack, shoes, thermals, gloves)</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>Personal offloading charges for luggage / mule support</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>Any personal insurance or medical emergency evacuation costs</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>Any expenses arising from unforeseen weather delays or road blocks</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* 7. MANDATORY GEAR CHECKLIST & TERMS */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 page-break-inside-avoid">
              <div className="flex items-center gap-1.5 font-bold text-[#0F3A2E]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Safety Protocol & Packing Essentials Checklist</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Trekking shoes with high ankle support & deep grip, warm down jacket (-5°C rating),
                moisture-wicking base layers, waterproof rain poncho, UV sunglasses (Cat 3/4), personal
                first-aid kit, 2x reusable water bottles, headlamp with fresh batteries, government ID
                original, and medical fitness self-declaration.
              </p>
            </div>

            {/* 8. FOOTER WITH AUTHORIZED SIGNATORY STAMP & CONTACT */}
            <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs page-break-inside-avoid">
              <div className="space-y-1">
                <span className="font-extrabold text-[#0F3A2E] text-xs block">
                  KRADIND ADVENTURES (A Unit of KRAD Global Travels)
                </span>
                <p className="text-[10px] text-slate-500 max-w-md">
                  Official itinerary document generated on {issueDate}. For booking confirmations,
                  slot reservations, or group queries, contact your dedicated trip coordinator.
                </p>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-emerald-800 pt-0.5">
                  <span>Helpline: +91 75002 22141</span>
                  <span>•</span>
                  <span>WhatsApp: +91 75002 22141</span>
                </div>
              </div>

              {/* Authorized Seal */}
              <div className="text-center sm:text-right border-2 border-dashed border-emerald-800/40 rounded-xl p-3 bg-emerald-50/50 min-w-[170px]">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Verification
                </div>
                <div className="font-extrabold text-xs text-[#0F3A2E] mt-0.5">
                  KRADIND ADVENTURES
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">
                  Certified Operator • Dehradun
                </div>
                <div className="text-[8px] text-slate-400 mt-1 font-mono">
                  REF: {quoteRefId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Print Action Bar (Screen Only) */}
        <div className="no-print bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {hasCapturedQuery ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Lead Verified: Prepared for <strong>{clientName}</strong> ({paxCount} Pax)</span>
              </span>
            ) : (
              <span>
                Personalized PDF Itinerary with official logo & security watermark.
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Close Preview
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Itinerary</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEAD / QUERY CAPTURE MODAL (Gated before downloading PDF) */}
      {/* ========================================================================= */}
      {showQueryGate && (
        <div className="no-print fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-[#0F3A2E] to-[#164e3f] text-white p-5 sm:p-6 text-center relative">
              <button
                type="button"
                onClick={() => setShowQueryGate(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 mx-auto mb-3 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>

              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Instant Query & PDF Download</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Download {tour.name} Itinerary
              </h3>
              <p className="text-xs text-emerald-200/80 mt-1 max-w-xs mx-auto">
                Please enter your details to generate your customized quotation & official printable PDF.
              </p>
            </div>

            {/* Lead Form */}
            <form onSubmit={handleSubmitLeadQuery} className="p-5 sm:p-6 space-y-3.5">
              {leadError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{leadError}</span>
                </div>
              )}

              {leadSuccessId && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Query #{leadSuccessId} generated! Preparing your PDF...</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={queryName}
                  onChange={(e) => setQueryName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F3A2E] focus:outline-none transition"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={queryPhone}
                    onChange={(e) => setQueryPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-16 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F3A2E] focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={queryEmail}
                  onChange={(e) => setQueryEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F3A2E] focus:outline-none transition"
                />
              </div>

              {/* Group Size & Travel Period */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. of Travelers
                  </label>
                  <select
                    value={queryPax}
                    onChange={(e) => setQueryPax(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F3A2E] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "Persons"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Travel Period
                  </label>
                  <select
                    value={queryMonth}
                    onChange={(e) => setQueryMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F3A2E] focus:outline-none"
                  >
                    <option value="This Month">This Month</option>
                    <option value="Next Month">Next Month</option>
                    <option value="Upcoming Weekend">Upcoming Weekend</option>
                    <option value="Diwali Holidays">Diwali Holidays</option>
                    <option value="Winter Snow Season">Winter Snow Season</option>
                    <option value="Summer 2026">Summer 2026</option>
                    <option value="Flexible Dates">Flexible Dates</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={submittingLead}
                  className="w-full bg-gradient-to-r from-[#0F3A2E] to-[#164e3f] hover:from-[#164e3f] hover:to-[#0F3A2E] text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {submittingLead ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>Generating Lead Query...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-300" />
                      <span>Submit Query & Download PDF Itinerary</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Privacy • No Spam</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQueryGate(false)}
                    className="text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
                  >
                    Preview Sample First
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
