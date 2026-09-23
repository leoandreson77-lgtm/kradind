"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { TrekData, TrekItineraryDay } from "@/lib/cms-store";
import { ItineraryPdfModal } from "@/components/itinerary-pdf-modal";

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
  const [activeTab, setActiveTab] = useState<"details" | "itinerary" | "export">("details");

  // Load default tour itinerary on initial open
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
  }, [tour]);

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
      `\n\n*✅ KEY INCLUSIONS:*\n` +
      `• Certified Himalayan Trek Leaders & Guides\n` +
      `• All Meals (Nutritious B/L/D + hot soups & tea)\n` +
      `• Dome Tents, Sleeping Bags & Mattresses\n` +
      `• Forest Permits, Camping Charges & Green Fees\n` +
      `• Medical Kit with Oxygen Cylinder & Oximeter\n\n` +
      `📄 *Official Itinerary PDF & Branded Proposal Available on Request.*\n` +
      `📞 Coordinator: ${salesAgentName} (+91 7500222141)\n` +
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
      <div className="fixed inset-0 z-[9990] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
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

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
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
          </div>

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
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="px-3.5 py-1.5 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] transition flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Extra Day</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {days.map((d, index) => (
                    <div
                      key={index}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded-full bg-[#0F3A2E] text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {d.day}
                          </span>
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
                  </div>
                </div>

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

      {/* Render Itinerary PDF Modal with Sales Overrides */}
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
        />
      )}
    </>
  );
}
