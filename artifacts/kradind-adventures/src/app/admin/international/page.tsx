"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Plane,
  ShieldCheck,
  FileCheck,
  FileDown,
  History,
  RotateCcw,
  ClipboardCopy,
  ClipboardPaste,
} from "lucide-react";
import { DestinationData, TrekItineraryDay } from "@/lib/cms-store";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { CustomEditableField } from "@/components/admin/custom-editable-field";

const POPULAR_COUNTRY_EMOJIS = ["🇳🇵", "🇮🇩", "🇹🇭", "🇦🇪", "🇻🇳", "🇸🇬", "🇲🇻", "🇱🇰", "🇲🇾", "🇲🇺", "🇪🇺", "🇬🇧", "✈️", "🏝️", "🏔️"];
const COUNTRY_PRESETS = [
  "All",
  "Nepal",
  "Bali",
  "Thailand",
  "Dubai",
  "Vietnam",
  "Singapore",
  "Maldives",
  "Other",
];

type ModalTab = "basic" | "itinerary" | "inclusions" | "overview" | "faqs";

const STANDARD_INTL_INCLUSIONS = [
  "Accommodation in verified 4-Star/5-Star luxury hotels or island boutique resorts on twin/double sharing",
  "Daily wholesome international buffet Breakfast and curated Dinners",
  "Private dedicated air-conditioned vehicle for all airport transfers, intercity journeys & guided sightseeing",
  "English-speaking licensed local tour director and certified drivers",
  "Pick-up and drop-off from designated International Airport terminals",
  "All inter-island ferry or high-speed speedboat transfers as specified in itinerary",
  "All standard monument, temple, and tourist attraction entry permits",
  "Complimentary local SIM assistance and 24/7 dedicated KRADIND International WhatsApp concierge",
];

const STANDARD_INTL_EXCLUSIONS = [
  "International airfare from home country to destination and return",
  "Country Visa on Arrival (VOA) or eVisa fees (unless explicitly selected in booking)",
  "Mandatory overseas travel & medical insurance (strongly recommended)",
  "Daily Lunches, personal refreshments, and room mini-bar charges",
  "Optional adventure sports, motorized water sports, and spa treatments",
  "City tourism taxes or hotel environmental resort fees payable directly at reception",
  "Applicable Government GST (5%) & TCS as per RBI regulations",
];

const STANDARD_INTL_FAQS = [
  {
    question: "What are the visa requirements for this international destination?",
    answer: "Most popular destinations like Bali, Thailand, and Maldives offer Visa-Free entry or simple Visa on Arrival (VOA) for Indian passport holders. For destinations requiring an eVisa (such as Dubai, Vietnam, or Singapore), KRADIND provides end-to-end visa document assistance.",
  },
  {
    question: "What passport validity is required for international travel?",
    answer: "Your passport MUST have at least 6 months validity remaining from the planned date of return to India, along with at least 2 blank visa pages.",
  },
  {
    question: "Can vegetarian and Jain meals be arranged on international tours?",
    answer: "Yes, absolutely! We coordinate closely with verified Indian restaurants and resort chefs at each destination to ensure delicious, authentic vegetarian and Jain food arrangements throughout your trip.",
  },
  {
    question: "How do currency exchange and Forex cards work?",
    answer: "We recommend carrying an international multi-currency Forex card (like Niyo, BookMyForex, or bank cards) for smooth cashless POS payments, along with a small amount of USD or local currency cash for local street markets and tipping.",
  },
];

const STANDARD_INTL_TIPS = [
  "Verify your passport has minimum 6 months validity from departure date.",
  "Keep digital and printed copies of your passport, visa copy, return flight tickets, and hotel confirmation vouchers.",
  "Enable international roaming or pick up a local tourist eSIM/physical SIM card at the airport arrivals hall for seamless maps and WhatsApp connectivity.",
  "Carry a universal power adapter plug compatible with international pin types.",
];

