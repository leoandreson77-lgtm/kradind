"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Layers,
  Globe,
  Compass,
  X,
  AlertCircle,
  Eye,
  Copy,
  Calendar,
  Clock,
  Utensils,
  Building,
  ArrowUp,
  ArrowDown,
  FileText,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Tag,
  Camera,
  Sun,
  Users,
  Navigation,
  Percent,
  Mountain,
  Car,
  ArrowRightLeft,
  FileDown,
  Sliders,
} from "lucide-react";
import { DestinationData, TrekItineraryDay } from "@/lib/cms-store";
import { ImageUploader } from "@/components/admin/image-uploader";
import { SalesItineraryCustomizer } from "@/components/sales-itinerary-customizer";
import { ItineraryPdfModal } from "@/components/itinerary-pdf-modal";

const POPULAR_EMOJIS = ["🏔️", "🌲", "❄️", "🏰", "🌴", "🌊", "🇳🇵", "🏝️", "✈️", "🛕", "⛺", "📍"];
const CATEGORIES = ["All", "Domestic", "International", "Trek", "Heritage", "Beach", "Spiritual"];

type ModalTab = "basic" | "itinerary" | "inclusions" | "overview" | "faqs";

const STANDARD_INCLUSIONS = [
  "Accommodation in verified 3-Star/4-Star hotels or boutique stays on twin/triple sharing",
  "Daily nutritious Breakfast and Dinner at the hotel restaurant",
  "Private dedicated AC vehicle (Sedan/SUV) for all airport transfers, intercity travel & sightseeing",
  "Experienced commercial driver, fuel, state road permits, toll taxes, and all parking fees",
  "Pick-up and drop-off from designated Airport or Railway Station",
  "Driver allowance, night halts, and 24/7 on-tour KRADIND Tour Coordinator assistance",
];

const STANDARD_EXCLUSIONS = [
  "Airfare or Train tickets to and from the starting destination",
  "Daily Lunches, personal refreshments, and room service/laundry expenses",
  "Entry tickets for monuments, museums, palaces, and wildlife national parks",
  "Optional adventure sports (river rafting, paragliding, ropeways, boat rides, camel safaris)",
  "Unforeseen costs due to roadblocks, weather disruptions, natural hazards or flight rescheduling",
  "Applicable Government GST (5%)",
];

const STANDARD_FAQS = [
  {
    question: "What is the best time to visit this destination?",
    answer: "The ideal visiting period is generally between September and May when pleasant temperatures make sightseeing, outdoor activities, and nature excursions delightful.",
  },
  {
    question: "Can this itinerary and hotel category be customized?",
    answer: "Absolutely! All KRADIND tour circuits can be fully personalized. You can extend days, swap attractions, or upgrade to 4-Star/5-Star luxury heritage resorts.",
  },
  {
    question: "What type of vehicles are provided for our group?",
    answer: "We provide private AC vehicles based on your group size: Swift Dzire / Etios for 2-3 guests, Toyota Innova / Ertiga for 4-6 guests, and Tempo Travellers for larger families.",
  },
  {
    question: "How do I confirm my tour booking?",
    answer: "You can book with a nominal 25% advance token payment. The remaining balance can be completed prior to trip commencement or at the time of arrival.",
  },
];

