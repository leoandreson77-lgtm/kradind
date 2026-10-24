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
  GripVertical,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Eye,
  EyeOff,
  MoveVertical,
  Edit3,
  Plus,
  Trash2,
  Plane,
  ShieldAlert,
  CreditCard,
  Quote,
  Palette,
  DollarSign,
} from "lucide-react";
import { TrekData, TrekItineraryDay } from "@/lib/cms-store";
import { parseInlineFormatting } from "@/components/formatted-text";
import { ItineraryRouteMap } from "@/components/itinerary-route-map";
import { ItineraryBankingDetails } from "@/components/itinerary-banking-details";
import { downloadElementAsPdf } from "@/lib/pdf-download";

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
  customHelpline?: string;
  customWhatsApp?: string;
  customEmail?: string;
  customCoordinator?: string;
  customOfficeLocation?: string;
  isDraftProposal?: boolean;
  showDraftWatermark?: boolean;
  customDiscount?: string;
  originalPrice?: number;
  discountAmount?: number;
  promoOfferBadge?: string;
  offerValidUntil?: string;
  initialPricePosition?: "top" | "middle" | "bottom";
}

export type CustomSectionStyle =
  | "emerald-card"
  | "amber-alert"
  | "bullet-list"
  | "milestone-steps"
  | "quote-box";

export interface PdfSectionItem {
  id: string;
  label: string;
  shortTag: string;
  visible: boolean;
  isCustom?: boolean;
  customStyle?: CustomSectionStyle;
  customIcon?: string;
  customContent?: string;
}

export interface CancellationPolicyData {
  title: string;
  badge: string;
  slabs: { timeline: string; refund: string; note: string; color: string }[];
  reschedulingNote: string;
  weatherNote: string;
}

export const DEFAULT_CANCELLATION_POLICY: CancellationPolicyData = {
  title: "Cancellation, Rescheduling & Refund Terms",
  badge: "Official Booking Policy",
  slabs: [
    {
      timeline: "30+ Days Prior",
      refund: "90% Refund",
      note: "10% deduction towards administrative & permits processing fee (or 100% credit voucher).",
      color: "text-emerald-800 bg-emerald-50 border-emerald-200",
    },
    {
      timeline: "15 to 29 Days Prior",
      refund: "50% Refund",
      note: "50% cash refund or 75% credit voucher valid for 12 months for any KRADIND trip.",
      color: "text-blue-800 bg-blue-50 border-blue-200",
    },
    {
      timeline: "7 to 14 Days Prior",
      refund: "25% Refund",
      note: "25% cash refund or 40% credit voucher towards a rescheduled future batch.",
      color: "text-amber-800 bg-amber-50 border-amber-200",
    },
    {
      timeline: "Less than 7 Days",
      refund: "Non-Refundable",
      note: "Strictly non-refundable due to advance camp, guide, logistics & permits booking.",
      color: "text-rose-800 bg-rose-50 border-rose-200",
    },
  ],
  reschedulingNote:
    "Free 1-time batch rescheduling permitted up to 15 days before departure without penalty.",
  weatherNote:
    "Force Majeure & Mountain Safety: If routes or high passes close due to sudden blizzards, floods, or governmental restrictions, our team arranges immediate safe alternate trails or issues equivalent carry-forward trek vouchers.",
};

const DEFAULT_PDF_SECTIONS: PdfSectionItem[] = [
  { id: "metadata_bar", label: "Client & Proposal Details", shortTag: "Client Info", visible: true },
  { id: "price_section", label: "Commercial Quotation & Rates Breakdown", shortTag: "💰 Price & Rates", visible: true },
  { id: "title_summary", label: "Tour Title & Overview", shortTag: "Title & Summary", visible: true },
  { id: "stats_grid", label: "Expedition Stats Grid", shortTag: "Stats Grid", visible: true },
  { id: "custom_notes", label: "Seasonal Custom Notes", shortTag: "Advisory Note", visible: true },
  { id: "route_map", label: "Route Flow Diagram", shortTag: "Route Flow Map", visible: true },
  { id: "itinerary_days", label: "Day-by-Day Expedition Schedule", shortTag: "Daily Itinerary", visible: true },
  { id: "inclusions_exclusions", label: "Inclusions & Exclusions Table", shortTag: "Inclusions", visible: true },
  { id: "gear_checklist", label: "Safety Protocol & Packing Essentials", shortTag: "Gear Checklist", visible: true },
  { id: "cancellation_policy", label: "Cancellation & Refund Terms", shortTag: "Cancellation Policy", visible: true },
  { id: "banking_details", label: "Official Bank Account, QR & Socials", shortTag: "Bank & QR Code", visible: true },
];

export function parseBulletPoints(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*]+/, "").replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

