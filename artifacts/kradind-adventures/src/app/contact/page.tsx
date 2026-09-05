"use client";

import React, { useState } from "react";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingModal } from "@/components/booking-modal";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          source: "Contact Page",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit inquiry.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Header onBookClick={() => setBookingOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[#FF6B35] font-extrabold text-xs uppercase tracking-wider">
            24/7 Support Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 brand-font">
            Get in Touch with Ground Officers
          </h1>
          <p className="text-slate-600 text-sm">
            Have questions regarding trail conditions, physical prep, gear requirements, or customized departures?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Details */}
          <address
            className="not-italic space-y-6"
            itemScope
            itemType="https://schema.org/LocalBusiness"
          >
            <meta itemProp="name" content="KRADIND Adventures" />
            <meta itemProp="image" content="https://kradind.com/logo.png" />
            <meta itemProp="priceRange" content="₹₹" />

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-emerald-100 text-[#0F3A2E] rounded-xl shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Emergency Ground Desk</h3>
                <a
                  href="tel:+917500222141"
                  itemProp="telephone"
                  className="text-xs text-slate-600 hover:text-emerald-700 font-medium mt-1 block"
                >
                  +91 75002 22141 (24/7 Helpline & WhatsApp)
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Email Expeditions Team</h3>
                <a
                  href="mailto:support@kradind.com"
                  itemProp="email"
                  className="text-xs text-slate-600 hover:text-emerald-700 font-medium mt-1 block"
                >
                  support@kradind.com
                </a>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Headquarters & Basecamp Office</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <span itemProp="streetAddress">Rajpur Road, Jakhan</span>,{" "}
                  <span itemProp="addressLocality">Dehradun</span>,{" "}
                  <span itemProp="addressRegion">Uttarakhand</span>{" "}
                  <span itemProp="postalCode">248001</span>,{" "}
                  <span itemProp="addressCountry">India</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Expedition base operations: Sankri Village (Uttarakhand), Manali (HP) & Srinagar (J&K).
                </p>
              </div>
            </div>
          </address>

          {/* Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-extrabold text-slate-900">Message Delivered!</h3>
                <p className="text-xs text-slate-600">
                  Thank you, <strong>{name}</strong>. Our Trek Leader officer will reply back within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 brand-font">Send an Inquiry</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#0F3A2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#0F3A2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Phone Number (WhatsApp updates)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 75002 22141"
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#0F3A2E]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase">Message / Questions *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#0F3A2E]"
                    placeholder="Ask about batch availability, gear renting, or route safety..."
                  ></textarea>
                </div>
                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                    {errorMsg}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0F3A2E] hover:bg-emerald-900 text-white font-bold py-3 rounded-full text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 transition"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <Footer />
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
