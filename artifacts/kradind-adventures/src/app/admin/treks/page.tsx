"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Eye,
  AlertCircle,
  Mountain,
  Calendar,
  Star,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ListPlus,
  Image as ImageIcon,
  Tag,
  Clock,
  Layers,
  MapPin,
  DollarSign,
  Users,
  Copy,
  ArrowUp,
  ArrowDown,
  Wand2,
  Car,
  ArrowRightLeft,
  CheckSquare,
  Globe,
  Filter,
  FileDown,
  Sliders,
  Search,
  ChevronDown,
  ArrowUpDown,
  Hash,
} from "lucide-react";
import { TrekData, TrekBatch, TrekItineraryDay } from "@/lib/cms-store";
import { ImageUploader } from "@/components/admin/image-uploader";
import { SalesItineraryCustomizer } from "@/components/sales-itinerary-customizer";
import { ItineraryPdfModal } from "@/components/itinerary-pdf-modal";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

type DateFilterType = "all" | "today" | "7days" | "30days" | "this_month" | "custom";
type SortOptionType = "newest" | "updated" | "oldest" | "name_asc" | "name_desc" | "price_desc" | "price_asc";

function parseItemDate(
  item: { createdAt?: string; updatedAt?: string; id?: any },
  fallbackIdx = 0
): { createdDate: Date; updatedDate: Date } {
  let createdDate: Date | null = null;
  if (item.createdAt) {
    const d = new Date(item.createdAt);
    if (!isNaN(d.getTime())) createdDate = d;
  }
  if (!createdDate && typeof item.id === "number" && item.id > 1600000000000) {
    createdDate = new Date(item.id);
  }
  if (!createdDate && typeof item.id === "string") {
    const match = item.id.match(/\d{10,13}/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > 1600000000) {
        createdDate = new Date(num > 1000000000000 ? num : num * 1000);
      }
    }
  }
  if (!createdDate) {
    createdDate = new Date(Date.now() - (fallbackIdx + 2) * 86400000);
  }

  let updatedDate = item.updatedAt ? new Date(item.updatedAt) : createdDate;
  if (isNaN(updatedDate.getTime())) updatedDate = createdDate;

  return { createdDate, updatedDate };
}

function formatRelativeOrDate(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isRecentlyAdded(date: Date, days = 7): boolean {
  const diff = Date.now() - date.getTime();
  return diff >= 0 && diff <= days * 86400000;
}

function matchesDateFilter(
  createdDate: Date,
  filterType: DateFilterType,
  customStart: string,
  customEnd: string
): boolean {
  if (filterType === "all") return true;

  const now = new Date();
  const itemTime = createdDate.getTime();

  if (filterType === "today") {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return itemTime >= startOfToday;
  }

  if (filterType === "7days") {
    const sevenDaysAgo = Date.now() - 7 * 86400000;
    return itemTime >= sevenDaysAgo;
  }

  if (filterType === "30days") {
    const thirtyDaysAgo = Date.now() - 30 * 86400000;
    return itemTime >= thirtyDaysAgo;
  }

  if (filterType === "this_month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    return itemTime >= startOfMonth;
  }

  if (filterType === "custom") {
    let matchesStart = true;
    let matchesEnd = true;
    if (customStart) {
      const s = new Date(customStart + "T00:00:00").getTime();
      if (!isNaN(s)) matchesStart = itemTime >= s;
    }
    if (customEnd) {
      const e = new Date(customEnd + "T23:59:59").getTime();
      if (!isNaN(e)) matchesEnd = itemTime <= e;
    }
    return matchesStart && matchesEnd;
  }

  return true;
}

function getDateFilterLabel(filterType: DateFilterType, customStart: string, customEnd: string): string {
  switch (filterType) {
    case "today":
      return "Added Today";
    case "7days":
      return "Last 7 Days";
    case "30days":
      return "Last 30 Days";
    case "this_month":
      return "This Month";
    case "custom":
      if (customStart && customEnd) return `${customStart} to ${customEnd}`;
      if (customStart) return `From ${customStart}`;
      if (customEnd) return `Until ${customEnd}`;
      return "Custom Range";
    default:
      return "All Dates";
  }
}

function getSortLabel(sort: SortOptionType): string {
  switch (sort) {
    case "newest":
      return "Recently Added";
    case "updated":
      return "Recently Updated";
    case "oldest":
      return "Oldest First";
    case "name_asc":
      return "Name: A → Z";
    case "name_desc":
      return "Name: Z → A";
    case "price_desc":
      return "Price: High to Low";
    case "price_asc":
      return "Price: Low to High";
    default:
      return "Sort By";
  }
}

function isDomesticPackage(trek?: { category?: string; categories?: string[] } | null): boolean {
  if (!trek) return false;
  return (
    (trek.category || "").toLowerCase() === "domestic" ||
    (trek.categories || []).some((c) => c.toLowerCase() === "domestic")
  );
}

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/ies$/, "y").replace(/es$/, "").replace(/s$/, "");
}

function cleanWords(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        ![
          "treks",
          "trek",
          "tours",
          "tour",
          "packages",
          "package",
          "specials",
          "special",
          "escapes",
          "escape",
          "pradesh",
          "district",
        ].includes(w) && w.length >= 3
    )
    .map(normalizeWord);
}

function matchesCategoryOrTag(t: TrekData, tagOrCat: string): boolean {
  if (!tagOrCat || tagOrCat === "All") return true;
  const target = tagOrCat.toLowerCase().trim();
  const isDom = isDomesticPackage(t);

  if (target === "domestic" || target === "domestic tours" || target === "domestic packages") return isDom;
  if (target === "himalayan treks" || target === "treks") return !isDom;

  const allTokens = [
    t.category || "",
    ...(t.categories || []),
    t.location || "",
    t.region || "",
    t.badge || "",
  ]
    .map((s) => s.toLowerCase().trim())
    .filter(Boolean);

  // Exact match
  if (allTokens.some((tok) => tok === target)) return true;

  const targetWords = cleanWords(target);
  if (targetWords.length === 0) return false;

  return allTokens.some((tok) => {
    const tokWords = cleanWords(tok);
    return targetWords.some((tw) => tokWords.includes(tw));
  });
}

const DOMESTIC_REGIONS = [
  "Uttarakhand",
  "Himachal Pradesh",
  "Kashmir",
  "Ladakh",
  "Rajasthan",
  "Kerala",
  "Goa",
  "Northeast",
  "Sikkim",
  "Meghalaya",
  "Assam",
  "Maharashtra",
  "Western Ghats",
  "South India",
];

const TREK_COLLECTIONS = [
  "Himalayas",
  "Weekend Treks",
  "Monsoon Specials",
  "High Altitude Passes",
  "Kashmir Treks",
  "Uttarakhand",
  "Himachal Pradesh",
  "Family Friendly",
  "Winter Snow",
  "Summer Escapes",
  "Expeditions",
];

const POPULAR_CATEGORIES = [
  "Domestic",
  "Himalayas",
  "Weekend Treks",
  "Monsoon Specials",
  "High Altitude Passes",
  "Kashmir Treks",
  "Uttarakhand",
  "Himachal Pradesh",
  "Rajasthan",
  "Kerala",
  "Goa",
  "Family Friendly",
  "Winter Snow",
  "Summer Escapes",
  "Expeditions",
  "Weekend",
  "Summit",
  "Heritage",
  "Northeast",
  "Road Trip",
  "Adventure",
  "Wildlife",
  "Desert",
  "Beach",
  "Honeymoon",
];

function getDefaultItinerary(daysCount: number = 5): TrekItineraryDay[] {
  const templates: TrekItineraryDay[] = [
    {
      day: 1,
      title: "Arrival at Base Camp | Acclimatization & Orientation",
      description: "Arrival at base camp. Meet your certified expedition leaders, conduct health checks (pulse/oximeter), inspect gear, and take a gentle evening acclimatization walk.",
      altitude: "6,400 Ft",
      distance: "Drive / 3 km Walk",
      meal: "Welcome Tea & Dinner",
      stay: "Base Camp Guesthouse / Alpine Camp",
    },
    {
      day: 2,
      title: "Trailhead Trek to Forest Camp",
      description: "After a nutritious mountain breakfast, begin the trek through dense pine, birch, and rhododendron forests along the mountain stream. Arrive at the forest clearing campsite.",
      altitude: "9,200 Ft",
      distance: "6 km Trek (4–5 Hours)",
      meal: "Breakfast, Packed Lunch & Dinner",
      stay: "Wilderness Alpine Tents",
    },
    {
      day: 3,
      title: "Forest Camp to High Altitude Meadow Camp",
      description: "Ascend past the tree line into expansive alpine meadows with dramatic panoramic mountain vistas. Cross gentle glacial streams to reach high camp before evening.",
      altitude: "11,800 Ft",
      distance: "7 km Trek (5–6 Hours)",
      meal: "Breakfast, Hot Trail Lunch & Dinner",
      stay: "High Altitude Alpine Tents",
    },
    {
      day: 4,
      title: "Summit Day / High Pass Push & Descent to Lower Camp",
      description: "Pre-dawn push towards the summit ridge / mountain pass. Reach the summit for breathtaking 360° Himalayan views of prominent snow-clad peaks. Celebrate and begin careful descent.",
      altitude: "14,000 Ft Summit (Camp: 10,500 Ft)",
      distance: "9–10 km Trek (7–9 Hours)",
      meal: "Early Breakfast, Energy Trail Snacks & Celebration Dinner",
      stay: "Riverside Alpine Camp",
    },
    {
      day: 5,
      title: "Descent to Roadhead & Onward Journey / Departure",
      description: "Wake up to glorious sunrise views. Gentle final descent through alpine pastures back to the roadhead. Board shared vehicles for transfer to the nearest transit hub.",
      altitude: "6,000 Ft",
      distance: "5 km Trek + Vehicle Drive",
      meal: "Breakfast & Farewell Lunch",
      stay: "Departure / Return Journey",
    },
    {
      day: 6,
      title: "Buffer Day / Extended Exploration & Cultural Sightseeing",
      description: "Reserved weather buffer day or excursion to nearby high-altitude glacial lakes, local villages, or sacred mountain shrines before concluding the expedition.",
      altitude: "7,500 Ft",
      distance: "Local Sightseeing & Transfers",
      meal: "Breakfast & Dinner",
      stay: "Heritage Hotel / Homestay",
    },
    {
      day: 7,
      title: "Final Departure & Transits to Transit Hub",
      description: "Check out after breakfast with lifetime memories of the high Himalayas. Private/shared transfer to railway station or airport.",
      altitude: "2,200 Ft",
      distance: "Road Transfer",
      meal: "Breakfast",
      stay: "Onward Travel",
    },
  ];

  return templates.slice(0, Math.max(1, Math.min(daysCount, 7)));
}

