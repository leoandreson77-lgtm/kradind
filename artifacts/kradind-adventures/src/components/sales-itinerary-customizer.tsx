"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  X,
  Sun,
  CloudRain,
  Leaf,
  Snowflake,
  Flower2,
  Sparkles,
  Calendar,
  Users,
  DollarSign,
  FileText,
  MessageCircle,
  Copy,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Mountain,
  Printer,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Save,
  UploadCloud,
  Download,
  ExternalLink,
  Search,
  AlertCircle,
  ShieldCheck,
  Eye,
  Share2,
} from "lucide-react";
import { TrekData, TrekItineraryDay } from "@/lib/cms-store";
import { ItineraryPdfModal } from "@/components/itinerary-pdf-modal";
import { ItineraryBankingDetails } from "@/components/itinerary-banking-details";

export interface SalesCustomizerDraft {
  id: string;
  tourId: string | number;
  tourSlug: string;
  tourName: string;
  clientName: string;
  paxCount: number;
  departureDate: string;
  quotePrice: number;
  totalPrice: number;
  specialDiscount: string;
  salesAgentName: string;
  customAdvisory: string;
  selectedSeason: string;
  days: TrekItineraryDay[];
  crmProposalId?: string;
  createdAt: string;
  updatedAt: string;
}

const SALES_AUTO_SAVE_PREFIX = "kradind_sales_customizer_autosave_";
const SALES_SAVED_DRAFTS_KEY = "kradind_sales_customizer_saved_drafts";

interface SeasonPreset {
  id: string;
  name: string;
  icon: string;
  months: string;
  badgeColor: string;
  advisory: string;
  includedGear: string[];
}

const SEASON_PRESETS: SeasonPreset[] = [
  {
    id: "summer",
    name: "Summer Season",
    icon: "☀️",
    months: "April – June",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    advisory:
      "Comfortable daytime temperatures with clear views. Snow patches at high passes. Sun-protection (SPF 50, UV sunglasses) recommended.",
    includedGear: ["UV Cap", "Trekking Poles", "Light Fleece", "Hydration Bag"],
  },
  {
    id: "monsoon",
    name: "Monsoon Flora & Bugyals",
    icon: "🌧️",
    months: "July – August",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    advisory:
      "Vibrant green alpine bugyals and blooming wildflowers. Streams and waterfalls are at their peak. Waterproof ponchos and rain-covers are mandatory.",
    includedGear: ["Waterproof Rain Poncho", "Dry-Bags", "Anti-Leech Socks", "Quick-Dry Pants"],
  },
  {
    id: "autumn",
    name: "Autumn Clear Skies",
    icon: "🍂",
    months: "September – November",
    badgeColor: "bg-orange-100 text-orange-900 border-orange-300",
    advisory:
      "Crisp, crystal-clear skies offering the highest mountain visibility of the year. Golden meadows with cool night air (-2°C at camps).",
    includedGear: ["Warm Beanie", "Thermal Base Layers", "Windcheater Jacket", "Camera Lens Pouch"],
  },
  {
    id: "winter",
    name: "Winter Snow Trek",
    icon: "❄️",
    months: "December – March",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
    advisory:
      "Pristine snow blanket covering trails and pine forests. Sub-zero temperatures (-5°C to -10°C at summit). Microspikes and gaiters provided by KRADIND.",
    includedGear: ["Microspikes / Crampons", "Snow Gaiters", "Sub-Zero Sleeping Bags (-10°C)", "Insulated Gloves"],
  },
  {
    id: "spring",
    name: "Spring Awakening",
    icon: "🌸",
    months: "March – April",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    advisory:
      "Melting snow trails with blooming pink and red rhododendrons. Moderate trail difficulty and pleasant sunshine.",
    includedGear: ["Trail Gaiters", "Sunglasses", "Mid-Weight Fleece", "Trekking Pole"],
  },
];

export interface SalesCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  tour: TrekData | any;
}

