"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  DoorClosed,
  Download,
  Loader2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { CustomerItineraryProposal } from "@/lib/cms-store";
import { ItineraryRouteMap } from "@/components/itinerary-route-map";
import { ItineraryBankingDetails } from "@/components/itinerary-banking-details";
import { downloadElementAsPdf } from "@/lib/pdf-download";

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
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [itineraryDays, setItineraryDays] = useState<any[]>([]);
  const [draggedDayIdx, setDraggedDayIdx] = useState<number | null>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proposal?.itinerary) {
      setItineraryDays(proposal.itinerary);
    }
  }, [proposal]);

  const moveProposalDay = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= itineraryDays.length) return;
    const reordered = [...itineraryDays];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setItineraryDays(reordered.map((d, i) => ({ ...d, day: i + 1 })));
  };

  const handleDragDayStart = (e: React.DragEvent, index: number) => {
    setDraggedDayIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragDayOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropDay = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedDayIdx === null || draggedDayIdx === dropIndex) return;
    const reordered = [...itineraryDays];
    const [moved] = reordered.splice(draggedDayIdx, 1);
    reordered.splice(dropIndex, 0, moved);
    setItineraryDays(reordered.map((d, i) => ({ ...d, day: i + 1 })));
    setDraggedDayIdx(null);
  };

  const handleResetDays = () => {
    if (proposal?.itinerary) {
      setItineraryDays(proposal.itinerary);
    }
  };

  const handleDownloadPdf = async () => {
    if (!printAreaRef.current || !proposal) return;
    setDownloading(true);
    try {
      const cleanCust = (proposal.customerName || "Traveler").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `KRADIND-${proposal.id || "Proposal"}-${cleanCust}.pdf`;
      await downloadElementAsPdf(printAreaRef.current, filename);
    } catch (err) {
      console.warn("Direct PDF generation error:", err);
      // Fallback to window print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("proposal-voucher-open");
    } else {
      document.body.classList.remove("proposal-voucher-open");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("proposal-voucher-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !proposal || !mounted) return null;

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
🏨 Stay: ${proposal.hotelCategory}${proposal.roomCategory ? ` (${proposal.roomCategory})` : ""}
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

  const modalContent = (
    <div
      id="proposal-voucher-portal-root"
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/75 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4 md:p-6 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible proposal-voucher-backdrop animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Print Specific CSS Override */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm 10mm 12mm 10mm;
          }

          /* Hide all app contents outside the portal during voucher printing */
          body.proposal-voucher-open > *:not(#proposal-voucher-portal-root) {
            display: none !important;
          }

          body.proposal-voucher-open,
          html {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #proposal-voucher-portal-root {
            display: block !important;
            position: static !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          .proposal-voucher-backdrop {
            position: static !important;
            inset: auto !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
            display: block !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          .proposal-voucher-container {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          #printable-itinerary-voucher {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #0f172a !important;
            overflow: visible !important;
          }

          /* Screen-only UI controls */
          .no-print,
          button,
          header,
          footer,
          nav,
          aside,
          .floating-whatsapp {
            display: none !important;
          }

          /* Pagination and card integrity rules */
          .page-break-avoid,
          .page-break-inside-avoid,
          .break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          *,
          *::before,
          *::after {
            box-shadow: none !important;
            text-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      {/* Main Modal Shell */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 print:my-0 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full print:static print:overflow-visible border border-slate-200 proposal-voucher-container">
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
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
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
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Download PDF directly to your device"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              title="Print voucher using browser print dialog"
            >
              <Printer className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-itinerary-voucher" ref={printAreaRef} className="p-6 sm:p-10 text-slate-900 bg-white print:p-0 print:m-0 print:w-full print:bg-white print:text-slate-900">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900 page-break-avoid">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 relative shrink-0">
                <Image
                  src="/logo-emblem.webp"
                  alt="KRADIND Adventures"
                  width={56}
                  height={56}
                  priority
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
              <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900 text-white mb-1.5 print:bg-slate-900 print:text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 page-break-avoid">
            {/* Customer Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 page-break-avoid print:bg-slate-50">
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
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-2 page-break-avoid print:bg-emerald-50/60">
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
          <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-3.5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs page-break-avoid print:bg-slate-100">
            <div className="flex items-center gap-2.5">
              <Bed className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Accommodation</span>
                <span className="font-bold text-slate-800">{proposal.hotelCategory || "Standard 3-Star / Camp"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <DoorClosed className="w-4 h-4 text-teal-700 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Room Category</span>
                <span className="font-bold text-slate-800">{proposal.roomCategory || "Standard Room"}</span>
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

          {/* Itinerary Route Flow Map */}
          <div className="mb-6 page-break-avoid">
            <ItineraryRouteMap
              itinerary={itineraryDays.length > 0 ? itineraryDays : (proposal.itinerary || [])}
              destination={proposal.destination}
              pickupLocation={proposal.pickupLocation}
              dropLocation={proposal.dropLocation}
            />
          </div>

          {/* Detailed Day-by-Day Itinerary */}
          <div className="mb-8">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 pb-2 mb-4 border-b border-slate-200 flex items-center justify-between page-break-avoid">
              <span className="flex items-center gap-2">
                <span>Day-by-Day Customized Itinerary</span>
                <span className="no-print text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <GripVertical className="w-3 h-3" />
                  Drag items to reorder
                </span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {itineraryDays.length} Scheduled Days
                </span>
                <button
                  type="button"
                  onClick={handleResetDays}
                  className="no-print p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
                  title="Reset to Original Days Order"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </h2>

            <div className="space-y-4">
              {itineraryDays.map((day, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragDayStart(e, idx)}
                  onDragOver={(e) => handleDragDayOver(e, idx)}
                  onDrop={(e) => handleDropDay(e, idx)}
                  onDragEnd={() => setDraggedDayIdx(null)}
                  className={`p-4 rounded-2xl border transition-all shadow-2xs page-break-avoid ${
                    draggedDayIdx === idx
                      ? "border-emerald-500 bg-emerald-50/50 opacity-60 shadow-md ring-2 ring-emerald-500/30"
                      : "border-slate-200 bg-white hover:border-slate-300 print:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      {/* Drag Handle & Move Buttons (Screen Only) */}
                      <div className="no-print flex items-center gap-0.5">
                        <div
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-md transition"
                          title="Drag to reorder day"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col -space-y-1">
                          <button
                            type="button"
                            onClick={() => moveProposalDay(idx, "up")}
                            disabled={idx === 0}
                            title="Move Day Up"
                            className="p-0.5 text-slate-400 hover:text-emerald-700 disabled:opacity-20 transition cursor-pointer"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveProposalDay(idx, "down")}
                            disabled={idx === itineraryDays.length - 1}
                            title="Move Day Down"
                            className="p-0.5 text-slate-400 hover:text-emerald-700 disabled:opacity-20 transition cursor-pointer"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 print:bg-slate-900 print:text-white">
                        D{day.day || idx + 1}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm">{day.title}</h3>
                    </div>
                    {day.distance && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0 print:bg-slate-100">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 page-break-avoid">
            {/* Inclusions */}
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 page-break-avoid print:bg-emerald-50/40">
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
            <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4 page-break-avoid print:bg-rose-50/40">
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
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 mb-8 space-y-1 page-break-avoid print:bg-amber-50/80">
              <div className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Special Instructions & Dietary Notes:</span>
              </div>
              <p className="text-slate-700 pl-5">{proposal.specialNotes}</p>
            </div>
          )}

          {/* Commercials & Pricing Schedule */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 page-break-avoid print:bg-slate-900 print:text-white">
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

          {/* Cancellation & Refund Policy */}
          <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-3 page-break-avoid print:border-slate-300">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Standard Cancellation &amp; Reschedule Terms</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Official Policy
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">30+ Days Prior</span>
                <strong className="text-sm font-black text-emerald-900 block mt-0.5">90% Refund</strong>
                <p className="text-[10px] text-emerald-800 mt-1">10% administrative processing fee (or 100% credit voucher).</p>
              </div>
              <div className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-xs">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">15 - 29 Days Prior</span>
                <strong className="text-sm font-black text-blue-900 block mt-0.5">50% Refund</strong>
                <p className="text-[10px] text-blue-800 mt-1">50% cash refund or 75% credit voucher valid for 12 months.</p>
              </div>
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 text-xs">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">7 - 14 Days Prior</span>
                <strong className="text-sm font-black text-amber-900 block mt-0.5">25% Refund</strong>
                <p className="text-[10px] text-amber-800 mt-1">25% cash refund or 40% credit voucher for future trip.</p>
              </div>
              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-xs">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">&lt; 7 Days</span>
                <strong className="text-sm font-black text-rose-900 block mt-0.5">Non-Refundable</strong>
                <p className="text-[10px] text-rose-800 mt-1">Strictly non-refundable due to pre-booked hotels &amp; transport.</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <span><strong>Reschedule:</strong> Free 1-time batch rescheduling up to 15 days before travel.</span>
              <span><strong>Safety Guarantee:</strong> Safe alternate trail / carry forward credits on severe weather.</span>
            </div>
          </div>

          {/* Official Bank Account Details, QR Code & Social Channels */}
          <div className="mb-8 page-break-avoid">
            <ItineraryBankingDetails showSocials={true} />
          </div>

          {/* Signoff & Booking Terms Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500 page-break-avoid">
            <div className="space-y-1">
              <div className="font-bold text-slate-800">KRADIND</div>
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

  return createPortal(modalContent, document.body);
}
