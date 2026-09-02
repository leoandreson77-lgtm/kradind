"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Calendar, Users, ShieldCheck, Mountain } from "lucide-react";

export function BookingModal({
  isOpen,
  onClose,
  initialTrek,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialTrek?: string;
}) {
  const [trekName, setTrekName] = useState(initialTrek || "Kedarkantha Summit Trek");
  const [batchDate, setBatchDate] = useState("Jun 14 - Jun 18, 2026");
  const [trekkersCount, setTrekkersCount] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMsg, setConfirmationMsg] = useState("");
  const [bookingRefId, setBookingRefId] = useState("");

  if (!isOpen) return null;

  const basePricePerPerson = 8999;
  const discountMultiplier = promoApplied ? 0.8 : 1.0;
  const totalPrice = basePricePerPerson * trekkersCount * discountMultiplier;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "MONSOON2026") {
      setPromoApplied(true);
    } else {
      alert("Invalid Promo Code. Try MONSOON2026 for 20% OFF!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          trekSlug: trekName.toLowerCase().replace(/\s+/g, "-"),
          trekkersCount,
          promoCode,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingRefId(data.id || "");
        setConfirmationMsg(data.message || "");
        setSubmitted(true);
      } else {
        alert(data.error || "Failed to reserve batch. Please check inputs.");
      }
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1.5 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 brand-font">
              Booking Reserved!
            </h3>
            {bookingRefId && (
              <div className="inline-block bg-slate-100 border border-slate-300 text-slate-800 text-xs font-mono font-bold px-3 py-1 rounded-full">
                Booking ID: {bookingRefId}
              </div>
            )}
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              {confirmationMsg || `Thank you, ${name}! Your departure batch for ${trekName} (${batchDate}) is reserved. Our Ground Support Officer will reach out at ${phone} with gear checklist & payment details.`}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-[#0F3A2E] hover:bg-emerald-900 text-white text-xs font-bold px-6 py-3 rounded-full transition w-full shadow-lg"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            
            <div className="flex items-center gap-2 text-[#0F3A2E]">
              <Mountain className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-xl font-black brand-font text-slate-900">
                Reserve Departure Batch
              </h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Trek
                </label>
                <select
                  value={trekName}
                  onChange={(e) => setTrekName(e.target.value)}
                  className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-3 focus:ring-2 focus:ring-[#0F3A2E] outline-none"
                >
                  <option value="Kedarkantha Summit Trek">Kedarkantha Summit Trek (₹8,999)</option>
                  <option value="Ali Bedni Bugyal Meadow">Ali Bedni Bugyal Meadow (₹10,499)</option>
                  <option value="Kashmir Great Lakes">Kashmir Great Lakes (₹15,999)</option>
                  <option value="Valley of Flowers & Hemkund">Valley of Flowers & Hemkund (₹9,999)</option>
                  <option value="Hampta Pass Crossover">Hampta Pass Crossover (₹11,199)</option>
                  <option value="Nag Tibba Weekend Summit">Nag Tibba Weekend Summit (₹2,899)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Batch Date
                  </label>
                  <select
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-2.5 outline-none"
                  >
                    <option>Jun 14 - Jun 18, 2026</option>
                    <option>Jun 28 - Jul 02, 2026</option>
                    <option>Jul 12 - Jul 16, 2026</option>
                    <option>Aug 02 - Aug 06, 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3" /> Trekkers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={trekkersCount}
                    onChange={(e) => setTrekkersCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full mt-1 bg-slate-100 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              {/* Promo code field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. MONSOON2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-100 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xl p-2.5 outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-slate-900 text-white text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-slate-800 transition"
                >
                  Apply
                </button>
              </div>

              {promoApplied && (
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> MONSOON2026 Applied: 20% Instant OFF!
                </p>
              )}

              <hr className="border-slate-100 my-2" />

              {/* Contact info */}
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-[#0F3A2E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-[#0F3A2E]"
                />
                <input
                  type="tel"
                  placeholder="Phone / WhatsApp"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-[#0F3A2E]"
                />
              </div>
            </div>

            {/* Total Price & Submit */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Total Estimated</span>
                <span className="text-xl font-extrabold text-[#0F3A2E]">
                  ₹{Math.round(totalPrice).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="submit"
                className="bg-[#FF6B35] hover:bg-[#e8590c] text-white font-bold px-6 py-3 rounded-full text-xs transition shadow-lg flex items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" /> Confirm Reservation
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