const STANDARD_TIPS = [
  "Carry valid Government photo IDs (Aadhaar/Passport/Voter ID) for every guest for seamless hotel check-in and local checkpoint verifications.",
  "Pack comfortable walking shoes, polarized sunglasses, sunscreen, and seasonal layered clothing.",
  "Keep some cash handy as digital UPI payments can experience intermittent mobile network issues in hilly or remote stretches.",
];

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>("basic");
  const [editingDestination, setEditingDestination] = useState<DestinationData | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [salesModalDest, setSalesModalDest] = useState<DestinationData | null>(null);
  const [pdfModalDest, setPdfModalDest] = useState<DestinationData | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/admin/destinations", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (err) {
      console.error("Failed to load destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleToggleCategory = async (dest: DestinationData) => {
    const isDomestic = dest.category?.toLowerCase() === "domestic";
    const newCat = isDomestic ? "Trek" : "Domestic";
    setActionLoading(true);
    try {
      const updated: DestinationData = { ...dest, category: newCat };
      const res = await fetch("/api/admin/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        showToast(`Switched "${dest.name}" to ${newCat} classification!`);
        setDestinations((prev) =>
          prev.map((d) => (d.id === dest.id ? { ...d, category: newCat } : d))
        );
      } else {
        const data = await res.json();
        showToast(`❌ ${data.error || "Failed to switch category"}`);
      }
    } catch {
      showToast("❌ Network error switching category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenAdd = () => {
    const defaultItem: DestinationData = {
      id: "",
      name: "",
      slug: "",
      category: "Domestic",
      tagline: "",
      duration: "5 Nights / 6 Days",
      price: 24999,
      originalPrice: 29999,
      bestSeason: "September to May",
      pickupDrop: "Nearest Airport / Railway Station",
      suitableFor: "Families, Couples & Friends",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      gallery: [],
      badge: "Trending Circuit",
      highlights: [],
      overview: "",
      itinerary: [
        {
          day: 1,
          title: "Arrival & Hotel Transfer",
          description: "Arrive at airport/railway station. Meet our tour executive and transfer comfortably to your hotel in a private AC cab. Evening at leisure for local market stroll.",
          activities: "Airport pickup, Hotel check-in, Evening relaxation",
          meal: "Dinner included",
          stay: "Verified 3-Star Hotel",
          distance: "40 km",
          duration: "1.5 hrs",
          altitude: "",
        },
        {
          day: 2,
          title: "Full Day Scenic Sightseeing & Cultural Tour",
          description: "After a wholesome breakfast, embark on a full-day guided sightseeing excursion covering prominent historic monuments, scenic viewpoints, and cultural attractions.",
          activities: "City tour, Heritage viewpoints, Local craft shopping",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel",
          distance: "65 km",
          duration: "Full Day",
          altitude: "",
        },
        {
          day: 3,
          title: "Nature Excursion, Waterfalls & Leisure",
          description: "Drive through scenic landscapes and pine-forested valley routes. Visit tranquil lakes/waterfalls, enjoy photo sessions, and relax amidst pristine nature.",
          activities: "Nature walk, Lake/Waterfall visit, Photography",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel / Resort",
          distance: "55 km",
          duration: "4 hrs",
          altitude: "",
        },
      ],
      inclusions: [...STANDARD_INCLUSIONS],
      exclusions: [...STANDARD_EXCLUSIONS],
      faqs: [...STANDARD_FAQS],
      travelTips: [...STANDARD_TIPS],
      color: "from-emerald-900/80",
      icon: "🏔️",
      status: "Published",
    };
    setEditingDestination(defaultItem);
    setHighlightsInput("");
    setNewGalleryUrl("");
    setModalTab("basic");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dest: DestinationData) => {
    setEditingDestination({
      ...dest,
      itinerary: dest.itinerary && dest.itinerary.length > 0 ? dest.itinerary : [],
      inclusions: dest.inclusions && dest.inclusions.length > 0 ? dest.inclusions : [...STANDARD_INCLUSIONS],
      exclusions: dest.exclusions && dest.exclusions.length > 0 ? dest.exclusions : [...STANDARD_EXCLUSIONS],
      faqs: dest.faqs && dest.faqs.length > 0 ? dest.faqs : [...STANDARD_FAQS],
      travelTips: dest.travelTips && dest.travelTips.length > 0 ? dest.travelTips : [...STANDARD_TIPS],
      gallery: dest.gallery || [],
    });
    setHighlightsInput((dest.highlights || []).join(", "));
    setNewGalleryUrl("");
    setModalTab("basic");
    setIsModalOpen(true);
  };

  const handleDuplicateDestination = (dest: DestinationData) => {
    const copySlug = `${dest.slug}-copy-${Date.now().toString().slice(-4)}`;
    const cloned: DestinationData = {
      ...dest,
      id: "",
      name: `${dest.name} (Copy)`,
      slug: copySlug,
      status: "Draft",
      highlights: dest.highlights ? [...dest.highlights] : [],
      itinerary: dest.itinerary ? dest.itinerary.map((d, i) => ({ ...d, day: i + 1 })) : [],
      inclusions: dest.inclusions ? [...dest.inclusions] : [...STANDARD_INCLUSIONS],
      exclusions: dest.exclusions ? [...dest.exclusions] : [...STANDARD_EXCLUSIONS],
      faqs: dest.faqs ? [...dest.faqs] : [...STANDARD_FAQS],
      travelTips: dest.travelTips ? [...dest.travelTips] : [...STANDARD_TIPS],
      gallery: dest.gallery ? [...dest.gallery] : [],
    };
    setEditingDestination(cloned);
    setHighlightsInput((cloned.highlights || []).join(", "));
    setNewGalleryUrl("");
    setModalTab("basic");
    setIsModalOpen(true);
    showToast("📋 Destination cloned! Edit details and save.");
  };

  const handleNameChange = (name: string) => {
    if (!editingDestination) return;
    const isNew = !editingDestination.id;
    const autoSlug = isNew
      ? name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      : editingDestination.slug;

    setEditingDestination({
      ...editingDestination,
      name,
      slug: autoSlug,
      tagline: editingDestination.tagline || (name ? `Explore handpicked tours, treks, and holidays in ${name}.` : ""),
    });
  };

  // --- ITINERARY HELPERS ---
  const handleAddDay = () => {
    if (!editingDestination) return;
    const current = editingDestination.itinerary || [];
    const nextDayNum = current.length + 1;
    const newDay: TrekItineraryDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum}: Sightseeing & Exploration`,
      description: "",
      activities: "",
      distance: "",
      duration: "",
      altitude: "",
      meal: "Breakfast & Dinner",
      stay: "3-Star Hotel / Resort",
    };
    setEditingDestination({
      ...editingDestination,
      itinerary: [...current, newDay],
    });
  };

  const handleUpdateDay = (index: number, field: keyof TrekItineraryDay, value: any) => {
    if (!editingDestination || !editingDestination.itinerary) return;
    const updated = [...editingDestination.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setEditingDestination({ ...editingDestination, itinerary: updated });
  };

  const handleRemoveDay = (index: number) => {
    if (!editingDestination || !editingDestination.itinerary) return;
    const updated = editingDestination.itinerary
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    setEditingDestination({ ...editingDestination, itinerary: updated });
  };

  const handleMoveDay = (index: number, direction: "up" | "down") => {
    if (!editingDestination || !editingDestination.itinerary) return;
    const list = [...editingDestination.itinerary];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const renumbered = list.map((d, i) => ({ ...d, day: i + 1 }));
    setEditingDestination({ ...editingDestination, itinerary: renumbered });
  };

  const handleDuplicateDay = (index: number) => {
    if (!editingDestination || !editingDestination.itinerary) return;
    const list = [...editingDestination.itinerary];
    const dayToClone = { ...list[index] };
    list.splice(index + 1, 0, dayToClone);
    const renumbered = list.map((d, i) => ({ ...d, day: i + 1 }));
    setEditingDestination({ ...editingDestination, itinerary: renumbered });
    showToast(`Day ${index + 1} duplicated!`);
  };

  const handleApplyPreset = (daysCount: number) => {
    if (!editingDestination) return;
    const days: TrekItineraryDay[] = [];
    for (let i = 1; i <= daysCount; i++) {
      days.push({
        day: i,
        title:
          i === 1
            ? `Day 1: Arrival & Hotel Check-in`
            : i === daysCount
            ? `Day ${i}: Sightseeing & Final Departure`
            : `Day ${i}: Local Sightseeing & Circuit Exploration`,
        description:
          i === 1
            ? "Pick up from airport/railway station. Transfer to hotel, check in, and spend the evening enjoying local cultural landmarks."
            : i === daysCount
            ? "Enjoy a hearty breakfast, pack bags, and transfer to airport/station for your return journey with fond memories."
            : "Visit renowned scenic viewpoints, historic monuments, local bazaars, and experience local cuisine.",
        activities: i === 1 ? "Arrival, Hotel check-in" : i === daysCount ? "Breakfast, Airport transfer" : "Sightseeing, Photography",
        meal: i === daysCount ? "Breakfast only" : "Breakfast & Dinner",
        stay: i === daysCount ? "Departure (No stay)" : "3-Star Deluxe Hotel / Resort",
        distance: i === 1 ? "35 km" : i === daysCount ? "35 km" : "50 km",
        duration: i === daysCount ? "2 hrs drive" : "Full Day Sightseeing",
      });
    }
    setEditingDestination({
      ...editingDestination,
      duration: `${daysCount - 1} Nights / ${daysCount} Days`,
      itinerary: days,
    });
    showToast(`✨ ${daysCount}-day itinerary template loaded!`);
  };

  // --- INCLUSIONS & EXCLUSIONS HELPERS ---
  const handleAddInclusion = () => {
    if (!editingDestination) return;
    const list = editingDestination.inclusions || [];
    setEditingDestination({
      ...editingDestination,
      inclusions: [...list, ""],
    });
  };

  const handleUpdateInclusion = (index: number, val: string) => {
    if (!editingDestination || !editingDestination.inclusions) return;
    const list = [...editingDestination.inclusions];
    list[index] = val;
    setEditingDestination({ ...editingDestination, inclusions: list });
  };

  const handleRemoveInclusion = (index: number) => {
    if (!editingDestination || !editingDestination.inclusions) return;
    const list = editingDestination.inclusions.filter((_, i) => i !== index);
    setEditingDestination({ ...editingDestination, inclusions: list });
  };

  const handleAddExclusion = () => {
    if (!editingDestination) return;
    const list = editingDestination.exclusions || [];
    setEditingDestination({
      ...editingDestination,
      exclusions: [...list, ""],
    });
  };

  const handleUpdateExclusion = (index: number, val: string) => {
    if (!editingDestination || !editingDestination.exclusions) return;
    const list = [...editingDestination.exclusions];
    list[index] = val;
    setEditingDestination({ ...editingDestination, exclusions: list });
  };

  const handleRemoveExclusion = (index: number) => {
    if (!editingDestination || !editingDestination.exclusions) return;
    const list = editingDestination.exclusions.filter((_, i) => i !== index);
    setEditingDestination({ ...editingDestination, exclusions: list });
  };

  // --- FAQS HELPERS ---
  const handleAddFaq = () => {
    if (!editingDestination) return;
    const list = editingDestination.faqs || [];
    setEditingDestination({
      ...editingDestination,
      faqs: [...list, { question: "", answer: "" }],
    });
  };

  const handleUpdateFaq = (index: number, field: "question" | "answer", val: string) => {
    if (!editingDestination || !editingDestination.faqs) return;
    const list = [...editingDestination.faqs];
    list[index] = { ...list[index], [field]: val };
    setEditingDestination({ ...editingDestination, faqs: list });
  };

  const handleRemoveFaq = (index: number) => {
    if (!editingDestination || !editingDestination.faqs) return;
    const list = editingDestination.faqs.filter((_, i) => i !== index);
    setEditingDestination({ ...editingDestination, faqs: list });
  };

  // --- TRAVEL TIPS HELPERS ---
  const handleAddTip = () => {
    if (!editingDestination) return;
    const list = editingDestination.travelTips || [];
    setEditingDestination({
      ...editingDestination,
      travelTips: [...list, ""],
    });
  };

  const handleUpdateTip = (index: number, val: string) => {
    if (!editingDestination || !editingDestination.travelTips) return;
    const list = [...editingDestination.travelTips];
    list[index] = val;
    setEditingDestination({ ...editingDestination, travelTips: list });
  };

  const handleRemoveTip = (index: number) => {
    if (!editingDestination || !editingDestination.travelTips) return;
    const list = editingDestination.travelTips.filter((_, i) => i !== index);
    setEditingDestination({ ...editingDestination, travelTips: list });
  };

  // --- GALLERY HELPERS ---
  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim() || !editingDestination) return;
    const list = editingDestination.gallery || [];
    setEditingDestination({
      ...editingDestination,
      gallery: [...list, newGalleryUrl.trim()],
    });
    setNewGalleryUrl("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (!editingDestination || !editingDestination.gallery) return;
    const list = editingDestination.gallery.filter((_, i) => i !== index);
    setEditingDestination({ ...editingDestination, gallery: list });
  };

  // --- SAVE DESTINATION ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination || !editingDestination.name.trim()) return;

    setActionLoading(true);
    const isNew = !editingDestination.id;
    const url = "/api/admin/destinations";
    const method = isNew ? "POST" : "PUT";

    const cleanHighlights = highlightsInput
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    const cleanItinerary = (editingDestination.itinerary || []).map((d, i) => ({
      ...d,
      day: i + 1,
    }));

    const cleanInclusions = (editingDestination.inclusions || []).filter((s) => s.trim().length > 0);
    const cleanExclusions = (editingDestination.exclusions || []).filter((s) => s.trim().length > 0);
    const cleanTips = (editingDestination.travelTips || []).filter((s) => s.trim().length > 0);
    const cleanFaqs = (editingDestination.faqs || []).filter((f) => f.question.trim().length > 0);

    const payload = {
      ...editingDestination,
      highlights: cleanHighlights,
      itinerary: cleanItinerary,
      inclusions: cleanInclusions,
      exclusions: cleanExclusions,
      travelTips: cleanTips,
      faqs: cleanFaqs,
      slug: editingDestination.slug
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save destination");
        setActionLoading(false);
        return;
      }

      showToast(isNew ? "✅ Destination created successfully!" : "✅ Destination updated successfully!");
      setIsModalOpen(false);
      setEditingDestination(null);
      fetchDestinations();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/destinations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ Destination deleted successfully");
        setDestinations(destinations.filter((d) => d.id !== id && d.slug !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete destination");
      }
    } catch {
      alert("Network error deleting destination");
    } finally {
      setActionLoading(false);
      setDeleteConfirmId(null);
    }
  };

  const handleToggleStatus = async (dest: DestinationData) => {
    const newStatus = dest.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dest, status: newStatus }),
      });
      if (res.ok) {
        setDestinations(
          destinations.map((d) => (d.id === dest.id ? { ...d, status: newStatus } : d))
        );
        showToast(`Status updated to ${newStatus}`);
      }
    } catch {
      alert("Failed to update status");
    }
  };

  // Filtered destinations
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.tagline && dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "All" || (dest.category || "Domestic").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F3A2E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 border border-emerald-500/30">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-[#FF6B35] uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>Destinations & Tour Circuits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 brand-font">
            Destinations & Itinerary CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Configure travel destinations with complete day-by-day itineraries, inclusions, exclusions, travel guidelines, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/treks"
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition flex items-center gap-2"
          >
            <span>Switch to Treks CMS</span>
          </Link>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-[#0F3A2E] hover:bg-[#154d3d] text-white text-xs font-extrabold rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination Circuit</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by destination name, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Destinations */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading destinations & itineraries...</p>
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No destinations match "${searchQuery}". Try clearing search.`
              : "Click '+ Add Destination Circuit' above to create your first destination circuit."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id || dest.slug}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge & Emoji */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="w-8 h-8 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-base shadow-sm">
                    {dest.icon || "📍"}
                  </span>
                  {dest.badge && (
                    <span className="bg-[#0F3A2E]/90 backdrop-blur-xs text-emerald-300 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {dest.badge}
                    </span>
                  )}
                </div>

                {/* Live Site Link & Status */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(dest)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-xs transition ${
                      dest.status === "Published"
                        ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                        : "bg-amber-500/90 text-white hover:bg-amber-600"
                    }`}
                  >
                    {dest.status}
                  </button>

                  <Link
                    href={`/destinations/${dest.slug}`}
                    target="_blank"
                    className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-xs transition"
                    title="View live destination page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Title & Slug */}
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-xl font-black brand-font drop-shadow-sm flex items-center gap-1.5">
                    <span>{dest.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-mono">/destinations/{dest.slug}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {dest.tagline || "No description specified."}
                </p>

                <div className="space-y-2">
                  {/* Duration & Price & Itinerary days */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{dest.duration || `${dest.itinerary?.length || 0} Days`}</span>
                    </span>

                    {dest.itinerary && dest.itinerary.length > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{dest.itinerary.length} Days Itinerary</span>
                      </span>
                    )}

                    {dest.price && (
                      <span className="font-extrabold text-slate-900">
                        ₹{dest.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Highlights Tags */}
                  {dest.highlights && dest.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dest.highlights.slice(0, 3).map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {h}
                        </span>
                      ))}
                      {dest.highlights.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                          +{dest.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-500">
                  Category: <span className="font-bold text-slate-800">{dest.category || "Domestic"}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Switch between Domestic and Trek */}
                  <button
                    onClick={() => handleToggleCategory(dest)}
                    disabled={actionLoading}
                    className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                    title={
                      dest.category?.toLowerCase() === "domestic"
                        ? "Switch Category to Trek"
                        : "Switch Category to Domestic"
                    }
                  >
                    {dest.category?.toLowerCase() === "domestic" ? (
                      <Mountain className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Car className="w-4 h-4 text-amber-600" />
                    )}
                  </button>

                    {/* Sales Seasonal Customizer & WhatsApp Quote */}
                    <button
                      onClick={() => setSalesModalDest(dest)}
                      className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                      title="Sales Seasonal Customizer & WhatsApp Quote"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>

                    {/* Client Itinerary PDF with Watermark & Logo */}
                    <button
                      onClick={() => setPdfModalDest(dest)}
                      className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition"
                      title="Download Branded Client PDF (With Logo & Watermark)"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicateDestination(dest)}
                      className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                      title="Duplicate / Clone Destination"
                    >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(dest)}
                    className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                    title="Edit Destination & Full Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(dest.id || dest.slug)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Destination"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Delete Destination?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this destination? It will be removed from website navigation and directory.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={actionLoading}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
              >
                {actionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Destination Modal with 5 Comprehensive Tabs */}
      {isModalOpen && editingDestination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-6 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {editingDestination.id ? `Edit Circuit: ${editingDestination.name}` : "Add New Destination Circuit"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Full tour control: Itinerary, inclusions, exclusions, pricing, and guidelines.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5 Modal Tabs Navigation */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 shrink-0 overflow-x-auto">
              <button
                type="button"
                onClick={() => setModalTab("basic")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "basic"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Basic Details & Media</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("itinerary")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "itinerary"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day-by-Day Itinerary ({editingDestination.itinerary?.length || 0} Days)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("inclusions")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "inclusions"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Inclusions & Exclusions ({editingDestination.inclusions?.length || 0}/{editingDestination.exclusions?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("overview")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "overview"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Overview & Tips</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("faqs")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "faqs"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FAQs ({editingDestination.faqs?.length || 0})</span>
              </button>
            </div>

            {/* Form Body (Scrollable) */}
            <form onSubmit={handleSave} className="space-y-6 overflow-y-auto pr-1 flex-1">
              {/* TAB 1: BASIC DETAILS & PRICING */}
              {modalTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Destination Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Destination Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajasthan, Kerala, Spiti Valley, Meghalaya"
                        value={editingDestination.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition font-semibold"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">URL Slug *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. rajasthan, kerala, spiti-valley"
                        value={editingDestination.slug}
                        onChange={(e) =>
                          setEditingDestination({
                            ...editingDestination,
                            slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15 transition font-mono"
                      />
                      <span className="text-[10px] text-slate-400">Route: /destinations/{editingDestination.slug || "slug"}</span>
                    </div>
                  </div>

                  {/* Emoji Icon & Category & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Emoji Icon */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Icon / Emoji</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={editingDestination.icon || "📍"}
                          onChange={(e) =>
                            setEditingDestination({ ...editingDestination, icon: e.target.value })
                          }
                          className="w-14 px-2 py-2 text-center text-base rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                        />
                        <div className="flex items-center gap-1 overflow-x-auto py-1">
                          {POPULAR_EMOJIS.slice(0, 6).map((emo) => (
                            <button
                              key={emo}
                              type="button"
                              onClick={() => setEditingDestination({ ...editingDestination, icon: emo })}
                              className="p-1 text-sm hover:bg-slate-100 rounded-md transition"
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Category</label>
                      <select
                        value={editingDestination.category || "Domestic"}
                        onChange={(e) =>
                          setEditingDestination({ ...editingDestination, category: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] font-semibold bg-white"
                      >
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                        <option value="Trek">Trek / Mountains</option>
                        <option value="Heritage">Heritage & Forts</option>
                        <option value="Beach">Beach & Coastal</option>
                        <option value="Spiritual">Spiritual & Pilgrimage</option>
                      </select>
                    </div>

                    {/* Badge */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. Most Popular, Trending Circuit"
                        value={editingDestination.badge || ""}
                        onChange={(e) =>
                          setEditingDestination({ ...editingDestination, badge: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] font-medium"
                      />
                    </div>
                  </div>

                  {/* Duration & Starting Price & Original Price */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> Suggested Duration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Nights / 6 Days"
                        value={editingDestination.duration || ""}
                        onChange={(e) =>
                          setEditingDestination({ ...editingDestination, duration: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Starting Offer Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 24999"
                        value={editingDestination.price || ""}
                        onChange={(e) =>
                          setEditingDestination({
                            ...editingDestination,
                            price: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Original / Cut Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 29999"
                        value={editingDestination.originalPrice || ""}
                        onChange={(e) =>
                          setEditingDestination({
                            ...editingDestination,
                            originalPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Logistics: Best Season, Pickup & Drop, Suitable For */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Best Time to Visit
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. September to May"
                        value={editingDestination.bestSeason || ""}
                        onChange={(e) =>
                          setEditingDestination({ ...editingDestination, bestSeason: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Pick-up & Drop Point
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kathgodam / Dehradun Airport"
                        value={editingDestination.pickupDrop || ""}
                        onChange={(e) =>
                          setEditingDestination({ ...editingDestination, pickupDrop: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" /> Suitable For
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Families, Couples & Groups"
                        value={editingDestination.suitableFor || ""}
                        onChange={(e) =>
                          setEditingDestination({ ...editingDestination, suitableFor: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                      />
                    </div>
                  </div>

                  {/* Tagline / Short Summary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Tagline / Short Summary *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Royal Forts, Palaces, Camel Safaris & Golden Sand Dunes"
                      value={editingDestination.tagline}
                      onChange={(e) =>
                        setEditingDestination({ ...editingDestination, tagline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition font-medium"
                    />
                  </div>

                  {/* Cover Image Upload & Publish Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <ImageUploader
                        value={editingDestination.image}
                        onChange={(url) => setEditingDestination({ ...editingDestination, image: url })}
                        label="Destination Hero Banner / Cover Photo"
                        description="Upload a high-resolution photo from device or paste direct image URL"
                        aspect="landscape"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Publish Status</label>
                        <select
                          value={editingDestination.status}
                          onChange={(e) =>
                            setEditingDestination({
                              ...editingDestination,
                              status: e.target.value as "Published" | "Draft",
                            })
                          }
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] font-bold bg-white"
                        >
                          <option value="Published">🟢 Published (Live)</option>
                          <option value="Draft">🟡 Draft (Hidden)</option>
                        </select>
                      </div>

                      {/* Additional Photo Gallery */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-slate-500" /> Additional Gallery Images
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Paste image URL..."
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                          />
                          <button
                            type="button"
                            onClick={handleAddGalleryImage}
                            className="px-2.5 py-1.5 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-lg"
                          >
                            + Add
                          </button>
                        </div>

                        {editingDestination.gallery && editingDestination.gallery.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1 max-h-24 overflow-y-auto">
                            {editingDestination.gallery.map((url, i) => (
                              <div key={i} className="relative group/g w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                                <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(i)}
                                  className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover/g:opacity-100 transition text-[10px] font-bold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DAY-BY-DAY ITINERARY BUILDER */}
              {modalTab === "itinerary" && (
                <div className="space-y-5">
                  {/* Preset Quick Actions Bar */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black text-emerald-950 block">
                        ⚡ Quick Itinerary Templates
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        Select a duration to auto-generate day structures, or add custom days below:
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {[3, 4, 5, 6, 7, 8, 10].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => handleApplyPreset(count)}
                          className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-emerald-600 hover:text-white text-emerald-900 border border-emerald-300 rounded-lg shadow-2xs transition"
                        >
                          {count} Days
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddDay}
                        className="px-3.5 py-1 text-xs font-black bg-[#0F3A2E] hover:bg-[#154d3d] text-white rounded-lg shadow-xs transition flex items-center gap-1 ml-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Day</span>
                      </button>
                    </div>
                  </div>

                  {/* Empty State */}
                  {(!editingDestination.itinerary || editingDestination.itinerary.length === 0) ? (
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-3">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="text-xs font-bold text-slate-700">No Itinerary Days Created Yet</div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Select a template above (e.g. 5 Days or 7 Days) or click &ldquo;Add Day&rdquo; to build your detailed day-by-day plan.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddDay}
                        className="px-4 py-2 bg-[#0F3A2E] hover:bg-[#154d3d] text-white text-xs font-bold rounded-xl shadow transition"
                      >
                        + Add Day 1
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingDestination.itinerary.map((day, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-3 relative group"
                        >
                          {/* Day Card Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="w-7 h-7 rounded-xl bg-[#0F3A2E] text-white flex items-center justify-center font-black text-xs shrink-0">
                                {idx + 1}
                              </span>
                              <input
                                type="text"
                                placeholder={`Day ${idx + 1} Title (e.g. Arrival & Munnar Tea Garden Sunset)`}
                                value={day.title}
                                onChange={(e) => handleUpdateDay(idx, "title", e.target.value)}
                                className="px-3 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200 flex-1 focus:outline-hidden focus:border-[#FF6B35]"
                              />
                            </div>

                            <div className="flex items-center gap-1 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleDuplicateDay(idx)}
                                className="p-1 text-slate-400 hover:text-blue-700 rounded"
                                title="Duplicate Day"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveDay(idx, "up")}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                                title="Move Day Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === editingDestination.itinerary!.length - 1}
                                onClick={() => handleMoveDay(idx, "down")}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                                title="Move Day Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDay(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded ml-1"
                                title="Delete Day"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Key Highlights / Activities */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#FF6B35]" /> Key Sightseeing & Activities
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Fort Palace tour, Shikara ride on Dal Lake, Sunset photography"
                              value={day.activities || ""}
                              onChange={(e) => handleUpdateDay(idx, "activities", e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">
                              Full Day Detailed Itinerary & Route Plan
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Describe today's travel schedule, scenic highlights, local stops, viewpoints, and evening activities..."
                              value={day.description}
                              onChange={(e) => handleUpdateDay(idx, "description", e.target.value)}
                              className="w-full p-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] leading-relaxed"
                            />
                          </div>

                          {/* Extra Details: Meals, Stays, Distance, Altitude */}
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                            {/* Meal Plan */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Utensils className="w-3 h-3 text-emerald-600" /> Meal Plan
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Breakfast & Dinner"
                                value={day.meal || ""}
                                onChange={(e) => handleUpdateDay(idx, "meal", e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
                              />
                              <div className="flex gap-1 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDay(idx, "meal", "Breakfast Only")}
                                  className="text-[9px] bg-slate-200 hover:bg-emerald-100 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  B
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDay(idx, "meal", "Breakfast & Dinner")}
                                  className="text-[9px] bg-slate-200 hover:bg-emerald-100 text-slate-700 px-1.5 py-0.5 rounded font-bold"
                                >
                                  B+D
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDay(idx, "meal", "All Meals (B+L+D)")}
                                  className="text-[9px] bg-slate-200 hover:bg-emerald-100 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  All Meals
                                </button>
                              </div>
                            </div>

                            {/* Accommodation / Stay */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Building className="w-3 h-3 text-emerald-600" /> Accommodation / Stay
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 3-Star Deluxe Hotel"
                                value={day.stay || ""}
                                onChange={(e) => handleUpdateDay(idx, "stay", e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
                              />
                              <div className="flex gap-1 pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDay(idx, "stay", "3-Star Hotel")}
                                  className="text-[9px] bg-slate-200 hover:bg-emerald-100 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  3-Star
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDay(idx, "stay", "4-Star Luxury Resort")}
                                  className="text-[9px] bg-slate-200 hover:bg-emerald-100 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  4-Star
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateDay(idx, "stay", "Heritage Stay / Haveli")}
                                  className="text-[9px] bg-slate-200 hover:bg-emerald-100 text-slate-700 px-1.5 py-0.5 rounded"
                                >
                                  Heritage
                                </button>
                              </div>
                            </div>

                            {/* Distance & Travel Time */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3 text-emerald-600" /> Distance / Drive Time
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 120 km / 4 hrs"
                                value={day.distance || ""}
                                onChange={(e) => handleUpdateDay(idx, "distance", e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
                              />
                            </div>

                            {/* Altitude / Elevation */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-emerald-600" /> Altitude / Elevation
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 6,800 ft / 2,070 m"
                                value={day.altitude || ""}
                                onChange={(e) => handleUpdateDay(idx, "altitude", e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={handleAddDay}
                          className="px-5 py-2.5 text-xs font-extrabold bg-[#0F3A2E] hover:bg-[#154d3d] text-white rounded-xl shadow-xs transition inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Another Day</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
              {modalTab === "inclusions" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* INCLUSIONS COLUMN */}
                    <div className="space-y-3 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200/80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>What&apos;s Included</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingDestination({ ...editingDestination, inclusions: [...STANDARD_INCLUSIONS] })}
                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-2xs"
                        >
                          ⚡ Load Standard
                        </button>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {(editingDestination.inclusions || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateInclusion(idx, e.target.value)}
                              placeholder="e.g. Verified 3-Star Hotel Stay..."
                              className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveInclusion(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddInclusion}
                        className="w-full py-2 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-dashed border-emerald-300 flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Inclusion Point</span>
                      </button>
                    </div>

                    {/* EXCLUSIONS COLUMN */}
                    <div className="space-y-3 bg-rose-50/40 p-4 rounded-2xl border border-rose-200/80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-rose-900 font-extrabold text-xs uppercase">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>What&apos;s Excluded</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingDestination({ ...editingDestination, exclusions: [...STANDARD_EXCLUSIONS] })}
                          className="text-[10px] font-bold text-rose-700 hover:text-rose-900 bg-white px-2 py-1 rounded-md border border-rose-200 shadow-2xs"
                        >
                          ⚡ Load Standard
                        </button>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {(editingDestination.exclusions || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleUpdateExclusion(idx, e.target.value)}
                              placeholder="e.g. Airfare / Train tickets..."
                              className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-rose-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExclusion(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddExclusion}
                        className="w-full py-2 bg-white hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-dashed border-rose-300 flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Exclusion Point</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: OVERVIEW & TRAVEL TIPS */}
              {modalTab === "overview" && (
                <div className="space-y-5">
                  {/* Detailed Overview */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Destination About & Circuit Overview Guide
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Write a comprehensive overview about this travel destination, landscape, history, unique culture, must-try cuisines, and travel atmosphere..."
                      value={editingDestination.overview || ""}
                      onChange={(e) =>
                        setEditingDestination({ ...editingDestination, overview: e.target.value })
                      }
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] leading-relaxed"
                    />
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Key Highlights & Top Attractions (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amber Fort, Hawa Mahal, City Palace, Jal Mahal, Chokhi Dhani"
                      value={highlightsInput}
                      onChange={(e) => setHighlightsInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#FF6B35] transition font-medium"
                    />
                  </div>

                  {/* Important Travel Tips */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-emerald-600" /> Important Travel Tips & Packing Guidelines
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditingDestination({ ...editingDestination, travelTips: [...STANDARD_TIPS] })}
                        className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-md"
                      >
                        ⚡ Load Standard Tips
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingDestination.travelTips || []).map((tip, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={tip}
                            onChange={(e) => handleUpdateTip(idx, e.target.value)}
                            placeholder="e.g. Carry valid Government photo ID..."
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveTip(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTip}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Travel Tip</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: FAQS BUILDER */}
              {modalTab === "faqs" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900">
                        Frequently Asked Questions (FAQs)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Address traveler queries regarding weather, clothing, booking policy, and transport.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingDestination({ ...editingDestination, faqs: [...STANDARD_FAQS] })}
                        className="text-[10px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1.5 rounded-lg transition"
                      >
                        ⚡ Load Common FAQs
                      </button>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="px-3 py-1.5 bg-[#0F3A2E] hover:bg-[#154d3d] text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add FAQ</span>
                      </button>
                    </div>
                  </div>

                  {(!editingDestination.faqs || editingDestination.faqs.length === 0) ? (
                    <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-600">No FAQs Added Yet</p>
                      <button
                        type="button"
                        onClick={() => setEditingDestination({ ...editingDestination, faqs: [...STANDARD_FAQS] })}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg hover:bg-emerald-200 transition"
                      >
                        Load Standard Destination FAQs
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editingDestination.faqs.map((faq, idx) => (
                        <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              placeholder={`Question ${idx + 1}`}
                              value={faq.question}
                              onChange={(e) => handleUpdateFaq(idx, "question", e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs font-bold bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            placeholder="Write comprehensive answer..."
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(idx, "answer", e.target.value)}
                            className="w-full p-2.5 text-xs bg-white rounded-lg border border-slate-200 focus:outline-hidden focus:border-[#FF6B35]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Live Preview Card */}
              {editingDestination.name && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Card & Live Preview
                  </span>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xl">
                      {editingDestination.icon || "📍"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-900 truncate">
                          {editingDestination.name}
                        </span>
                        {editingDestination.badge && (
                          <span className="text-[9px] font-bold bg-[#FF6B35] text-white px-2 py-0.5 rounded-full">
                            {editingDestination.badge}
                          </span>
                        )}
                        {editingDestination.itinerary && editingDestination.itinerary.length > 0 && (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            📅 {editingDestination.itinerary.length} Days Itinerary
                          </span>
                        )}
                        {editingDestination.price && (
                          <span className="text-[10px] font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                            ₹{editingDestination.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate block mt-0.5">
                        {editingDestination.tagline || "Tagline appears here..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 text-xs font-extrabold bg-[#0F3A2E] hover:bg-[#154d3d] text-white rounded-xl shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingDestination.id ? "Update Destination & Full Details" : "Publish Full Destination"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Seasonal Customizer */}
      {salesModalDest && (
        <SalesItineraryCustomizer
          isOpen={!!salesModalDest}
          onClose={() => setSalesModalDest(null)}
          tour={{
            id: salesModalDest.id || salesModalDest.slug,
            name: `${salesModalDest.name} Tour Circuit`,
            slug: salesModalDest.slug,
            duration: salesModalDest.duration || `${salesModalDest.itinerary?.length || 5} Days`,
            altitude: "Scenic Hills & Valleys",
            difficulty: "Easy to Moderate",
            location: `${salesModalDest.name}, India`,
            region: salesModalDest.name,
            pickupPoint: salesModalDest.pickupDrop || "Airport / Station Pickup",
            price: salesModalDest.price || 14999,
            originalPrice: salesModalDest.originalPrice || 18999,
            category: "Domestic",
            tagline: salesModalDest.tagline || `Explore the best of ${salesModalDest.name}`,
            overview: salesModalDest.overview || "",
            itinerary: salesModalDest.itinerary || [],
            inclusions: salesModalDest.inclusions || [],
            exclusions: salesModalDest.exclusions || [],
          }}
        />
      )}

      {/* Client Itinerary PDF Modal with Logo & Watermark */}
      {pdfModalDest && (
        <ItineraryPdfModal
          isOpen={!!pdfModalDest}
          onClose={() => setPdfModalDest(null)}
          tour={{
            id: pdfModalDest.id || pdfModalDest.slug,
            name: `${pdfModalDest.name} Tour Circuit`,
            slug: pdfModalDest.slug,
            duration: pdfModalDest.duration || `${pdfModalDest.itinerary?.length || 5} Days`,
            altitude: "Scenic Hills & Valleys",
            difficulty: "Easy to Moderate",
            location: `${pdfModalDest.name}, India`,
            region: pdfModalDest.name,
            pickupPoint: pdfModalDest.pickupDrop || "Airport / Station Pickup",
            price: pdfModalDest.price || 14999,
            originalPrice: pdfModalDest.originalPrice || 18999,
            category: "Domestic",
            tagline: pdfModalDest.tagline || `Explore the best of ${pdfModalDest.name}`,
            overview: pdfModalDest.overview || "",
            itinerary: pdfModalDest.itinerary || [],
            inclusions: pdfModalDest.inclusions || [],
            exclusions: pdfModalDest.exclusions || [],
          }}
        />
      )}
    </div>
  );
}
