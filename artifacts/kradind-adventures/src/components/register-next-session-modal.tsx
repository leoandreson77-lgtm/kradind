"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Mountain,
  Users,
  Send,
  MessageCircle,
  AlertCircle,
  BellRing,
} from "lucide-react";
import { TrekData } from "@/lib/cms-store";

interface RegisterNextSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trek: TrekData | null;
  seasonName?: string;
}

export function RegisterNextSessionModal({
  isOpen,
  onClose,
  trek,
  seasonName = "Upcoming Season",
}: RegisterNextSessionModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredSession, setPreferredSession] = useState("Next Upcoming Batch (Early Bird)");
  const [pax, setPax] = useState("2 Explorers");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !trek) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg("Please fill in your name, phone number, and email.");
      return;
    }

    setLoading(true);
    const generatedId = `REG-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          trekInterest: `${trek.name} (Next Session Registration)`,
          message: `Next Session Registration (${generatedId}): Preferred Window: ${preferredSession} | Group Size: ${pax} | Notes: ${notes.trim() || "None"} | Current Season: ${seasonName}`,
          source: "Seasonal Carousel - Register for Next Session",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit registration");
      }

      // Store locally for client reference
      try {
        const stored = JSON.parse(
          localStorage.getItem("kradind_session_registrations") || "[]"
        );
        stored.unshift({
          id: generatedId,
          trekSlug: trek.slug,
          trekName: trek.name,
          date: new Date().toISOString(),
          preferredSession,
        });
        localStorage.setItem("kradind_session_registrations", JSON.stringify(stored));
      } catch {}

      setRegId(generatedId);
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setErrorMsg("");
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Hi KRADIND! I would like to register for the next session of ${trek.name}. My preference: ${preferredSession}, Group size: ${pax}. Please let me know once dates open!`
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Priority Waitlist Confirmed
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                You&apos;re Registered for Next Session!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Registration Ref <span className="font-mono font-bold text-slate-900">#{regId}</span> for{" "}
                <span className="font-bold text-emerald-900">{trek.name}</span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700">
                <BellRing className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Early-Bird Guarantee:</strong> You will receive batch notifications 48 hours before public booking opens.
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Selected Window:</strong> {preferredSession} ({pax})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={`https://wa.me/919797941414?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Trek Leader on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div>
            {/* Header with Trek Banner */}
            <div className="relative h-32 sm:h-36 bg-slate-900 overflow-hidden">
              <img
                src={trek.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"}
                alt={trek.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-3 left-4 right-14 text-white">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 shadow-xs mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Next Session Pre-Registration</span>
                </span>
                <h3 className="text-sm sm:text-base font-black truncate leading-tight drop-shadow-sm">
                  {trek.name}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {trek.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mountain className="w-3 h-3 text-emerald-400" />
                    {trek.altitude || "Alpine Summit"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {trek.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 leading-snug flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Current window has concluded.</strong> Register your interest below to secure early-bird priority booking with zero deposit as soon as the upcoming session opens.
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F3A2E] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F3A2E] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email Address & Preferred Next Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F3A2E] focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Preferred Session Window
                  </label>
                  <select
                    value={preferredSession}
                    onChange={(e) => setPreferredSession(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0F3A2E] focus:bg-white transition"
                  >
                    <option value="Next Upcoming Batch (Early Bird)">🌟 Next Upcoming Batch (First Priority)</option>
                    <option value="Winter Snow Season (Dec - Feb)">❄️ Winter Snow Season (Dec - Feb)</option>
                    <option value="Spring Blossoms (Mar - Apr)">🌸 Spring Blossoms (Mar - Apr)</option>
                    <option value="Summer High Pass (May - Jun)">☀️ Summer High Pass (May - Jun)</option>
                    <option value="Autumn Clear Skies (Oct - Nov)">🍂 Autumn Window (Oct - Nov)</option>
                    <option value="Flexible / Customized Private Group">🎒 Flexible / Private Custom Dates</option>
                  </select>
                </div>
              </div>

              {/* Group Size (Pax) */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Number of Trekkers (Estimated Group Size)</span>
                  <span className="text-slate-400 font-normal">Can be adjusted later</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Solo (1)", "2 Explorers", "3 - 5 Friends", "6+ Group"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setPax(opt)}
                      className={`py-1.5 px-2 rounded-xl text-center text-[11px] font-bold border transition ${
                        pax === opt
                          ? "bg-[#0F3A2E] text-white border-[#0F3A2E] shadow-2xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Notes or Queries */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Special Notes or Custom Date Request (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Planning a weekend trip, need trekking gear rental, student group..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0F3A2E] focus:bg-white transition"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Registering Priority Spot..." : "Register for Next Session (Zero Deposit)"}</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">
                  🔒 We never spam. You will only receive official early-bird batch announcements for this trek.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