export function SalesItineraryCustomizer({
  isOpen,
  onClose,
  tour,
}: SalesCustomizerProps) {
  const [selectedSeason, setSelectedSeason] = useState<string>("autumn");
  const [clientName, setClientName] = useState<string>("Valued Client");
  const [paxCount, setPaxCount] = useState<number>(2);
  const [departureDate, setDepartureDate] = useState<string>("Flexible Dates / 2026");
  const [quotePrice, setQuotePrice] = useState<number>(tour?.price || 9999);
  const [specialDiscount, setSpecialDiscount] = useState<string>("Special Group Pricing Applied");
  const [salesAgentName, setSalesAgentName] = useState<string>("KRAD Sales Team");
  const [customAdvisory, setCustomAdvisory] = useState<string>("");
  const [days, setDays] = useState<TrekItineraryDay[]>([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"details" | "itinerary" | "export" | "drafts">("details");

  // Drafts & CRM Integration State
  const [showDraftWatermark, setShowDraftWatermark] = useState<boolean>(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");
  const [hasRecoveredDraft, setHasRecoveredDraft] = useState<boolean>(false);
  const [recoveredDraftData, setRecoveredDraftData] = useState<any>(null);
  const [savedDrafts, setSavedDrafts] = useState<SalesCustomizerDraft[]>([]);
  const [draftSearch, setDraftSearch] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [savingToCrm, setSavingToCrm] = useState<boolean>(false);
  const [crmSuccessLink, setCrmSuccessLink] = useState<{ id: string; url: string } | null>(null);

  const isRestoringRef = useRef<boolean>(false);
  const autoSaveTimerRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Load default tour itinerary & check saved drafts + auto-save on initial open
  useEffect(() => {
    if (tour && tour.itinerary) {
      setDays(JSON.parse(JSON.stringify(tour.itinerary)));
      setQuotePrice(tour.price || 9999);
      // Auto-select season if tour has a matching badge
      const name = (tour.name || "").toLowerCase();
      if (name.includes("winter") || name.includes("snow") || name.includes("kedarkantha")) {
        setSelectedSeason("winter");
      } else if (name.includes("valley of flowers") || name.includes("monsoon")) {
        setSelectedSeason("monsoon");
      }
    }

    if (typeof window !== "undefined" && tour) {
      try {
        // Load saved drafts list
        const rawSaved = localStorage.getItem(SALES_SAVED_DRAFTS_KEY);
        if (rawSaved) {
          setSavedDrafts(JSON.parse(rawSaved));
        }

        // Check for active auto-save draft for this tour
        const draftKey = `${SALES_AUTO_SAVE_PREFIX}${tour.id || tour.slug || "default"}`;
        const rawDraft = localStorage.getItem(draftKey);
        if (rawDraft) {
          const parsed = JSON.parse(rawDraft);
          // If draft has meaningful user input
          if (
            parsed.clientName &&
            (parsed.clientName !== "Valued Client" ||
              parsed.quotePrice !== (tour.price || 9999) ||
              (parsed.days && parsed.days.length !== (tour.itinerary?.length || 0)) ||
              (parsed.departureDate && parsed.departureDate !== "Flexible Dates / 2026"))
          ) {
            setRecoveredDraftData(parsed);
            setHasRecoveredDraft(true);
          }
        }
      } catch (err) {
        console.warn("Error reading local sales drafts:", err);
      }
    }
  }, [tour]);

  // Live Auto-Save to Browser Storage
  useEffect(() => {
    if (!tour || typeof window === "undefined" || !isOpen) return;
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSaveStatus("Saving...");

    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const draftKey = `${SALES_AUTO_SAVE_PREFIX}${tour.id || tour.slug || "default"}`;
        const draftPayload = {
          tourId: tour.id || tour.slug,
          tourSlug: tour.slug || "",
          tourName: tour.name || "",
          clientName,
          paxCount,
          departureDate,
          quotePrice,
          totalPrice: quotePrice * paxCount,
          specialDiscount,
          salesAgentName,
          customAdvisory,
          selectedSeason,
          days,
          updatedAt: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
        localStorage.setItem(draftKey, JSON.stringify(draftPayload));
        setAutoSaveStatus(`Auto-saved at ${draftPayload.updatedAt}`);
      } catch (err) {
        setAutoSaveStatus("Save error");
      }
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    tour,
    clientName,
    paxCount,
    departureDate,
    quotePrice,
    specialDiscount,
    salesAgentName,
    customAdvisory,
    selectedSeason,
    days,
    isOpen,
  ]);

  // Discard Auto-Save
  const handleDiscardAutoSave = () => {
    if (!tour || typeof window === "undefined") return;
    try {
      const draftKey = `${SALES_AUTO_SAVE_PREFIX}${tour.id || tour.slug || "default"}`;
      localStorage.removeItem(draftKey);
    } catch {}
    setHasRecoveredDraft(false);
    setRecoveredDraftData(null);
    if (tour.itinerary) {
      setDays(JSON.parse(JSON.stringify(tour.itinerary)));
      setQuotePrice(tour.price || 9999);
      setClientName("Valued Client");
      setPaxCount(2);
      setDepartureDate("Flexible Dates / 2026");
      setSpecialDiscount("Special Group Pricing Applied");
    }
    showToast("Auto-saved draft discarded. Reset to catalog defaults.");
  };

  // Restore Draft into Form
  const handleRestoreDraft = (draft: any) => {
    isRestoringRef.current = true;
    if (draft.clientName) setClientName(draft.clientName);
    if (draft.paxCount) setPaxCount(draft.paxCount);
    if (draft.departureDate) setDepartureDate(draft.departureDate);
    if (draft.quotePrice) setQuotePrice(draft.quotePrice);
    if (draft.specialDiscount !== undefined) setSpecialDiscount(draft.specialDiscount);
    if (draft.salesAgentName) setSalesAgentName(draft.salesAgentName);
    if (draft.customAdvisory) setCustomAdvisory(draft.customAdvisory);
    if (draft.selectedSeason) setSelectedSeason(draft.selectedSeason);
    if (draft.days && draft.days.length > 0) setDays(draft.days);
    setHasRecoveredDraft(false);
    showToast(`⚡ Restored draft for "${draft.clientName || "Client"}"!`);
  };

  // Save Current Form as Named Draft
  const handleSaveAsDraft = () => {
    if (!tour || typeof window === "undefined") return;
    try {
      const newDraft: SalesCustomizerDraft = {
        id: `DRAFT-${Date.now().toString(36).toUpperCase()}`,
        tourId: tour.id || tour.slug || "custom",
        tourSlug: tour.slug || "",
        tourName: tour.name || "Custom Tour",
        clientName: clientName.trim() || "Valued Client",
        paxCount,
        departureDate,
        quotePrice,
        totalPrice: quotePrice * paxCount,
        specialDiscount,
        salesAgentName,
        customAdvisory,
        selectedSeason,
        days,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      const updated = [newDraft, ...savedDrafts.filter((d) => d.id !== newDraft.id)].slice(0, 50);
      setSavedDrafts(updated);
      localStorage.setItem(SALES_SAVED_DRAFTS_KEY, JSON.stringify(updated));
      showToast(`💾 Saved draft: "${newDraft.clientName}" (${tour.name})`);
    } catch (err) {
      console.warn("Failed to save draft:", err);
      alert("Storage limit reached or local storage unavailable.");
    }
  };

  // Delete Saved Draft
  const handleDeleteSavedDraft = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete draft "${name}"?`)) return;
    const updated = savedDrafts.filter((d) => d.id !== id);
    setSavedDrafts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(SALES_SAVED_DRAFTS_KEY, JSON.stringify(updated));
    }
    showToast(`🗑️ Draft "${name}" deleted.`);
  };

  // 1-Click Push to CRM Proposals (as Draft)
  const handlePushToCrm = async (targetDraft?: SalesCustomizerDraft) => {
    setSavingToCrm(true);
    try {
      const targetDays = targetDraft ? targetDraft.days : days;
      const targetClient = targetDraft ? targetDraft.clientName : clientName;
      const targetPax = targetDraft ? targetDraft.paxCount : paxCount;
      const targetPrice = targetDraft ? targetDraft.quotePrice : quotePrice;
      const targetTotal = targetPrice * targetPax;
      const targetDate = targetDraft ? targetDraft.departureDate : departureDate;

      const payload = {
        customerName: targetClient,
        customerPhone: "",
        customerEmail: "",
        customerCity: "",
        packageTitle: `${tour.name} (${currentPreset.name})`,
        basePackageSlug: tour.slug || "",
        packageType: tour.type || "Trek",
        destination: tour.location || "Uttarakhand",
        duration: `${targetDays.length} Days`,
        startDate: targetDate,
        adultsCount: targetPax,
        totalPrice: targetTotal,
        pricePerPerson: targetPrice,
        advanceRequired: Math.round(targetTotal * 0.3),
        status: "Draft",
        hotelCategory: "Standard",
        transportOption: "Included (Tempo / SUV)",
        coordinatorName: salesAgentName,
        internalNotes: `Pushed from Sales Customizer. Discount: ${specialDiscount || "None"}. Season: ${currentPreset.name}`,
        cancellationPolicy: "Standard KRADIND Cancellation Policy",
        itinerary: targetDays.map((d: any) => ({
          day: d.day,
          title: d.title,
          description: d.description,
          stay: d.stay || "Alpine Camp / Hotel",
          mealPlan: d.meal || "All Meals Included",
          distance: d.distance || "",
          altitude: d.altitude || "",
        })),
        termsConditions:
          "1. 30% advance deposit to confirm. 2. Remaining balance due on Day 1. 3. Standard cancellation policies apply.",
        salesRepresentative: salesAgentName,
      };

      const res = await fetch("/api/admin/crm/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save proposal to CRM");
      }

      const savedProposal = await res.json();
      setCrmSuccessLink({
        id: savedProposal.id,
        url: `/admin/crm?tab=drafts`,
      });
      showToast(`🎉 Draft saved to CRM Hub (#${savedProposal.id})!`);

      // If pushing a saved draft, annotate it
      if (targetDraft && typeof window !== "undefined") {
        const updatedList = savedDrafts.map((d) =>
          d.id === targetDraft.id ? { ...d, crmProposalId: savedProposal.id } : d
        );
        setSavedDrafts(updatedList);
        localStorage.setItem(SALES_SAVED_DRAFTS_KEY, JSON.stringify(updatedList));
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to push draft to CRM. Please verify admin session or network.");
    } finally {
      setSavingToCrm(false);
    }
  };

  // Update advisory when season changes
  useEffect(() => {
    const preset = SEASON_PRESETS.find((s) => s.id === selectedSeason);
    if (preset) {
      setCustomAdvisory(
        `[${preset.name} Edition • ${preset.months}]: ${preset.advisory} Standard gear includes: ${preset.includedGear.join(", ")}.`
      );
    }
  }, [selectedSeason]);

  if (!isOpen || !tour) return null;

  const currentPreset = SEASON_PRESETS.find((s) => s.id === selectedSeason) || SEASON_PRESETS[0];
  const totalPrice = quotePrice * paxCount;

  // Day editor handlers
  const handleUpdateDay = (index: number, field: keyof TrekItineraryDay, value: any) => {
    const updated = [...days];
    updated[index] = { ...updated[index], [field]: value };
    setDays(updated);
  };

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const newDay: TrekItineraryDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum}: Scenic Exploration / Acclimatization`,
      description: "Exploration of the alpine vicinity, photography points, and acclimatization walk. Hot local lunch and overnight stay in camp.",
      distance: "4 km",
      altitude: "9,500 Ft",
      stay: "Alpine Tents / Eco Resort",
      meal: "Breakfast, Lunch & Dinner",
    };
    setDays([...days, newDay]);
  };

  const handleDeleteDay = (index: number) => {
    const filtered = days.filter((_, i) => i !== index);
    const renumbered = filtered.map((d, i) => ({ ...d, day: i + 1 }));
    setDays(renumbered);
  };

  const [draggedDayIndex, setDraggedDayIndex] = useState<number | null>(null);

  const moveDay = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= days.length) return;
    const reordered = [...days];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setDays(reordered.map((d, i) => ({ ...d, day: i + 1 })));
  };

  const handleDragDayStart = (e: React.DragEvent, index: number) => {
    setDraggedDayIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragDayOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropDay = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedDayIndex === null || draggedDayIndex === dropIndex) return;
    const reordered = [...days];
    const [moved] = reordered.splice(draggedDayIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    setDays(reordered.map((d, i) => ({ ...d, day: i + 1 })));
    setDraggedDayIndex(null);
  };

  const handleResetDays = () => {
    if (tour.itinerary) {
      setDays(JSON.parse(JSON.stringify(tour.itinerary)));
    }
  };

  // WhatsApp Pitch Formatter
  const generateWhatsAppPitch = () => {
    return (
      `*🏔️ KRADIND ADVENTURES - CUSTOMIZED TRIP QUOTATION*\n` +
      `------------------------------------------------\n` +
      `*Hello ${clientName}!* Thank you for choosing KRADIND Adventures.\n` +
      `Here is your tailored proposal for *${tour.name}*:\n\n` +
      `*🗓️ Season Edition:* ${currentPreset.name} (${currentPreset.months})\n` +
      `*👥 Group Size:* ${paxCount} ${paxCount === 1 ? "Person" : "Persons"}\n` +
      `*📅 Departure Schedule:* ${departureDate}\n` +
      `*⏱️ Duration:* ${days.length} Days / ${Math.max(1, days.length - 1)} Nights\n` +
      `*📍 Location:* ${tour.location}\n\n` +
      `*💰 COMMERCIAL QUOTATION:*\n` +
      `• *Rate per Person:* ₹${quotePrice.toLocaleString("en-IN")}/- all-inclusive\n` +
      `• *Total Group Quote:* ₹${totalPrice.toLocaleString("en-IN")}/-\n` +
      (specialDiscount ? `• *Special Offer:* ${specialDiscount}\n` : "") +
      `\n*✨ SEASONAL HIGHLIGHTS & GEAR:*\n` +
      `${currentPreset.advisory}\n` +
      `*Included Equipment:* ${currentPreset.includedGear.join(", ")}\n\n` +
      `*📋 DAY-BY-DAY SCHEDULE:* \n` +
      days
        .map(
          (d) =>
            `• *Day ${d.day}:* ${d.title}${d.distance ? ` (${d.distance})` : ""}`
        )
        .join("\n") +
      `\n\n*🏦 OFFICIAL BANK & UPI DETAILS FOR TOKEN DEPOSIT:*\n` +
      `• *Bank:* ICICI Bank\n` +
      `• *Account Name:* KRAD GLOBAL EXIM (INDIA) PRIVATE LIMITED\n` +
      `• *Current A/C No:* 778305500099\n` +
      `• *IFSC Code:* ICIC0000021\n` +
      `• *Instant UPI ID:* 9999797269.ibz@icici\n` +
      `• *Eazypay UPI ID:* mskradglobaleximindiaprivatelimited.eazypay@icici\n\n` +
      `*📱 FOLLOW OUR ADVENTURES (SOCIAL LINKS):*\n` +
      `• Instagram: https://instagram.com/kradind_adventures\n` +
      `• Facebook: https://facebook.com/kradind\n` +
      `• YouTube: https://youtube.com/@kradind\n` +
      `• WhatsApp: https://wa.me/919797941414\n\n` +
      `📄 *Official Itinerary PDF & Branded Proposal Available on Request.*\n` +
      `📞 Coordinator: ${salesAgentName} (+91 9797941414)\n` +
      `🌐 Website: https://kradind.com/treks/${tour.slug}`
    );
  };

  const handleCopyPitch = () => {
    const text = generateWhatsAppPitch();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2200);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppPitch());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <>
      <div className="fixed inset-0 z-[9990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:hidden">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="bg-[#0F3A2E] text-white px-5 sm:px-7 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold leading-tight">
                    Seasonal Itinerary & Quote Customizer
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    Sales Pro
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 mt-0.5">
                  Package: <strong className="text-white">{tour.name}</strong> • Adapt according to season, client budget & dates.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {autoSaveStatus && (
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-200 text-[11px] font-medium border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{autoSaveStatus}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition shadow-xs cursor-pointer"
                title="Save current proposal customization as local draft"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handlePushToCrm()}
                disabled={savingToCrm}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 cursor-pointer disabled:opacity-50"
                title="Save to CRM Proposals database as Draft"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                <span>{savingToCrm ? "Saving..." : "Save to CRM"}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100/80 border-b border-slate-200 px-5 sm:px-7 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "details"
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>1. Client & Season Config</span>
            </button>

            <button
              onClick={() => setActiveTab("itinerary")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "itinerary"
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>2. Day-by-Day Editor ({days.length} Days)</span>
            </button>

            <button
              onClick={() => setActiveTab("export")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "export"
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-amber-500" />
              <span>3. Export Branded PDF & WhatsApp Pitch</span>
            </button>

            <button
              onClick={() => setActiveTab("drafts")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === "drafts"
                  ? "bg-amber-500 text-slate-950 shadow-xs font-extrabold"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>4. Saved Drafts Hub</span>
              {savedDrafts.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    activeTab === "drafts"
                      ? "bg-slate-950 text-amber-300"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}
                >
                  {savedDrafts.length}
                </span>
              )}
            </button>
          </div>

          {/* Auto-Saved Draft Restored Banner */}
          {hasRecoveredDraft && recoveredDraftData && (
            <div className="bg-amber-50 border-b border-amber-200 px-5 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-950 animate-fade-in shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold">⚡ Unsaved Sales Draft Restored:</span>{" "}
                  <span>
                    Client: <strong>{recoveredDraftData.clientName}</strong> • {recoveredDraftData.days?.length || 0} Days • Quote:{" "}
                    <strong>
                      ₹{(recoveredDraftData.quotePrice * (recoveredDraftData.paxCount || 1))?.toLocaleString("en-IN")}
                    </strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => handleRestoreDraft(recoveredDraftData)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
                >
                  Restore Into Form
                </button>
                <button
                  type="button"
                  onClick={handleDiscardAutoSave}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition border border-slate-300 cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: CLIENT & SEASON CONFIG */}
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* 1. SEASON SELECTION CARDS */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                      <span>Select Travel Season Edition:</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Adapts packing list, weather gear & route notes
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {SEASON_PRESETS.map((preset) => {
                      const isSelected = selectedSeason === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedSeason(preset.id)}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? "border-[#0F3A2E] bg-emerald-50/60 ring-2 ring-[#0F3A2E]/20"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-xl">{preset.icon}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#0F3A2E]" />
                            )}
                          </div>
                          <div>
                            <span className="text-xs font-bold block text-slate-900 leading-tight">
                              {preset.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {preset.months}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Season Preview Banner */}
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
                    <span className="text-2xl mt-0.5">{currentPreset.icon}</span>
                    <div className="space-y-1">
                      <div className="font-extrabold flex items-center gap-2">
                        <span>{currentPreset.name} Advisory & Requirements:</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
                          {currentPreset.months}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        {currentPreset.advisory}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="font-bold text-amber-950">Seasonal Gear Provided:</span>
                        {currentPreset.includedGear.map((g, i) => (
                          <span
                            key={i}
                            className="bg-white/90 border border-amber-300 px-2 py-0.5 rounded-md font-semibold text-amber-900"
                          >
                            ✓ {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. CLIENT & QUOTE CONFIGURATION */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#0F3A2E]" />
                    <span>Client Details & Commercial Quote</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Client / Lead Name *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Rahul Sharma & Family"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Traveller Pax Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={paxCount}
                        onChange={(e) => setPaxCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Proposed Travel Dates / Month
                      </label>
                      <input
                        type="text"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        placeholder="e.g. 15th to 20th Oct 2026"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Custom Rate / Person (₹)
                      </label>
                      <input
                        type="number"
                        step={100}
                        value={quotePrice}
                        onChange={(e) => setQuotePrice(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-[#0F3A2E] focus:ring-2 focus:ring-[#0F3A2E]"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Original Catalog Rate: ₹{tour.price?.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Total Commercial Quote
                      </label>
                      <div className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-extrabold text-[#0F3A2E] flex items-center justify-between">
                        <span>Total ({paxCount} Pax):</span>
                        <span className="text-sm">₹{totalPrice.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Discount / Special Offer Note
                      </label>
                      <input
                        type="text"
                        value={specialDiscount}
                        onChange={(e) => setSpecialDiscount(e.target.value)}
                        placeholder="e.g. Early Bird 10% Off Applied"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0F3A2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Custom Inclusions / Advisory Note (shown on PDF & quote)
                    </label>
                    <textarea
                      rows={2}
                      value={customAdvisory}
                      onChange={(e) => setCustomAdvisory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-[#0F3A2E]"
                      placeholder="Add any client-specific notes like private vehicle pickup, hotel upgrade, or dietary preferences..."
                    />
                  </div>
                </div>

                {/* 3. DRAFT & PDF SECURITY WATERMARK SETTINGS */}
                <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Draft Quotation &amp; PDF Watermark Settings</span>
                    </h3>
                    <span className="text-[11px] font-semibold text-amber-800">
                      Proposal Status: <strong>Draft / Custom</strong>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 p-3 rounded-xl border border-amber-200">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={showDraftWatermark}
                        onChange={(e) => setShowDraftWatermark(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                      />
                      <span>Show "DRAFT PROPOSAL" Watermark &amp; Header Stamp on PDF</span>
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Prevents unconfirmed bookings from being treated as final vouchers.
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSaveAsDraft}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save as Named Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePushToCrm()}
                      disabled={savingToCrm}
                      className="px-3.5 py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                      <span>{savingToCrm ? "Saving to CRM..." : "Push to CRM Proposals (Draft)"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("drafts")}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span>All Saved Drafts ({savedDrafts.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DAY BY DAY EDITOR */}
            {activeTab === "itinerary" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#0F3A2E]" />
                      <span>Customizable Scheduled Itinerary</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Add, remove, or modify daily stops, altitude gains, stays, or sightseeing for this client.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetDays}
                      className="px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-1.5">
                  <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                    <GripVertical className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Drag items to reorder days or use ↑ / ↓ buttons (Day numbers auto-update)</span>
                  </span>
                  <span className="font-semibold text-emerald-700">{days.length} Days</span>
                </div>

                <div className="space-y-3">
                  {days.map((d, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragDayStart(e, index)}
                      onDragOver={(e) => handleDragDayOver(e, index)}
                      onDrop={(e) => handleDropDay(e, index)}
                      onDragEnd={() => setDraggedDayIndex(null)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all space-y-3 ${
                        draggedDayIndex === index
                          ? "border-emerald-500 bg-emerald-50/50 opacity-60 shadow-md ring-2 ring-emerald-500/30"
                          : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Drag Handle */}
                        <div
                          className="p-1.5 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-200/60 rounded-lg transition shrink-0"
                          title="Drag to reorder day"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Move Up/Down Controls */}
                        <div className="flex flex-col -space-y-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveDay(index, "up")}
                            disabled={index === 0}
                            title="Move Day Up"
                            className="p-0.5 text-slate-400 hover:text-emerald-700 disabled:opacity-20 disabled:hover:text-slate-400 transition cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDay(index, "down")}
                            disabled={index === days.length - 1}
                            title="Move Day Down"
                            className="p-0.5 text-slate-400 hover:text-emerald-700 disabled:opacity-20 disabled:hover:text-slate-400 transition cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-10 h-10 rounded-full bg-[#0F3A2E] text-white flex flex-col items-center justify-center font-sans shrink-0 border border-white ring-2 ring-[#0F3A2E]/20 shadow-xs select-none">
                            <span className="text-[8px] font-bold uppercase leading-none">Day</span>
                            <span className="text-xs font-black leading-none mt-0.5">{d.day}</span>
                          </div>
                          <input
                            type="text"
                            value={d.title}
                            onChange={(e) => handleUpdateDay(index, "title", e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                            placeholder="Day title"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteDay(index)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Day"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          value={d.distance || ""}
                          onChange={(e) => handleUpdateDay(index, "distance", e.target.value)}
                          placeholder="Distance: e.g. 5 km"
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                        />
                        <input
                          type="text"
                          value={d.altitude || ""}
                          onChange={(e) => handleUpdateDay(index, "altitude", e.target.value)}
                          placeholder="Altitude: e.g. 11,200 Ft"
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                        />
                        <input
                          type="text"
                          value={d.stay || ""}
                          onChange={(e) => handleUpdateDay(index, "stay", e.target.value)}
                          placeholder="Stay: e.g. Alpine Camps"
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                        />
                        <input
                          type="text"
                          value={d.meal || ""}
                          onChange={(e) => handleUpdateDay(index, "meal", e.target.value)}
                          placeholder="Meal: e.g. All Meals"
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={d.description}
                        onChange={(e) => handleUpdateDay(index, "description", e.target.value)}
                        placeholder="Day route highlights & activities description..."
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed"
                      />
                    </div>
                  ))}
                </div>

                {/* Add Day / Activity Button - At the Bottom */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t-2 border-slate-200 mt-2">
                  <span className="text-xs text-slate-500 font-semibold">
                    Total {days.length} Days / Activities configured
                  </span>
                  <button
                    type="button"
                    onClick={handleAddDay}
                    className="px-5 py-2.5 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] transition flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 self-end"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Day / Activity {days.length + 1}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: EXPORT BRANDED PDF & WHATSAPP PITCH */}
            {activeTab === "export" && (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                      Proposal Ready for Client
                    </span>
                    <h3 className="text-base font-extrabold text-[#0F3A2E] mt-0.5">
                      {tour.name} ({currentPreset.name} Edition)
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Client: <strong>{clientName}</strong> • {paxCount} Pax • {days.length} Days Itinerary • Quote: <strong>₹{totalPrice.toLocaleString("en-IN")}</strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsPdfModalOpen(true)}
                      className="px-4 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-300" />
                      <span>Generate Branded PDF</span>
                    </button>

                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send to WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePushToCrm()}
                      disabled={savingToCrm}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{savingToCrm ? "Pushing..." : "Push to CRM Proposals (Draft)"}</span>
                    </button>
                  </div>
                </div>

                {/* CRM Proposal Success Notice */}
                {crmSuccessLink && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block font-bold">Successfully Pushed to CRM Proposals Hub!</strong>
                        <span>Reference ID: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">{crmSuccessLink.id}</code></span>
                      </div>
                    </div>
                    <a
                      href={crmSuccessLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                    >
                      <span>Open in CRM Drafts</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </a>
                  </div>
                )}

                {/* WhatsApp Pitch Preview Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Formatted WhatsApp Pitch (Instant Copy):</span>
                    </label>
                    <button
                      onClick={handleCopyPitch}
                      className="text-xs font-bold text-[#0F3A2E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPitch ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="w-3.5 h-3.5" /> Copy Entire Pitch
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto border border-slate-800">
                    {generateWhatsAppPitch()}
                  </div>
                </div>

                {/* Official Bank Account & Social Links */}
                <div className="pt-2">
                  <ItineraryBankingDetails showSocials={true} />
                </div>
              </div>
            )}

            {/* TAB 4: SAVED DRAFTS & PROPOSALS HUB */}
            {activeTab === "drafts" && (
              <div className="space-y-6">
                {/* Drafts Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0F3A2E] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Saved Drafts & Proposal Templates</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Store multiple client configurations, resume editing anytime, or push directly to CRM Proposals.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAsDraft}
                      className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Current as Draft</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePushToCrm()}
                      disabled={savingToCrm}
                      className="px-3.5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4 text-amber-300" />
                      <span>{savingToCrm ? "Pushing..." : "Push to CRM"}</span>
                    </button>
                  </div>
                </div>

                {/* CRM Success Notice */}
                {crmSuccessLink && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="block font-bold">Successfully Synced with CRM Drafts Hub!</strong>
                        <span>Proposal Reference ID: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">{crmSuccessLink.id}</code></span>
                      </div>
                    </div>
                    <a
                      href={crmSuccessLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                    >
                      <span>Open CRM Drafts Hub</span>
                      <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    </a>
                  </div>
                )}

                {/* Active Browser Auto-Save Card */}
                {autoSaveStatus && (
                  <div className="bg-gradient-to-r from-emerald-900 to-[#0F3A2E] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                          Active Browser Auto-Save Cache
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        In-Progress Work: {clientName || "Valued Client"} ({days.length} Days Itinerary)
                      </h4>
                      <p className="text-xs text-emerald-200/80">
                        {autoSaveStatus} • Status: <strong>Draft Quote (₹{totalPrice.toLocaleString("en-IN")})</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSaveAsDraft}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to Named List</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDiscardAutoSave}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition border border-white/20 cursor-pointer"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}

                {/* Search / Filter for Saved Drafts */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={draftSearch}
                      onChange={(e) => setDraftSearch(e.target.value)}
                      placeholder="Search drafts by client, tour or date..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0F3A2E]"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {savedDrafts.length} Saved {savedDrafts.length === 1 ? "Draft" : "Drafts"}
                  </span>
                </div>

                {/* Drafts List */}
                {savedDrafts.length === 0 ? (
                  <div className="p-10 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">No Saved Drafts Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Customize your package for a client, then click <strong>"Save Draft"</strong> to store multiple proposal variations.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveAsDraft}
                      className="px-4 py-2 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5 text-amber-300" />
                      <span>Save Current Customization as First Draft</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedDrafts
                      .filter((d) => {
                        if (!draftSearch) return true;
                        const q = draftSearch.toLowerCase();
                        return (
                          d.clientName.toLowerCase().includes(q) ||
                          d.tourName.toLowerCase().includes(q) ||
                          d.departureDate.toLowerCase().includes(q) ||
                          d.id.toLowerCase().includes(q)
                        );
                      })
                      .map((draft) => {
                        const isCurrentTour = String(draft.tourId) === String(tour.id || tour.slug);
                        return (
                          <div
                            key={draft.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 bg-white shadow-2xs hover:shadow-md ${
                              isCurrentTour ? "border-amber-300 ring-1 ring-amber-300/40" : "border-slate-200"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-extrabold text-[#0F3A2E] truncate">
                                      {draft.clientName}
                                    </h4>
                                    {isCurrentTour && (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[9px] uppercase">
                                        This Tour
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                    {draft.tourName} • {draft.selectedSeason.toUpperCase()}
                                  </p>
                                </div>

                                <span className="text-xs font-extrabold text-[#FF6B35] shrink-0 font-mono">
                                  ₹{draft.totalPrice?.toLocaleString("en-IN")}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Group Size:</span>
                                  <strong className="text-slate-800">{draft.paxCount} Pax (₹{draft.quotePrice}/p)</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Itinerary:</span>
                                  <strong className="text-slate-800">{draft.days?.length || 0} Days Schedule</strong>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Travel Dates:</span>
                                  <span className="truncate block font-medium">{draft.departureDate}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Saved On:</span>
                                  <span className="truncate block font-medium">{draft.updatedAt}</span>
                                </div>
                              </div>

                              {draft.crmProposalId && (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Synced with CRM: #{draft.crmProposalId}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleRestoreDraft(draft);
                                    setActiveTab("details");
                                  }}
                                  className="px-2.5 py-1 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                  title="Load this draft into the customizer"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Load</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleRestoreDraft(draft);
                                    setIsPdfModalOpen(true);
                                  }}
                                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                                  title="Preview PDF for this draft"
                                >
                                  <FileText className="w-3 h-3 text-amber-600" />
                                  <span>PDF</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handlePushToCrm(draft)}
                                  disabled={savingToCrm}
                                  className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  title="Push to CRM Proposals Database"
                                >
                                  <UploadCloud className="w-3 h-3 text-amber-700" />
                                  <span>CRM</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteSavedDraft(draft.id, draft.clientName)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Delete Draft"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-3.5 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Quote includes KRADIND official logo & background security watermark.
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-300" />
                <span>Open Branded PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Itinerary PDF Modal with Sales Overrides & Draft Mode */}
      {isPdfModalOpen && (
        <ItineraryPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          tour={tour}
          customClientName={clientName}
          customPax={paxCount}
          customPrice={quotePrice}
          customSeason={`${currentPreset.name} (${currentPreset.months})`}
          customNotes={customAdvisory}
          customDays={days}
          customCoordinator={salesAgentName}
          isDraftProposal={true}
          showDraftWatermark={showDraftWatermark}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-950 text-white border border-emerald-500/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
