"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  Bed,
  Utensils,
  Save,
  Printer,
  Share2,
  RotateCcw,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  UserCheck,
  Mountain,
  Milestone,
  Copy,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  CustomerItineraryProposal,
  ItineraryProposalDay,
  CustomerRecord,
  TrekData,
} from "@/lib/cms-store";

interface ItineraryStudioProps {
  packages: TrekData[];
  customers: CustomerRecord[];
  initialProposal?: CustomerItineraryProposal | null;
  onSave: (proposal: CustomerItineraryProposal) => Promise<void>;
  onPreview: (proposal: CustomerItineraryProposal) => void;
  onWhatsApp: (proposal: CustomerItineraryProposal) => void;
  onReset: () => void;
  saving?: boolean;
}

const DRAFT_STORAGE_KEY = "kradind_crm_itinerary_studio_draft";
const DRAFT_TIMESTAMP_KEY = "kradind_crm_itinerary_studio_draft_time";

export function ItineraryStudio({
  packages,
  customers,
  initialProposal,
  onSave,
  onPreview,
  onWhatsApp,
  onReset,
  saving = false,
}: ItineraryStudioProps) {
  // Form State
  const [formData, setFormData] = useState<CustomerItineraryProposal>(() => {
    if (initialProposal) return { ...initialProposal };
    return {
      id: `KRAD-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      customerCity: "",
      packageTitle: "",
      basePackageSlug: "",
      destination: "",
      duration: "",
      startDate: "",
      endDate: "",
      adultsCount: 2,
      childrenCount: 0,
      pickupLocation: "",
      dropLocation: "",
      hotelCategory: "Standard 3-Star / Alpine Camp",
      vehicleType: "Private AC Sedan / Ertiga",
      itinerary: [],
      inclusions: [],
      exclusions: [],
      basePricePerPerson: 0,
      totalQuotedPrice: 0,
      advanceDepositRequired: 0,
      validUntil: "",
      specialNotes: "",
      status: "Draft",
      author: "Admin Agent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [selectedPackageSlug, setSelectedPackageSlug] = useState<string>("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  // Auto-save & draft restoration state
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"Saved" | "Saving..." | "Ready">("Ready");
  const [draftRecoveredNotice, setDraftRecoveredNotice] = useState<boolean>(false);

  // De-duplicate packages and classify cleanly
  const distinctPackages = useMemo(() => {
    const seen = new Set<string>();
    return (packages || []).filter((p) => {
      const cleanSlug = (p.slug || "").replace(/^\/+/, "").toLowerCase().trim();
      if (!cleanSlug || seen.has(cleanSlug)) return false;
      seen.add(cleanSlug);
      return true;
    });
  }, [packages]);

  const isDomesticPkg = (p: TrekData) =>
    (p.category || "").toLowerCase() === "domestic" ||
    (p.categories || []).some((c) => c.toLowerCase() === "domestic");

  const isInternationalPkg = (p: TrekData) =>
    (p.category || "").toLowerCase() === "international" ||
    (p.categories || []).some((c) => c.toLowerCase() === "international") ||
    ["bali", "thailand", "dubai", "vietnam", "singapore", "maldives", "nepal"].some((c) =>
      (p.slug || "").toLowerCase().includes(c)
    );

  const isTrekPkg = (p: TrekData) => !isDomesticPkg(p) && !isInternationalPkg(p);

  // Auto-restore draft from localStorage on load if not editing an existing saved proposal
  useEffect(() => {
    if (typeof window !== "undefined" && !initialProposal) {
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed: CustomerItineraryProposal = JSON.parse(savedDraft);
          const hasContent = Boolean(
            parsed.customerName?.trim() ||
            parsed.packageTitle?.trim() ||
            parsed.customerPhone?.trim() ||
            (parsed.itinerary && parsed.itinerary.length > 0)
          );
          if (hasContent) {
            setFormData(parsed);
            if (parsed.basePackageSlug) setSelectedPackageSlug(parsed.basePackageSlug);
            if (parsed.customerId) setSelectedCustomerId(parsed.customerId);
            const savedTime = localStorage.getItem(DRAFT_TIMESTAMP_KEY) || "";
            setLastSavedTime(savedTime);
            setDraftRecoveredNotice(true);
            setAutoSaveStatus("Saved");
          }
        }
      } catch (err) {
        console.warn("Failed to restore itinerary studio draft:", err);
      }
    }
  }, [initialProposal]);

  // Debounced auto-save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window === "undefined" || initialProposal) return;

    const hasContent = Boolean(
      formData.customerName?.trim() ||
      formData.packageTitle?.trim() ||
      formData.customerPhone?.trim() ||
      formData.destination?.trim() ||
      (formData.itinerary && formData.itinerary.length > 0)
    );

    if (!hasContent) return;

    setAutoSaveStatus("Saving...");
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
        const now = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        localStorage.setItem(DRAFT_TIMESTAMP_KEY, now);
        setLastSavedTime(now);
        setAutoSaveStatus("Saved");
      } catch (err) {
        console.warn("Failed to auto-save itinerary studio draft:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData, initialProposal]);

  // Warn user before leaving or reloading page if dirty unsaved proposal data exists
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasContent = Boolean(
        formData.customerName?.trim() ||
        formData.packageTitle?.trim() ||
        formData.itinerary.length > 0
      );
      if (hasContent) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData]);

  // Clear Draft & Start Fresh handler
  const handleClearDraft = () => {
    if (
      confirm(
        "Are you sure you want to discard this draft and start fresh? All typed customer details and custom itinerary days will be cleared."
      )
    ) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
      } catch {}
      setSelectedPackageSlug("");
      setSelectedCustomerId("");
      setDraftRecoveredNotice(false);
      setLastSavedTime("");
      setAutoSaveStatus("Ready");
      setFormData({
        id: `KRAD-PROP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        customerCity: "",
        packageTitle: "",
        basePackageSlug: "",
        destination: "",
        duration: "",
        startDate: "",
        endDate: "",
        adultsCount: 2,
        childrenCount: 0,
        pickupLocation: "",
        dropLocation: "",
        hotelCategory: "Standard 3-Star / Alpine Camp",
        vehicleType: "Private AC Sedan / Ertiga",
        itinerary: [],
        inclusions: [],
        exclusions: [],
        basePricePerPerson: 0,
        totalQuotedPrice: 0,
        advanceDepositRequired: 0,
        validUntil: "",
        specialNotes: "",
        status: "Draft",
        author: "Admin Agent",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      onReset();
    }
  };

  // Sync if initialProposal changes from outside
  useEffect(() => {
    if (initialProposal) {
      setFormData({ ...initialProposal });
      if (initialProposal.basePackageSlug) setSelectedPackageSlug(initialProposal.basePackageSlug);
      if (initialProposal.customerId) setSelectedCustomerId(initialProposal.customerId);
    }
  }, [initialProposal]);

  // Recalculate price when base price or pax count changes
  const handlePaxOrPriceChange = (basePrice: number, adults: number) => {
    const total = basePrice * Math.max(1, adults);
    const deposit = Math.round(total * 0.3);
    setFormData((prev) => ({
      ...prev,
      basePricePerPerson: basePrice,
      adultsCount: adults,
      totalQuotedPrice: total,
      advanceDepositRequired: deposit,
    }));
  };

  // Load existing package template
  const handleSelectPackageTemplate = (slug: string) => {
    setSelectedPackageSlug(slug);
    if (!slug) return;

    const pkg = packages.find((p) => p.slug === slug);
    if (!pkg) return;

    const mappedItinerary: ItineraryProposalDay[] = (pkg.itinerary || []).map((day: any, idx: number) => ({
      day: day.day || idx + 1,
      title: day.title || `Day ${idx + 1}`,
      description: day.description || day.desc || "",
      stay: day.stay || "Standard Accommodation",
      meal: day.meal || "Breakfast Included",
      activities: day.activities || "",
      distance: day.distance || "",
    }));

    const basePrice = pkg.price || 9999;
    const adults = formData.adultsCount || 2;
    const total = basePrice * adults;
    const deposit = Math.round(total * 0.3);

    setFormData((prev) => ({
      ...prev,
      packageTitle: pkg.name,
      basePackageSlug: pkg.slug,
      destination: pkg.location || pkg.region || "Uttarakhand, Himalayas",
      duration: pkg.duration || `${mappedItinerary.length || 5} Days`,
      basePricePerPerson: basePrice,
      totalQuotedPrice: total,
      advanceDepositRequired: deposit,
      itinerary: mappedItinerary,
      inclusions: Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 ? [...pkg.inclusions] : [
        "All verified accommodation as per selected plan",
        "Dedicated private transport with experienced mountain chauffeur",
        "Daily breakfast and dinner (MAP plan)",
        "Certified trek leader and local safety guides",
        "All forest permits, entry passes, and state tolls",
      ],
      exclusions: Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0 ? [...pkg.exclusions] : [
        "Personal travel and medical insurance",
        "Airfare or train journey to starting point",
        "Any personal expenses, tips, and optional activities",
        "Applicable 5% GST",
      ],
      hotelCategory: pkg.region === "Himalayas" ? "Alpine Dome Tents + Standard Homestay" : "Deluxe 3-Star / Heritage Hotel",
      vehicleType: adults > 4 ? "Private AC Tempo Traveller" : "Private AC Sedan / Ertiga",
      pickupLocation: pkg.pickupDrop || pkg.baseCamp || pkg.location || "Dehradun / Base Hub",
      dropLocation: pkg.pickupDrop || pkg.baseCamp || pkg.location || "Dehradun / Base Hub",
    }));
  };

  // Link existing CRM Customer
  const handleSelectCustomer = (custId: string) => {
    setSelectedCustomerId(custId);
    if (!custId) return;

    const cust = customers.find((c) => c.id === custId);
    if (!cust) return;

    setFormData((prev) => ({
      ...prev,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerEmail: cust.email,
      customerCity: cust.city,
    }));
  };

  // Day editor handlers
  const handleUpdateDay = (index: number, field: keyof ItineraryProposalDay, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleAddDay = () => {
    setFormData((prev) => {
      const nextDayNum = prev.itinerary.length + 1;
      const newDay: ItineraryProposalDay = {
        day: nextDayNum,
        title: `Day ${nextDayNum} - Scenic Trail & Exploration`,
        description: "Explore alpine landscapes, local heritage viewpoints, and authentic mountain trails.",
        stay: "Standard Resort / Alpine Tents",
        meal: "Breakfast & Dinner",
        distance: "5 km / 2 Hours",
        duration: "Full Day Activity",
        altitude: "9,500 Ft",
      };
      return {
        ...prev,
        itinerary: [...prev.itinerary, newDay],
        duration: `${nextDayNum} Days / ${nextDayNum - 1} Nights`,
      };
    });
  };

  const handleDuplicateDay = (index: number) => {
    setFormData((prev) => {
      const source = prev.itinerary[index];
      const clone = { ...source };
      const updated = [...prev.itinerary];
      updated.splice(index + 1, 0, clone);
      const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }));
      return {
        ...prev,
        itinerary: renumbered,
        duration: `${renumbered.length} Days / ${Math.max(1, renumbered.length - 1)} Nights`,
      };
    });
  };

  const handleMoveDay = (fromIdx: number, toIdx: number) => {
    setFormData((prev) => {
      if (toIdx < 0 || toIdx >= prev.itinerary.length) return prev;
      const updated = [...prev.itinerary];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }));
      return { ...prev, itinerary: renumbered };
    });
  };

  const handleRemoveDay = (index: number) => {
    setFormData((prev) => {
      const updated = prev.itinerary.filter((_, idx) => idx !== index);
      // Re-number days
      const renumbered = updated.map((d, i) => ({ ...d, day: i + 1 }));
      return {
        ...prev,
        itinerary: renumbered,
        duration: `${renumbered.length} Days / ${Math.max(1, renumbered.length - 1)} Nights`,
      };
    });
  };

  // Inclusion handlers
  const handleAddInclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInclusion.trim()) return;
    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, newInclusion.trim()],
    }));
    setNewInclusion("");
  };

  const handleRemoveInclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, idx) => idx !== index),
    }));
  };

  // Exclusion handlers
  const handleAddExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExclusion.trim()) return;
    setFormData((prev) => ({
      ...prev,
      exclusions: [...prev.exclusions, newExclusion.trim()],
    }));
    setNewExclusion("");
  };

  const handleRemoveExclusion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, idx) => idx !== index),
    }));
  };

  // Submission validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      alert("Please provide customer name.");
      return;
    }
    if (!formData.packageTitle.trim()) {
      alert("Please specify a package title or pick a template.");
      return;
    }
    if (formData.itinerary.length === 0) {
      alert("Please add at least one day to the itinerary.");
      return;
    }

    await onSave(formData);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    } catch {}
    setDraftRecoveredNotice(false);
    setAutoSaveStatus("Saved");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Draft Recovered Notice Banner */}
      {draftRecoveredNotice && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-400/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Auto-Saved Draft Restored!</span>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                Your previous proposal draft {lastSavedTime ? `(saved at ${lastSavedTime})` : ""} was automatically restored. You will never lose typed itinerary data when navigating or reloading.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleClearDraft}
              className="px-3 py-1.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-900 font-bold transition text-xs flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </button>
            <button
              type="button"
              onClick={() => setDraftRecoveredNotice(false)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 font-bold transition text-xs border border-amber-300/60"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Studio Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F3A2E] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Itinerary Studio</span>
              </span>

              {/* Real-time Auto-save Indicator */}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Auto-Save: {autoSaveStatus} {lastSavedTime ? `• ${lastSavedTime}` : ""}</span>
              </span>

              <span className="text-slate-500 text-xs">•</span>
              <span className="text-slate-300 text-xs font-semibold">{distinctPackages.length} Verified Blueprints</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Create & Customize Travel Proposals
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate branded itinerary vouchers from existing Himalayan treks, Rajasthan tours, or international
              packages. Customize stops, stays, meal plans, pricing, and dispatch instantly via WhatsApp or printable PDF.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleClearDraft}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-500/30"
              title="Clear draft and start with a blank proposal"
            >
              <Trash2 className="w-4 h-4 text-rose-300" />
              <span>Clear Draft</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
              <span>Reset Studio</span>
            </button>
            <button
              type="button"
              onClick={() => onPreview(formData)}
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-4 h-4 text-[#FF6B35]" />
              <span>Preview Voucher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Package Blueprint Dropdown */}
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
              1
            </span>
            <span>Select Existing Tour / Trek Package Template</span>
          </label>
          <select
            value={selectedPackageSlug}
            onChange={(e) => handleSelectPackageTemplate(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition-all cursor-pointer"
          >
            <option value="">-- Choose from {distinctPackages.length} Existing Packages --</option>
            <optgroup label="🏔️ Himalayan Treks">
              {distinctPackages
                .filter(isTrekPkg)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.duration} • ₹{p.price.toLocaleString("en-IN")})
                  </option>
                ))}
            </optgroup>
            <optgroup label="🏖️ Domestic & Weekend Tours">
              {distinctPackages
                .filter(isDomesticPkg)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.duration} • ₹{p.price.toLocaleString("en-IN")})
                  </option>
                ))}
            </optgroup>
            <optgroup label="🌐 International Destinations">
              {distinctPackages
                .filter(isInternationalPkg)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.duration} • ₹{p.price.toLocaleString("en-IN")})
                  </option>
                ))}
            </optgroup>
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Auto-fills days, stops, stays, meals, inclusions, and default pricing.
          </span>
        </div>

        {/* Step 2: Customer Link Dropdown */}
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black flex items-center justify-center">
              2
            </span>
            <span>Link CRM Customer Record (Optional)</span>
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => handleSelectCustomer(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
          >
            <option value="">-- Or enter new traveler details below --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone} • {c.city} • {c.lifecycleStage})
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Auto-populates contact information and links quotation to their CRM 360 profile.
          </span>
        </div>
      </div>

      {/* Main Studio Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Customer Profile & Trip Specifics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: Traveler Profile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Traveler Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Lead Traveler Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact Phone (WhatsApp) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Origin City</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai / Delhi NCR"
                  value={formData.customerCity}
                  onChange={(e) => setFormData({ ...formData, customerCity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Adults (Age 12+)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.adultsCount}
                  onChange={(e) =>
                    handlePaxOrPriceChange(formData.basePricePerPerson, parseInt(e.target.value) || 1)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Children (Below 12)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.childrenCount}
                  onChange={(e) => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Card B: Trip Logistics & Dates */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Trip Blueprint & Schedule</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Package Proposal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kedarkantha Winter Snow Summit Expedition"
                  value={formData.packageTitle}
                  onChange={(e) => setFormData({ ...formData, packageTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Uttarakhand / Rajasthan"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Days / 4 Nights"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Proposed Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Proposed End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pickup Point</label>
                <input
                  type="text"
                  placeholder="e.g. Dehradun Railway Station / Airport"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Drop Point</label>
                <input
                  type="text"
                  placeholder="e.g. Dehradun ISBT / Airport"
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hospitality & Transportation Specs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bed className="w-4 h-4 text-purple-600" />
            <span>Accommodation, Vehicle & Special Notes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Accommodation Category
              </label>
              <select
                value={formData.hotelCategory}
                onChange={(e) => setFormData({ ...formData, hotelCategory: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Alpine Dome Tents + Standard Homestay">Alpine Dome Tents + Standard Homestay</option>
                <option value="Standard (3-Star)">Standard (3-Star)</option>
                <option value="4-Star Heritage Haveli & Palace Stay">4-Star Heritage Haveli & Palace Stay</option>
                <option value="5-Star Luxury Resort">5-Star Luxury Resort</option>
                <option value="Glamping Luxury Geodesic Domes">Glamping Luxury Geodesic Domes</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Private AC Sedan (Dzire / Etios)">Private AC Sedan (Dzire / Etios)</option>
                <option value="Private AC Ertiga / XL6">Private AC Ertiga / XL6</option>
                <option value="Private AC Innova Crysta">Private AC Innova Crysta</option>
                <option value="Private 12-Seater Tempo Traveller">Private 12-Seater Tempo Traveller</option>
                <option value="Shared Mountain Bolero / Sumo">Shared Mountain Bolero / Sumo</option>
                <option value="Self-Drive / Not Included">Self-Drive / Not Included</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Quotation Validity
              </label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Special Dietary & Expedition Instructions
              </label>
              <input
                type="text"
                placeholder="e.g. Pure Vegetarian/Jain meal requirement, Anniversary welcome flowers, microspikes included"
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Day-by-Day Editor */}
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Day-by-Day Itinerary Schedule ({formData.itinerary.length} Days)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Craft custom stops, trekking distances, elevations, stays, and meal plans.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
              {formData.itinerary.length} Days Scheduled
            </span>
          </div>

          {formData.itinerary.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-500">No itinerary days added yet.</p>
              <p className="text-slate-400">Choose a package template above or click &ldquo;Add Day&rdquo; below to start building.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md transition duration-300 overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Header: Day Badge & Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          Day {day.day || idx + 1} Schedule
                        </span>
                      </div>

                      {/* Row Action Controls */}
                      <div className="flex items-center gap-1 text-slate-500">
                        <button
                          type="button"
                          onClick={() => handleDuplicateDay(idx)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition flex items-center gap-1 text-[11px]"
                          title="Duplicate this day"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveDay(idx, idx - 1)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition"
                          title="Move Day Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.itinerary.length - 1}
                          onClick={() => handleMoveDay(idx, idx + 1)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition"
                          title="Move Day Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveDay(idx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Delete this day"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Day Title Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Day Title (e.g. Scenic Drive from Dehradun to Sankri Basecamp)"
                        value={day.title}
                        onChange={(e) => handleUpdateDay(idx, "title", e.target.value)}
                        className="w-full text-base sm:text-lg font-extrabold text-slate-900 placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                      />
                    </div>

                    {/* 4-Item Metric Ribbon (Matches Website Exactly!) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {/* Duration */}
                      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">Duration</span>
                          <input
                            type="text"
                            placeholder="5-6 Hours"
                            value={day.duration || ""}
                            onChange={(e) => handleUpdateDay(idx, "duration", e.target.value)}
                            className="w-full bg-transparent text-xs font-extrabold text-amber-950 placeholder-amber-400/70 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Distance */}
                      <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <Milestone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600">Distance</span>
                          <input
                            type="text"
                            placeholder="6 km Trek"
                            value={day.distance || ""}
                            onChange={(e) => handleUpdateDay(idx, "distance", e.target.value)}
                            className="w-full bg-transparent text-xs font-extrabold text-purple-950 placeholder-purple-400/70 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Altitude / Elevation */}
                      <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                          <Mountain className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-600">Elevation</span>
                          <input
                            type="text"
                            placeholder="10,500 Ft"
                            value={day.altitude || ""}
                            onChange={(e) => handleUpdateDay(idx, "altitude", e.target.value)}
                            className="w-full bg-transparent text-xs font-extrabold text-sky-950 placeholder-sky-400/70 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Meals */}
                      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Meals</span>
                          <input
                            type="text"
                            placeholder="Breakfast, Lunch, Dinner"
                            value={day.meal || ""}
                            onChange={(e) => handleUpdateDay(idx, "meal", e.target.value)}
                            className="w-full bg-transparent text-xs font-extrabold text-emerald-950 placeholder-emerald-400/70 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Narrative Description */}
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Day Narrative & Activities
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detailed activities, viewpoints, mountain trail terrain, resting points, and highlights..."
                        value={day.description}
                        onChange={(e) => handleUpdateDay(idx, "description", e.target.value)}
                        className="w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] resize-y"
                      />
                    </div>
                  </div>

                  {/* Bottom Hospitality Bar */}
                  <div className="bg-slate-50/90 px-5 sm:px-6 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <Bed className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Overnight Stay:</span>
                      <input
                        type="text"
                        placeholder="e.g. 4-Star Resort / Alpine Tents"
                        value={day.stay || ""}
                        onChange={(e) => handleUpdateDay(idx, "stay", e.target.value)}
                        className="flex-1 bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Day Button - Positioned at Bottom Right */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddDay}
              className="px-4 py-2.5 bg-[#0F3A2E] hover:bg-[#14483a] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day {formData.itinerary.length + 1}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Inclusions & Exclusions Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inclusions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inclusions List ({formData.inclusions.length})</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add inclusion item..."
                value={newInclusion}
                onChange={(e) => setNewInclusion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddInclusion(e);
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddInclusion}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {formData.inclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-slate-800"
                >
                  <span className="leading-tight">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInclusion(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Exclusions List ({formData.exclusions.length})</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add exclusion item..."
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddExclusion(e);
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddExclusion}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {formData.exclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 bg-rose-50/50 border border-rose-100 rounded-xl text-xs text-slate-800"
                >
                  <span className="leading-tight">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExclusion(idx)}
                    className="text-slate-400 hover:text-rose-600 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Commercials, Status & Action Ribbon */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-100 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Base Price / Person (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.basePricePerPerson}
                onChange={(e) =>
                  handlePaxOrPriceChange(parseFloat(e.target.value) || 0, formData.adultsCount)
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-900 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Quoted Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.totalQuotedPrice}
                onChange={(e) => setFormData({ ...formData, totalQuotedPrice: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-extrabold text-emerald-700 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Advance Deposit Required (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.advanceDepositRequired}
                onChange={(e) =>
                  setFormData({ ...formData, advanceDepositRequired: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-amber-700 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Proposal Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white cursor-pointer"
              >
                <option value="Draft">Draft (Internal Working)</option>
                <option value="Sent">Sent to Client</option>
                <option value="Accepted">Accepted & Slot Reserved</option>
                <option value="Under Review">Under Review / Negotiating</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Reference: <strong className="font-mono text-slate-800">{formData.id}</strong> • Last saved:{" "}
              {new Date(formData.updatedAt || Date.now()).toLocaleTimeString("en-IN")}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => onWhatsApp(formData)}
                className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => onPreview(formData)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold flex items-center gap-2 transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#FF6B35]" />
                <span>Printable Voucher</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-[#0F3A2E] hover:bg-[#0A261E] disabled:opacity-50 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>{saving ? "Saving Proposal..." : "Save Proposal Voucher"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
