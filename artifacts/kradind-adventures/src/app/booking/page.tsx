"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Mountain,
  Compass,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Send,
  Star,
  Tag,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Award,
  ShieldAlert,
  Clock,
  ChevronDown,
} from "lucide-react";
import { TrekData, TrekBatch } from "@/lib/cms-store";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL query params
  const paramTrek = searchParams.get("trek") || "";
  const paramPackage = searchParams.get("package") || "";
  const paramDestination = searchParams.get("destination") || "";
  const paramBatchDate = searchParams.get("date") || searchParams.get("batch") || "";
  const paramTrekkers = parseInt(searchParams.get("trekkers") || "1", 10);
  const paramMode = searchParams.get("mode") || (paramTrek || paramPackage || paramDestination ? "direct" : "direct");

  // Mode: "direct" (Book specific trek/package) vs "custom" (Plan custom trip)
  const [activeTab, setActiveTab] = useState<"direct" | "custom">("direct");

  // Data
  const [allTreks, setAllTreks] = useState<TrekData[]>([]);
  const [loadingTreks, setLoadingTreks] = useState(true);

  // Direct Booking Form State
  const [selectedTrekSlug, setSelectedTrekSlug] = useState<string>("");
  const [selectedBatchDate, setSelectedBatchDate] = useState<string>("");
  const [trekkersCount, setTrekkersCount] = useState<number>(isNaN(paramTrekkers) || paramTrekkers < 1 ? 1 : paramTrekkers);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoAppliedMsg, setPromoAppliedMsg] = useState<string>("");

  // Contact details
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  // Custom Trip Form State
  const [customDestination, setCustomDestination] = useState<string>(paramDestination || "Uttarakhand");
  const [customTravelStyle, setCustomTravelStyle] = useState<string>("Himalayan Trekking");
  const [customDuration, setCustomDuration] = useState<string>("4–6 Days");
  const [customGroupSize, setCustomGroupSize] = useState<string>("Small Group (2–5 People)");
  const [customTravelMonth, setCustomTravelMonth] = useState<string>("Upcoming Month");
  const [customBudget, setCustomBudget] = useState<string>("Comfort Standard");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submittedBooking, setSubmittedBooking] = useState<{
    bookingId: string;
    trekName: string;
    batchDate: string;
    travelers: number;
    totalAmount: number;
    customerName: string;
    phone: string;
    isCustomLead?: boolean;
  } | null>(null);

  // Fetch treks from API
  useEffect(() => {
    async function loadTreks() {
      try {
        const res = await fetch("/api/treks");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAllTreks(data);
          }
        }
      } catch (err) {
        console.error("Failed to load treks list", err);
      } finally {
        setLoadingTreks(false);
      }
    }
    loadTreks();
  }, []);

  // Determine current active trek
  const selectedTrek = useMemo(() => {
    if (!selectedTrekSlug && allTreks.length > 0) {
      // Try finding by query param
      const match = allTreks.find(
        (t) =>
          t.slug.toLowerCase() === paramTrek.toLowerCase() ||
          t.name.toLowerCase() === paramTrek.toLowerCase() ||
          t.slug.toLowerCase() === paramPackage.toLowerCase() ||
          t.name.toLowerCase().includes(paramDestination.toLowerCase())
      );
      return match || allTreks[0];
    }
    return allTreks.find((t) => t.slug === selectedTrekSlug) || allTreks[0] || null;
  }, [allTreks, selectedTrekSlug, paramTrek, paramPackage, paramDestination]);

  // Sync selected trek slug
  useEffect(() => {
    if (selectedTrek && !selectedTrekSlug) {
      setSelectedTrekSlug(selectedTrek.slug);
    }
  }, [selectedTrek, selectedTrekSlug]);

  // Sync batch date
  useEffect(() => {
    if (paramBatchDate) {
      setSelectedBatchDate(paramBatchDate);
    } else if (selectedTrek?.batches && selectedTrek.batches.length > 0) {
      const firstAvailable = selectedTrek.batches.find((b) => (b.status || "").toUpperCase() !== "FULL");
      if (firstAvailable) {
        setSelectedBatchDate(`${firstAvailable.startDate} – ${firstAvailable.endDate}`);
      } else {
        setSelectedBatchDate(`${selectedTrek.batches[0].startDate} – ${selectedTrek.batches[0].endDate}`);
      }
    }
  }, [paramBatchDate, selectedTrek]);

  // Pricing calculations
  const basePrice = selectedTrek ? selectedTrek.price : 8999;
  const subtotal = basePrice * trekkersCount;
  const discountAmount = Math.round(subtotal * promoDiscount);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Apply Promo
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "MONSOON2026" || code === "KRADIND20") {
      setPromoDiscount(0.2);
      setPromoAppliedMsg("Success! 20% discount applied to your expedition.");
    } else if (code === "EARLYBIRD" || code === "HIMALAYAS10") {
      setPromoDiscount(0.1);
      setPromoAppliedMsg("Success! 10% Early Bird discount applied.");
    } else {
      setPromoDiscount(0);
      setPromoAppliedMsg("Invalid code. Use 'MONSOON2026' for 20% OFF.");
    }
  };

  // Submit Direct Booking
  const handleDirectBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMessage("Please fill in your name, contact phone number, and email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          trekSlug: selectedTrek?.slug || selectedTrekSlug || "himalayan-expedition",
          batchDate: selectedBatchDate || "Upcoming Selected Batch",
          trekkersCount,
          promoCode: promoDiscount > 0 ? promoCode : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmittedBooking({
          bookingId: data.id || `KR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          trekName: selectedTrek?.name || data.trekName || "Himalayan Expedition",
          batchDate: selectedBatchDate || "Upcoming Selected Batch",
          travelers: trekkersCount,
          totalAmount,
          customerName: fullName,
          phone,
          isCustomLead: false,
        });
      } else {
        setErrorMessage(data.error || "Failed to confirm booking. Please contact our Dehradun desk directly.");
      }
    } catch {
      setErrorMessage("Network error. Please try again or reach out at +91 9797941414.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Custom Trip Inquiry
  const handleCustomTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMessage("Please fill in your name, contact phone number, and email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone,
          email,
          trekInterest: `${customDestination} - ${customTravelStyle}`,
          source: "Booking Page Customizer",
          message: `[Custom Trip Plan]\nDestination: ${customDestination}\nTravel Style: ${customTravelStyle}\nDuration: ${customDuration}\nGroup Size: ${customGroupSize}\nMonth: ${customTravelMonth}\nBudget: ${customBudget}\nDeparture City: ${city || "Not provided"}\nSpecial Requests: ${specialNotes || "None"}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmittedBooking({
          bookingId: data.id || `LD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          trekName: `${customDestination} (${customTravelStyle})`,
          batchDate: customTravelMonth,
          travelers: parseInt(customGroupSize.replace(/[^0-9]/g, "") || "2", 10) || 2,
          totalAmount: 0,
          customerName: fullName,
          phone,
          isCustomLead: true,
        });
      } else {
        setErrorMessage(data.error || "Failed to submit plan. Please contact our Dehradun desk directly.");
      }
    } catch {
      setErrorMessage("Network error. Please try again or reach out at +91 9797941414.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Title & Breadcrumbs */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0F3A2E] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official KRADIND Booking Portal • Zero Booking Fees</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight brand-font">
            Secure Your Adventure Slot
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Book certified Himalayan treks, scenic domestic holidays, or customize private group expeditions with direct ground operations support from Dehradun.
          </p>

          {/* Mode Switcher Tabs */}
          {!submittedBooking && (
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex bg-slate-200/80 p-1 rounded-2xl shadow-inner border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("direct")}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === "direct"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Mountain className="w-4 h-4 text-emerald-600" />
                  <span>Standard Trek / Tour Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("custom")}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === "custom"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#FF6B35]" />
                  <span>Custom Trip &amp; Group Quote</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* If Submitted: Full Confirmation View */}
        {submittedBooking ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-12 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                {submittedBooking.isCustomLead ? "Inquiry Confirmed" : "Slot Reserved Successfully"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 brand-font">
                Thank You, {submittedBooking.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your reservation reference has been generated and dispatched to our expedition operations team.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Ref ID</span>
                <span className="font-mono font-black text-base text-emerald-800 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  #{submittedBooking.bookingId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Expedition / Trip</span>
                  <span className="font-extrabold text-slate-800">{submittedBooking.trekName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travel Date / Window</span>
                  <span className="font-extrabold text-slate-800">{submittedBooking.batchDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travelers</span>
                  <span className="font-extrabold text-slate-800">{submittedBooking.travelers} Persons</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost</span>
                  <span className="font-black text-emerald-700">
                    {submittedBooking.totalAmount > 0 ? `₹${submittedBooking.totalAmount.toLocaleString("en-IN")}` : "Custom Quote on Request"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/919797941414?text=${encodeURIComponent(
                  `Hi KRADIND, I just booked #${submittedBooking.bookingId} for ${submittedBooking.trekName} (${submittedBooking.travelers} travelers). Please send my itinerary and preparation checklist.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20be5a] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp Desk</span>
              </a>

              <a
                href="tel:+919797941414"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call Ground Desk (+91 9797941414)</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline cursor-pointer"
              >
                Book Another Expedition or Package
              </button>
            </div>
          </div>
        ) : (
          /* Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {activeTab === "direct" ? (
                /* TAB 1: DIRECT EXPEDITION BOOKING */
                <form onSubmit={handleDirectBookingSubmit} className="space-y-6">
                  {/* Step 1: Trek / Tour Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Mountain className="w-4 h-4 text-emerald-600" />
                      <span>1. Select Trek or Tour Package</span>
                    </label>

                    {loadingTreks ? (
                      <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                    ) : (
                      <div className="relative">
                        <select
                          value={selectedTrekSlug}
                          onChange={(e) => {
                            setSelectedTrekSlug(e.target.value);
                            const t = allTreks.find((x) => x.slug === e.target.value);
                            if (t?.batches && t.batches.length > 0) {
                              setSelectedBatchDate(`${t.batches[0].startDate} – ${t.batches[0].endDate}`);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-emerald-600 appearance-none pr-10 cursor-pointer"
                        >
                          {allTreks.map((t) => (
                            <option key={t.id || t.slug} value={t.slug}>
                              {t.name} — ₹{t.price?.toLocaleString("en-IN") || "8,999"} ({t.duration} • {t.altitude || t.location})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Step 2: Date & Batch Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>2. Departure Batch Date</span>
                      </label>
                      {selectedTrek?.batches && selectedTrek.batches.length > 0 ? (
                        <div className="relative">
                          <select
                            value={selectedBatchDate}
                            onChange={(e) => setSelectedBatchDate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 appearance-none pr-8 cursor-pointer"
                          >
                            {selectedTrek.batches.map((b) => (
                              <option
                                key={b.id || b.startDate}
                                value={`${b.startDate} – ${b.endDate}`}
                                disabled={(b.status || "").toUpperCase() === "FULL"}
                              >
                                {b.startDate} – {b.endDate} [{(b.status || "AVBL").toUpperCase()}]
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={selectedBatchDate}
                          onChange={(e) => setSelectedBatchDate(e.target.value)}
                          placeholder="e.g. Oct 15 - Oct 20, 2026 or Flexible"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>3. Number of Trekkers</span>
                      </label>
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setTrekkersCount((prev) => Math.max(1, prev - 1))}
                          className="w-10 py-2.5 text-base font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-black text-xs text-slate-900">
                          {trekkersCount} {trekkersCount === 1 ? "Trekker" : "Trekkers"}
                        </div>
                        <button
                          type="button"
                          onClick={() => setTrekkersCount((prev) => prev + 1)}
                          className="w-10 py-2.5 text-base font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Traveler & Contact Info */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      4. Traveler &amp; Lead Contact Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp / Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">City of Departure (Optional)</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Delhi, Mumbai, Bengaluru"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Special Requests / Rental Gear / Dietary Needs (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Need trekking poles, rental shoes, or Jain meal options..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* Promo Code Strip */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2.5">
                    <Tag className="w-4 h-4 text-amber-600 shrink-0 hidden sm:block" />
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter Promo Code (e.g. MONSOON2026)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                    >
                      Apply Code
                    </button>
                  </div>
                  {promoAppliedMsg && (
                    <p className={`text-xs font-bold ${promoDiscount > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      {promoAppliedMsg}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#f0551d] hover:from-[#e05a26] hover:to-[#df4913] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Reservation...</span>
                    ) : (
                      <>
                        <span>Confirm &amp; Reserve Slot • ₹{totalAmount.toLocaleString("en-IN")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Zero spam guarantee. No payment deducted now — pay post confirmation via UPI/NEFT.
                  </p>
                </form>
              ) : (
                /* TAB 2: CUSTOM TRIP & GROUP QUOTE */
                <form onSubmit={handleCustomTripSubmit} className="space-y-6">
                  {/* Step 1: Destination */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>1. Where would you like to travel?</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Uttarakhand",
                        "Himachal Pradesh",
                        "Kashmir",
                        "Ladakh",
                        "Rajasthan",
                        "Kerala",
                        "Goa",
                        "International / Nepal",
                      ].map((dest) => (
                        <button
                          type="button"
                          key={dest}
                          onClick={() => setCustomDestination(dest)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                            customDestination === dest
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Travel Style */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#FF6B35]" />
                      <span>2. Preferred Travel Style</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Himalayan Trekking",
                        "Family Leisure Vacation",
                        "Road Trip & 4x4 Safari",
                        "Weekend Camping Escape",
                        "Romantic Honeymoon",
                        "Corporate / College Group",
                      ].map((style) => (
                        <button
                          type="button"
                          key={style}
                          onClick={() => setCustomTravelStyle(style)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                            customTravelStyle === style
                              ? "bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Duration & Group Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Duration</label>
                      <select
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="2–3 Days (Weekend)">2–3 Days (Weekend)</option>
                        <option value="4–6 Days (Standard)">4–6 Days (Standard)</option>
                        <option value="7–9 Days (Extended)">7–9 Days (Extended)</option>
                        <option value="10+ Days (Grand Circuit)">10+ Days (Grand Circuit)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Group Size</label>
                      <select
                        value={customGroupSize}
                        onChange={(e) => setCustomGroupSize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Solo (1 Person)">Solo (1 Person)</option>
                        <option value="Couple (2 People)">Couple (2 People)</option>
                        <option value="Small Group (3–5 People)">Small Group (3–5 People)</option>
                        <option value="Large Group (6–15 People)">Large Group (6–15 People)</option>
                        <option value="Corporate / College (15+ People)">Corporate / College (15+ People)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Tentative Timing</label>
                      <select
                        value={customTravelMonth}
                        onChange={(e) => setCustomTravelMonth(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Upcoming 2 Weeks">Upcoming 2 Weeks</option>
                        <option value="Upcoming Month">Upcoming Month</option>
                        <option value="Next 2–3 Months">Next 2–3 Months</option>
                        <option value="Later / Exploring">Later / Exploring</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 4: Contact details */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      3. Where should we send your custom itinerary?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Priya Nair"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. priya@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Departure City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Bengaluru, Pune"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Any specific preferences or sights you want included?
                      </label>
                      <textarea
                        rows={3}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Tell us about sightseeing wishes, hotel star rating, vehicle type..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Plan...</span>
                    ) : (
                      <>
                        <span>Request Custom Itinerary &amp; Transparent Quote</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Order Summary & Trust Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Sticky Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Order Summary</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Instant Quote
                  </span>
                </div>

                {selectedTrek && (
                  <div className="space-y-3">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900">
                      <img
                        src={selectedTrek.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"}
                        alt={selectedTrek.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-white font-black text-sm line-clamp-1">{selectedTrek.name}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="font-bold text-slate-800">{selectedTrek.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty / Altitude</span>
                        <span className="font-bold text-slate-800">{selectedTrek.difficulty} • {selectedTrek.altitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Rate</span>
                        <span className="font-bold text-slate-800">₹{basePrice.toLocaleString("en-IN")} / person</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travelers</span>
                        <span className="font-bold text-slate-800">{trekkersCount}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Promo Discount ({promoDiscount * 100}%)</span>
                          <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase">Estimated Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-800 brand-font">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">All taxes &amp; permits included</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Certified Mountain Leaders &amp; Wilderness First Responders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Cancellation Fee within 48h of booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct Basecamp Support: +91 9797941414</span>
                  </div>
                </div>

                {/* Need Help Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <span className="text-xs font-black text-slate-900 block">Questions before booking?</span>
                  <p className="text-[11px] text-slate-500">
                    Connect directly with our expedition desk in Dehradun
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <a
                      href="https://wa.me/919797941414?text=Hi%20KRADIND%2C%20I%20have%20questions%20regarding%20booking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+919797941414"
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                      <span>Call Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
            <svg className="animate-spin h-6 w-6 text-[#FF6B35]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading Booking Portal...</span>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