export function renderCustomIcon(iconName?: string) {
  switch (iconName) {
    case "shield":
      return <ShieldCheck className="w-4 h-4" />;
    case "alert":
      return <AlertTriangle className="w-4 h-4" />;
    case "check":
      return <CheckCircle2 className="w-4 h-4" />;
    case "plane":
      return <Plane className="w-4 h-4" />;
    case "credit":
      return <CreditCard className="w-4 h-4" />;
    case "quote":
      return <Quote className="w-4 h-4" />;
    case "steps":
      return <Award className="w-4 h-4" />;
    case "map":
      return <MapPin className="w-4 h-4" />;
    case "calendar":
      return <Calendar className="w-4 h-4" />;
    case "sparkles":
    default:
      return <Sparkles className="w-4 h-4" />;
  }
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
  customHelpline,
  customWhatsApp,
  customEmail,
  customCoordinator,
  customOfficeLocation,
  isDraftProposal = false,
  showDraftWatermark,
  customDiscount,
  originalPrice,
  discountAmount,
  promoOfferBadge,
  offerValidUntil,
  initialPricePosition,
}: ItineraryPdfProps) {
  // If a custom client name was specified by sales/admin, consider it sales mode (no gate needed)
  const isSalesMode = Boolean(customClientName && customClientName !== "Valued Traveler");

  const [clientName, setClientName] = useState(customClientName);
  const [paxCount, setPaxCount] = useState(customPax);
  const [pricePerPerson, setPricePerPerson] = useState<number>(
    customPrice !== undefined ? customPrice : tour?.price || 9999
  );
  const [isDraftWatermarkActive, setIsDraftWatermarkActive] = useState<boolean>(
    showDraftWatermark !== undefined ? showDraftWatermark : isDraftProposal || false
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Editable Contact Info State
  const [contactHelpline, setContactHelpline] = useState(customHelpline || "+91 9797941414");
  const [contactWhatsApp, setContactWhatsApp] = useState(customWhatsApp || "+91 9797941414");
  const [contactEmail, setContactEmail] = useState(customEmail || "Info@kradind.com");
  const [coordinatorName, setCoordinatorName] = useState(customCoordinator || "Dedicated Trip Coordinator");
  const [officeLocation, setOfficeLocation] = useState(customOfficeLocation || "Certified Operator • Dehradun");
  const [isEditingContact, setIsEditingContact] = useState(false);

  // Editable Cancellation Policy State
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicyData>(DEFAULT_CANCELLATION_POLICY);
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);

  // Draggable Items & Sections state
  const [sections, setSections] = useState<PdfSectionItem[]>(DEFAULT_PDF_SECTIONS);
  const [pdfDays, setPdfDays] = useState<TrekItineraryDay[]>([]);
  const [isDragTrayOpen, setIsDragTrayOpen] = useState(false);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [draggedDayIndex, setDraggedDayIndex] = useState<number | null>(null);

  // Custom Sections Creator Modal State
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [customSecTitle, setCustomSecTitle] = useState("");
  const [customSecShortTag, setCustomSecShortTag] = useState("");
  const [customSecStyle, setCustomSecStyle] = useState<CustomSectionStyle>("emerald-card");
  const [customSecIcon, setCustomSecIcon] = useState("sparkles");
  const [customSecContent, setCustomSecContent] = useState("");

  const handleOpenAddSectionModal = () => {
    setEditingSectionId(null);
    setCustomSecTitle("");
    setCustomSecShortTag("");
    setCustomSecStyle("emerald-card");
    setCustomSecIcon("sparkles");
    setCustomSecContent("");
    setIsAddSectionModalOpen(true);
  };

  const handleEditCustomSection = (sec: PdfSectionItem) => {
    setEditingSectionId(sec.id);
    setCustomSecTitle(sec.label);
    setCustomSecShortTag(sec.shortTag);
    setCustomSecStyle(sec.customStyle || "emerald-card");
    setCustomSecIcon(sec.customIcon || "sparkles");
    setCustomSecContent(sec.customContent || "");
    setIsAddSectionModalOpen(true);
  };

  const handleDeleteCustomSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveCustomSection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customSecTitle.trim()) return;

    if (editingSectionId) {
      setSections((prev) =>
        prev.map((s) =>
          s.id === editingSectionId
            ? {
                ...s,
                label: customSecTitle.trim(),
                shortTag: customSecShortTag.trim() || customSecTitle.trim().slice(0, 16),
                customStyle: customSecStyle,
                customIcon: customSecIcon,
                customContent: customSecContent.trim(),
              }
            : s
        )
      );
    } else {
      const newSec: PdfSectionItem = {
        id: `custom_sec_${Date.now()}`,
        label: customSecTitle.trim(),
        shortTag: customSecShortTag.trim() || customSecTitle.trim().slice(0, 16),
        visible: true,
        isCustom: true,
        customStyle: customSecStyle,
        customIcon: customSecIcon,
        customContent: customSecContent.trim(),
      };
      // Place new section before banking details
      const bankIdx = sections.findIndex((s) => s.id === "banking_details");
      if (bankIdx >= 0) {
        const copy = [...sections];
        copy.splice(bankIdx, 0, newSec);
        setSections(copy);
      } else {
        setSections((prev) => [...prev, newSec]);
      }
    }
    setIsAddSectionModalOpen(false);
    setEditingSectionId(null);
  };

  const applySectionPresetTemplate = (preset: "flight" | "payment" | "perks" | "medical" | "message") => {
    if (preset === "flight") {
      setCustomSecTitle("Flight & Travel Schedule Advisory");
      setCustomSecShortTag("Travel Advisory");
      setCustomSecStyle("amber-alert");
      setCustomSecIcon("plane");
      setCustomSecContent(
        "• Nearest Airport: Jolly Grant Airport, Dehradun (DED) with daily direct flights from Delhi, Mumbai & Bengaluru.\n• Nearest Railway Station: Dehradun Railway Station (DDN) with overnight superfast express trains.\n• Departure Timing: Official shared/private cab departs at 06:30 AM sharp from Dehradun on Day 1.\n• Return Drop: Anticipated drop back at Dehradun by 06:30 PM on the final day. Book departure flights/trains after 09:00 PM."
      );
    } else if (preset === "payment") {
      setCustomSecTitle("Deposit & Payment Milestones Plan");
      setCustomSecShortTag("Payment Plan");
      setCustomSecStyle("milestone-steps");
      setCustomSecIcon("credit");
      setCustomSecContent(
        "1. Token Advance: 20% deposit to lock departure slots, permits & local guide allocation.\n2. Pre-Trek Clearance: 50% payment cleared 15 days before departure.\n3. Basecamp Briefing: Remaining 30% balance cleared on Day 1 arrival during trip orientation."
      );
    } else if (preset === "perks") {
      setCustomSecTitle("Special Group Inclusions & VIP Perks");
      setCustomSecShortTag("Exclusive Perks");
      setCustomSecStyle("emerald-card");
      setCustomSecIcon("sparkles");
      setCustomSecContent(
        "• 4K Ultra-HD summit drone clips & complimentary candid group photography.\n• Dedicated mountain chef serving unlimited hot soups, wholesome local dishes & hydration drinks.\n• High-altitude safety kit: 2x portable oxygen cylinders, fingertip pulse oximeters & certified emergency team.\n• Upgraded 4-season alpine tents (-10°C rating) with insulated ground mattresses."
      );
    } else if (preset === "medical") {
      setCustomSecTitle("Medical Fitness & Safety Self-Declaration");
      setCustomSecShortTag("Health Check");
      setCustomSecStyle("bullet-list");
      setCustomSecIcon("shield");
      setCustomSecContent(
        "• Cardio Stamina: Able to walk briskly or jog 4 km comfortably in under 30 minutes.\n• Medical Clearance: No active heart conditions, untreated hypertension, severe asthma, or acute joint surgery.\n• Daily Health Monitor: Pulse & SpO2 oxygen levels recorded every morning and evening at camp.\n• Mandatory Documentation: Signed physical fitness self-declaration submitted at basecamp check-in."
      );
    } else if (preset === "message") {
      setCustomSecTitle("A Personal Welcome from Your Trip Coordinator");
      setCustomSecShortTag("Coordinator Note");
      setCustomSecStyle("quote-box");
      setCustomSecIcon("quote");
      setCustomSecContent(
        "Welcome to KRADIND Adventures! Our mountain leadership team is committed to delivering a safe, transformative, and memorable Himalayan journey. If you need any advice on customized packing, physical preparation, or travel logistics, our desk is always available on call or WhatsApp."
      );
    }
  };

  useEffect(() => {
    const raw = customDays && customDays.length > 0 ? customDays : tour?.itinerary || [];
    setPdfDays(JSON.parse(JSON.stringify(raw)));
  }, [tour, customDays]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setSections(updated);
  };

  const movePriceSectionTo = (target: "top" | "middle" | "bottom") => {
    setSections((prev) => {
      let priceSec = prev.find((s) => s.id === "price_section");
      if (!priceSec) {
        priceSec = {
          id: "price_section",
          label: "Commercial Quotation & Rates Breakdown",
          shortTag: "💰 Price & Rates",
          visible: true,
        };
      }
      const updated = prev.filter((s) => s.id !== "price_section");

      if (target === "top") {
        const metaIdx = updated.findIndex((s) => s.id === "metadata_bar");
        const insertAt = metaIdx !== -1 ? metaIdx + 1 : 0;
        updated.splice(insertAt, 0, priceSec);
      } else if (target === "middle") {
        const daysIdx = updated.findIndex((s) => s.id === "itinerary_days");
        const insertAt = daysIdx !== -1 ? daysIdx + 1 : Math.floor(updated.length / 2);
        updated.splice(insertAt, 0, priceSec);
      } else if (target === "bottom") {
        const botIdx = updated.findIndex(
          (s) => s.id === "cancellation_policy" || s.id === "banking_details"
        );
        const insertAt = botIdx !== -1 ? botIdx : updated.length;
        updated.splice(insertAt, 0, priceSec);
      }
      return updated;
    });
  };

  useEffect(() => {
    if (initialPricePosition) {
      movePriceSectionTo(initialPricePosition);
    }
  }, [initialPricePosition]);

  const toggleSectionVisibility = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const moveDay = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pdfDays.length) return;
    const updated = [...pdfDays];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }));
    setPdfDays(renumbered);
  };

  const handleResetLayout = () => {
    setSections(DEFAULT_PDF_SECTIONS);
    const raw = customDays && customDays.length > 0 ? customDays : tour?.itinerary || [];
    setPdfDays(JSON.parse(JSON.stringify(raw)));
  };

  const handleDownloadDirectPdf = async () => {
    if (!printAreaRef.current || !tour) return;
    setDownloadingPdf(true);
    try {
      const cleanTour = (tour.name || "Itinerary").replace(/[^a-zA-Z0-9]/g, "_");
      const cleanClient = (clientName || "Traveler").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `KRADIND-${cleanTour}-${cleanClient}.pdf`;
      await downloadElementAsPdf(printAreaRef.current, filename);
    } catch (err) {
      console.warn("Direct PDF error:", err);
      window.print();
    } finally {
      setDownloadingPdf(false);
    }
  };

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

  // Commercial Pricing & Top Offer Proposal Banner Calculations
  const displayPricePerPax = pricePerPerson;
  const displayNetTotal = displayPricePerPax * paxCount;
  const catalogRatePerPax = originalPrice || tour?.originalPrice || Math.round(displayPricePerPax * 1.25);
  const displayOriginalTotal = catalogRatePerPax * paxCount;
  const displaySavings = Math.max(
    discountAmount ? discountAmount * paxCount : 0,
    displayOriginalTotal - displayNetTotal
  );
  const displaySavingsPercent =
    displayOriginalTotal > 0
      ? Math.max(5, Math.min(60, Math.round((displaySavings / displayOriginalTotal) * 100)))
      : 20;
  const displayAdvance = Math.round(displayNetTotal * 0.3);
  const displayOfferBadge = promoOfferBadge || "SPECIAL ADDITIONAL DISCOUNT APPLIED";
  const displayValidUntil =
    offerValidUntil ||
    (() => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    })();
  const displayOfferNote =
    customDiscount ||
    tour?.discountNote ||
    (discountAmount
      ? `₹${(discountAmount * paxCount).toLocaleString("en-IN")} Special Additional Discount applied for ${clientName || "Valued Traveler"}`
      : `Special Additional Discount & Price Lock Proposal prepared for ${clientName || "Valued Traveler"}. All permits, mountain transport, accommodation & taxes included.`);

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
    const cleanPhone = queryPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      setLeadError("Please enter a valid 10-digit WhatsApp/phone number.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setLeadError("Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.");
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
    window.open(`https://wa.me/919797941414?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Printable & Direct PDF Generation Styles Injection */}
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
          .drag-handle,
          .reorder-controls,
          .reorder-btn,
          .interactive-ctrl,
          [data-pdf-ignore="true"],
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
          *, *::before, *::after {
            box-shadow: none !important;
            text-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            transition: none !important;
            animation: none !important;
          }
        }

        /* Applied during direct client PDF rendering via html2canvas */
        .is-generating-pdf .no-print,
        .is-generating-pdf button,
        .is-generating-pdf .drag-handle,
        .is-generating-pdf .reorder-controls,
        .is-generating-pdf .reorder-btn,
        .is-generating-pdf .interactive-ctrl,
        .is-generating-pdf [data-pdf-ignore="true"] {
          display: none !important;
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
              onClick={handleDownloadDirectPdf}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
              title="Download PDF directly to your device"
            >
              {downloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#FF6B35] hover:bg-[#e05320] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition transform active:scale-95 cursor-pointer"
              title="Open browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
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

            {/* Quick Price Placement Dropdown */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-300 shadow-2xs">
              <span className="text-slate-600 font-bold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>Price:</span>
              </span>
              <select
                value={
                  (() => {
                    const idx = sections.findIndex((s) => s.id === "price_section");
                    if (idx <= 1) return "top";
                    if (idx >= sections.length - 3) return "bottom";
                    return "middle";
                  })()
                }
                onChange={(e) => movePriceSectionTo(e.target.value as any)}
                className="bg-transparent text-xs font-extrabold text-[#0F3A2E] cursor-pointer outline-none"
                title="Reposition the Price Section to Top, Middle, or Bottom"
              >
                <option value="top">🔝 Sabse Uper (Top)</option>
                <option value="middle">⬌ Beech Me (Middle)</option>
                <option value="bottom">🔻 Neeche (Bottom)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsDraftWatermarkActive(!isDraftWatermarkActive)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                isDraftWatermarkActive
                  ? "bg-amber-400 text-slate-950 border-amber-500 font-extrabold ring-2 ring-amber-400/40"
                  : "bg-white text-slate-700 hover:bg-slate-100 border-slate-300"
              }`}
              title="Toggle prominent DRAFT watermark & status tag across PDF"
            >
              <FileText className={`w-3.5 h-3.5 ${isDraftWatermarkActive ? "text-slate-950" : "text-amber-600"}`} />
              <span>{isDraftWatermarkActive ? "📝 Draft Watermark (ON)" : "Draft Watermark (OFF)"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEditingContact(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-white text-slate-800 hover:bg-slate-100 border-slate-300 shadow-2xs"
              title="Edit Helpline, WhatsApp, Email & Coordinator"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>📞 Contact Info</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddSectionModal}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border bg-emerald-700 text-white hover:bg-emerald-800 border-emerald-700 shadow-2xs"
              title="Add any custom designed section to the itinerary"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Custom Section</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDragTrayOpen(!isDragTrayOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDragTrayOpen
                  ? "bg-slate-900 text-white border-slate-900 shadow-inner"
                  : "bg-white text-emerald-950 hover:bg-emerald-100 border-emerald-300"
              }`}
            >
              <MoveVertical className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>{isDragTrayOpen ? "Close Drag Layout" : "⇄ Drag / Reorder Sections"}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DRAG & REORDER SECTIONS TRAY (SCREEN ONLY) */}
        {/* ========================================================================= */}
        {isDragTrayOpen && (
          <div className="no-print bg-slate-900 text-white p-4 sm:p-5 border-b border-slate-800 space-y-3.5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MoveVertical className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Drag &amp; Reorder PDF Sections</span>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Layout Builder
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Drag items or click ↑ ↓ to rearrange sections in the final PDF. Toggle the eye icon to show/hide.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleOpenAddSectionModal}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ New Custom Section</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLayout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Layout</span>
                </button>
              </div>
            </div>

            {/* Quick Move Price Section Bar */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  ₹
                </span>
                <div>
                  <span className="font-extrabold text-amber-300 block">Quick Placement for Price Section:</span>
                  <span className="text-[11px] text-slate-400">Position the commercial pricing table anywhere in the proposal</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => movePriceSectionTo("top")}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <span>🔝 Sabse Uper (Top)</span>
                </button>
                <button
                  type="button"
                  onClick={() => movePriceSectionTo("middle")}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <span>⬌ Beech Me (Middle)</span>
                </button>
                <button
                  type="button"
                  onClick={() => movePriceSectionTo("bottom")}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs text-xs"
                >
                  <span>🔻 Neeche (Bottom)</span>
                </button>
              </div>
            </div>

            {/* Draggable Sections Chips List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              {sections.map((sec, index) => (
                <div
                  key={sec.id}
                  draggable
                  onDragStart={() => setDraggedSectionIndex(index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedSectionIndex !== null && draggedSectionIndex !== index) {
                      moveSection(draggedSectionIndex, index);
                      setDraggedSectionIndex(null);
                    }
                  }}
                  onDragEnd={() => setDraggedSectionIndex(null)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-1.5 select-none cursor-grab active:cursor-grabbing transition-all ${
                    sec.visible
                      ? "bg-slate-800/90 border-slate-700 hover:border-emerald-500 text-slate-100"
                      : "bg-slate-950/60 border-slate-800 text-slate-500 opacity-60"
                  } ${draggedSectionIndex === index ? "opacity-40 border-emerald-400 border-dashed" : ""}`}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <GripVertical className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold truncate">{sec.shortTag}</span>
                    {sec.isCustom && (
                      <span className="px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-amber-400/20 text-amber-300 rounded shrink-0 border border-amber-400/30">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveSection(index, index - 1)}
                      disabled={index === 0}
                      aria-label={`Move ${sec.label} section up`}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSection(index, index + 1)}
                      disabled={index === sections.length - 1}
                      aria-label={`Move ${sec.label} section down`}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(sec.id)}
                      aria-label={sec.visible ? `Hide ${sec.label} section in PDF` : `Show ${sec.label} section in PDF`}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        sec.visible
                          ? "text-emerald-400 hover:bg-emerald-500/20"
                          : "text-slate-500 hover:bg-slate-800"
                      }`}
                      title={sec.visible ? "Hide section in PDF" : "Show section in PDF"}
                    >
                      {sec.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    {sec.isCustom && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditCustomSection(sec)}
                          className="p-1 rounded text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Edit Custom Section"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomSection(sec.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-slate-700 transition-colors cursor-pointer"
                          title="Delete Custom Section"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Template Strip at Bottom of Tray */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Add Templates:</span>
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    applySectionPresetTemplate("flight");
                    handleSaveCustomSection();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[10px]"
                >
                  + Flight Advisory
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applySectionPresetTemplate("payment");
                    handleSaveCustomSection();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[10px]"
                >
                  + Payment Milestones
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applySectionPresetTemplate("perks");
                    handleSaveCustomSection();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[10px]"
                >
                  + VIP Perks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applySectionPresetTemplate("medical");
                    handleSaveCustomSection();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[10px]"
                >
                  + Health Check
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applySectionPresetTemplate("message");
                    handleSaveCustomSection();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer text-[10px]"
                >
                  + Coordinator Letter
                </button>
              </div>
            </div>
          </div>
        )}

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
                KRADIND • CERTIFIED TOUR OPERATOR • OFFICIAL ITINERARY
              </div>
            ))}
          </div>

          {/* DRAFT WATERMARK OVERLAY (WHEN IN DRAFT MODE) */}
          {isDraftWatermarkActive && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden flex flex-col justify-around select-none opacity-[0.08] print:opacity-[0.10]"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={`draft-wm-${i}`}
                  className="transform -rotate-25 whitespace-nowrap text-center text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest text-amber-900"
                >
                  DRAFT PROPOSAL • CONFIDENTIAL • ESTIMATE ONLY
                </div>
              ))}
            </div>
          )}

          <div className="relative z-10 space-y-7">
            {/* 1. DOCUMENT HEADER WITH OFFICIAL LOGO & CONTACT INFO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-emerald-900/20">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="KRADIND - Official Logo"
                  width={200}
                  height={65}
                  priority
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>

              {/* Operator Details */}
              <div className="text-left sm:text-right space-y-0.5 text-xs text-slate-600">
                <div className="font-extrabold text-[#0F3A2E] text-base tracking-tight">
                  KRADIND
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Certified Tour &amp; Travel Operator • Dehradun, Uttarakhand, India
                </div>
                <div className="flex flex-wrap sm:justify-end gap-x-3 gap-y-0.5 text-[11px] pt-1 text-slate-700">
                  <span className="flex items-center gap-1 font-semibold">
                    <Phone className="w-3 h-3 text-emerald-700" /> +91 9797941414
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Mail className="w-3 h-3 text-emerald-700" /> Info@kradind.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-emerald-700" /> www.kradind.com
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* TOP SPECIAL OFFER PROPOSAL & ADDITIONAL DISCOUNT BANNER */}
            {/* ========================================================================= */}
            <div className="rounded-2xl overflow-hidden border-2 border-amber-400 bg-gradient-to-br from-amber-500/10 via-emerald-900/[0.03] to-amber-500/15 p-4 sm:p-5 shadow-xs page-break-inside-avoid relative">
              {/* Luxury Offer Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-300/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0 ring-2 ring-amber-400/40">
                    <Sparkles className="w-5 h-5 text-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-2xs">
                        🎁 EXCLUSIVE OFFER PROPOSAL
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-[#0F3A2E] text-amber-300 border border-emerald-500/40 shadow-2xs">
                        {displayOfferBadge}
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-black text-[#0F3A2E] tracking-tight mt-1 flex items-center gap-1.5">
                      <span>Special Additional Discount &amp; Price Lock Proposal</span>
                    </h2>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Offer Guarantee
                  </span>
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300 inline-flex items-center gap-1 mt-0.5 shadow-2xs">
                    <Lock className="w-3 h-3 text-emerald-700" />
                    <span>Price Lock Valid: {displayValidUntil}</span>
                  </span>
                </div>
              </div>

              {/* 4-Card Offer Comparison Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3 text-xs">
                {/* 1. Catalog / Standard Brochure Price */}
                <div className="bg-white/95 p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                    Standard Catalog Rate
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-base sm:text-lg font-bold text-slate-400 line-through">
                      ₹{displayOriginalTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    (₹{catalogRatePerPax.toLocaleString("en-IN")} / Person)
                  </span>
                </div>

                {/* 2. Special Deal Rate */}
                <div className="bg-emerald-50/95 p-3 rounded-xl border-2 border-emerald-600 shadow-2xs">
                  <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block truncate flex items-center gap-1">
                    <span>Special Deal Rate</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <strong className="text-lg sm:text-xl font-black text-[#0F3A2E]">
                      ₹{displayNetTotal.toLocaleString("en-IN")}
                    </strong>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-800 block">
                    ₹{displayPricePerPax.toLocaleString("en-IN")} / Person ({paxCount} {paxCount === 1 ? "Pax" : "Pax"})
                  </span>
                </div>

                {/* 3. Instant Savings */}
                <div className="bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-amber-500/5 p-3 rounded-xl border border-amber-300 shadow-2xs">
                  <span className="text-[10px] font-black text-amber-950 uppercase tracking-wider block truncate">
                    You Save Instantly
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <strong className="text-base sm:text-lg font-black text-amber-900">
                      🎉 ₹{displaySavings.toLocaleString("en-IN")} OFF
                    </strong>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-950 block">
                    {displaySavingsPercent}% Privilege Discount
                  </span>
                </div>

                {/* 4. Token Advance */}
                <div className="bg-white/95 p-3 rounded-xl border border-blue-200 shadow-2xs text-left sm:text-right">
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block truncate">
                    Token Seat Lock (30%)
                  </span>
                  <strong className="text-base sm:text-lg font-black text-blue-700 block mt-0.5">
                    ₹{displayAdvance.toLocaleString("en-IN")}
                  </strong>
                  <span className="text-[10px] text-blue-600 font-semibold block">
                    Immediate Reservation
                  </span>
                </div>
              </div>

              {/* Deal Note Callout */}
              <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="flex items-start sm:items-center gap-2 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                    ✓
                  </span>
                  <span className="leading-snug">
                    <strong className="text-[#0F3A2E]">Privilege Note:</strong> {displayOfferNote}
                  </span>
                </div>
                <span className="font-extrabold text-[#0F3A2E] bg-white px-2.5 py-0.5 rounded-md border border-amber-300 text-[10px] shrink-0 self-start sm:self-auto shadow-2xs">
                  ⭐ 100% Date Flexibility Included
                </span>
              </div>
            </div>

            {/* DRAFT PROPOSAL STATUS BANNER (PRINT & SCREEN) */}
            {isDraftWatermarkActive && (
              <div className="bg-amber-50/90 border-2 border-dashed border-amber-400 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-amber-950 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-2xs">
                    DRAFT PROPOSAL
                  </span>
                  <span className="font-semibold text-amber-950">
                    Preliminary estimate for trip planning. Subject to real-time seat availability &amp; advance confirmation.
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-900 bg-white/90 px-2 py-0.5 rounded-md border border-amber-300 shrink-0">
                  ESTIMATE ONLY • NOT A TAX INVOICE
                </span>
              </div>
            )}

            {/* DYNAMIC ORDER OF REORDERABLE / DRAGGABLE SECTIONS */}
            {sections.map((sec, secIdx) => {
              if (!sec.visible) return null;

              if (sec.id === "metadata_bar") {
                return (
                  <div key={sec.id} className="relative group page-break-inside-avoid">
                    <div className="no-print absolute -top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-300 shadow-2xs z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-bold text-slate-700">Client Info</span>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx - 1)} disabled={secIdx === 0} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move client info up" title="Move Up"><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx + 1)} disabled={secIdx === sections.length - 1} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move client info down" title="Move Down"><ChevronDown className="w-3 h-3" /></button>
                    </div>
                    <div className={`rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs ${
                      isDraftWatermarkActive
                        ? "bg-amber-50/40 border-2 border-amber-300/80"
                        : "bg-slate-50 border border-slate-200/90"
                    }`}>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Specially Prepared For</span>
                        <strong className="text-[#0F3A2E] text-sm sm:text-base font-extrabold block truncate">{clientName || "Valued Traveler"}</strong>
                        <span className="text-slate-500 text-[11px]">Group Size: {paxCount} {paxCount === 1 ? "Person" : "Persons"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tour Reference &amp; Date</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-800 text-xs sm:text-sm font-bold block font-mono">{quoteRefId}</strong>
                          {isDraftWatermarkActive && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-950 font-extrabold text-[9px] uppercase border border-amber-300">
                              DRAFT
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 text-[11px]">Issued: {issueDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Travel Season / Batch</span>
                        <strong className="text-slate-800 text-xs sm:text-sm font-bold block">{customSeason}</strong>
                        <span className="text-emerald-700 text-[11px] font-semibold">Valid for 15 Days</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Commercial Summary</span>
                        <strong className="text-[#FF6B35] text-base sm:text-lg font-extrabold block">₹{totalPrice.toLocaleString("en-IN")}</strong>
                        <span className="text-slate-500 text-[10px]">(₹{pricePerPerson.toLocaleString("en-IN")} / Person)</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (sec.id === "price_section") {
                return (
                  <div key={sec.id} className="relative group page-break-inside-avoid space-y-3">
                    {/* Floating Controls with Move to Top, Middle, Bottom */}
                    <div className="no-print absolute -top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-300 shadow-md z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-extrabold text-[#0F3A2E] flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-[#FF6B35]" />
                        <span>Price Section</span>
                      </span>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => movePriceSectionTo("top")}
                        className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold cursor-pointer"
                        title="Move Price Section to the Very Top"
                      >
                        🔝 Top
                      </button>
                      <button
                        type="button"
                        onClick={() => movePriceSectionTo("middle")}
                        className="px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold cursor-pointer"
                        title="Move Price Section to Middle (After Itinerary Schedule)"
                      >
                        ⬌ Middle
                      </button>
                      <button
                        type="button"
                        onClick={() => movePriceSectionTo("bottom")}
                        className="px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold cursor-pointer"
                        title="Move Price Section to Bottom (Before Banking &amp; Terms)"
                      >
                        🔻 Bottom
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => moveSection(secIdx, secIdx - 1)}
                        disabled={secIdx === 0}
                        className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Up 1 step"
                        aria-label="Move pricing section up 1 step"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(secIdx, secIdx + 1)}
                        disabled={secIdx === sections.length - 1}
                        className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer"
                        title="Move Down 1 step"
                        aria-label="Move pricing section down 1 step"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div
                      className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                        isDraftWatermarkActive
                          ? "bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 border-2 border-amber-300 shadow-sm"
                          : "bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 border border-slate-200/90 shadow-2xs"
                      }`}
                    >
                      {/* Section Title Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200/80">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#0F3A2E] text-amber-300 flex items-center justify-center shadow-xs shrink-0">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-black text-[#0F3A2E] uppercase tracking-wider flex items-center gap-2">
                              <span>Commercial Quotation &amp; Investment Summary</span>
                              {isDraftWatermarkActive && (
                                <span className="px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                                  DRAFT QUOTE
                                </span>
                              )}
                            </h3>
                            <p className="text-[10px] text-slate-500">
                              All-inclusive expedition pricing • Certified transparent mountain operations.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            ✓ Permits &amp; Taxes Included
                          </span>
                        </div>
                      </div>

                      {/* 4 Cards Pricing Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Rate Per Person
                          </span>
                          <strong className="text-base sm:text-lg font-black text-[#0F3A2E] block mt-0.5">
                            ₹{pricePerPerson.toLocaleString("en-IN")}
                          </strong>
                          <span className="text-[10px] text-slate-500">All-Inclusive Base Fare</span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Group Size (Pax)
                          </span>
                          <strong className="text-base sm:text-lg font-black text-slate-800 block mt-0.5">
                            {paxCount} {paxCount === 1 ? "Traveler" : "Travelers"}
                          </strong>
                          <span className="text-[10px] text-slate-500">
                            {tour.duration || `${effectiveDays.length} Days`} Expedition
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Token Advance (30%)
                          </span>
                          <strong className="text-base sm:text-lg font-black text-blue-700 block mt-0.5">
                            ₹{Math.round(totalPrice * 0.3).toLocaleString("en-IN")}
                          </strong>
                          <span className="text-[10px] text-blue-600 font-semibold">Immediate Seat Lock</span>
                        </div>

                        <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-300 text-left sm:text-right shadow-2xs">
                          <span className="text-[10px] font-extrabold text-emerald-950 uppercase tracking-wider block">
                            Total Commercial Quote
                          </span>
                          <strong className="text-lg sm:text-xl font-black text-[#FF6B35] block mt-0.5">
                            ₹{totalPrice.toLocaleString("en-IN")}
                          </strong>
                          <span className="text-[10px] text-emerald-800 font-medium">Net Payable Amount</span>
                        </div>
                      </div>

                      {/* Payment Schedule & Milestones Bar */}
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-bold text-slate-700">Payment Milestones:</span>
                          <span className="flex items-center gap-1 font-semibold text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            30% Advance for Confirmation
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            70% Balance on Day 1 Arrival
                          </span>
                        </div>
                        {customDiscount && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                            🎁 {customDiscount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              if (sec.id === "title_summary") {
                return (
                  <div key={sec.id} className="relative group space-y-2">
                    <div className="no-print absolute -top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-300 shadow-2xs z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-bold text-slate-700">Overview</span>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx - 1)} disabled={secIdx === 0} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move overview section up" title="Move Up"><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx + 1)} disabled={secIdx === sections.length - 1} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move overview section down" title="Move Down"><ChevronDown className="w-3 h-3" /></button>
                    </div>
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
                );
              }

              if (sec.id === "stats_grid") {
                return (
                  <div key={sec.id} className="relative group page-break-inside-avoid">
                    <div className="no-print absolute -top-2.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-300 shadow-2xs z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-bold text-slate-700">Stats</span>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx - 1)} disabled={secIdx === 0} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move stats section up" title="Move Up"><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx + 1)} disabled={secIdx === sections.length - 1} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move stats section down" title="Move Down"><ChevronDown className="w-3 h-3" /></button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Pickup &amp; Drop</span>
                          <strong className="text-xs font-bold text-slate-900 truncate block max-w-[130px]">
                            {tour.pickupPoint || tour.location}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (sec.id === "custom_notes") {
                if (!customNotes) return null;
                return (
                  <div key={sec.id} className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 page-break-inside-avoid relative group">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="block font-bold">Seasonal Custom Advisory &amp; Inclusions:</strong>
                      <span className="mt-0.5 block leading-relaxed">{customNotes}</span>
                    </div>
                  </div>
                );
              }

              if (sec.id === "route_map") {
                return (
                  <div key={sec.id} className="pt-1 page-break-inside-avoid relative group">
                    <div className="no-print absolute top-0 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-300 shadow-2xs z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-bold text-slate-700">Route Map</span>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx - 1)} disabled={secIdx === 0} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move route map section up" title="Move Up"><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx + 1)} disabled={secIdx === sections.length - 1} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" aria-label="Move route map section down" title="Move Down"><ChevronDown className="w-3 h-3" /></button>
                    </div>
                    <ItineraryRouteMap
                      itinerary={pdfDays}
                      destination={tour.name}
                      pickupLocation={tour.pickupPoint || tour.pickupDrop}
                      dropLocation={tour.pickupPoint || tour.pickupDrop}
                    />
                  </div>
                );
              }

              if (sec.id === "itinerary_days") {
                return (
                  <div key={sec.id} className="space-y-3 pt-2 relative group">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h2 className="text-sm sm:text-base font-extrabold text-[#0F3A2E] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF6B35]" />
                        <span>Comprehensive Day-by-Day Expedition Schedule</span>
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="no-print text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1" data-pdf-ignore="true">
                          <GripVertical className="w-3 h-3 text-emerald-600" />
                          <span>Drag cards to reorder days</span>
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {pdfDays.length} Scheduled Days
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {pdfDays.map((dayItem: TrekItineraryDay, index: number) => (
                        <div
                          key={dayItem.day || index}
                          draggable
                          onDragStart={() => setDraggedDayIndex(index)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedDayIndex !== null && draggedDayIndex !== index) {
                              moveDay(draggedDayIndex, index);
                              setDraggedDayIndex(null);
                            }
                          }}
                          onDragEnd={() => setDraggedDayIndex(null)}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all page-break-inside-avoid text-xs relative group ${
                            draggedDayIndex === index
                              ? "opacity-40 border-emerald-500 bg-emerald-50/50 border-dashed ring-2 ring-emerald-500/30"
                              : "border-slate-200 bg-slate-50/50 hover:border-slate-300"
                          }`}
                        >
                          {/* Screen Only: Drag Handle & Move Controls */}
                          <div className="no-print absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 shadow-2xs border border-slate-200 rounded-lg p-0.5 z-10 opacity-70 group-hover:opacity-100 transition-opacity" data-pdf-ignore="true">
                            <button
                              type="button"
                              onClick={() => moveDay(index, index - 1)}
                              disabled={index === 0}
                              title="Move Day Earlier"
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveDay(index, index + 1)}
                              disabled={index === pdfDays.length - 1}
                              title="Move Day Later"
                              className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <div
                              title="Drag to reorder day"
                              className="p-1 text-slate-400 hover:text-emerald-700 cursor-grab active:cursor-grabbing rounded hover:bg-slate-100 transition-colors"
                            >
                              <GripVertical className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-slate-200/60 pr-20 sm:pr-24">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#0F3A2E] text-white flex flex-col items-center justify-center font-sans shrink-0 border border-white ring-1 ring-[#0F3A2E]/20 shadow-xs select-none">
                                <span className="text-[7px] font-bold uppercase leading-none">Day</span>
                                <span className="text-[11px] font-black leading-none mt-0.5">{dayItem.day}</span>
                              </div>
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

                          <div className="text-slate-600 leading-relaxed text-xs">
                            {parseInlineFormatting(dayItem.description)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sec.id === "inclusions_exclusions") {
                return (
                  <div key={sec.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 page-break-inside-avoid relative group">
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
                              <span className="flex-1 leading-relaxed">{parseInlineFormatting(inc)}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">✓</span>
                              <span>Certified Expedition Leader &amp; Experienced Local Mountain Guides</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">✓</span>
                              <span>All meals during expedition (nutritious vegetarian &amp; egg dishes)</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">✓</span>
                              <span>Dome tents, sub-zero sleeping bags &amp; insulated foam mattresses</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-emerald-700 font-bold shrink-0">✓</span>
                              <span>Forest permits, camping fees &amp; environmental entry taxes</span>
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
                              <span className="flex-1 leading-relaxed">{parseInlineFormatting(exc)}</span>
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
                );
              }

              if (sec.id === "gear_checklist") {
                return (
                  <div key={sec.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 page-break-inside-avoid relative group">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F3A2E]">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Safety Protocol &amp; Packing Essentials Checklist</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Trekking shoes with high ankle support &amp; deep grip, warm down jacket (-5°C rating),
                      moisture-wicking base layers, waterproof rain poncho, UV sunglasses (Cat 3/4), personal
                      first-aid kit, 2x reusable water bottles, headlamp with fresh batteries, government ID
                      original, and medical fitness self-declaration.
                    </p>
                  </div>
                );
              }

              if (sec.id === "cancellation_policy") {
                return (
                  <div key={sec.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5 page-break-inside-avoid relative group shadow-2xs">
                    {/* Screen Only: Move Controls & Quick Edit */}
                    <div className="no-print absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-300 shadow-2xs z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-bold text-slate-700">Cancellation Policy</span>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx - 1)} disabled={secIdx === 0} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" title="Move Up" aria-label="Move cancellation policy up"><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx + 1)} disabled={secIdx === sections.length - 1} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" title="Move Down" aria-label="Move cancellation policy down"><ChevronDown className="w-3 h-3" /></button>
                      <button type="button" onClick={() => setIsEditingPolicy(true)} className="p-0.5 text-emerald-700 hover:text-emerald-900 ml-1 cursor-pointer flex items-center gap-0.5" title="Edit Cancellation Policy Terms" aria-label="Edit cancellation policy terms">
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#0F3A2E]">
                            {cancellationPolicy.title}
                          </h3>
                          <span className="text-[10px] text-slate-500 font-medium">Transparent refund slabs &amp; mountain safety reschedule guarantee</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {cancellationPolicy.badge}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditingPolicy(true)}
                          className="no-print text-[10px] font-semibold text-slate-500 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Customize Policy</span>
                        </button>
                      </div>
                    </div>

                    {/* 4-Slab Timeline Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {cancellationPolicy.slabs.map((slab, sIdx) => (
                        <div key={sIdx} className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${slab.color}`}>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">{slab.timeline}</span>
                            <strong className="text-sm font-black block mt-0.5">{slab.refund}</strong>
                          </div>
                          <p className="text-[10px] mt-1.5 leading-snug opacity-90">{slab.note}</p>
                        </div>
                      ))}
                    </div>

                    {/* Rescheduling & Force Majeure Advisory */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Rescheduling:</strong> {cancellationPolicy.reschedulingNote}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span><strong>Weather &amp; Safety:</strong> {cancellationPolicy.weatherNote}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (sec.id === "banking_details") {
                return (
                  <div key={sec.id} className="my-6 page-break-inside-avoid relative group">
                    <ItineraryBankingDetails showSocials={true} />
                  </div>
                );
              }

              // =========================================================================
              // DYNAMIC CUSTOM SECTION WITH LUXURY DESIGN PRESETS
              // =========================================================================
              if (sec.isCustom) {
                return (
                  <div key={sec.id} className="relative group page-break-inside-avoid">
                    {/* Screen Only: Move, Edit & Delete Controls */}
                    <div className="no-print absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-slate-300 shadow-sm z-20 text-[10px]" data-pdf-ignore="true">
                      <span className="font-bold text-slate-700">{sec.label}</span>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx - 1)} disabled={secIdx === 0} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" title="Move Up" aria-label={`Move ${sec.label} up`}><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveSection(secIdx, secIdx + 1)} disabled={secIdx === sections.length - 1} className="p-0.5 hover:text-slate-900 disabled:opacity-20 cursor-pointer" title="Move Down" aria-label={`Move ${sec.label} down`}><ChevronDown className="w-3 h-3" /></button>
                      <button type="button" onClick={() => handleEditCustomSection(sec)} className="p-0.5 text-blue-600 hover:text-blue-800 ml-1 cursor-pointer flex items-center gap-0.5" title="Edit this custom section" aria-label={`Edit ${sec.label}`}>
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button type="button" onClick={() => handleDeleteCustomSection(sec.id)} className="p-0.5 text-rose-600 hover:text-rose-800 cursor-pointer" title="Delete section" aria-label={`Delete ${sec.label}`}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Style 1: Alpine Luxury Emerald Card */}
                    {(!sec.customStyle || sec.customStyle === "emerald-card") && (
                      <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#0F3A2E] text-white flex items-center justify-center font-bold">
                              {renderCustomIcon(sec.customIcon)}
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F3A2E]">{sec.label}</h3>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            {sec.shortTag || "Special Highlight"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-1">
                          {parseBulletPoints(sec.customContent || "").length > 1 ? (
                            <ul className="space-y-1.5 pt-0.5">
                              {parseBulletPoints(sec.customContent || "").map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">✦</span>
                                  <span className="leading-relaxed">{parseInlineFormatting(pt)}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{parseInlineFormatting(sec.customContent || "")}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Style 2: Amber Alert Box */}
                    {sec.customStyle === "amber-alert" && (
                      <div className="p-4 sm:p-5 rounded-2xl border border-amber-300 bg-amber-50/70 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                              {renderCustomIcon(sec.customIcon || "alert")}
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-amber-950">{sec.label}</h3>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                            {sec.shortTag || "Important Advisory"}
                          </span>
                        </div>
                        <div className="text-xs text-amber-950 leading-relaxed space-y-1">
                          {parseBulletPoints(sec.customContent || "").length > 1 ? (
                            <ul className="space-y-1.5 pt-0.5">
                              {parseBulletPoints(sec.customContent || "").map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="text-amber-700 font-bold shrink-0 mt-0.5">⚠️</span>
                                  <span className="leading-relaxed">{parseInlineFormatting(pt)}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>{parseInlineFormatting(sec.customContent || "")}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Style 3: 2-Column Checklist */}
                    {sec.customStyle === "bullet-list" && (
                      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#0F3A2E] text-emerald-300 flex items-center justify-center">
                              {renderCustomIcon(sec.customIcon || "check")}
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{sec.label}</h3>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{sec.shortTag || "Checklist"}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {parseBulletPoints(sec.customContent || "").map((point, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
                              <span className="text-emerald-600 font-bold mt-0.5 shrink-0">✓</span>
                              <span className="leading-relaxed">{parseInlineFormatting(point)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Style 4: Milestone Steps */}
                    {sec.customStyle === "milestone-steps" && (
                      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center">
                              {renderCustomIcon(sec.customIcon || "steps")}
                            </div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{sec.label}</h3>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{sec.shortTag || "Process Stages"}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {parseBulletPoints(sec.customContent || "").map((stepText, sIdx) => (
                            <div key={sIdx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col justify-between">
                              <span className="w-5 h-5 rounded-full bg-[#0F3A2E] text-white text-[10px] font-extrabold flex items-center justify-center mb-1.5">
                                {sIdx + 1}
                              </span>
                              <p className="text-xs text-slate-800 font-semibold leading-relaxed">{parseInlineFormatting(stepText)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Style 5: Quote Box / Personal Coordinator Note */}
                    {sec.customStyle === "quote-box" && (
                      <div className="p-4 sm:p-5 rounded-2xl border-2 border-dashed border-emerald-700/40 bg-emerald-50/40 shadow-2xs space-y-2 relative">
                        <span className="text-4xl text-emerald-800/20 font-serif absolute top-1 right-3 select-none">&ldquo;</span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-[#0F3A2E] flex items-center gap-2">
                          {renderCustomIcon(sec.customIcon || "quote")}
                          <span>{sec.label}</span>
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed italic font-serif pl-3 border-l-2 border-emerald-700">
                          {parseInlineFormatting(sec.customContent || "")}
                        </p>
                        <div className="text-right text-[10px] font-bold text-emerald-900 pt-1">
                          — {coordinatorName || "KRADIND Adventures Desk"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}

            {/* 9. FOOTER WITH AUTHORIZED SIGNATORY STAMP & EDITABLE CONTACT */}
            <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs page-break-inside-avoid">
              <div className="space-y-1">
                <span className="font-extrabold text-[#0F3A2E] text-sm block">
                  KRADIND
                </span>
                <p className="text-[10px] text-slate-500 max-w-md">
                  Official client itinerary generated on {issueDate}. For booking confirmations,
                  slot reservations, or customized inquiries, contact your dedicated coordinator: <strong>{coordinatorName}</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-semibold text-emerald-800 pt-0.5">
                  <span>Helpline: {contactHelpline}</span>
                  <span>•</span>
                  <span>WhatsApp: {contactWhatsApp}</span>
                  <span>•</span>
                  <span>Email: {contactEmail}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingContact(true)}
                    className="no-print ml-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
                    title="Click to edit contact numbers and coordinator"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Contact</span>
                  </button>
                </div>
              </div>

              {/* Authorized Seal */}
              <div className="text-center sm:text-right border-2 border-dashed border-emerald-800/40 rounded-xl p-3 bg-emerald-50/50 min-w-[170px] relative group">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Official Verification
                </div>
                <div className="font-extrabold text-xs text-[#0F3A2E] mt-0.5">
                  KRADIND
                </div>
                <div className="text-[9px] text-emerald-700 font-semibold">
                  {officeLocation}
                </div>
                <div className="text-[8px] text-slate-400 mt-1 font-mono">
                  REF: {quoteRefId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: CONTACT INFO EDITOR (SCREEN ONLY) */}
        {/* ========================================================================= */}
        {isEditingContact && (
          <div className="no-print fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-[#0F3A2E]">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold">Edit PDF Contact &amp; Coordinator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingContact(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Helpline Number (Call Support)</label>
                  <input
                    type="text"
                    value={contactHelpline}
                    onChange={(e) => setContactHelpline(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="+91 9797941414"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={contactWhatsApp}
                    onChange={(e) => setContactWhatsApp(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="+91 9797941414"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Support Email</label>
                  <input
                    type="text"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="Info@kradind.com"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Trip Coordinator Name</label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="Dedicated Trip Coordinator"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Office / Hub Verification Seal Text</label>
                  <input
                    type="text"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                    placeholder="Certified Operator • Dehradun"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setContactHelpline("+91 9797941414");
                    setContactWhatsApp("+91 9797941414");
                    setContactEmail("Info@kradind.com");
                    setCoordinatorName("Dedicated Trip Coordinator");
                    setOfficeLocation("Certified Operator • Dehradun");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingContact(false)}
                  className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Save &amp; Update PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: CANCELLATION POLICY CUSTOMIZER (SCREEN ONLY) */}
        {/* ========================================================================= */}
        {isEditingPolicy && (
          <div className="no-print fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-[#0F3A2E]">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-extrabold">Customize Cancellation &amp; Refund Policy</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPolicy(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Policy Section Title</label>
                  <input
                    type="text"
                    value={cancellationPolicy.title}
                    onChange={(e) => setCancellationPolicy({ ...cancellationPolicy, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-slate-700 block">4 Refund Slabs Timeline</label>
                  {cancellationPolicy.slabs.map((slab, sIdx) => (
                    <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                      <input
                        type="text"
                        value={slab.timeline}
                        onChange={(e) => {
                          const updated = [...cancellationPolicy.slabs];
                          updated[sIdx] = { ...updated[sIdx], timeline: e.target.value };
                          setCancellationPolicy({ ...cancellationPolicy, slabs: updated });
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                        placeholder="Timeline"
                      />
                      <input
                        type="text"
                        value={slab.refund}
                        onChange={(e) => {
                          const updated = [...cancellationPolicy.slabs];
                          updated[sIdx] = { ...updated[sIdx], refund: e.target.value };
                          setCancellationPolicy({ ...cancellationPolicy, slabs: updated });
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#0F3A2E]"
                        placeholder="Refund %"
                      />
                      <input
                        type="text"
                        value={slab.note}
                        onChange={(e) => {
                          const updated = [...cancellationPolicy.slabs];
                          updated[sIdx] = { ...updated[sIdx], note: e.target.value };
                          setCancellationPolicy({ ...cancellationPolicy, slabs: updated });
                        }}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        placeholder="Details note"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rescheduling Guarantee Note</label>
                  <textarea
                    rows={2}
                    value={cancellationPolicy.reschedulingNote}
                    onChange={(e) => setCancellationPolicy({ ...cancellationPolicy, reschedulingNote: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Force Majeure &amp; Weather Safety Policy</label>
                  <textarea
                    rows={2}
                    value={cancellationPolicy.weatherNote}
                    onChange={(e) => setCancellationPolicy({ ...cancellationPolicy, weatherNote: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCancellationPolicy(DEFAULT_CANCELLATION_POLICY)}
                  className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset Standard Policy
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingPolicy(false)}
                  className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Apply to Itinerary
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: ADD / EDIT CUSTOM SECTION WITH 5 DESIGN PRESETS (SCREEN ONLY) */}
        {/* ========================================================================= */}
        {isAddSectionModalOpen && (
          <div className="no-print fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Header */}
              <div className="bg-[#0F3A2E] text-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold leading-tight">
                      {editingSectionId ? "Edit Custom PDF Section" : "Add New Custom Section with Design"}
                    </h3>
                    <span className="text-[11px] text-emerald-200/80">
                      Choose from 5 luxury design styles and 1-click templates
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
                {/* Quick 1-Click Templates */}
                {!editingSectionId && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      ⚡ Quick Preset Templates (1-Click Fill):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => applySectionPresetTemplate("flight")}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-[11px] font-semibold text-slate-800 hover:text-amber-900 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Plane className="w-3 h-3 text-amber-600" />
                        <span>Flight &amp; Train Advisory</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => applySectionPresetTemplate("payment")}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 text-[11px] font-semibold text-slate-800 hover:text-teal-900 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <CreditCard className="w-3 h-3 text-teal-600" />
                        <span>Payment Milestone Plan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => applySectionPresetTemplate("perks")}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-[11px] font-semibold text-slate-800 hover:text-emerald-900 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>VIP Perks &amp; Inclusions</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => applySectionPresetTemplate("medical")}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-[11px] font-semibold text-slate-800 hover:text-blue-900 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span>Medical Fitness Check</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => applySectionPresetTemplate("message")}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-purple-400 text-[11px] font-semibold text-slate-800 hover:text-purple-900 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <Quote className="w-3 h-3 text-purple-600" />
                        <span>Coordinator Letter</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Section Title & Short Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Section Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customSecTitle}
                      onChange={(e) => setCustomSecTitle(e.target.value)}
                      placeholder="e.g. Special Group Inclusions & Highlights"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Badge / Short Tag
                    </label>
                    <input
                      type="text"
                      value={customSecShortTag}
                      onChange={(e) => setCustomSecShortTag(e.target.value)}
                      placeholder="e.g. VIP Inclusions"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                    />
                  </div>
                </div>

                {/* Choose Design Style Preset */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Select Design Style Preset:</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {[
                      { id: "emerald-card", title: "Alpine Luxury", desc: "Emerald gradient, header icon & highlight card", color: "border-emerald-500 bg-emerald-50/50" },
                      { id: "amber-alert", title: "Advisory Box", desc: "Warm amber alert box with notice badges", color: "border-amber-500 bg-amber-50/50" },
                      { id: "bullet-list", title: "2-Column List", desc: "Structured dual-column checkmark list", color: "border-slate-400 bg-slate-50" },
                      { id: "milestone-steps", title: "Stage Steps", desc: "Numbered stages (1, 2, 3...) in step cards", color: "border-teal-500 bg-teal-50/50" },
                      { id: "quote-box", title: "Personal Letter", desc: "Italicized note with coordinator sign", color: "border-purple-400 bg-purple-50/50" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setCustomSecStyle(style.id as CustomSectionStyle)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          customSecStyle === style.id
                            ? `${style.color} ring-2 ring-emerald-600 shadow-xs font-bold`
                            : "border-slate-200 bg-white hover:border-slate-300 opacity-80"
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{style.title}</div>
                        <div className="text-[10px] text-slate-500 leading-snug mt-0.5">{style.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Picker */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Section Header Icon:
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "sparkles", label: "Sparkles", icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" /> },
                      { id: "shield", label: "Safety Shield", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> },
                      { id: "alert", label: "Notice Alert", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
                      { id: "check", label: "Verified Check", icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> },
                      { id: "plane", label: "Flight / Travel", icon: <Plane className="w-3.5 h-3.5 text-sky-600" /> },
                      { id: "credit", label: "Payment / Bank", icon: <CreditCard className="w-3.5 h-3.5 text-emerald-700" /> },
                      { id: "steps", label: "Award / Steps", icon: <Award className="w-3.5 h-3.5 text-amber-600" /> },
                      { id: "quote", label: "Personal Quote", icon: <Quote className="w-3.5 h-3.5 text-purple-600" /> },
                    ].map((ic) => (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setCustomSecIcon(ic.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition cursor-pointer ${
                          customSecIcon === ic.id
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-600"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {ic.icon}
                        <span className="text-[11px]">{ic.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Field */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Section Content (Supports **bold**, newlines &amp; bullet points):
                  </label>
                  <textarea
                    rows={5}
                    value={customSecContent}
                    onChange={(e) => setCustomSecContent(e.target.value)}
                    placeholder="Type your content here or use bullet points like:
• Point 1: **Important highlight**
• Point 2: Specific timing or details
• Point 3: Additional coordinator instructions"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs leading-relaxed font-sans text-slate-800 focus:ring-2 focus:ring-[#0F3A2E]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    💡 Tip: Lines starting with • or numbers will automatically format cleanly in bullet and step styles.
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!customSecTitle.trim()}
                  onClick={handleSaveCustomSection}
                  className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingSectionId ? "Save Changes" : "Add to Itinerary PDF"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

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
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    autoComplete="tel-national"
                    required
                    value={queryPhone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setQueryPhone(digits);
                    }}
                    placeholder="97979 41414"
                    className="w-full pl-16 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F3A2E] focus:outline-none transition font-mono tracking-wider"
                  />
                  <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold ${
                    queryPhone.length === 10 ? "text-emerald-600" : "text-slate-400"
                  }`}>
                    {queryPhone.length}/10
                  </span>
                </div>
                {queryPhone.length > 0 && queryPhone.length < 10 && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    Please enter complete 10-digit mobile number ({10 - queryPhone.length} digits left).
                  </p>
                )}
                {queryPhone.length === 10 && !/^[6-9]/.test(queryPhone) && (
                  <p className="text-[11px] text-rose-600 font-medium mt-1">
                    Number should start with 6, 7, 8, or 9.
                  </p>
                )}
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
                  placeholder="Enter your email address"
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