export default function AdminTreksPage() {
  const [treks, setTreks] = useState<TrekData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [classificationFilter, setClassificationFilter] = useState<"All" | "Treks" | "Domestic">("All");
  const [selectedTrekIds, setSelectedTrekIds] = useState<(number | string)[]>([]);

  // Move Modal State
  const [moveModalTrek, setMoveModalTrek] = useState<TrekData | null>(null);
  const [targetMoveType, setTargetMoveType] = useState<"Domestic" | "Trek">("Domestic");
  const [targetMoveRegion, setTargetMoveRegion] = useState("Uttarakhand");
  const [targetMoveCollection, setTargetMoveCollection] = useState("Himalayas");
  const [transferToDestinationsCopy, setTransferToDestinationsCopy] = useState(false);

  // Sales Customizer & PDF States
  const [salesModalTrek, setSalesModalTrek] = useState<TrekData | null>(null);
  const [pdfModalTrek, setPdfModalTrek] = useState<TrekData | null>(null);

  // Quick Tag Modal & Dropdown States
  const [quickTagModalTrek, setQuickTagModalTrek] = useState<TrekData | null>(null);
  const [quickTagCategories, setQuickTagCategories] = useState<string[]>([]);
  const [quickTagInput, setQuickTagInput] = useState("");
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagDropdownSearch, setTagDropdownSearch] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState<TrekData | null>(null);
  const [modalTab, setModalTab] = useState<
    "basic" | "media" | "batches" | "categories" | "overview" | "itinerary" | "inclusions" | "faqs"
  >("basic");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [sortBy, setSortBy] = useState<SortOptionType>("newest");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Batch Generator & Batch management states
  const [showBatchGenerator, setShowBatchGenerator] = useState(false);
  const [genMonth, setGenMonth] = useState("October 2026");
  const [genTheme, setGenTheme] = useState("Vibrant Colours");
  const [genDurationDays, setGenDurationDays] = useState(6);
  const [genStartDay, setGenStartDay] = useState(3);
  const [genIntervalDays, setGenIntervalDays] = useState(2);
  const [genCount, setGenCount] = useState(8);
  const [genPrice, setGenPrice] = useState(9999);

  const handleGenerateBatches = () => {
    if (!editingTrek) return;
    const newBatches: TrekBatch[] = [...(editingTrek.batches || [])];

    const getDaySuffix = (d: number) => {
      if (d > 3 && d < 21) return `${d}th`;
      switch (d % 10) {
        case 1: return `${d}st`;
        case 2: return `${d}nd`;
        case 3: return `${d}rd`;
        default: return `${d}th`;
      }
    };

    const monthShort = genMonth.split(" ")[0].slice(0, 3);

    for (let i = 0; i < genCount; i++) {
      const startDayNum = genStartDay + i * genIntervalDays;
      const endDayNum = startDayNum + (genDurationDays - 1);

      const startFormatted = `${getDaySuffix(startDayNum)} ${monthShort}`;
      const endFormatted = `${getDaySuffix(endDayNum)} ${monthShort}`;

      let status: "AVBL" | "WL" | "FULL" | "LAST" = "AVBL";
      let waitlistCount: number | undefined = undefined;
      let slotsLeft = 14;
      let tag: string | undefined = undefined;

      if (i === 0 || i === 1) {
        status = "FULL";
        slotsLeft = 0;
      } else if (i === 2 || i === 3) {
        status = "FULL";
        slotsLeft = 0;
        tag = "Stargazing";
      } else if (i === 4) {
        status = "WL";
        waitlistCount = 4;
        slotsLeft = 0;
      } else if (i === 5) {
        status = "WL";
        waitlistCount = 5;
        slotsLeft = 0;
      } else if (i === 6) {
        status = "LAST";
        slotsLeft = 1;
      } else {
        status = "AVBL";
        slotsLeft = 12;
      }

      newBatches.push({
        id: Date.now() + i * 100,
        startDate: startFormatted,
        endDate: endFormatted,
        slotsLeft,
        price: genPrice || editingTrek.price || 8999,
        status,
        waitlistCount,
        experienceTag: tag,
        monthGroup: genMonth,
        seasonTheme: genTheme,
      });
    }

    setEditingTrek({ ...editingTrek, batches: newBatches });
    setShowBatchGenerator(false);
    showToast(`✨ Generated ${genCount} batches for ${genMonth}!`);
  };

  const dateFilterRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setIsDateFilterOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchTreks = async () => {
    try {
      const res = await fetch("/api/admin/treks", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setTreks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks();
  }, []);

  // Quick 1-Click Move Handler
  const handleQuickMoveTrek = async (trek: TrekData, targetType?: "Domestic" | "Trek") => {
    const isDomestic = isDomesticPackage(trek);
    const nextType = targetType || (isDomestic ? "Trek" : "Domestic");
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/treks/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: trek.id,
          targetType: nextType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to move package");
      }
      showToast(data.message || `Moved "${trek.name}" to ${nextType === "Domestic" ? "Domestic Tours" : "Himalayan Treks"}`);
      setTreks((prev) =>
        prev.map((t) => (String(t.id) === String(trek.id) ? data.trek : t))
      );
    } catch (err: any) {
      showToast(`❌ ${err.message || "Failed to move package"}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Interactive Move Modal
  const handleOpenMoveModal = (trek: TrekData) => {
    const isDomestic = isDomesticPackage(trek);
    setMoveModalTrek(trek);
    setTargetMoveType(isDomestic ? "Trek" : "Domestic");
    setTargetMoveRegion(trek.location.split(",")[0]?.trim() || "Uttarakhand");
    setTargetMoveCollection("Himalayas");
    setTransferToDestinationsCopy(false);
  };

  // Submit Detailed Move Modal
  const handleDetailedMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveModalTrek) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/treks/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: moveModalTrek.id,
          targetType: targetMoveType,
          targetRegion: targetMoveRegion,
          targetCollection: targetMoveCollection,
          transferToDestinations: transferToDestinationsCopy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to move package");
      }
      showToast(data.message || `Moved "${moveModalTrek.name}" successfully!`);
      setTreks((prev) =>
        prev.map((t) => (String(t.id) === String(moveModalTrek.id) ? data.trek : t))
      );
      setMoveModalTrek(null);
    } catch (err: any) {
      showToast(`❌ ${err.message || "Failed to move package"}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Bulk Move Handler
  const handleBulkMove = async (targetType: "Domestic" | "Trek") => {
    if (selectedTrekIds.length === 0) return;
    setActionLoading(true);
    try {
      let successCount = 0;
      for (const id of selectedTrekIds) {
        const res = await fetch("/api/admin/treks/move", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, targetType }),
        });
        if (res.ok) successCount++;
      }
      showToast(`Successfully moved ${successCount} packages to ${targetType === "Domestic" ? "Domestic Tours" : "Himalayan Treks"}!`);
      setSelectedTrekIds([]);
      await fetchTreks();
    } catch (err: any) {
      showToast(`❌ Bulk move error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Open Quick Tag Management Modal
  const handleOpenQuickTagModal = (trek: TrekData) => {
    setQuickTagModalTrek(trek);
    const existing = trek.categories && trek.categories.length > 0
      ? [...trek.categories]
      : trek.category
      ? [trek.category]
      : ["Himalayas"];
    setQuickTagCategories(Array.from(new Set(existing)));
    setQuickTagInput("");
  };

  // Save Quick Tags
  const handleSaveQuickTags = async () => {
    if (!quickTagModalTrek) return;
    setActionLoading(true);
    try {
      const updatedCategories = Array.from(new Set(quickTagCategories.filter(Boolean)));
      const updatedTrek: TrekData = {
        ...quickTagModalTrek,
        categories: updatedCategories,
      };

      const res = await fetch("/api/admin/treks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTrek),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update tags");
      }

      setTreks((prev) =>
        prev.map((t) => (String(t.id) === String(quickTagModalTrek.id) ? updatedTrek : t))
      );
      showToast(`🏷️ Updated tags for "${quickTagModalTrek.name}"`);
      setQuickTagModalTrek(null);
    } catch (err: any) {
      showToast(`❌ Failed to update tags: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Type in Add/Edit modal
  const handleSetEditingType = (type: "Trek" | "Domestic") => {
    if (!editingTrek) return;
    const currentCats = editingTrek.categories || [];
    if (type === "Domestic") {
      const cleaned = currentCats.filter(
        (c) =>
          !["Trek", "Summit", "High Pass", "Expedition", "Himalayas"].includes(c) &&
          c !== "Domestic" &&
          c !== "Holiday Package"
      );
      setEditingTrek({
        ...editingTrek,
        category: "Domestic",
        categories: ["Domestic", "Holiday Package", ...cleaned],
        badge: editingTrek.badge && editingTrek.badge !== "Featured" ? editingTrek.badge : "Domestic Holiday",
        difficulty:
          editingTrek.difficulty?.includes("Difficult") || editingTrek.difficulty?.includes("Challenging")
            ? "Leisure / Scenic"
            : editingTrek.difficulty || "Moderate",
      });
      showToast("🚗 Switched to Domestic Tour Package format");
    } else {
      const cleaned = currentCats.filter(
        (c) => !["Domestic", "Holiday Package", "Road Trip"].includes(c) && c !== "Trek" && c !== "Himalayas"
      );
      setEditingTrek({
        ...editingTrek,
        category: "Himalayas",
        categories: ["Himalayas", "Trek", ...cleaned],
        badge: editingTrek.badge && editingTrek.badge !== "Domestic Holiday" ? editingTrek.badge : "Featured",
        difficulty:
          editingTrek.difficulty?.includes("Leisure") || editingTrek.difficulty?.includes("Scenic")
            ? "Easy to Moderate"
            : editingTrek.difficulty || "Moderate",
      });
      showToast("🏔️ Switched to Himalayan Trek format");
    }
  };

  const handleOpenAdd = () => {
    setModalTab("basic");
    setEditingTrek({
      id: "",
      slug: "",
      name: "",
      category: "Himalayas",
      location: "Uttarakhand",
      region: "Garhwal",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
      imageAlt: "Himalayan trekking package by KRAD Global",
      gallery: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      ],
      tagline: "",
      overview: "",
      highlights: ["Experienced mountain guide", "All camp equipment & safety gear", "Nutritious mountain meals"],
      duration: "5 Days / 4 Nights",
      difficulty: "Moderate",
      altitude: "12,000 Ft",
      distance: "20 km",
      baseCamp: "Base Camp",
      rating: 4.9,
      reviewCount: 1,
      price: 8999,
      originalPrice: 10999,
      badge: "Featured",
      categories: ["Himalayas", "Trek"],
      status: "Published",
      batches: [
        { id: 1, startDate: "Jun 14", endDate: "Jun 18, 2026", slotsLeft: 12, price: 8999 },
        { id: 2, startDate: "Jun 21", endDate: "Jun 25, 2026", slotsLeft: 14, price: 8999 },
        { id: 3, startDate: "Jul 05", endDate: "Jul 09, 2026", slotsLeft: 10, price: 8999 },
      ],
      itinerary: getDefaultItinerary(5),
      inclusions: ["All meals during the trek", "Certified mountain guides", "Tents, sleeping bags, and mattress"],
      exclusions: ["Personal expenses & tips", "Travel insurance", "Transportation to base camp unless booked"],
      faqs: [
        { question: "What is the fitness level required?", answer: "Moderate fitness. 3-4 km jogging daily for 2 weeks prior is recommended." }
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trek: TrekData) => {
    setModalTab("basic");
    const isDomestic = isDomesticPackage(trek);
    setEditingTrek({
      ...trek,
      category: trek.category || (isDomestic ? "Domestic" : trek.categories?.[0] || "Himalayas"),
      gallery: trek.gallery && trek.gallery.length > 0 ? trek.gallery : [trek.image || ""].filter(Boolean),
      batches: trek.batches && trek.batches.length > 0 ? trek.batches : [
        { id: 1, startDate: "Upcoming Weekend", endDate: "Open Batch", slotsLeft: 12, price: trek.price || 8999 }
      ],
      categories: trek.categories || (isDomestic ? ["Domestic", "Holiday Package"] : ["Himalayas", "Trek"]),
      highlights: trek.highlights || [],
      itinerary: trek.itinerary && trek.itinerary.length > 0 ? trek.itinerary : getDefaultItinerary(5),
      inclusions: trek.inclusions || [],
      exclusions: trek.exclusions || [],
      faqs: trek.faqs || [],
    });
    setIsModalOpen(true);
  };

  const handleDuplicateTrek = (trek: TrekData) => {
    setModalTab("basic");
    const isDomestic = isDomesticPackage(trek);
    const copySlug = `${trek.slug}-copy-${Date.now().toString().slice(-4)}`;
    setEditingTrek({
      ...trek,
      id: "",
      name: `${trek.name} (Copy)`,
      slug: copySlug,
      category: trek.category || (isDomestic ? "Domestic" : trek.categories?.[0] || "Himalayas"),
      status: "Draft",
      gallery: trek.gallery && trek.gallery.length > 0 ? [...trek.gallery] : [trek.image || ""].filter(Boolean),
      batches:
        trek.batches && trek.batches.length > 0
          ? trek.batches.map((b, i) => ({ ...b, id: i + 1 }))
          : [{ id: 1, startDate: "Upcoming Weekend", endDate: "Open Batch", slotsLeft: 12, price: trek.price || 8999 }],
      categories: [...(trek.categories || (isDomestic ? ["Domestic", "Holiday Package"] : ["Himalayas", "Trek"]))],
      highlights: [...(trek.highlights || [])],
      itinerary:
        trek.itinerary && trek.itinerary.length > 0
          ? trek.itinerary.map((d, i) => ({ ...d, day: i + 1 }))
          : getDefaultItinerary(5),
      inclusions: [...(trek.inclusions || [])],
      exclusions: [...(trek.exclusions || [])],
      faqs: [...(trek.faqs || [])],
    });
    setIsModalOpen(true);
    showToast("📋 Trek duplicated! Review details and click Save Trek.");
  };

  const handleSaveTrek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrek) return;

    if (!editingTrek.name.trim() || !editingTrek.slug.trim()) {
      alert("Please provide both Trek Name and Slug.");
      return;
    }

    // Ensure image is set, or default to first gallery image
    let trekImage = editingTrek.image;
    if (!trekImage && editingTrek.gallery && editingTrek.gallery.length > 0) {
      trekImage = editingTrek.gallery[0];
    }

    // Re-index days 1..N
    const cleanItinerary = (editingTrek.itinerary || []).map((d, i) => ({
      ...d,
      day: i + 1,
    }));

    const payload = {
      ...editingTrek,
      image: trekImage,
      gallery: editingTrek.gallery || [trekImage].filter(Boolean),
      itinerary: cleanItinerary,
    };

    setActionLoading(true);
    const isNew = !editingTrek.id;
    const url = "/api/admin/treks";
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to save trek");
        setActionLoading(false);
        return;
      }

      showToast(isNew ? "Trek created successfully!" : "Trek updated successfully!");
      setIsModalOpen(false);
      setEditingTrek(null);
      fetchTreks();
    } catch {
      alert("Error saving trek");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/treks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Trek deleted successfully");
        setDeleteConfirmId(null);
        fetchTreks();
      } else {
        alert("Failed to delete trek");
      }
    } catch {
      alert("Error deleting trek");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (trek: TrekData) => {
    const newStatus = trek.status === "Published" ? "Draft" : "Published";
    try {
      const res = await fetch("/api/admin/treks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...trek, status: newStatus }),
      });
      if (res.ok) {
        showToast(`Status changed to ${newStatus}`);
        fetchTreks();
      }
    } catch {
      alert("Error updating status");
    }
  };

  // Duplicate an itinerary day
  const handleDuplicateDay = (index: number) => {
    if (!editingTrek || !editingTrek.itinerary) return;
    const days = [...editingTrek.itinerary];
    const sourceDay = days[index];
    const clonedDay: TrekItineraryDay = {
      ...sourceDay,
      day: index + 2,
      title: `${sourceDay.title} (Continuation)`,
    };
    days.splice(index + 1, 0, clonedDay);
    const renumbered = days.map((d, i) => ({ ...d, day: i + 1 }));
    setEditingTrek({ ...editingTrek, itinerary: renumbered });
    showToast(`Duplicated Day ${index + 1}`);
  };

  // Move day up or down
  const handleMoveDay = (from: number, to: number) => {
    if (!editingTrek || !editingTrek.itinerary) return;
    const days = [...editingTrek.itinerary];
    if (to < 0 || to >= days.length) return;
    const [moved] = days.splice(from, 1);
    days.splice(to, 0, moved);
    const renumbered = days.map((d, i) => ({ ...d, day: i + 1 }));
    setEditingTrek({ ...editingTrek, itinerary: renumbered });
  };

  // Apply quick preset itinerary
  const handleApplyPresetItinerary = (count: number) => {
    if (!editingTrek) return;
    if (
      editingTrek.itinerary &&
      editingTrek.itinerary.length > 0 &&
      !confirm(`Apply ${count}-day itinerary template? This will update your scheduled days list.`)
    ) {
      return;
    }
    const template = getDefaultItinerary(count);
    setEditingTrek({
      ...editingTrek,
      duration: `${count} Days / ${count - 1} Nights`,
      itinerary: template,
    });
    showToast(`Applied ${count}-Day Itinerary Template`);
  };

  const trekCount = treks.filter((t) => !isDomesticPackage(t)).length;
  const domesticCount = treks.filter((t) => isDomesticPackage(t)).length;

  // Dynamically extract all available tags across all packages
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    treks.forEach((t) => {
      if (t.category) tagSet.add(t.category);
      (t.categories || []).forEach((c) => {
        if (c && c.trim()) tagSet.add(c.trim());
      });
      if (t.badge && !["Published", "Draft"].includes(t.badge)) tagSet.add(t.badge);
    });

    POPULAR_CATEGORIES.forEach((c) => tagSet.add(c));

    const list = Array.from(tagSet);
    // Sort by matching package count (highest first), then alphabetical
    return list.sort((a, b) => {
      const countA = treks.filter((t) => matchesCategoryOrTag(t, a)).length;
      const countB = treks.filter((t) => matchesCategoryOrTag(t, b)).length;
      if (countB !== countA) return countB - countA;
      return a.localeCompare(b);
    });
  }, [treks]);

  // Recently added count (within 7 days)
  const recentlyAddedCount = useMemo(() => {
    return treks.filter((t) => {
      const { createdDate } = parseItemDate(t);
      return isRecentlyAdded(createdDate, 7);
    }).length;
  }, [treks]);

  const filtered = useMemo(() => {
    return treks
      .filter((t) => {
        const isDom = isDomesticPackage(t);

        const matchesClassification =
          classificationFilter === "All" ||
          (classificationFilter === "Domestic" && isDom) ||
          (classificationFilter === "Treks" && !isDom);

        const cleanSearch = search.trim().toLowerCase().replace(/^#/, "");
        const matchesSearch =
          !cleanSearch ||
          t.name.toLowerCase().includes(cleanSearch) ||
          t.location.toLowerCase().includes(cleanSearch) ||
          (t.region || "").toLowerCase().includes(cleanSearch) ||
          t.slug.toLowerCase().includes(cleanSearch) ||
          (t.category || "").toLowerCase().includes(cleanSearch) ||
          (t.badge || "").toLowerCase().includes(cleanSearch) ||
          (t.difficulty || "").toLowerCase().includes(cleanSearch) ||
          (t.tagline || "").toLowerCase().includes(cleanSearch) ||
          (t.categories || []).some((c) => c.toLowerCase().includes(cleanSearch)) ||
          (t.highlights || []).some((h) => h.toLowerCase().includes(cleanSearch));

        const matchesCategory = matchesCategoryOrTag(t, selectedCategory);

        const { createdDate } = parseItemDate(t);
        const matchesDate = matchesDateFilter(createdDate, dateFilter, customStartDate, customEndDate);

        return matchesClassification && matchesSearch && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        const aDates = parseItemDate(a);
        const bDates = parseItemDate(b);

        switch (sortBy) {
          case "newest":
            return bDates.createdDate.getTime() - aDates.createdDate.getTime();
          case "updated":
            return bDates.updatedDate.getTime() - aDates.updatedDate.getTime();
          case "oldest":
            return aDates.createdDate.getTime() - bDates.createdDate.getTime();
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "price_desc":
            return (b.price || 0) - (a.price || 0);
          case "price_asc":
            return (a.price || 0) - (b.price || 0);
          default:
            return 0;
        }
      });
  }, [treks, classificationFilter, search, selectedCategory, dateFilter, customStartDate, customEndDate, sortBy]);

  const allFilteredIds = filtered.map((t) => t.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedTrekIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTrekIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      setSelectedTrekIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])));
    }
  };

  const handleToggleSelectRow = (id: number | string) => {
    setSelectedTrekIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F3A2E] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-fade-in border border-emerald-500/40">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Print-Only Treks & Tours Catalog Header */}
      <div className="hidden print:flex items-center justify-between pb-4 mb-4 border-b-2 border-[#0F3A2E]">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="KRADIND Adventures"
            className="h-10 w-auto object-contain"
          />
          <div>
            <h1 className="text-base font-extrabold text-[#0F3A2E]">
              Treks &amp; Domestic Tour Packages Catalog
            </h1>
            <p className="text-[10px] text-slate-500">
              Official KRAD Global Travels &amp; KRADIND Adventures Portfolio
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <span className="font-bold text-slate-900 block">
            Total Packages: {filtered.length}
          </span>
          <span className="text-[10px] text-slate-500 block">
            Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            www.kradind.com • +91 7500222141
          </span>
        </div>
      </div>

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Treks & Domestic Packages CMS
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage Himalayan expeditions, domestic tour packages, multi-day itineraries, departure batches, and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
            title="Export clean, lightweight PDF catalog of treks and tour packages"
          >
            <FileDown className="w-4 h-4 text-emerald-700" />
            <span>Export Clean PDF</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add New Package / Trek</span>
          </button>
        </div>
      </div>

      {/* Primary Classification Filter Bar (Treks vs Domestic Packages) */}
      <div className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setClassificationFilter("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              classificationFilter === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>All Packages</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${classificationFilter === "All" ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-700"}`}>
              {treks.length}
            </span>
          </button>

          <button
            onClick={() => setClassificationFilter("Treks")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              classificationFilter === "Treks"
                ? "bg-[#0F3A2E] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span>🏔️ Himalayan Treks</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${classificationFilter === "Treks" ? "bg-emerald-950 text-emerald-300" : "bg-emerald-100 text-emerald-800"}`}>
              {trekCount}
            </span>
          </button>

          <button
            onClick={() => setClassificationFilter("Domestic")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              classificationFilter === "Domestic"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-200" />
            <span>🚗 Domestic Packages</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${classificationFilter === "Domestic" ? "bg-amber-800 text-amber-200" : "bg-amber-100 text-amber-800"}`}>
              {domesticCount}
            </span>
          </button>
        </div>

        <div className="text-[11px] font-medium text-slate-400 hidden sm:block">
          Use the <span className="font-semibold text-slate-600">⇄ Move</span> buttons to switch any package between Trek and Domestic format.
        </div>
      </div>

      {/* Bulk Action Toolbar when items are selected */}
      {selectedTrekIds.length > 0 && (
        <div className="bg-[#0F3A2E] text-white px-4 py-3 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 animate-fade-in border border-emerald-500/30">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>{selectedTrekIds.length} packages selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkMove("Domestic")}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Move Selected to Domestic</span>
            </button>

            <button
              onClick={() => handleBulkMove("Trek")}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Move Selected to Treks</span>
            </button>

            <button
              onClick={() => setSelectedTrekIds([])}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold transition"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Granular Tag & Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Category & Tags:</span>
        </span>

        {/* All Filter Pill */}
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
            selectedCategory === "All"
              ? "bg-[#0F3A2E] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>All</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-md ${
              selectedCategory === "All" ? "bg-emerald-950 text-emerald-300" : "bg-slate-200 text-slate-700"
            }`}
          >
            {treks.length}
          </span>
        </button>

        {/* Dynamic & Popular Tags */}
        {availableTags.slice(0, 16).map((cat) => {
          const count = treks.filter((t) => matchesCategoryOrTag(t, cat)).length;
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isSelected ? "All" : cat)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? "bg-[#0F3A2E] text-white shadow-xs"
                  : count > 0
                  ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-slate-50/80"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50 opacity-60"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected
                    ? "bg-emerald-950 text-emerald-300"
                    : count > 0
                    ? "bg-slate-200 text-slate-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {count}
              </span>
              {isSelected && <X className="w-3 h-3 ml-0.5 text-emerald-300" />}
            </button>
          );
        })}

        {/* More Tags Dropdown */}
        {availableTags.length > 16 && (
          <div className="relative">
            <button
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50 border border-emerald-200/80 transition flex items-center gap-1 shrink-0"
            >
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>More Tags ({availableTags.length - 16}+)</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {isTagDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 w-72 max-h-80 overflow-y-auto space-y-2 animate-fade-in">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Select Tag to Filter
                </div>
                <input
                  type="text"
                  value={tagDropdownSearch}
                  onChange={(e) => setTagDropdownSearch(e.target.value)}
                  placeholder="Search tags..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-emerald-500"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableTags
                    .filter((tag) =>
                      tag.toLowerCase().includes(tagDropdownSearch.toLowerCase())
                    )
                    .map((tag) => {
                      const count = treks.filter((t) => matchesCategoryOrTag(t, tag)).length;
                      const isSelected = selectedCategory.toLowerCase() === tag.toLowerCase();
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedCategory(isSelected ? "All" : tag);
                            setIsTagDropdownOpen(false);
                          }}
                          className={`text-xs px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                            isSelected
                              ? "bg-[#0F3A2E] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                          }`}
                        >
                          <span>#{tag}</span>
                          <span className="text-[10px] opacity-70">({count})</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search & Tag Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2.5 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            
            {/* Active Tag Filter Chip inside Search */}
            {selectedCategory !== "All" && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold shrink-0">
                <Tag className="w-3 h-3 text-emerald-600" />
                <span>#{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-emerald-700 hover:text-rose-600 transition"
                  title="Clear tag filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                selectedCategory !== "All"
                  ? `Search within #${selectedCategory} (name, region, slug)...`
                  : "Search package by name, destination region, #tag, or slug..."
              }
              className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Result count */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
              Showing {filtered.length} of {treks.length}
            </span>
          </div>
        </div>

        {/* Date Filter & Sort Controls Row */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick 1-Click "Recently Added" Filter Toggle */}
            <button
              onClick={() => {
                if (dateFilter === "7days" && sortBy === "newest") {
                  setDateFilter("all");
                } else {
                  setDateFilter("7days");
                  setSortBy("newest");
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                dateFilter === "7days" && sortBy === "newest"
                  ? "bg-[#0F3A2E] text-white border-emerald-500/40 shadow-xs"
                  : "bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border-emerald-200/80"
              }`}
              title="Quick Filter: Show packages added in the last 7 days"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>🕒 Recently Added</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                  dateFilter === "7days" && sortBy === "newest"
                    ? "bg-emerald-950 text-emerald-300"
                    : "bg-emerald-200/80 text-emerald-900"
                }`}
              >
                {recentlyAddedCount}
              </span>
            </button>

            {/* Date-Wise Filter Dropdown */}
            <div className="relative" ref={dateFilterRef}>
              <button
                onClick={() => {
                  setIsDateFilterOpen(!isDateFilterOpen);
                  setIsSortDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                  dateFilter !== "all"
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                }`}
                title="Filter packages by creation date"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {getDateFilterLabel(dateFilter, customStartDate, customEndDate)}</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {/* Date Filter Popover */}
              {isDateFilterOpen && (
                <div className="absolute top-full left-0 mt-2 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 w-72 space-y-3 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Filter by Date Added</span>
                    {dateFilter !== "all" && (
                      <button
                        onClick={() => {
                          setDateFilter("all");
                          setCustomStartDate("");
                          setCustomEndDate("");
                          setIsDateFilterOpen(false);
                        }}
                        className="text-rose-600 hover:underline capitalize font-semibold"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {[
                      { key: "all", label: "🌟 All Time" },
                      { key: "today", label: "⚡ Added Today (Last 24h)" },
                      { key: "7days", label: "🕒 Last 7 Days (Recent)" },
                      { key: "30days", label: "🗓️ Last 30 Days" },
                      { key: "this_month", label: "📆 This Month" },
                      { key: "custom", label: "🛠️ Custom Date Range" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setDateFilter(opt.key as DateFilterType);
                          if (opt.key !== "custom") {
                            setIsDateFilterOpen(false);
                          }
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                          dateFilter === opt.key
                            ? "bg-[#0F3A2E] text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {dateFilter === opt.key && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>

                  {/* Custom Date Inputs if "custom" selected */}
                  {dateFilter === "custom" && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">From Date</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0F3A2E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 block">To Date</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 outline-none focus:border-[#0F3A2E]"
                        />
                      </div>
                      <button
                        onClick={() => setIsDateFilterOpen(false)}
                        className="w-full mt-1 py-1.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#154d3d] transition text-center"
                      >
                        Apply Date Range
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => {
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                  setIsDateFilterOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
                title="Sort packages"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Sort: {getSortLabel(sortBy)}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
              </button>

              {isSortDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 z-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 w-56 space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Sort Packages By
                  </div>
                  {[
                    { key: "newest", label: "🕒 Recently Added (Newest)" },
                    { key: "updated", label: "🔄 Recently Updated" },
                    { key: "oldest", label: "⏳ Oldest First" },
                    { key: "name_asc", label: "🔤 Name (A → Z)" },
                    { key: "name_desc", label: "🔤 Name (Z → A)" },
                    { key: "price_desc", label: "💰 Price (High to Low)" },
                    { key: "price_asc", label: "🏷️ Price (Low to High)" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => {
                        setSortBy(s.key as SortOptionType);
                        setIsSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                        sortBy === s.key
                          ? "bg-[#0F3A2E] text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{s.label}</span>
                      {sortBy === s.key && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reset button if any filter or sort is applied */}
          {(search || selectedCategory !== "All" || dateFilter !== "all" || sortBy !== "newest") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setDateFilter("all");
                setCustomStartDate("");
                setCustomEndDate("");
                setSortBy("newest");
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 transition flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Treks Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-3.5 py-3.5 w-10 text-center print:hidden">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded text-[#0F3A2E] focus:ring-[#0F3A2E] w-3.5 h-3.5 cursor-pointer"
                    title="Select / Deselect all visible packages"
                  />
                </th>
                <th className="px-5 py-3.5">Package Details & Type</th>
                <th className="px-5 py-3.5">Region</th>
                <th className="px-5 py-3.5">Altitude / Style</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right print:hidden">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t, idx) => {
                const isDom = isDomesticPackage(t);
                const isSelected = selectedTrekIds.includes(t.id);
                const { createdDate, updatedDate } = parseItemDate(t, idx);
                const isRecent = isRecentlyAdded(createdDate, 7);

                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-slate-50/70 transition break-inside-avoid page-break-inside-avoid print-card-item ${
                      isSelected ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <td className="px-3.5 py-3.5 text-center print:hidden">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(t.id)}
                        className="rounded text-[#0F3A2E] focus:ring-[#0F3A2E] w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3.5">
                        {/* Trek Photo Thumbnail */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-2xs group">
                          <img
                            src={t.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"}
                            alt={t.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          {t.gallery && t.gallery.length > 1 && (
                            <div className="absolute bottom-0 right-0 bg-black/75 backdrop-blur text-white text-[9px] font-bold px-1 rounded-tl">
                              +{t.gallery.length}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 text-sm flex flex-wrap items-center gap-2">
                            <span>{t.name}</span>
                            {isRecent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black flex items-center gap-1 shrink-0 border border-amber-300/30">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>NEW</span>
                              </span>
                            )}
                            {/* Classification Badge */}
                            {isDom ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 flex items-center gap-1 shrink-0">
                                <Car className="w-3 h-3 text-amber-600" />
                                <span>Domestic Tour</span>
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1 shrink-0">
                                <Mountain className="w-3 h-3 text-emerald-600" />
                                <span>Himalayan Trek</span>
                              </span>
                            )}
                            {t.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                                {t.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="font-mono">/{t.slug}</span>
                            <span>•</span>
                            <span>{t.duration}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">
                              {t.itinerary?.length || 0} Days Itinerary
                            </span>
                            <span>•</span>
                            <span className="text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-emerald-600" />
                              <span>Added {formatRelativeOrDate(createdDate)}</span>
                            </span>
                          </div>

                          {/* Interactive Tags Row */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                              <Tag className="w-3 h-3 text-slate-400" />
                              <span>Tags:</span>
                            </span>
                            {((t.categories && t.categories.length > 0 ? t.categories : [t.category]).filter(Boolean) as string[]).map((cat) => {
                              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                              return (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCategory(isSelected ? "All" : cat);
                                  }}
                                  title={isSelected ? `Clear filter for #${cat}` : `Filter list by #${cat}`}
                                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                                    isSelected
                                      ? "bg-[#0F3A2E] text-white shadow-2xs"
                                      : "bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/70 hover:border-emerald-300"
                                  }`}
                                >
                                  <span>#{cat}</span>
                                  {isSelected && <X className="w-2.5 h-2.5 ml-0.5" />}
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenQuickTagModal(t);
                              }}
                              title="Add or edit tags for this package"
                              className="text-[10px] px-1.5 py-0.5 rounded-md text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-bold transition flex items-center gap-0.5 cursor-pointer"
                            >
                              <Plus className="w-2.5 h-2.5" />
                              <span>Tag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 font-medium">{t.location}</td>
                    <td className="px-5 py-3.5 text-slate-600">{t.altitude}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">₹{t.price.toLocaleString("en-IN")}</div>
                      {t.originalPrice > t.price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{t.originalPrice.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(t)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                          t.status === "Published"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {t.status === "Published" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{t.status}</span>
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1 whitespace-nowrap print:hidden">
                      {/* One-Click Move Action Button */}
                      {isDom ? (
                        <button
                          onClick={() => handleQuickMoveTrek(t, "Trek")}
                          disabled={actionLoading}
                          className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition"
                          title="Quick Move: Convert to Himalayan Trek"
                        >
                          <Mountain className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickMoveTrek(t, "Domestic")}
                          disabled={actionLoading}
                          className="p-1.5 text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition"
                          title="Quick Move: Convert to Domestic Tour Package"
                        >
                          <Car className="w-4 h-4" />
                        </button>
                      )}

                      {/* Detailed Move with Options Modal */}
                      <button
                        onClick={() => handleOpenMoveModal(t)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition"
                        title="Move / Convert with options & region..."
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>

                      <a
                        href={`/treks/${t.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="View live page"
                      >
                        <Eye className="w-4 h-4" />
                      </a>

                      {/* Sales Seasonal Customizer & WhatsApp Quote */}
                      <button
                        onClick={() => setSalesModalTrek(t)}
                        className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                        title="Sales Seasonal Customizer & WhatsApp Quote"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>

                      {/* Client Itinerary PDF with Watermark & Logo */}
                      <button
                        onClick={() => setPdfModalTrek(t)}
                        className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition"
                        title="Download Branded Client PDF (With Logo & Watermark)"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDuplicateTrek(t)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                        title="Duplicate / Clone this trek"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        title="Edit Trek"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(t.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Trek"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-xs">
                    {loading ? "Loading treks catalog..." : "No treks or packages match your filter."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingTrek && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 my-auto">
            
            {/* Modal Header */}
            <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingTrek.id ? `Edit: ${editingTrek.name || "Trek"}` : "Create New Trek"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage photos, departure batches, multi-day itineraries, overview, and FAQs.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-5 pt-3 pb-2 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0 bg-white">
              <button
                type="button"
                onClick={() => setModalTab("basic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "basic"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>Basic & Pricing</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("media")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "media"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Photos & Gallery ({(editingTrek.gallery?.length || 0) + (editingTrek.image ? 1 : 0)})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("itinerary")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "itinerary"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                <span>Itinerary ({editingTrek.itinerary?.length || 0} Days)</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("batches")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "batches"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Batches ({editingTrek.batches?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("categories")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "categories"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Categories ({editingTrek.categories?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("overview")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "overview"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Overview & Highlights</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("inclusions")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "inclusions"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Inclusions</span>
              </button>

              <button
                type="button"
                onClick={() => setModalTab("faqs")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  modalTab === "faqs"
                    ? "bg-[#0F3A2E] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>FAQs ({editingTrek.faqs?.length || 0})</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveTrek} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* TAB 1: BASIC & PRICING */}
                {modalTab === "basic" && (
                  <div className="space-y-4">
                    {/* Package Classification Toggle */}
                    {(() => {
                      const isEditingDomestic = isDomesticPackage(editingTrek);
                      return (
                        <div className="p-3.5 bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">Package Classification:</span>
                              <span
                                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                  isEditingDomestic
                                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                                    : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                }`}
                              >
                                {isEditingDomestic ? "🚗 Domestic Tour Package" : "🏔️ Himalayan / Mountain Trek"}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {isEditingDomestic
                                ? "Published under /domestic-trips and domestic holiday circuits."
                                : "Published under /treks and mountain expedition collections."}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSetEditingType("Trek")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                !isEditingDomestic
                                  ? "bg-[#0F3A2E] text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                              }`}
                            >
                              <Mountain className="w-3.5 h-3.5" />
                              <span>🏔️ Himalayan Trek</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSetEditingType("Domestic")}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                                isEditingDomestic
                                  ? "bg-amber-600 text-white shadow-2xs"
                                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                              }`}
                            >
                              <Car className="w-3.5 h-3.5" />
                              <span>🚗 Domestic Tour</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {isDomesticPackage(editingTrek) ? "Tour Package Name *" : "Trek Name *"}
                        </label>
                        <input
                          type="text"
                          required
                          value={editingTrek.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                            setEditingTrek({
                              ...editingTrek,
                              name,
                              slug: editingTrek.id ? editingTrek.slug : slug,
                            });
                          }}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                          placeholder="Hampta Pass Crossover Trek"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Slug (URL identifier) *</label>
                        <input
                          type="text"
                          required
                          value={editingTrek.slug}
                          onChange={(e) => setEditingTrek({ ...editingTrek, slug: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                          placeholder="hampta-pass"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Location (Start to End)</label>
                        <input
                          type="text"
                          value={editingTrek.location}
                          onChange={(e) => setEditingTrek({ ...editingTrek, location: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Manali to Lahaul, Himachal Pradesh"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Region / Mountain Range</label>
                        <input
                          type="text"
                          value={editingTrek.region}
                          onChange={(e) => setEditingTrek({ ...editingTrek, region: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Pir Panjal & Zanskar"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Max Altitude</label>
                        <input
                          type="text"
                          value={editingTrek.altitude}
                          onChange={(e) => setEditingTrek({ ...editingTrek, altitude: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="14,000 Ft"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={editingTrek.duration}
                          onChange={(e) => setEditingTrek({ ...editingTrek, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="5 Days / 4 Nights"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Trek Distance</label>
                        <input
                          type="text"
                          value={editingTrek.distance || ""}
                          onChange={(e) => setEditingTrek({ ...editingTrek, distance: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="26 km"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Base Camp</label>
                        <input
                          type="text"
                          value={editingTrek.baseCamp || ""}
                          onChange={(e) => setEditingTrek({ ...editingTrek, baseCamp: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Jobra / Sankri"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty / Grade</label>
                        <select
                          value={editingTrek.difficulty}
                          onChange={(e) => setEditingTrek({ ...editingTrek, difficulty: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                        >
                          <option value="Easy">Easy (Beginner Friendly)</option>
                          <option value="Easy to Moderate">Easy to Moderate</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Moderate to Difficult">Moderate to Difficult</option>
                          <option value="Challenging">Challenging / Strenuous</option>
                          <option value="Difficult">Difficult (High Altitude Pass)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Tag</label>
                        <input
                          type="text"
                          value={editingTrek.badge}
                          onChange={(e) => setEditingTrek({ ...editingTrek, badge: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                          placeholder="Featured / High Pass Epic"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Offering Price (₹)</label>
                        <input
                          type="number"
                          value={editingTrek.price}
                          onChange={(e) => setEditingTrek({ ...editingTrek, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-emerald-700"
                          placeholder="9999"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                        <input
                          type="number"
                          value={editingTrek.originalPrice}
                          onChange={(e) => setEditingTrek({ ...editingTrek, originalPrice: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500"
                          placeholder="12999"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Rating (out of 5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={editingTrek.rating || 4.9}
                          onChange={(e) => setEditingTrek({ ...editingTrek, rating: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Review Count</label>
                        <input
                          type="number"
                          min="0"
                          value={editingTrek.reviewCount || 1}
                          onChange={(e) => setEditingTrek({ ...editingTrek, reviewCount: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Publish Status</label>
                        <select
                          value={editingTrek.status}
                          onChange={(e) =>
                            setEditingTrek({
                              ...editingTrek,
                              status: e.target.value as "Published" | "Draft",
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white"
                        >
                          <option value="Published">Published (Live on site)</option>
                          <option value="Draft">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    <RichTextEditor
                      compact
                      label="Tagline / Short Summary"
                      value={editingTrek.tagline || ""}
                      onChange={(val) => setEditingTrek({ ...editingTrek, tagline: val })}
                      rows={2}
                      placeholder="Cross from the lush green pine valleys of Kullu into the dramatic, barren moonscape of Spiti."
                      helperText="Supports formatting (Bold, Italic, Sizing, Colors, Badge) for hero card & header."
                    />
                  </div>
                )}

                {/* TAB 2: PHOTOS & MEDIA */}
                {modalTab === "media" && (
                  <div className="space-y-6">
                    {/* Primary Hero Cover Photo */}
                    <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>Primary Cover Photo</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Main featured hero banner photo shown on public search cards and trek headers. Upload a file or paste any image URL.
                          </p>
                        </div>
                      </div>

                      <ImageUploader
                        mode="single"
                        value={editingTrek.image}
                        onChange={(url) => setEditingTrek({ ...editingTrek, image: url })}
                        alt={editingTrek.imageAlt || ""}
                        onAltChange={(alt) => setEditingTrek({ ...editingTrek, imageAlt: alt })}
                        altPlaceholder="e.g. Himalayan trekking package by KRAD Global"
                        aspect="landscape"
                      />
                    </div>

                    {/* Expedition Photo Gallery */}
                    <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                      <ImageUploader
                        mode="gallery"
                        images={editingTrek.gallery || []}
                        onChange={(imgs) => setEditingTrek({ ...editingTrek, gallery: imgs })}
                        primaryImage={editingTrek.image}
                        onSetPrimary={(url) => setEditingTrek({ ...editingTrek, image: url })}
                        label="Expedition Photo Gallery"
                        description="Upload multiple pictures from your computer or paste image links. Click star to make any photo the main cover."
                      />
                    </div>
                  </div>
                )}

                {/* TAB 3: ITINERARY (DAY-BY-DAY) */}
                {modalTab === "itinerary" && (
                  <div className="space-y-4">
                    {/* Top Toolbar: Presets & Day Counter */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#0F3A2E]" />
                            <span>Scheduled Itinerary:</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                              {editingTrek.itinerary?.length || 0} Days
                            </span>
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Full day-by-day route, distance, elevations, meals, and overnight camps.
                          </p>
                        </div>

                        {/* Add Day Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const days = [...(editingTrek.itinerary || [])];
                            const nextDayNum = days.length + 1;
                            days.push({
                              day: nextDayNum,
                              title: `Day ${nextDayNum}: Scenic Trail & Mountain Camp`,
                              description: "Ascend along the alpine trail with scenic panoramic views. Arrive at campsite for warm dinner and overnight stay.",
                              distance: "5 km",
                              altitude: "10,500 Ft",
                              meal: "Breakfast, Lunch & Dinner",
                              stay: "Alpine Tents",
                            });
                            setEditingTrek({ ...editingTrek, itinerary: days });
                            showToast(`Added Day ${nextDayNum}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-xl hover:bg-[#164e3f] transition shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Next Day</span>
                        </button>
                      </div>

                      {/* Quick Multi-Day Templates */}
                      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Wand2 className="w-3 h-3 text-amber-500" />
                          <span>Quick Templates:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetItinerary(3)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition"
                        >
                          + 3-Day Weekend Plan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetItinerary(5)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition"
                        >
                          + 5-Day Himalayan Plan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetItinerary(6)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition"
                        >
                          + 6-Day Circuit Plan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetItinerary(7)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-100 transition"
                        >
                          + 7-Day Expedition Plan
                        </button>
                      </div>
                    </div>

                    {/* Day-by-Day Cards */}
                    <div className="space-y-4">
                      {(editingTrek.itinerary || []).map((day, idx) => (
                        <div key={idx} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                          {/* Day Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                              <div className="w-10 h-10 rounded-full bg-[#0F3A2E] text-white flex flex-col items-center justify-center font-sans shrink-0 border border-white ring-2 ring-[#0F3A2E]/20 shadow-xs select-none">
                                <span className="text-[8px] font-bold uppercase leading-none">Day</span>
                                <span className="text-xs font-black leading-none mt-0.5">{day.day}</span>
                              </div>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], title: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="flex-1 font-bold text-xs sm:text-sm px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3A2E]"
                                placeholder={`Day ${day.day} Route / Title`}
                              />
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
                                disabled={idx === (editingTrek.itinerary?.length || 0) - 1}
                                onClick={() => handleMoveDay(idx, idx + 1)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition"
                                title="Move Day Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const days = (editingTrek.itinerary || [])
                                    .filter((_, i) => i !== idx)
                                    .map((d, i) => ({ ...d, day: i + 1 }));
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                                title="Delete this day"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Day Description */}
                          <RichTextEditor
                            compact
                            label="Day Narrative & Activities"
                            value={day.description || ""}
                            onChange={(val) => {
                              const days = [...(editingTrek.itinerary || [])];
                              days[idx] = { ...days[idx], description: val };
                              setEditingTrek({ ...editingTrek, itinerary: days });
                            }}
                            rows={3}
                            placeholder="Describe the trail terrain, river crossings, views, and resting points..."
                          />

                          {/* 4 Metrics: Distance, Altitude, Meals, Stay */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Trek Distance</label>
                              <input
                                type="text"
                                value={day.distance || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], distance: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                placeholder="6 km Trek"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Max Altitude</label>
                              <input
                                type="text"
                                value={day.altitude || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], altitude: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                placeholder="11,800 Ft"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Meals Included</label>
                              <input
                                type="text"
                                value={day.meal || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], meal: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                placeholder="Breakfast, Lunch, Dinner"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Overnight Stay</label>
                              <input
                                type="text"
                                value={day.stay || ""}
                                onChange={(e) => {
                                  const days = [...(editingTrek.itinerary || [])];
                                  days[idx] = { ...days[idx], stay: e.target.value };
                                  setEditingTrek({ ...editingTrek, itinerary: days });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                                placeholder="Alpine Tents / Homestay"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!editingTrek.itinerary || editingTrek.itinerary.length === 0) && (
                        <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                          <Clock className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                          <p className="text-xs text-slate-500 font-semibold">No itinerary days scheduled yet.</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Click "+ 5-Day Himalayan Plan" or "Add Next Day" above to populate the day-by-day plan.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: BATCHES & DEPARTURES - FULL FEATURED */}
                {modalTab === "batches" && (
                  <div className="space-y-4">
                    {/* Header with Generator & Quick Tools */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {editingTrek.batches?.length || 0} Scheduled Departure Batches
                          </span>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Indiahikes &amp; Live Availability
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Set status (AVBL, WL, LAST, FULL), Stargazing tags, month groupings, and custom pricing.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Quick Generator Trigger */}
                        <button
                          type="button"
                          onClick={() => setShowBatchGenerator(!showBatchGenerator)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-lg transition shadow-xs cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{showBatchGenerator ? "Close Generator" : "⚡ Bulk Generator"}</span>
                        </button>

                        {/* Mark All AVBL */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingTrek.batches || []).map((b) => ({
                              ...b,
                              status: "AVBL",
                              slotsLeft: b.slotsLeft > 0 ? b.slotsLeft : 14,
                            }));
                            setEditingTrek({ ...editingTrek, batches: updated });
                            showToast("All batches set to AVBL!");
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                          title="Quickly set all batches to Available status"
                        >
                          <span>Mark All AVBL</span>
                        </button>

                        {/* Add Single Batch */}
                        <button
                          type="button"
                          onClick={() => {
                            const batches = [...(editingTrek.batches || [])];
                            batches.push({
                              id: Date.now(),
                              startDate: "23rd Oct",
                              endDate: "28th Oct",
                              slotsLeft: 14,
                              price: editingTrek.price || 8999,
                              status: "AVBL",
                              monthGroup: "October 2026",
                              seasonTheme: "Vibrant Colours",
                            });
                            setEditingTrek({ ...editingTrek, batches });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-lg hover:bg-[#164e3f] transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Batch
                        </button>
                      </div>
                    </div>

                    {/* Bulk Batch Generator Drawer */}
                    {showBatchGenerator && (
                      <div className="p-4 bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200/90 rounded-2xl space-y-3 animate-fade-in shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-700" />
                            <span className="text-xs font-extrabold text-amber-900">
                              Automated Month Batch Generator
                            </span>
                          </div>
                          <span className="text-[11px] text-amber-700">
                            Quickly generates seasonal batch calendar
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Month &amp; Year</label>
                            <input
                              type="text"
                              value={genMonth}
                              onChange={(e) => setGenMonth(e.target.value)}
                              placeholder="October 2026"
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Seasonal Theme</label>
                            <input
                              type="text"
                              value={genTheme}
                              onChange={(e) => setGenTheme(e.target.value)}
                              placeholder="Vibrant Colours"
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Trek Duration (Days)</label>
                            <input
                              type="number"
                              min="2"
                              max="15"
                              value={genDurationDays}
                              onChange={(e) => setGenDurationDays(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Start Day of Month</label>
                            <input
                              type="number"
                              min="1"
                              max="28"
                              value={genStartDay}
                              onChange={(e) => setGenStartDay(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Interval (Days)</label>
                            <input
                              type="number"
                              min="1"
                              max="7"
                              value={genIntervalDays}
                              onChange={(e) => setGenIntervalDays(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Number of Batches</label>
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={genCount}
                              onChange={(e) => setGenCount(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs font-bold text-emerald-800"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-1">Batch Price (₹)</label>
                            <input
                              type="number"
                              value={genPrice}
                              onChange={(e) => setGenPrice(Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 border border-amber-200 bg-white rounded-lg text-xs font-bold text-emerald-800"
                            />
                          </div>

                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={handleGenerateBatches}
                              className="w-full py-1.5 bg-[#0F3A2E] hover:bg-[#164e3f] text-white text-xs font-extrabold rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>Generate Now</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Batch Cards List */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {(editingTrek.batches || []).map((batch, idx) => {
                        const currentStatus = (batch.status || (batch.slotsLeft <= 0 ? "FULL" : batch.slotsLeft <= 3 ? "LAST" : "AVBL")).toUpperCase();

                        return (
                          <div
                            key={batch.id || idx}
                            className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-2xs hover:border-slate-300 transition"
                          >
                            {/* Card Top Row: Index, Status Pill & Quick 1-Click Status Toggles */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Batch #{idx + 1}</span>
                                </span>

                                {batch.monthGroup && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                    {batch.monthGroup}
                                  </span>
                                )}

                                {batch.experienceTag && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1">
                                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                    <span>{batch.experienceTag}</span>
                                  </span>
                                )}

                                {/* Live Status Indicator */}
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                    currentStatus === "FULL"
                                      ? "bg-slate-100 text-slate-500"
                                      : currentStatus === "WL"
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : currentStatus === "LAST"
                                      ? "bg-rose-100 text-rose-800 border border-rose-300"
                                      : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  }`}
                                >
                                  {currentStatus === "WL"
                                    ? `WL ${batch.waitlistCount || 4}`
                                    : currentStatus === "LAST"
                                    ? `LAST ${batch.slotsLeft || 1}`
                                    : currentStatus}
                                </span>
                              </div>

                              {/* Quick 1-Click Status Toggles & Actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] font-bold text-slate-400 mr-1 hidden sm:inline">
                                  Quick Status:
                                </span>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], status: "AVBL", slotsLeft: next[idx].slotsLeft > 0 ? next[idx].slotsLeft : 14 };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                                    currentStatus === "AVBL"
                                      ? "bg-emerald-700 text-white"
                                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                                  }`}
                                  title="Mark as Available"
                                >
                                  AVBL
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], status: "WL", waitlistCount: 4, slotsLeft: 0 };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                                    currentStatus === "WL"
                                      ? "bg-amber-600 text-white"
                                      : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                                  }`}
                                  title="Mark as Waitlist"
                                >
                                  WL 4
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], status: "LAST", slotsLeft: 1 };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                                    currentStatus === "LAST"
                                      ? "bg-rose-600 text-white"
                                      : "bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200"
                                  }`}
                                  title="Mark as Last 1 Slot"
                                >
                                  LAST 1
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], status: "FULL", slotsLeft: 0 };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer ${
                                    currentStatus === "FULL"
                                      ? "bg-slate-700 text-white"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  }`}
                                  title="Mark as Full"
                                >
                                  FULL
                                </button>

                                {/* Duplicate Batch */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = [...(editingTrek.batches || [])];
                                    next.splice(idx + 1, 0, {
                                      ...batch,
                                      id: Date.now(),
                                      startDate: batch.startDate,
                                      endDate: batch.endDate,
                                    });
                                    setEditingTrek({ ...editingTrek, batches: next });
                                    showToast("Batch duplicated!");
                                  }}
                                  className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded cursor-pointer ml-1"
                                  title="Duplicate this batch"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Batch */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = (editingTrek.batches || []).filter((_, i) => i !== idx);
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded cursor-pointer"
                                  title="Delete this batch"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Batch Form Inputs */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
                              {/* Start Date */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Start Date</label>
                                <input
                                  type="text"
                                  value={batch.startDate}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], startDate: e.target.value };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                  placeholder="3rd Oct"
                                />
                              </div>

                              {/* End Date */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">End Date</label>
                                <input
                                  type="text"
                                  value={batch.endDate}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], endDate: e.target.value };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                  placeholder="8th Oct"
                                />
                              </div>

                              {/* Status Dropdown */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Status</label>
                                <select
                                  value={batch.status || "AVBL"}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    const val = e.target.value;
                                    next[idx] = {
                                      ...next[idx],
                                      status: val,
                                      slotsLeft: val === "FULL" ? 0 : val === "LAST" ? 1 : next[idx].slotsLeft || 12,
                                    };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white"
                                >
                                  <option value="AVBL">AVBL (Available)</option>
                                  <option value="WL">WL (Waitlist)</option>
                                  <option value="LAST">LAST (Last Slots)</option>
                                  <option value="FULL">FULL (Full / Sold out)</option>
                                </select>
                              </div>

                              {/* Waitlist count or Slots */}
                              {currentStatus === "WL" ? (
                                <div>
                                  <label className="block text-[10px] font-bold text-amber-700 mb-1">Waitlist Count</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={batch.waitlistCount || 4}
                                    onChange={(e) => {
                                      const next = [...(editingTrek.batches || [])];
                                      next[idx] = { ...next[idx], waitlistCount: Number(e.target.value) };
                                      setEditingTrek({ ...editingTrek, batches: next });
                                    }}
                                    className="w-full px-2.5 py-1.5 border border-amber-300 bg-amber-50/50 rounded-lg text-xs font-bold text-amber-900"
                                    placeholder="4"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Slots Available</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={batch.slotsLeft}
                                    onChange={(e) => {
                                      const next = [...(editingTrek.batches || [])];
                                      next[idx] = { ...next[idx], slotsLeft: Number(e.target.value) };
                                      setEditingTrek({ ...editingTrek, batches: next });
                                    }}
                                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-bold"
                                    placeholder="14"
                                  />
                                </div>
                              )}

                              {/* Price */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Price (₹)</label>
                                <input
                                  type="number"
                                  value={batch.price}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], price: Number(e.target.value) };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-extrabold text-emerald-800"
                                  placeholder="8999"
                                />
                              </div>

                              {/* Experience Tag / Badge */}
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Special Badge</label>
                                <input
                                  type="text"
                                  value={batch.experienceTag || ""}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], experienceTag: e.target.value };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                                  placeholder="Stargazing"
                                />
                              </div>
                            </div>

                            {/* Preset Chips & Month Tag row */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 flex-wrap text-[11px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-slate-400 font-bold text-[10px]">Quick Tag:</span>
                                {["Stargazing", "Vibrant Colours", "Snow Summit", "Full Moon", "Senior Friendly", "Women Only", "Family Special"].map((tg) => (
                                  <button
                                    type="button"
                                    key={tg}
                                    onClick={() => {
                                      const next = [...(editingTrek.batches || [])];
                                      next[idx] = { ...next[idx], experienceTag: batch.experienceTag === tg ? undefined : tg };
                                      setEditingTrek({ ...editingTrek, batches: next });
                                    }}
                                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                                      batch.experienceTag === tg
                                        ? "bg-amber-500 text-white font-bold"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    {tg}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={batch.monthGroup || ""}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], monthGroup: e.target.value };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="px-2 py-1 border border-slate-200 rounded text-[10px] w-28"
                                  placeholder="October 2026"
                                  title="Month Group for Accordion"
                                />
                                <input
                                  type="text"
                                  value={batch.seasonTheme || ""}
                                  onChange={(e) => {
                                    const next = [...(editingTrek.batches || [])];
                                    next[idx] = { ...next[idx], seasonTheme: e.target.value };
                                    setEditingTrek({ ...editingTrek, batches: next });
                                  }}
                                  className="px-2 py-1 border border-slate-200 rounded text-[10px] w-28"
                                  placeholder="Vibrant Colours"
                                  title="Seasonal Theme Description"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {(!editingTrek.batches || editingTrek.batches.length === 0) && (
                        <div className="text-center py-10 text-slate-400 text-xs border border-dashed rounded-2xl bg-slate-50/50">
                          <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-slate-600">No departure batches scheduled yet.</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Use the &ldquo;⚡ Bulk Generator&rdquo; or click &ldquo;Add Batch&rdquo; to schedule departures.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: CATEGORIES */}
                {modalTab === "categories" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        Active Categories & Collections
                      </label>
                      <p className="text-[11px] text-slate-500 mb-3">
                        These tags determine which collections, filters, and season specials this trek appears in.
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(editingTrek.categories || []).map((cat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-2xs"
                          >
                            <span>{cat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.categories || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, categories: next });
                              }}
                              className="text-emerald-700 hover:text-rose-600 ml-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Switch Package Format */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700">Quick Package Format Preset:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetEditingType("Domestic")}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center gap-1.5 border border-amber-300"
                        >
                          <Car className="w-3.5 h-3.5 text-amber-700" />
                          <span>Set as Domestic Tour Package</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSetEditingType("Trek")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition flex items-center gap-1.5 border border-emerald-300"
                        >
                          <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Set as Himalayan Trek</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Add Preset Categories */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-700">Quick-Select Popular Categories:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_CATEGORIES.map((preset) => {
                          const isSelected = (editingTrek.categories || []).includes(preset);
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => {
                                const current = editingTrek.categories || [];
                                if (isSelected) {
                                  setEditingTrek({
                                    ...editingTrek,
                                    categories: current.filter((c) => c !== preset),
                                  });
                                } else {
                                  setEditingTrek({
                                    ...editingTrek,
                                    categories: [...current, preset],
                                  });
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                                isSelected
                                  ? "bg-[#0F3A2E] text-white shadow-2xs"
                                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {isSelected ? "✓ " : "+ "}
                              {preset}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Category Input */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        placeholder="Add custom category tag..."
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newCategoryInput.trim()) {
                              const current = editingTrek.categories || [];
                              if (!current.includes(newCategoryInput.trim())) {
                                setEditingTrek({
                                  ...editingTrek,
                                  categories: [...current, newCategoryInput.trim()],
                                });
                              }
                              setNewCategoryInput("");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCategoryInput.trim()) {
                            const current = editingTrek.categories || [];
                            if (!current.includes(newCategoryInput.trim())) {
                              setEditingTrek({
                                ...editingTrek,
                                categories: [...current, newCategoryInput.trim()],
                              });
                            }
                            setNewCategoryInput("");
                          }
                        }}
                        className="px-4 py-2 bg-[#0F3A2E] text-white rounded-xl text-xs font-bold hover:bg-[#164e3f]"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 6: OVERVIEW & HIGHLIGHTS */}
                {modalTab === "overview" && (
                  <div className="space-y-5">
                    <RichTextEditor
                      label="About the Journey (Overview Narrative)"
                      value={editingTrek.overview || ""}
                      onChange={(val) => setEditingTrek({ ...editingTrek, overview: val })}
                      rows={6}
                      placeholder="Write the detailed overview, landscape description, and trek story here. Format with Bold, Italic, Sizing, Colors..."
                      helperText="Use toolbar buttons to format headings, bold/italic text, custom font sizes, or colors."
                    />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Expedition Highlights (Key Features)
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTrek({
                              ...editingTrek,
                              highlights: [...(editingTrek.highlights || []), ""],
                            })
                          }
                          className="text-xs font-bold text-[#0F3A2E] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Highlight
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingTrek.highlights || []).map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const next = [...(editingTrek.highlights || [])];
                                next[idx] = e.target.value;
                                setEditingTrek({ ...editingTrek, highlights: next });
                              }}
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              placeholder="e.g. Dramatic crossover from Kullu's pine forest to Spiti's cold desert"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.highlights || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, highlights: next });
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!editingTrek.highlights || editingTrek.highlights.length === 0) && (
                          <p className="text-xs text-slate-400 italic py-2">No highlights added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: INCLUSIONS & EXCLUSIONS */}
                {modalTab === "inclusions" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inclusions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inclusions
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTrek({
                              ...editingTrek,
                              inclusions: [...(editingTrek.inclusions || []), ""],
                            })
                          }
                          className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingTrek.inclusions || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const next = [...(editingTrek.inclusions || [])];
                                next[idx] = e.target.value;
                                setEditingTrek({ ...editingTrek, inclusions: next });
                              }}
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              placeholder="e.g. All vegetarian meals on trek"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.inclusions || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, inclusions: next });
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                          <X className="w-4 h-4 text-rose-600" /> Exclusions
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingTrek({
                              ...editingTrek,
                              exclusions: [...(editingTrek.exclusions || []), ""],
                            })
                          }
                          className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Item
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(editingTrek.exclusions || []).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const next = [...(editingTrek.exclusions || [])];
                                next[idx] = e.target.value;
                                setEditingTrek({ ...editingTrek, exclusions: next });
                              }}
                              className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                              placeholder="e.g. Personal gear and backpacks"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = (editingTrek.exclusions || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, exclusions: next });
                              }}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 8: FAQS */}
                {modalTab === "faqs" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700">
                        {editingTrek.faqs?.length || 0} Questions & Answers
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const faqs = [...(editingTrek.faqs || [])];
                          faqs.push({ question: "", answer: "" });
                          setEditingTrek({ ...editingTrek, faqs });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3A2E] text-white text-xs font-bold rounded-lg hover:bg-[#164e3f] transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Question
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingTrek.faqs || []).map((faq, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => {
                                const faqs = [...(editingTrek.faqs || [])];
                                faqs[idx] = { ...faqs[idx], question: e.target.value };
                                setEditingTrek({ ...editingTrek, faqs });
                              }}
                              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                              placeholder={`Question ${idx + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const faqs = (editingTrek.faqs || []).filter((_, i) => i !== idx);
                                setEditingTrek({ ...editingTrek, faqs });
                              }}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <RichTextEditor
                            compact
                            label="Answer"
                            value={faq.answer || ""}
                            onChange={(val) => {
                              const faqs = [...(editingTrek.faqs || [])];
                              faqs[idx] = { ...faqs[idx], answer: val };
                              setEditingTrek({ ...editingTrek, faqs });
                            }}
                            rows={2}
                            placeholder="Provide a clear, helpful answer..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 rounded-b-2xl">
                <div className="text-xs text-slate-500 hidden sm:block">
                  Active Tab: <strong className="text-slate-800 capitalize">{modalTab}</strong>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-60"
                  >
                    {actionLoading ? "Saving Trek..." : "Save All Changes"}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete this trek?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete this trek? It will immediately be removed from the public catalog.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={actionLoading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-60"
              >
                {actionLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Move / Convert Modal */}
      {moveModalTrek && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F3A2E] text-emerald-300 flex items-center justify-center shadow-md">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Move Package: {moveModalTrek.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Switch between Himalayan Trek and Domestic Tour Package catalog.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMoveModalTrek(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDetailedMoveSubmit} className="space-y-4 pt-4">
              {/* Current Status */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Currently Classified As:</span>
                <span className="font-bold flex items-center gap-1.5">
                  {isDomesticPackage(moveModalTrek) ? (
                    <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      🚗 Domestic Tour Package
                    </span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      🏔️ Himalayan Trek
                    </span>
                  )}
                </span>
              </div>

              {/* Target Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Select Target Package Classification:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTargetMoveType("Trek")}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      targetMoveType === "Trek"
                        ? "border-[#0F3A2E] bg-emerald-50/50 text-emerald-950 ring-2 ring-[#0F3A2E]/20"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">🏔️</span>
                      {targetMoveType === "Trek" && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>
                    <span className="font-bold text-xs">Himalayan Trek</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Publishes on /treks & mountain collections
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetMoveType("Domestic")}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      targetMoveType === "Domestic"
                        ? "border-amber-500 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/20"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">🚗</span>
                      {targetMoveType === "Domestic" && <Check className="w-4 h-4 text-amber-600" />}
                    </div>
                    <span className="font-bold text-xs">Domestic Tour</span>
                    <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Publishes on /domestic-trips & holiday tours
                    </span>
                  </button>
                </div>
              </div>

              {/* Region or Collection dropdown */}
              {targetMoveType === "Domestic" ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Destination Region / State
                  </label>
                  <select
                    value={targetMoveRegion}
                    onChange={(e) => setTargetMoveRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-[#0F3A2E]"
                  >
                    {DOMESTIC_REGIONS.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Adds relevant regional tag to enable filtering under /domestic-trips/{targetMoveRegion.toLowerCase().replace(/\s+/g, "-")}.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Trek Collection / Range
                  </label>
                  <select
                    value={targetMoveCollection}
                    onChange={(e) => setTargetMoveCollection(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-[#0F3A2E]"
                  >
                    {TREK_COLLECTIONS.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Sets primary category tag for trekking seasons, difficulty and collections.
                  </p>
                </div>
              )}

              {/* Cross-CMS Bridge Option */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={transferToDestinationsCopy}
                    onChange={(e) => setTransferToDestinationsCopy(e.target.checked)}
                    className="mt-0.5 rounded text-[#0F3A2E] focus:ring-[#0F3A2E] w-3.5 h-3.5"
                  />
                  <div>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>Also sync copy to Destinations CMS</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Creates or updates a corresponding itinerary package in the Destinations CMS (/admin/destinations).
                    </p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMoveModalTrek(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 disabled:opacity-60"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{actionLoading ? "Moving..." : `Confirm Move to ${targetMoveType === "Domestic" ? "Domestic" : "Trek"}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Seasonal Itinerary Customizer Modal */}
      {salesModalTrek && (
        <SalesItineraryCustomizer
          isOpen={!!salesModalTrek}
          onClose={() => setSalesModalTrek(null)}
          tour={salesModalTrek}
        />
      )}

      {/* Client Itinerary PDF Modal with Logo & Watermark */}
      {pdfModalTrek && (
        <ItineraryPdfModal
          isOpen={!!pdfModalTrek}
          onClose={() => setPdfModalTrek(null)}
          tour={pdfModalTrek}
        />
      )}

      {/* Quick Tag Editor Modal */}
      {quickTagModalTrek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Manage Tags & Categories</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{quickTagModalTrek.name}</p>
                </div>
              </div>
              <button
                onClick={() => setQuickTagModalTrek(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Active Tags on this Package ({quickTagCategories.length})
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                {quickTagCategories.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No tags assigned yet. Add below.</span>
                ) : (
                  quickTagCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-2xs"
                    >
                      <span>#{cat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuickTagCategories((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="text-emerald-700 hover:text-rose-600 ml-0.5 cursor-pointer"
                        title="Remove tag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Add Custom Tag Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Add New Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickTagInput}
                  onChange={(e) => setQuickTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const trimmed = quickTagInput.trim().replace(/^#/, "");
                      if (trimmed && !quickTagCategories.includes(trimmed)) {
                        setQuickTagCategories((prev) => [...prev, trimmed]);
                        setQuickTagInput("");
                      }
                    }
                  }}
                  placeholder="Type tag (e.g. Weekend, Monsoon, Couple) and press Enter..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = quickTagInput.trim().replace(/^#/, "");
                    if (trimmed && !quickTagCategories.includes(trimmed)) {
                      setQuickTagCategories((prev) => [...prev, trimmed]);
                      setQuickTagInput("");
                    }
                  }}
                  className="px-4 py-2 bg-[#0F3A2E] text-white text-xs font-bold rounded-xl hover:bg-[#164e3f] transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Quick-Select Suggestions */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700">Quick-Select Popular Tags</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                {POPULAR_CATEGORIES.map((preset) => {
                  const isSelected = quickTagCategories.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setQuickTagCategories((prev) => prev.filter((c) => c !== preset));
                        } else {
                          setQuickTagCategories((prev) => [...prev, preset]);
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#0F3A2E] text-white shadow-2xs font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
                      }`}
                    >
                      <span>{isSelected ? "✓" : "+"}</span>
                      <span>#{preset}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setQuickTagModalTrek(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickTags}
                disabled={actionLoading}
                className="px-5 py-2 bg-[#0F3A2E] hover:bg-[#164e3f] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 disabled:opacity-60 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{actionLoading ? "Saving..." : "Save Tags"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
