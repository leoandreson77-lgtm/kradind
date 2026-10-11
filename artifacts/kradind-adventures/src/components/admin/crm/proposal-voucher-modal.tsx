"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  Printer,
  X,
  Share2,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  Bed,
  Utensils,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { CustomerItineraryProposal } from "@/lib/cms-store";

interface ProposalVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: CustomerItineraryProposal | null;
}

export function ProposalVoucherModal({
  isOpen,
  onClose,
  proposal,
}: ProposalVoucherModalProps) {
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !proposal) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const summaryText = `*KRADIND ADVENTURES - CUSTOM ITINERARY PROPOSAL*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 Proposal ID: ${proposal.id}
👤 Traveler: ${proposal.customerName} (${proposal.customerPhone || "N/A"})
🏔️ Trip: ${proposal.packageTitle}
📍 Destination: ${proposal.destination}
⏱️ Duration: ${proposal.duration}
👥 Pax: ${proposal.adultsCount} Adult(s)${proposal.childrenCount ? ` + ${proposal.childrenCount} Child(ren)` : ""}
📅 Dates: ${proposal.startDate || "TBD"} to ${proposal.endDate || "TBD"}
🏨 Stay: ${proposal.hotelCategory}
🚗 Transit: ${proposal.vehicleType}

💰 Total Quoted Price: ${formatCurrency(proposal.totalQuotedPrice)}
💳 Advance Deposit: ${formatCurrency(proposal.advanceDepositRequired || 0)}
⏳ Valid Until: ${proposal.validUntil || "14 Days from issuance"}

View full day-by-day plan & inclusions: https://kradind.com
━━━━━━━━━━━━━━━━━━━━━━━━━━
KRADIND Adventures | Himalayas & Beyond
📞 +91 97979 41414 | ✉️ info@kradind.com`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanPhone = (phone?: string) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const whatsappLink = () => {
    const phone = cleanPhone(proposal.customerPhone);
    const msg = `Hi ${proposal.customerName}, here is your customized travel proposal for *${proposal.packageTitle}* (${proposal.duration}) by KRADIND Adventures.\n\nTotal Quoted: ${formatCurrency(proposal.totalQuotedPrice)}\nAdvance to Reserve: ${formatCurrency(proposal.advanceDepositRequired || 0)}\n\nPlease review your day-by-day itinerary and let us know if you need any adjustments!`;
    const encoded = encodeURIComponent(msg);
    return phone ? `https://wa.me/${phone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4 md:p-6 print:p-0 print:bg-white animate-fade-in">
      {/* Print Specific CSS Override */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-itinerary-voucher,
          #printable-itinerary-voucher * {
            visibility: visible;
          }
          #printable-itinerary-voucher {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Modal Shell */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 print:my-0 print:rounded-none print:shadow-none border border-slate-200">
        {/* Floating Top Control Bar (Screen only) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Voucher Preview: <strong className="text-white">{proposal.id}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Copy Summary text for messaging"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Text"}</span>
            </button>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Send Proposal via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Send WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#FF6B35] hover:bg-[#e05a27] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Print voucher or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-itinerary-voucher" ref={printAreaRef} className="p-6 sm:p-10 text-slate-900 bg-white">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 relative shrink-0">
                <Image
                  src="/logo-emblem.webp"
                  alt="KRADIND Adventures"
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  KRADIND ADVENTURES
                </h1>
                <p className="text-[11px] font-bold tracking-wider uppercase text-emerald-700">
                  Certified Himalayan Expeditions & Luxury Tours
                </p>
                <p className="text-[10px] text-slate-500">
                  Registered Travel & Tourism Operator • Uttarakhand, India
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900 text-white mb-1.5">
                {proposal.status || "CONFIRMED QUOTATION"}
              </div>
              <div className="font-mono font-bold text-slate-800 text-sm">Ref: {proposal.id}</div>
              <div className="text-[11px] text-slate-500">
                Date: {new Date(proposal.createdAt || Date.now()).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              {proposal.validUntil && (
                <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                  Quotation Valid Until: {proposal.validUntil}
                </div>
              )}
            </div>
          </div>

          {/* Trip & Customer Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {/* Customer Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Prepared Exclusively For
              </div>
              <div className="text-base font-extrabold text-slate-900">{proposal.customerName}</div>
              <div className="text-xs text-slate-600 space-y-1">
                {proposal.customerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{proposal.customerPhone}</span>
                  </div>
                )}
                {proposal.customerEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{proposal.customerEmail}</span>
                  </div>
                )}
                {proposal.customerCity && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{proposal.customerCity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expedition Summary Box */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Expedition Blueprint
              </div>
              <div className="text-base font-extrabold text-emerald-950">{proposal.packageTitle}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Destination:</span>
                  <span className="font-bold text-slate-800">{proposal.destination}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Duration:</span>
                  <span className="font-bold text-slate-800">{proposal.duration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Travelers:</span>
                  <span className="font-bold text-slate-800">
                    {proposal.adultsCount} Adult(s)
                    {proposal.childrenCount ? `, ${proposal.childrenCount} Child(ren)` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Travel Dates:</span>
                  <span className="font-bold text-slate-800">
                    {proposal.startDate || "Flexible"} {proposal.endDate ? `to ${proposal.endDate}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospitality & Transit Logistics Strip */}
          <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3.5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Bed className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Accommodation</span>
                <span className="font-bold text-slate-800">{proposal.hotelCategory || "Standard 3-Star / Camp"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-blue-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Transport</span>
                <span className="font-bold text-slate-800">{proposal.vehicleType || "Private AC Vehicle"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Pickup & Drop</span>
                <span className="font-bold text-slate-800">
                  {proposal.pickupLocation || "Base Hub"} → {proposal.dropLocation || "Base Hub"}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Day-by-Day Itinerary */}
          <div className="mb-8">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 mb-4 border-b border-slate-200 flex items-center justify-between">
              <span>Day-by-Day Customized Itinerary</span>
              <span className="text-xs font-semibold text-slate-500">
                {proposal.itinerary?.length || 0} Scheduled Days
              </span>
            </h2>

            <div className="space-y-4">
              {proposal.itinerary?.map((day, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        D{day.day || idx + 1}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{day.title}</h3>
                    </div>
                    {day.distance && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        {day.distance}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pl-9 mb-3 whitespace-pre-line">
                    {day.description}
                  </p>

                  {(day.stay || day.meal || day.activities) && (
                    <div className="pl-9 flex items-center gap-3 flex-wrap text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
                      {day.stay && (
                        <span className="flex items-center gap-1.5">
                          <Bed className="w-3.5 h-3.5 text-emerald-600" />
                          <strong>Stay:</strong> {day.stay}
                        </span>
                      )}
                      {day.meal && (
                        <span className="flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5 text-amber-600" />
                          <strong>Meal:</strong> {day.meal}
                        </span>
                      )}
                      {day.activities && (
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <strong>Activities:</strong> {day.activities}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Inclusions */}
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Package Inclusions</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {proposal.inclusions?.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-900 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Package Exclusions</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {proposal.exclusions?.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold mt-0.5">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Special Notes */}
          {proposal.specialNotes && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 mb-8 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Special Instructions & Dietary Notes:</span>
              </div>
              <p className="text-slate-700 pl-5">{proposal.specialNotes}</p>
            </div>
          )}

          {/* Commercials & Pricing Schedule */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Commercial Quotation
              </div>
              <div className="text-xs text-slate-300">
                Base Rate: {formatCurrency(proposal.basePricePerPerson)} per traveler × {proposal.adultsCount} Pax
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Quoted by: <strong className="text-slate-200">{proposal.author || "KRADIND Sales Desk"}</strong>
              </div>
            </div>

            <div className="text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formatCurrency(proposal.totalQuotedPrice)}
              </div>
              {proposal.advanceDepositRequired ? (
                <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                  Advance Token to Lock: {formatCurrency(proposal.advanceDepositRequired)}
                </div>
              ) : null}
              <div className="text-[10px] text-slate-400 mt-0.5">All applicable transport & guide taxes included</div>
            </div>
          </div>

          {/* Signoff & Booking Terms Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="space-y-1">
              <div className="font-bold text-slate-800">KRADIND ADVENTURES PRIVATE LIMITED</div>
              <div>Dehradun Head Office, Uttarakhand • Contact: +91 97979 41414</div>
              <div>Official Portal: https://kradind.com • Email: info@kradind.com</div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="font-bold text-slate-800">Authorized Tour Specialist</div>
              <div className="w-36 h-0.5 bg-slate-300 sm:ml-auto my-1" />
              <div className="text-[10px] text-slate-400 font-mono">Digitally Verified & Approved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