export default function AdminInternationalPage() {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>("basic");
  const [editingItem, setEditingItem] = useState<DestinationData | null>(null);
  const [recoveredDraft, setRecoveredDraft] = useState<DestinationData | null>(null);
  const editingItemRef = useRef<DestinationData | null>(editingItem);
  const isModalOpenRef = useRef<boolean>(isModalOpen);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [highlightsInput, setHighlightsInput] = useState("");
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [showPastePackageModal, setShowPastePackageModal] = useState(false);
  const [pastePackageInput, setPastePackageInput] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/admin/international", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (err) {
      console.error("Failed to load international tours:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  // Sync refs for exit handlers
  useEffect(() => {
    editingItemRef.current = editingItem;
    isModalOpenRef.current = isModalOpen;
  }, [editingItem, isModalOpen]);

  // Load unsaved draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kradind_admin_intl_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.slug)) {
          setRecoveredDraft(parsed);
        }
      }
    } catch {}
  }, []);

  const [showIntlHistoryModal, setShowIntlHistoryModal] = useState(false);
  const lastIntlSnapshotHashRef = useRef<string>("");
  const isRestoringIntlRef = useRef<boolean>(false);

  // Manual snapshot
  const handleManualIntlSnapshot = (customNote?: string) => {
    if (!editingItem) return;
    const nextVer = (editingItem.versionHistory?.length || 0) + 1;
    const now = new Date().toISOString();
    const snap = {
      version: nextVer,
      timestamp: now,
      author: "Admin Agent",
      note: customNote || `Manual Snapshot v${nextVer} (${(editingItem.itinerary || []).length} Days • ₹${(editingItem.price || 0).toLocaleString("en-IN")})`,
      destinationSnapshot: JSON.parse(JSON.stringify(editingItem)),
    };
    const updatedHistory = [snap, ...(editingItem.versionHistory || [])].slice(0, 25);
    const updatedItem: DestinationData = {
      ...editingItem,
      status: "Draft",
      version: nextVer,
      versionHistory: updatedHistory,
      updatedAt: now,
    };
    setEditingItem(updatedItem);
    try {
      localStorage.setItem("kradind_admin_intl_draft", JSON.stringify(updatedItem));
      fetch("/api/admin/international", {
        method: editingItem.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      }).catch(() => {});
    } catch {}
    showToast(`📸 International tour snapshot v${nextVer} captured!`);
  };

  // Restore snapshot from international revision history
  const handleRestoreIntlVersion = (snap: any, versionNum: number) => {
    if (!editingItem) return;
    if (confirm(`Restore tour revision v${versionNum}? Current unsaved edits in modal will be replaced.`)) {
      isRestoringIntlRef.current = true;
      setEditingItem({
        ...editingItem,
        ...snap.destinationSnapshot,
        status: "Draft",
        updatedAt: new Date().toISOString(),
      });
      setShowIntlHistoryModal(false);
      showToast(`🕒 Restored tour revision v${versionNum}!`);
    }
  };

  // Continuous debounced auto-save to Database & localStorage with automated revision snapshots
  useEffect(() => {
    if (!isModalOpen || !editingItem) return;

    if (isRestoringIntlRef.current) {
      isRestoringIntlRef.current = false;
      return;
    }

    const name = (editingItem.name || "").trim();
    if (!name) return;

    const timer = setTimeout(() => {
      try {
        const contentHash = JSON.stringify({
          name: editingItem.name,
          price: editingItem.price,
          duration: editingItem.duration,
          days: (editingItem.itinerary || []).map((d) => ({ t: d.title, d: d.description, s: d.stay })),
          highlights: editingItem.highlights || [],
          overview: editingItem.overview,
        });

        let updatedHistory = Array.isArray(editingItem.versionHistory) ? [...editingItem.versionHistory] : [];
        let newVersion = editingItem.version || 1;

        if (contentHash !== lastIntlSnapshotHashRef.current) {
          newVersion = updatedHistory.length + 1;
          const autoSnap = {
            version: newVersion,
            timestamp: new Date().toISOString(),
            author: "Admin Agent",
            note: `Auto-saved Draft v${newVersion} (${(editingItem.itinerary || []).length} Days • ₹${(editingItem.price || 0).toLocaleString("en-IN")})`,
            destinationSnapshot: JSON.parse(JSON.stringify(editingItem)),
          };
          updatedHistory = [autoSnap, ...updatedHistory].slice(0, 25);
          lastIntlSnapshotHashRef.current = contentHash;

          setEditingItem((prev) => prev ? {
            ...prev,
            status: "Draft",
            version: newVersion,
            versionHistory: updatedHistory,
          } : null);
        }

        const draftPayload = {
          ...editingItem,
          status: "Draft",
          version: newVersion,
          versionHistory: updatedHistory,
        };

        localStorage.setItem("kradind_admin_intl_draft", JSON.stringify(draftPayload));

        fetch("/api/admin/international", {
          method: editingItem.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftPayload),
        }).catch(() => {});
      } catch (err) {
        console.warn("International tour auto-save error:", err);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [editingItem, isModalOpen]);

  // Tab close & background exit auto-save to Database & localStorage
  useEffect(() => {
    const autoSaveOnExit = () => {
      const item = editingItemRef.current;
      const open = isModalOpenRef.current;
      if (!open || !item) return;

      const name = (item.name || "").trim();
      if (!name) return;

      const draftPayload = {
        ...item,
        status: "Draft",
      };

      try {
        localStorage.setItem("kradind_admin_intl_draft", JSON.stringify(draftPayload));
      } catch {}

      try {
        fetch("/api/admin/international", {
          method: item.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftPayload),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    };

    const handleBeforeUnload = () => autoSaveOnExit();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") autoSaveOnExit();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleOpenAdd = () => {
    const defaultItem: DestinationData = {
      id: "",
      name: "",
      slug: "",
      category: "International",
      tagline: "",
      duration: "5 Nights / 6 Days",
      price: 39999,
      originalPrice: 48999,
      bestSeason: "September to April",
      pickupDrop: "Designated International Airport",
      suitableFor: "Couples, Honeymooners, Families & Friends",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      gallery: [],
      badge: "Visa On Arrival",
      highlights: [],
      overview: "",
      itinerary: [
        {
          day: 1,
          title: "Arrival & VIP Hotel Transfer",
          description: "Arrive at destination international airport. Meet our chauffeur and transfer to your luxury hotel. Evening at leisure.",
          activities: "Airport pickup, Hotel check-in, Evening city walk",
          meal: "Dinner included",
          stay: "Verified 4-Star Resort",
          distance: "25 km",
          duration: "45 mins",
        },
        {
          day: 2,
          title: "Guided Highlights & Cultural Exploration",
          description: "Full day sightseeing of top iconic attractions, heritage temples, and panoramic viewpoints with private vehicle.",
          activities: "City highlights tour, Iconic monuments, Scenic viewpoint",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Resort",
          distance: "40 km",
          duration: "Full Day",
        },
      ],
      inclusions: [...STANDARD_INTL_INCLUSIONS],
      exclusions: [...STANDARD_INTL_EXCLUSIONS],
      faqs: [...STANDARD_INTL_FAQS],
      travelTips: [...STANDARD_INTL_TIPS],
      status: "Draft",
      version: 1,
      versionHistory: [],
      color: "from-blue-900/80",
      icon: "✈️",
    };
    setEditingItem(defaultItem);
    setHighlightsInput("");
    setModalTab("basic");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DestinationData) => {
    setEditingItem({
      ...item,
      category: "International",
      gallery: item.gallery || [],
      highlights: item.highlights || [],
      itinerary: item.itinerary || [],
      inclusions: item.inclusions || [...STANDARD_INTL_INCLUSIONS],
      exclusions: item.exclusions || [...STANDARD_INTL_EXCLUSIONS],
      faqs: item.faqs || [...STANDARD_INTL_FAQS],
      travelTips: item.travelTips || [...STANDARD_INTL_TIPS],
    });
    setHighlightsInput((item.highlights || []).join(", "));
    setModalTab("basic");
    setIsModalOpen(true);
  };

  const handleDuplicate = async (item: DestinationData) => {
    setActionLoading(true);
    try {
      const copySlug = `${item.slug}-copy-${Math.floor(Math.random() * 1000)}`;
      const payload = {
        ...item,
        name: `${item.name} (Copy)`,
        slug: copySlug,
        status: "Draft",
      };

      const res = await fetch("/api/admin/international", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast("✅ Tour package duplicated successfully as draft!");
        fetchDestinations();
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Failed to duplicate package");
      }
    } catch {
      alert("Network error while duplicating package");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;

    if (!editingItem.name.trim()) {
      alert("Please enter a Tour or Country name.");
      setModalTab("basic");
      return;
    }

    setActionLoading(true);
    try {
      const highlights = highlightsInput
        .split(/[\n,]+/)
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        ...editingItem,
        category: "International",
        highlights,
      };

      const isNew = !editingItem.id;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch("/api/admin/international", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        try {
          localStorage.removeItem("kradind_admin_intl_draft");
        } catch {}
        setRecoveredDraft(null);
        showToast(
          isNew
            ? "🎉 New International Tour Package created and live!"
            : "✅ International Tour Package updated successfully!"
        );
        fetchDestinations();
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Failed to save package");
      }
    } catch {
      alert("Network error while saving package");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string | number, slug: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/international?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("🗑️ Package moved to Recycle Bin! You can restore it anytime.");
        setDeleteConfirmId(null);
        fetchDestinations();
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Failed to delete package");
      }
    } catch {
      alert("Network error while deleting package");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreItem = async (id: string | number, slug: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/international?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(slug)}&restore=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("✅ International package restored successfully as Draft!");
        fetchDestinations();
      } else {
        alert("Failed to restore package");
      }
    } catch {
      alert("Error restoring package");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDeleteItem = async (id: string | number, slug: string) => {
    if (!confirm("Are you sure you want to permanently delete this package? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/international?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(slug)}&permanent=true`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("🗑️ Package permanently deleted.");
        fetchDestinations();
      } else {
        alert("Failed to permanently delete package");
      }
    } catch {
      alert("Error permanently deleting package");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmptyRecycleBin = async () => {
    if (!confirm("Are you sure you want to permanently purge all items in the Recycle Bin?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/international?emptyRecycleBin=true`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ Recycle Bin emptied!");
        setShowRecycleModal(false);
        fetchDestinations();
      } else {
        alert("Failed to empty Recycle Bin");
      }
    } catch {
      alert("Error emptying Recycle Bin");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyPackage = (item: DestinationData) => {
    try {
      const cleanData = {
        ...item,
        id: undefined,
        _id: undefined,
        status: "Draft",
      };
      navigator.clipboard.writeText(JSON.stringify(cleanData, null, 2));
      showToast(`📋 Copied "${item.name}" package JSON to clipboard!`);
    } catch {
      alert("Failed to copy package to clipboard");
    }
  };

  const toggleStatus = async (item: DestinationData) => {
    const nextStatus = item.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch("/api/admin/international", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, status: nextStatus }),
      });

      if (res.ok) {
        showToast(`Status updated to ${nextStatus}`);
        setDestinations(
          destinations.map((d) => (d.id === item.id ? { ...d, status: nextStatus } : d))
        );
      }
    } catch {
      alert("Failed to update status");
    }
  };

  // Itinerary helper methods
  const handleAddItineraryDay = () => {
    if (!editingItem) return;
    const currentItinerary = editingItem.itinerary || [];
    const nextDayNum = currentItinerary.length + 1;
    const newDay: TrekItineraryDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum}: Sightseeing & Leisure`,
      description: "Enjoy guided sightseeing, scenic excursions, and free time for personal shopping.",
      activities: "Guided tours, Photo stops, Local market exploration",
      meal: "Breakfast & Dinner",
      stay: "Verified 4-Star Resort",
      distance: "30 km",
      duration: "Half Day",
    };
    setEditingItem({
      ...editingItem,
      itinerary: [...currentItinerary, newDay],
    });
  };

  const handleUpdateDay = (index: number, field: keyof TrekItineraryDay, val: any) => {
    if (!editingItem || !editingItem.itinerary) return;
    const updated = [...editingItem.itinerary];
    updated[index] = { ...updated[index], [field]: val };
    setEditingItem({ ...editingItem, itinerary: updated });
  };

  const handleRemoveDay = (index: number) => {
    if (!editingItem || !editingItem.itinerary) return;
    const updated = editingItem.itinerary
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, day: i + 1 }));
    setEditingItem({ ...editingItem, itinerary: updated });
  };

  const handleMoveDay = (index: number, direction: "up" | "down") => {
    if (!editingItem || !editingItem.itinerary) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= editingItem.itinerary.length) return;

    const list = [...editingItem.itinerary];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const renumbered = list.map((d, i) => ({ ...d, day: i + 1 }));
    setEditingItem({ ...editingItem, itinerary: renumbered });
  };

  // FAQs helper methods
  const handleAddFaq = () => {
    if (!editingItem) return;
    const currentFaqs = editingItem.faqs || [];
    setEditingItem({
      ...editingItem,
      faqs: [
        ...currentFaqs,
        {
          question: "New International Travel Question?",
          answer: "Provide clear, reassuring information for international travelers here.",
        },
      ],
    });
  };

  const handleUpdateFaq = (idx: number, field: "question" | "answer", val: string) => {
    if (!editingItem || !editingItem.faqs) return;
    const updated = [...editingItem.faqs];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditingItem({ ...editingItem, faqs: updated });
  };

  const handleRemoveFaq = (idx: number) => {
    if (!editingItem || !editingItem.faqs) return;
    setEditingItem({
      ...editingItem,
      faqs: editingItem.faqs.filter((_, i) => i !== idx),
    });
  };

  // Separate active packages from soft-deleted / recycled items
  const activeDestinations = destinations.filter((d) => !d.isDeleted && d.status !== "Trash");
  const recycledDestinations = destinations.filter((d) => d.isDeleted || d.status === "Trash");

  // Filtered destinations list
  const filtered = activeDestinations.filter((dest) => {
    const matchesSearch =
      searchQuery === "" ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dest.highlights || []).some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry =
      countryFilter === "All" ||
      dest.name.toLowerCase().includes(countryFilter.toLowerCase()) ||
      dest.slug.toLowerCase().includes(countryFilter.toLowerCase()) ||
      (countryFilter === "Other" &&
        !["nepal", "bali", "thailand", "dubai", "vietnam", "singapore", "maldives"].some(
          (c) => dest.slug.toLowerCase().includes(c) || dest.name.toLowerCase().includes(c)
        ));

    const matchesStatus =
      statusFilter === "All" || dest.status === statusFilter;

    return matchesSearch && matchesCountry && matchesStatus;
  });

  const publishedCount = activeDestinations.filter((d) => d.status === "Published").length;
  const draftCount = activeDestinations.filter((d) => d.status === "Draft").length;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 border border-emerald-500/40">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Print-Only International Catalog Header */}
      <div className="hidden print:flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F3A2E]">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="KRADIND Adventures"
            width={160}
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
          <div>
            <h1 className="text-base font-extrabold text-[#0F3A2E]">
              International Tours & Holiday Packages Catalog
            </h1>
            <p className="text-[10px] text-slate-500">
              Official KRAD Global Travels Portfolio
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <span className="font-bold text-slate-900 block">
            Total Tours: {filtered.length}
          </span>
          <span className="text-[10px] text-slate-500 block">
            Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            www.kradind.com • +91 9797941414
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden print:hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>World Expeditions &amp; Holidays Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              International Tours CMS
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Create, edit, and publish international holiday packages, flight details, visa assistance disclosures, and day-by-day itineraries across Bali, Thailand, Dubai, Nepal, Vietnam, Singapore, Maldives, and beyond.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 backdrop-blur-xs cursor-pointer"
              title="Export clean, lightweight PDF catalog of international tours"
            >
              <FileDown className="w-4 h-4 text-emerald-300" />
              <span>Export Clean PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPastePackageModal(true)}
              className="px-4 py-2.5 rounded-xl border border-indigo-400/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-bold transition flex items-center gap-2 backdrop-blur-xs cursor-pointer"
              title="Import or paste full package JSON directly"
            >
              <Copy className="w-4 h-4 text-indigo-300" />
              <span>📥 Paste / Import JSON</span>
            </button>

            {/* Recycle Bin Button */}
            <button
              type="button"
              onClick={() => setShowRecycleModal(true)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 backdrop-blur-xs cursor-pointer ${
                recycledDestinations.length > 0
                  ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-400/40 shadow-sm"
                  : "border-white/20 bg-white/10 hover:bg-white/20 text-white"
              }`}
              title="Open Recycle Bin to restore or permanently purge deleted items"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Recycle Bin ({recycledDestinations.length})</span>
            </button>

            <Link
              href="/international-trips"
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 backdrop-blur-xs"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Public Page</span>
            </Link>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#e05320] text-white text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-orange-950/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add International Tour</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-slate-400 font-medium">Total Packages</div>
            <div className="text-xl font-bold text-white mt-0.5">{destinations.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-emerald-400 font-medium">Published &amp; Live</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">{publishedCount}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-amber-400 font-medium">Drafts / In Review</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">{draftCount}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="text-[11px] text-blue-400 font-medium">Starting Package</div>
            <div className="text-xl font-bold text-blue-300 mt-0.5">
              ₹{Math.min(...destinations.map((d) => d.price || 32999)).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Draft Recovery Banner */}
      {recoveredDraft && !isModalOpen && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-blue-50 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              💾
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">
                Unfinished International Tour Draft Auto-Recovered!
              </p>
              <p className="text-slate-600 mt-0.5">
                Tour: <strong className="text-amber-900">{recoveredDraft.name || "Untitled International Tour"}</strong> ({recoveredDraft.duration || "Custom Days"}). You left this during your previous session.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditingItem(recoveredDraft);
                setHighlightsInput((recoveredDraft.highlights || []).join(", "));
                setIsModalOpen(true);
                setRecoveredDraft(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Resume Editing</span>
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem("kradind_admin_intl_draft");
                } catch {}
                setRecoveredDraft(null);
                showToast("Draft discarded");
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-semibold transition cursor-pointer"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 print:hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by country, city, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setStatusFilter("All")}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === "All" ? "bg-white text-slate-900 shadow-2xs" : "hover:text-slate-900"
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Published")}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === "Published" ? "bg-white text-emerald-800 shadow-2xs" : "hover:text-slate-900"
                }`}
              >
                Live ({publishedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("Draft")}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === "Draft" ? "bg-white text-amber-800 shadow-2xs" : "hover:text-slate-900"
                }`}
              >
                Drafts ({draftCount})
              </button>
            </div>
          </div>
        </div>

        {/* Country Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Country:</span>
          </span>
          {COUNTRY_PRESETS.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => setCountryFilter(country)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                countryFilter === country
                  ? "bg-[#0F3A2E] text-white shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 h-80 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No international packages match your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or country filter, or click below to add a new international tour circuit.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#0F3A2E] text-white text-xs font-bold rounded-xl hover:bg-[#164e3f] transition"
          >
            + Add International Tour
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 print:grid-cols-2 print:gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between group break-inside-avoid page-break-inside-avoid print-card-item print:border-slate-300 print:shadow-none"
            >
              <div>
                {/* Visual Image Header with Badges */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badges on Top */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold flex items-center gap-1 border border-white/20">
                      <span>{item.icon || "✈️"}</span>
                      <span>{item.name}</span>
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-bold shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Status Toggle on Top Right */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 shadow-sm backdrop-blur-xs ${
                        item.status === "Published"
                          ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                          : "bg-amber-500/90 text-white hover:bg-amber-600"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {item.status === "Published" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Draft
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Image Overlay: Pricing & Duration */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
                    <div>
                      <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration || "5 Nights / 6 Days"}</span>
                      </div>
                      <div className="text-base font-black flex items-baseline gap-1.5 mt-0.5">
                        <span>₹{(item.price || 39999).toLocaleString("en-IN")}</span>
                        {item.originalPrice && item.originalPrice > (item.price || 0) && (
                          <span className="text-[11px] text-slate-300 line-through font-normal">
                            ₹{item.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-400 font-normal">/ person</span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs text-white">
                      {item.itinerary?.length || 5} Days Plan
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-[#0F3A2E] transition">
                      {item.name}
                    </h2>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.tagline || `Explore customized international holidays in ${item.name}.`}
                    </p>
                  </div>

                  {/* Airport & Best Season */}
                  <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.pickupDrop && (
                      <div className="flex items-center gap-1.5 truncate" title={item.pickupDrop}>
                        <Plane className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{item.pickupDrop}</span>
                      </div>
                    )}
                    {item.bestSeason && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Best: {item.bestSeason}</span>
                      </div>
                    )}
                  </div>

                  {/* Highlights Chips */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.highlights.slice(0, 3).map((h, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-medium truncate max-w-[200px]"
                        >
                          {h}
                        </span>
                      ))}
                      {item.highlights.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold">
                          +{item.highlights.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2 print:hidden">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Package</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(item)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs transition"
                    title="Duplicate Tour Package"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy Package JSON */}
                  <button
                    type="button"
                    onClick={() => handleCopyPackage(item)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-emerald-700 text-xs transition"
                    title="Copy Package JSON to clipboard"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/international-trips/${item.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs transition"
                    title="Preview on Live Site"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>

                  {deleteConfirmId === item.id ? (
                    <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-700 font-bold px-1">Delete?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.slug)}
                        className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(item.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Move to Recycle Bin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL-FEATURED EDIT / CREATE MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-6xl h-[92vh] max-h-[94vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 text-lg">
                  {editingItem.icon || "✈️"}
                </span>
                <div>
                  <h3 className="text-base font-bold">
                    {editingItem.id ? `Edit: ${editingItem.name}` : "Create New International Tour"}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Comprehensive international tour management with itineraries, inclusions &amp; visa guidance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Auto-saved as Draft</span>
                </div>

                {/* Revision History Button */}
                <button
                  type="button"
                  onClick={() => setShowIntlHistoryModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-400/40 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold transition shadow-2xs cursor-pointer"
                  title="View revision history and restore snapshots"
                >
                  <History className="w-3.5 h-3.5 text-purple-300" />
                  <span>History (v{editingItem.version || 1})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with Left Sidebar */}
            <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
              {/* Left Sidebar Navigation */}
              <aside className="w-56 sm:w-64 lg:w-72 shrink-0 bg-slate-50/90 border-r border-slate-200/90 flex flex-col justify-between overflow-y-auto p-3 sm:p-4">
                <div className="space-y-1.5">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Tour Sections
                  </div>
                  <nav className="flex flex-col gap-1.5">
                    {[
                      { key: "basic", label: "Basic Details & Media", icon: FileText, count: undefined },
                      { key: "itinerary", label: "Day-by-Day Itinerary", icon: Calendar, count: `${editingItem.itinerary?.length || 0} Days` },
                      { key: "inclusions", label: "Inclusions & Exclusions", icon: CheckCircle2, count: `${editingItem.inclusions?.length || 0}/${editingItem.exclusions?.length || 0}` },
                      { key: "overview", label: "Overview & Visa Info", icon: Info, count: undefined },
                      { key: "faqs", label: "Traveler FAQs", icon: HelpCircle, count: editingItem.faqs?.length || 0 },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = modalTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setModalTab(tab.key as ModalTab)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition flex items-center justify-between gap-2.5 group cursor-pointer ${
                            isActive
                              ? "bg-[#0F3A2E] text-white shadow-md font-bold ring-2 ring-[#0F3A2E]/20"
                              : "text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`p-1.5 rounded-xl transition ${
                              isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600 group-hover:text-slate-900"
                            }`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="truncate">{tab.label}</span>
                          </div>
                          {tab.count !== undefined && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition shrink-0 ${
                              isActive
                                ? "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30"
                                : "bg-slate-200/70 text-slate-600"
                            }`}>
                              {tab.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* Right Content Area */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              {/* TAB 1: BASIC & MEDIA */}
              {modalTab === "basic" && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <CustomEditableField
                        label="Tour / Country Name *"
                        required
                        value={editingItem.name}
                        onChange={(val) => {
                          const autoSlug = val
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "-")
                            .replace(/-+/g, "-");
                          setEditingItem({
                            ...editingItem,
                            name: val,
                            slug: editingItem.slug ? editingItem.slug : autoSlug,
                          });
                        }}
                        placeholder="e.g. Bali Island & Nusa Penida Escape"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        URL Slug <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-600">
                        <span className="text-slate-400">/international-trips/</span>
                        <input
                          type="text"
                          value={editingItem.slug}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              slug: e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "")
                                .replace(/-+/g, "-"),
                            })
                          }
                          placeholder="bali"
                          className="flex-1 bg-transparent outline-none font-bold text-[#0F3A2E]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Flag Emoji & Badge & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Country Flag / Emoji Icon
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingItem.icon || "✈️"}
                          onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                          className="w-16 text-center px-3 py-2 text-base bg-slate-50 border border-slate-300 rounded-xl outline-none"
                        />
                        <div className="flex flex-wrap gap-1 flex-1">
                          {POPULAR_COUNTRY_EMOJIS.slice(0, 8).map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setEditingItem({ ...editingItem, icon: em })}
                              className="text-xs p-1.5 rounded-lg hover:bg-slate-100 border border-slate-200"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <CustomEditableField
                        label="Promo Badge"
                        value={editingItem.badge || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, badge: val })}
                        placeholder="e.g. Visa On Arrival / Best Seller"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Publish Status
                      </label>
                      <select
                        value={editingItem.status}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            status: e.target.value as "Published" | "Draft",
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] font-semibold"
                      >
                        <option value="Published">🟢 Published &amp; Live on Website</option>
                        <option value="Draft">🟡 Draft (Hidden from Public)</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <CustomEditableField
                        label="Duration"
                        value={editingItem.duration || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, duration: val })}
                        placeholder="e.g. 6 Nights / 7 Days"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Offer Price (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={editingItem.price || 0}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, price: Number(e.target.value) })
                        }
                        placeholder="42999"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] font-bold text-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={editingItem.originalPrice || 0}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, originalPrice: Number(e.target.value) })
                        }
                        placeholder="49999"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] text-slate-500"
                      />
                    </div>

                    <div>
                      <CustomEditableField
                        label="Best Season"
                        value={editingItem.bestSeason || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, bestSeason: val })}
                        placeholder="e.g. April to October"
                      />
                    </div>
                  </div>

                  {/* Airport Pickup & Drop and Suitable For */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <CustomEditableField
                        label="Airport Pickup & Drop Terminal"
                        value={editingItem.pickupDrop || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, pickupDrop: val })}
                        placeholder="e.g. Ngurah Rai International Airport (DPS), Denpasar"
                      />
                    </div>

                    <div>
                      <CustomEditableField
                        label="Suitable For"
                        value={editingItem.suitableFor || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, suitableFor: val })}
                        placeholder="e.g. Couples, Honeymooners, Families & Friends"
                      />
                    </div>
                  </div>

                  {/* Tagline */}
                  <RichTextEditor
                    compact
                    label="Catchy Tagline / Subtitle"
                    value={editingItem.tagline || ""}
                    onChange={(val) => setEditingItem({ ...editingItem, tagline: val })}
                    placeholder="e.g. Tropical Island Paradise: Ubud Terraces, Uluwatu Sunsets & Nusa Penida Cliffs"
                    rows={2}
                    helperText="Supports formatting (Bold, Italic, Sizing, Colors, Badge) for card and hero."
                  />

                  {/* Hero Cover Image (Using Resilient ImageUploader) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <ImageUploader
                      value={editingItem.image}
                      onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                      label="Hero Banner / Cover Photo"
                      description="Upload photo from device (auto-compressed for sub-second load) or paste image link."
                      aspect="landscape"
                      required
                    />
                  </div>

                  {/* Photo Gallery (Using Resilient Gallery Uploader) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <ImageUploader
                      mode="gallery"
                      images={editingItem.gallery || []}
                      onChange={(imgs) => setEditingItem({ ...editingItem, gallery: imgs })}
                      primaryImage={editingItem.image}
                      onSetPrimary={(url) => setEditingItem({ ...editingItem, image: url })}
                      label="International Tour Photo Gallery"
                      description="Add multiple high-resolution photos of landmarks, beaches, and luxury resort stays."
                    />
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <CustomEditableField
                      multiline
                      rows={2}
                      label="Tour Highlights (Comma-separated)"
                      value={highlightsInput}
                      onChange={(val) => setHighlightsInput(val)}
                      placeholder="Ubud Monkey Forest, Nusa Penida Kelingking Beach, Uluwatu Sunset Kecak Dance, Seminyak Beach Clubs"
                      helperText="These appear as highlight tags on tour cards and in search results."
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: DAY-BY-DAY ITINERARY */}
              {modalTab === "itinerary" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Day-by-Day International Itinerary ({editingItem.itinerary?.length || 0} Days)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Detail activities, stays, and included meals for each day. Trekkers love comprehensive itineraries!
                      </p>
                    </div>
                  </div>

                  {editingItem.itinerary && editingItem.itinerary.length > 0 ? (
                    <div className="space-y-3">
                      {editingItem.itinerary.map((day, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-3 relative group"
                        >
                          {/* Day Header */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 flex-1">
                              <div className="w-10 h-10 rounded-full bg-[#0F3A2E] text-white flex flex-col items-center justify-center font-sans shrink-0 border border-white ring-2 ring-[#0F3A2E]/20 shadow-xs select-none">
                                <span className="text-[8px] font-bold uppercase leading-none">Day</span>
                                <span className="text-xs font-black leading-none mt-0.5">{day.day}</span>
                              </div>
                              <CustomEditableField
                                compact
                                value={day.title}
                                onChange={(val) => handleUpdateDay(idx, "title", val)}
                                placeholder="Day Title e.g. Arrival in Bali & Transfer to Ubud"
                                className="flex-1"
                              />
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveDay(idx, "up")}
                                className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                                title="Move Day Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === editingItem.itinerary!.length - 1}
                                onClick={() => handleMoveDay(idx, "down")}
                                className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                                title="Move Day Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveDay(idx)}
                                className="p-1 rounded-md bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100"
                                title="Remove Day"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Description */}
                          <RichTextEditor
                            compact
                            label="Day Schedule & Highlights"
                            rows={3}
                            value={day.description || ""}
                            onChange={(val) => handleUpdateDay(idx, "description", val)}
                            placeholder="Comprehensive description of the day's journey, monuments, cultural visits, and highlights..."
                          />

                          {/* Meals, Stay, Activities */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                                Included Meals
                              </label>
                              <input
                                type="text"
                                value={day.meal || ""}
                                onChange={(e) => handleUpdateDay(idx, "meal", e.target.value)}
                                placeholder="e.g. Breakfast & Dinner"
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                                Overnight Stay
                              </label>
                              <input
                                type="text"
                                value={day.stay || ""}
                                onChange={(e) => handleUpdateDay(idx, "stay", e.target.value)}
                                placeholder="e.g. 4-Star Resort in Ubud"
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                                Distance / Travel Time
                              </label>
                              <input
                                type="text"
                                value={day.distance || ""}
                                onChange={(e) => handleUpdateDay(idx, "distance", e.target.value)}
                                placeholder="e.g. 45 km / 1.5 hrs"
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Day / Activity Button - Always at the Bottom */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t-2 border-slate-200 mt-2">
                        <span className="text-xs text-slate-500 font-semibold">
                          Total {editingItem.itinerary.length} Days / Activities configured
                        </span>
                        <button
                          type="button"
                          onClick={handleAddItineraryDay}
                          className="px-5 py-2.5 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 self-end"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add Day / Activity {editingItem.itinerary.length + 1}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-500 font-bold">No days added to itinerary yet.</p>
                      <button
                        type="button"
                        onClick={handleAddItineraryDay}
                        className="mt-2 px-3 py-1.5 bg-[#0F3A2E] text-white rounded-lg text-xs font-bold"
                      >
                        + Add Day 1
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: INCLUSIONS & EXCLUSIONS */}
              {modalTab === "inclusions" && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Tour Inclusions (What's Included)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, inclusions: [...STANDARD_INTL_INCLUSIONS] })}
                          className="text-[10px] text-emerald-700 hover:underline font-bold"
                        >
                          Load Standard Inclusions
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingItem.inclusions || []).map((inc, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-emerald-600 font-bold text-xs">✓</span>
                            <CustomEditableField
                              compact
                              value={inc}
                              onChange={(val) => {
                                const next = [...(editingItem.inclusions || [])];
                                next[i] = val;
                                setEditingItem({ ...editingItem, inclusions: next });
                              }}
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingItem.inclusions || []).filter((_, idx) => idx !== i);
                                setEditingItem({ ...editingItem, inclusions: next });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingItem({
                            ...editingItem,
                            inclusions: [...(editingItem.inclusions || []), "New included service or amenity"],
                          })
                        }
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Inclusion</span>
                      </button>
                    </div>

                    {/* Exclusions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <label className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Tour Exclusions (What's Not Included)</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, exclusions: [...STANDARD_INTL_EXCLUSIONS] })}
                          className="text-[10px] text-rose-700 hover:underline font-bold"
                        >
                          Load Standard Exclusions
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingItem.exclusions || []).map((exc, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-rose-500 font-bold text-xs">✗</span>
                            <CustomEditableField
                              compact
                              value={exc}
                              onChange={(val) => {
                                const next = [...(editingItem.exclusions || [])];
                                next[i] = val;
                                setEditingItem({ ...editingItem, exclusions: next });
                              }}
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingItem.exclusions || []).filter((_, idx) => idx !== i);
                                setEditingItem({ ...editingItem, exclusions: next });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingItem({
                            ...editingItem,
                            exclusions: [...(editingItem.exclusions || []), "Personal expenses / optional activity"],
                          })
                        }
                        className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Exclusion</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: OVERVIEW & VISA INFO */}
              {modalTab === "overview" && (
                <div className="space-y-5 animate-in fade-in">
                  <RichTextEditor
                    label="Comprehensive Destination Overview & Narrative"
                    rows={5}
                    value={editingItem.overview || ""}
                    onChange={(val) => setEditingItem({ ...editingItem, overview: val })}
                    placeholder="Describe what makes this international destination extraordinary: cultural heritage, landscapes, beach experiences, and why travelers should choose KRADIND..."
                    helperText="Supports Headings (##), Bullet Lists (•), Bold, Italic, Color Highlights, Underline, and Badges."
                  />

                  {/* Travel Tips & Visa Guidance */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>Visa Requirements, Passport &amp; Travel Tips</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, travelTips: [...STANDARD_INTL_TIPS] })}
                        className="text-[10px] text-blue-700 hover:underline font-bold"
                      >
                        Load Standard Travel Tips
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingItem.travelTips || []).map((tip, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-blue-500 font-bold text-xs">ℹ</span>
                          <CustomEditableField
                            compact
                            value={tip}
                            onChange={(val) => {
                              const next = [...(editingItem.travelTips || [])];
                              next[i] = val;
                              setEditingItem({ ...editingItem, travelTips: next });
                            }}
                            className="flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (editingItem.travelTips || []).filter((_, idx) => idx !== i);
                              setEditingItem({ ...editingItem, travelTips: next });
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          travelTips: [...(editingItem.travelTips || []), "Carry a universal power adapter plug."],
                        })
                      }
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Travel Tip</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: FAQS */}
              {modalTab === "faqs" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        International Traveler FAQs ({editingItem.faqs?.length || 0})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Address common traveler questions regarding visas, currency, food, and flights.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, faqs: [...STANDARD_INTL_FAQS] })}
                        className="text-[11px] text-blue-700 hover:underline font-bold"
                      >
                        Load Standard FAQs
                      </button>
                    </div>
                  </div>

                  {editingItem.faqs && editingItem.faqs.length > 0 ? (
                    <div className="space-y-3">
                      {editingItem.faqs.map((faq, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <CustomEditableField
                              compact
                              value={faq.question}
                              onChange={(val) => handleUpdateFaq(idx, "question", val)}
                              placeholder="Question e.g. Do Indian passport holders get Visa on Arrival?"
                              className="flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <RichTextEditor
                            compact
                            label="Answer"
                            rows={2}
                            value={faq.answer || ""}
                            onChange={(val) => handleUpdateFaq(idx, "answer", val)}
                            placeholder="Clear, factual, and reassuring answer..."
                          />
                        </div>
                      ))}

                      {/* Add FAQ Button - Positioned at Bottom */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t-2 border-slate-200 mt-2">
                        <span className="text-xs text-slate-500 font-semibold">
                          Total {(editingItem.faqs?.length || 0)} FAQs configured
                        </span>
                        <button
                          type="button"
                          onClick={handleAddFaq}
                          className="px-5 py-2.5 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 self-end"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add FAQ {(editingItem.faqs?.length || 0) + 1}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-semibold">No FAQs yet.</p>
                      <button
                        type="button"
                        onClick={handleAddFaq}
                        className="mt-3 px-4 py-2 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f] inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add First FAQ</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between shrink-0">
                  <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
                    <span>Active Section:</span>
                    <span className="text-[#0F3A2E] bg-emerald-100/80 px-2.5 py-0.5 rounded-lg border border-emerald-200/80 capitalize font-bold">
                      {modalTab}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleSaveItem}
                      className="px-6 py-2 rounded-xl bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold transition flex items-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
                    >
                      {actionLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Save International Tour</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* International Tour Revision History Modal */}
      {showIntlHistoryModal && editingItem && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    International Tour Revision History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Current Version: <strong className="text-purple-700">v{editingItem.version || 1}</strong> • Roll back to any past snapshot
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleManualIntlSnapshot()}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Capture an instant snapshot of current edits"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Snapshot Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowIntlHistoryModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick banner */}
            <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-200/70 text-xs text-purple-900 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Auto-saves continuously into <strong>Draft</strong>. Every update creates a recoverable version checkpoint.</span>
              </div>
              <span className="text-[11px] font-black text-purple-700 bg-purple-200/60 px-2 py-0.5 rounded-full shrink-0">
                {editingItem.versionHistory?.length || 0} Snapshots
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(!editingItem.versionHistory || editingItem.versionHistory.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs space-y-3">
                  <History className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No previous revisions recorded yet.</p>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Data auto-saves continuously into Draft. Click below to capture an immediate snapshot now.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleManualIntlSnapshot("Initial International Tour Snapshot")}
                    className="px-4 py-2 rounded-xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-bold text-xs shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Create First Snapshot (v1)</span>
                  </button>
                </div>
              ) : (
                editingItem.versionHistory.map((snap, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200">
                          v{snap.version}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {snap.author || "Admin Agent"}
                        </span>
                        <span className="text-slate-300 text-xs">•</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(snap.timestamp).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {snap.note || "Snapshot captured during update"}
                      </p>
                      {snap.destinationSnapshot && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                          <span className="font-medium text-slate-700">{snap.destinationSnapshot.name}</span>
                          <span>•</span>
                          <span>{snap.destinationSnapshot.duration || `${(snap.destinationSnapshot.itinerary || []).length} Days`}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">
                            ₹{(snap.destinationSnapshot.price || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreIntlVersion(snap, snap.version)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore v{snap.version}</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIntlHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Recycle Bin Modal */}
      {showRecycleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">International Tours Recycle Bin</h3>
                  <p className="text-xs text-slate-500">
                    {recycledDestinations.length} deleted package{recycledDestinations.length === 1 ? "" : "s"} in recycle bin
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {recycledDestinations.length > 0 && (
                  <button
                    onClick={handleEmptyRecycleBin}
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Empty Recycle Bin</span>
                  </button>
                )}
                <button
                  onClick={() => setShowRecycleModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {recycledDestinations.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Trash2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">Recycle Bin is empty</p>
                  <p className="text-xs text-slate-400 mt-1">Deleted international packages will appear here and can be restored anytime.</p>
                </div>
              ) : (
                recycledDestinations.map((d) => (
                  <div
                    key={d.id || d.slug}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 truncate">{d.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                          International
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>{d.duration || "N/A"}</span>
                        <span>•</span>
                        <span>₹{(d.price || 0).toLocaleString("en-IN")}</span>
                        {d.deletedAt && (
                          <>
                            <span>•</span>
                            <span className="text-rose-500">Deleted {new Date(d.deletedAt).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleRestoreItem(d.id, d.slug)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs cursor-pointer disabled:opacity-50"
                        title="Restore package back to Drafts"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => handlePermanentDeleteItem(d.id, d.slug)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        title="Delete permanently from database"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Purge</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Restored packages are automatically placed in Draft mode.</span>
              <button
                onClick={() => setShowRecycleModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paste / Import Package JSON Modal */}
      {showPastePackageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold">
                  <Copy className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Paste / Import International Tour JSON
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paste raw JSON from another package or proposal to load it directly.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPastePackageModal(false);
                  setPastePackageInput("");
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Paste JSON Package Object
                </label>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const clipText = await navigator.clipboard.readText();
                      if (clipText) {
                        setPastePackageInput(clipText);
                        showToast("📋 Pasted from clipboard!");
                      }
                    } catch {
                      alert("Please use Ctrl+V / Cmd+V in the box below to paste.");
                    }
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste from Clipboard</span>
                </button>
              </div>
              <textarea
                rows={10}
                value={pastePackageInput}
                onChange={(e) => setPastePackageInput(e.target.value)}
                placeholder={'{\n  "name": "Bali Tropical Escape",\n  "slug": "bali-escape",\n  "category": "International",\n  "price": 39999,\n  "duration": "5 Nights / 6 Days",\n  "itinerary": [...]\n}'}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E] bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowPastePackageModal(false);
                  setPastePackageInput("");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(pastePackageInput);
                    if (!parsed || typeof parsed !== "object") throw new Error("Invalid object format");
                    const name = parsed.name || parsed.packageTitle || "Imported International Tour";
                    const slug = parsed.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setEditingItem({
                      ...parsed,
                      id: "",
                      name,
                      slug: `${slug}-imported-${Date.now().toString().slice(-4)}`,
                      category: "International",
                      status: "Draft",
                      highlights: parsed.highlights || [],
                      itinerary: Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0 ? parsed.itinerary : [],
                      inclusions: parsed.inclusions || [...STANDARD_INTL_INCLUSIONS],
                      exclusions: parsed.exclusions || [...STANDARD_INTL_EXCLUSIONS],
                      faqs: parsed.faqs || [...STANDARD_INTL_FAQS],
                      travelTips: parsed.travelTips || [...STANDARD_INTL_TIPS],
                      gallery: parsed.gallery || [],
                    });
                    setHighlightsInput((parsed.highlights || []).join(", "));
                    setShowPastePackageModal(false);
                    setPastePackageInput("");
                    setModalTab("basic");
                    setIsModalOpen(true);
                    showToast(`✨ Successfully imported "${name}"! Review details and click Save.`);
                  } catch (err: any) {
                    alert(`Failed to parse JSON: ${err.message}`);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F3A2E] hover:bg-[#154d3e] text-white flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Parse &amp; Load into Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
