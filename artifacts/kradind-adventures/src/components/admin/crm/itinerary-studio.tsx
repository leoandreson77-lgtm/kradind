"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Building2,
  History,
  ClipboardCopy,
  ClipboardPaste,
  Boxes,
  Layers,
  Eye,
  Check,
  X,
  Shield,
  Download,
  GripVertical,
  Edit3,
} from "lucide-react";
import type {
  CustomerItineraryProposal,
  ItineraryProposalDay,
  CustomerRecord,
  TrekData,
  ProposalVersionSnapshot,
} from "@/lib/cms-store";
import { getPackageSection } from "@/lib/package-sections";
import { CustomEditableField } from "@/components/admin/custom-editable-field";
import { ItineraryRouteMap } from "@/components/itinerary-route-map";
import { ItineraryBankingDetails } from "@/components/itinerary-banking-details";

/**
 * Utility to strip raw markdown asterisks (**, *) from package text
 * so clean, readable content is loaded in Itinerary Studio and proposals
 */
export function cleanAsterisks(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/(^|\n)\s*\*\s+/g, "$1• ")
    .replace(/\*/g, "")
    .trim();
}

/**
 * Route transit extractor from title (e.g. "Rishikesh to Chopta" -> { from: "Rishikesh", to: "Chopta" })
 */
function parseTransitRoute(title: string): { from: string; to: string } | null {
  const transitMatch = (title || "").match(/^(.+?)\s+(?:to|➔|->|–)\s+(.+?)(?:\s*\|.*)?$/i);
  if (transitMatch && transitMatch[1].length < 35 && transitMatch[2].length < 35) {
    return { from: transitMatch[1].trim(), to: transitMatch[2].trim() };
  }
  return null;
}

/**
 * Auto-detect experience & terrain tags for rich client view
 */
function getTerrainTags(title: string, desc: string) {
  const combined = ((title || "") + " " + (desc || "")).toLowerCase();
  const tags: { label: string; icon: string; bg: string; text: string }[] = [];
  if (combined.includes("flower") || combined.includes("flora") || combined.includes("rhododendron")) {
    tags.push({ label: "Alpine Wildflowers", icon: "🌸", bg: "bg-rose-50 border-rose-200", text: "text-rose-800" });
  }
  if (combined.includes("stream") || combined.includes("river") || combined.includes("crossing")) {
    tags.push({ label: "Glacial Streams", icon: "🌊", bg: "bg-cyan-50 border-cyan-200", text: "text-cyan-800" });
  }
  if (combined.includes("pass") || combined.includes("summit") || combined.includes("peak") || combined.includes("crest")) {
    tags.push({ label: "High Mountain Pass", icon: "🏔️", bg: "bg-indigo-50 border-indigo-200", text: "text-indigo-800" });
  }
  if (combined.includes("meadow") || combined.includes("bugyal") || combined.includes("valley")) {
    tags.push({ label: "Alpine Meadows", icon: "🌿", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800" });
  }
  if (combined.includes("rock") || combined.includes("boulder") || combined.includes("moraine")) {
    tags.push({ label: "Moraine Trail", icon: "🪨", bg: "bg-amber-50 border-amber-200", text: "text-amber-800" });
  }
  if (combined.includes("lake") || combined.includes("tarn") || combined.includes("chandratal")) {
    tags.push({ label: "Glacial Lake", icon: "💎", bg: "bg-blue-50 border-blue-200", text: "text-blue-800" });
  }
  if (combined.includes("drive") || combined.includes("transit") || combined.includes("road")) {
    tags.push({ label: "Mountain Transit", icon: "🚙", bg: "bg-teal-50 border-teal-200", text: "text-teal-800" });
  }
  if (combined.includes("camp") || combined.includes("tent") || combined.includes("campsite")) {
    tags.push({ label: "Wilderness Camp", icon: "⛺", bg: "bg-purple-50 border-purple-200", text: "text-purple-800" });
  }
  return tags.slice(0, 4);
}

export const POPULAR_HOTEL_DIRECTORY = [
  // Goa
  { name: "The Leela Goa", city: "Cavelossim, Goa", rating: "5-Star Luxury", roomType: "Lagoon Deluxe Suite", mealPlan: "CP" },
  { name: "Taj Exotica Resort & Spa", city: "Benaulim, Goa", rating: "5-Star Luxury", roomType: "Premium Villa Room", mealPlan: "CP" },
  { name: "Heritage Village Resort & Spa", city: "Arossim, Goa", rating: "4-Star Deluxe", roomType: "Superior Heritage Room", mealPlan: "MAP" },
  { name: "Resort Rio Arpora", city: "Baga/Arpora, Goa", rating: "4-Star Deluxe", roomType: "Luxury Deluxe Room", mealPlan: "MAP" },
  { name: "ibis Styles Calangute", city: "Calangute, Goa", rating: "3-Star Standard", roomType: "Standard AC Room", mealPlan: "CP" },
  { name: "Whispering Palms Beach Resort", city: "Candolim, Goa", rating: "4-Star Deluxe", roomType: "Balcony Room", mealPlan: "MAP" },
  // Manali / Himachal
  { name: "The Himalayan Resort & Spa", city: "Old Manali, HP", rating: "5-Star Luxury", roomType: "Castle Premier Room", mealPlan: "MAP" },
  { name: "Apple Country Resort", city: "Log Huts, Manali", rating: "4-Star Deluxe", roomType: "Mountain Valley Deluxe", mealPlan: "MAP" },
  { name: "Snow Valley Resorts", city: "Log Huts, Manali", rating: "3-Star Standard", roomType: "Luxury Pine View Room", mealPlan: "MAP" },
  { name: "Solang Valley Alpine Cottages", city: "Solang, Manali", rating: "Alpine Camp", roomType: "Wooden Alpine Cottage", mealPlan: "MAP" },
  { name: "Wildflower Hall, An Oberoi Resort", city: "Shimla, HP", rating: "5-Star Luxury", roomType: "Premier Mountain View Room", mealPlan: "CP" },
  // Kerala
  { name: "Blanket Hotel & Spa", city: "Munnar, Kerala", rating: "5-Star Luxury", roomType: "Valley View Luxury Room", mealPlan: "MAP" },
  { name: "Fragrant Nature Resort", city: "Munnar, Kerala", rating: "4-Star Deluxe", roomType: "Tropic Green Room", mealPlan: "MAP" },
  { name: "Lake Palace Houseboat", city: "Alleppey, Kerala", rating: "Luxury Houseboat", roomType: "AC Deluxe Bedroom", mealPlan: "AP" },
  { name: "Spice Village - CGH Earth", city: "Thekkady, Kerala", rating: "4-Star Heritage", roomType: "Standard Spice Cottage", mealPlan: "MAP" },
  { name: "Poovar Island Resort", city: "Poovar/Kovalam, Kerala", rating: "4-Star Deluxe", roomType: "Floating Luxury Cottage", mealPlan: "CP" },
  // Meghalaya / Northeast
  { name: "Polo Orchid Resort", city: "Cherrapunji, Meghalaya", rating: "4-Star Deluxe", roomType: "Seven Sisters Falls View Suite", mealPlan: "MAP" },
  { name: "Ri Kynjai - Serenity by the Lake", city: "Umiam Lake, Meghalaya", rating: "5-Star Luxury", roomType: "Superior Lake View Cottage", mealPlan: "CP" },
  { name: "Hotel Polo Towers", city: "Shillong, Meghalaya", rating: "4-Star Deluxe", roomType: "Executive Deluxe Room", mealPlan: "CP" },
  { name: "Jiva Resort", city: "Cherrapunji, Meghalaya", rating: "4-Star Deluxe", roomType: "Luxury Suite", mealPlan: "MAP" },
  // Maharashtra
  { name: "Fariyas Resort", city: "Lonavala, Maharashtra", rating: "5-Star Luxury", roomType: "Deluxe Valley Room", mealPlan: "MAP" },
  { name: "Le Méridien Resort & Spa", city: "Mahabaleshwar, Maharashtra", rating: "5-Star Luxury", roomType: "Classic Forest View Room", mealPlan: "CP" },
  { name: "Evershine Resort & Spa", city: "Mahabaleshwar, Maharashtra", rating: "4-Star Deluxe", roomType: "Executive Garden Room", mealPlan: "MAP" },
  { name: "Della Resorts", city: "Lonavala, Maharashtra", rating: "5-Star Luxury", roomType: "Luxury Resort Room", mealPlan: "CP" },
  // Rajasthan
  { name: "ITC Rajputana, Luxury Collection", city: "Jaipur, Rajasthan", rating: "5-Star Luxury", roomType: "Rajputana Chamber", mealPlan: "CP" },
  { name: "Alsisar Haveli", city: "Jaipur, Rajasthan", rating: "Heritage 4-Star", roomType: "Heritage Standard Haveli", mealPlan: "MAP" },
  { name: "Ajit Bhawan Palace", city: "Jodhpur, Rajasthan", rating: "Heritage Palace", roomType: "Luxury Heritage Room", mealPlan: "MAP" },
  { name: "Fateh Garh Heritage Resort", city: "Udaipur, Rajasthan", rating: "Heritage 4-Star", roomType: "Renaissance Suite", mealPlan: "MAP" },
  { name: "Sam Sand Dunes Royal Camp", city: "Jaisalmer, Rajasthan", rating: "Desert Camp", roomType: "Swiss AC Luxury Tent", mealPlan: "MAP" },
  // Kashmir
  { name: "The Khyber Himalayan Resort & Spa", city: "Gulmarg, Kashmir", rating: "5-Star Luxury", roomType: "Premier Pine View Room", mealPlan: "MAP" },
  { name: "Radisson Collection Hotel & Spa", city: "Srinagar, Kashmir", rating: "5-Star Luxury", roomType: "Deluxe Mountain View", mealPlan: "CP" },
  { name: "Kolahoi Green Resort", city: "Pahalgam, Kashmir", rating: "4-Star Deluxe", roomType: "Deluxe Pine Cottage", mealPlan: "MAP" },
  { name: "WelcomHeritage Gurkha Houseboat", city: "Nigeen/Dal Lake, Kashmir", rating: "Heritage Houseboat", roomType: "Royal Cedar Suite", mealPlan: "MAP" },
  // Uttarakhand & Himalayan Treks
  { name: "Alpine Swiss Tents Chopta", city: "Chopta, Uttarakhand", rating: "Alpine Camp", roomType: "Swiss Tent with Attached Bath", mealPlan: "MAP" },
  { name: "Himalayan Eco Lodge", city: "Sankri/Kedarkantha", rating: "Mountain Lodge", roomType: "Standard Wooden Room", mealPlan: "MAP" },
  { name: "Monal Resort", city: "Rudraprayag, Uttarakhand", rating: "3-Star Standard", roomType: "Alaknanda River View Room", mealPlan: "MAP" },
  { name: "Camp AquaForest", city: "Rishikesh, Uttarakhand", rating: "Luxury Camp", roomType: "Riverbank AC Dome Tent", mealPlan: "MAP" },
  // International
  { name: "Ayana Resort and Spa", city: "Jimbaran, Bali", rating: "5-Star Luxury", roomType: "Resort View Room", mealPlan: "CP" },
  { name: "Atlantis, The Palm", city: "Dubai, UAE", rating: "5-Star Luxury", roomType: "Ocean King Room", mealPlan: "CP" },
  { name: "Amari Phuket", city: "Patong, Thailand", rating: "4-Star Deluxe", roomType: "Superior Ocean Facing", mealPlan: "CP" },
  { name: "Vinpearl Resort & Spa", city: "Nha Trang, Vietnam", rating: "5-Star Luxury", roomType: "Deluxe King Room", mealPlan: "CP" },
];

interface ItineraryStudioProps {
  packages: TrekData[];
  customers: CustomerRecord[];
  initialProposal?: CustomerItineraryProposal | null;
  onSave: (proposal: CustomerItineraryProposal) => Promise<void>;
  onPreview: (proposal: CustomerItineraryProposal) => void;
  onWhatsApp: (proposal: CustomerItineraryProposal) => void;
  onReset: () => void;
  saving?: boolean;
  onOpenDrafts?: () => void;
  draftCount?: number;
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
  onOpenDrafts,
  draftCount = 0,
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
      hotelCategory: "3 star hotel",
      roomCategory: "Standard Room",
      vehicleType: "Private AC Sedan (Dzire / Etios)",
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
  const [draggedStudioDayIdx, setDraggedStudioDayIdx] = useState<number | null>(null);

  // Accommodation, Room Category & Vehicle Type dynamic lists
  const [accommodationCategories, setAccommodationCategories] = useState<string[]>([
    "Guest house",
    "2 star hotel",
    "3 star hotel",
    "4 star hotel",
    "5 star hotel",
    "Alpine Dome Tents + Standard Homestay",
    "Standard (3-Star)",
    "4-Star Heritage Haveli & Palace Stay",
    "5-Star Luxury Resort",
    "Glamping Luxury Geodesic Domes",
  ]);

  const [roomCategories, setRoomCategories] = useState<string[]>([
    "Standard Room",
    "Deluxe Room",
    "Superior Room",
    "Premium Room",
    "Executive Room",
    "Suite Room",
  ]);

  const [vehicleTypes, setVehicleTypes] = useState<string[]>([
    "Private AC Sedan (Dzire / Etios)",
    "Private AC Ertiga / XL6",
    "Private AC Innova Crysta",
    "Private 12-Seater Tempo Traveller",
    "Shared Mountain Bolero / Sumo",
    "Self-Drive / Not Included",
  ]);

  const [isEditingAccommodation, setIsEditingAccommodation] = useState(false);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [studioViewMode, setStudioViewMode] = useState<"edit" | "preview">("edit");

  // Modal / prompt for adding custom item to backend
  const [showAddOptionModal, setShowAddOptionModal] = useState<
    "accommodation" | "room" | "vehicle" | "inclusion" | "exclusion" | null
  >(null);
  const [customOptionInput, setCustomOptionInput] = useState("");
  const [savingCustomOption, setSavingCustomOption] = useState(false);

  // Hotel directory state (with backend persistence)
  const [popularHotels, setPopularHotels] = useState<typeof POPULAR_HOTEL_DIRECTORY>(POPULAR_HOTEL_DIRECTORY);
  const [customInclusions, setCustomInclusions] = useState<string[]>([]);
  const [customExclusions, setCustomExclusions] = useState<string[]>([]);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false);
  const [newHotelForm, setNewHotelForm] = useState({
    name: "",
    city: "",
    rating: "3-Star Standard",
    roomType: "Deluxe Room",
    mealPlan: "MAP",
  });

  // Fetch saved studio options from backend on mount
  useEffect(() => {
    fetch("/api/admin/crm/studio-options")
      .then((r) => r.json())
      .then((data) => {
        if (data.accommodationCategories && Array.isArray(data.accommodationCategories)) {
          setAccommodationCategories(data.accommodationCategories);
        }
        if (data.roomCategories && Array.isArray(data.roomCategories)) {
          setRoomCategories(data.roomCategories);
        }
        if (data.vehicleTypes && Array.isArray(data.vehicleTypes)) {
          setVehicleTypes(data.vehicleTypes);
        }
        if (data.customHotels && Array.isArray(data.customHotels) && data.customHotels.length > 0) {
          setPopularHotels((prev) => {
            const seen = new Set(prev.map((h) => `${h.name.toLowerCase()}:::${h.city.toLowerCase()}`));
            const uniqueCustom = data.customHotels.filter(
              (h: any) => !seen.has(`${h.name.toLowerCase()}:::${h.city.toLowerCase()}`)
            );
            return [...uniqueCustom, ...prev];
          });
        }
        if (data.customInclusions && Array.isArray(data.customInclusions)) {
          setCustomInclusions(data.customInclusions);
        }
        if (data.customExclusions && Array.isArray(data.customExclusions)) {
          setCustomExclusions(data.customExclusions);
        }
      })
      .catch((err) => console.warn("Could not load studio options:", err));
  }, []);

  // Save new custom option to backend
  const handleSaveNewOption = async (
    type: "accommodation" | "room" | "vehicle" | "inclusion" | "exclusion",
    name: string
  ) => {
    if (!name.trim()) return;
    const cleanName = cleanAsterisks(name.trim());
    setSavingCustomOption(true);

    try {
      const res = await fetch("/api/admin/crm/studio-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name: cleanName }),
      });

      if (res.ok) {
        if (type === "accommodation") {
          setAccommodationCategories((prev) => Array.from(new Set([...prev, cleanName])));
          setFormData((prev) => ({ ...prev, hotelCategory: cleanName }));
        } else if (type === "room") {
          setRoomCategories((prev) => Array.from(new Set([...prev, cleanName])));
          setFormData((prev) => ({ ...prev, roomCategory: cleanName }));
        } else if (type === "vehicle") {
          setVehicleTypes((prev) => Array.from(new Set([...prev, cleanName])));
          setFormData((prev) => ({ ...prev, vehicleType: cleanName }));
        } else if (type === "inclusion") {
          setCustomInclusions((prev) => Array.from(new Set([...prev, cleanName])));
          setFormData((prev) => ({ ...prev, inclusions: [...prev.inclusions, cleanName] }));
        } else if (type === "exclusion") {
          setCustomExclusions((prev) => Array.from(new Set([...prev, cleanName])));
          setFormData((prev) => ({ ...prev, exclusions: [...prev.exclusions, cleanName] }));
        }
        setCopiedToast(`Added "${cleanName}" to ${type} options & saved to backend!`);
        setTimeout(() => setCopiedToast(""), 3000);
      }
    } catch (err) {
      console.error("Error saving option to backend:", err);
    } finally {
      setSavingCustomOption(false);
      setShowAddOptionModal(null);
      setCustomOptionInput("");
    }
  };

  // Copy / Paste / History / Hotel Picker / Inventory State
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showPasteModal, setShowPasteModal] = useState<boolean>(false);
  const [pasteJsonInput, setPasteJsonInput] = useState<string>("");
  const [hotelPickerDayIdx, setHotelPickerDayIdx] = useState<number | null>(null);
  const [hotelSearchQuery, setHotelSearchQuery] = useState<string>("");
  const [copiedToast, setCopiedToast] = useState<string>("");

  // Auto-save & draft restoration state
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Ready");
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

  const isDomesticPkg = (p: TrekData) => getPackageSection(p) === "Domestic";
  const isInternationalPkg = (p: TrekData) => getPackageSection(p) === "International";
  const isFixedPkg = (p: TrekData) => getPackageSection(p) === "Fixed";
  const isTrekPkg = (p: TrekData) => getPackageSection(p) === "Trek";

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

  const lastSnapshotHashRef = useRef<string>("");
  const isRestoringRef = useRef<boolean>(false);

  // Debounced auto-save to localStorage & server DB as Draft, with automated version snapshots
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasContent = Boolean(
      formData.customerName?.trim() ||
      formData.packageTitle?.trim() ||
      formData.destination?.trim() ||
      (formData.itinerary && formData.itinerary.length > 0)
    );

    if (!hasContent) return;

    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }

    setAutoSaveStatus("Saving Draft...");
    const timer = setTimeout(() => {
      try {
        const contentHash = JSON.stringify({
          title: (formData.packageTitle || "").trim(),
          cust: (formData.customerName || "").trim(),
          phone: (formData.customerPhone || "").trim(),
          dest: (formData.destination || "").trim(),
          price: formData.totalQuotedPrice || 0,
          days: (formData.itinerary || []).map((d) => ({ t: d.title, d: d.description, s: d.stay, m: d.meal })),
          inclusions: formData.inclusions || [],
          exclusions: formData.exclusions || [],
        });

        const nowFormatted = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        let updatedHistory = Array.isArray(formData.versionHistory) ? [...formData.versionHistory] : [];
        let newVersion = formData.version || 1;

        // Automatically log a revision snapshot whenever meaningful changes occur
        if (contentHash !== lastSnapshotHashRef.current) {
          newVersion = updatedHistory.length + 1;
          const snapTime = new Date().toISOString();
          const autoSnap: ProposalVersionSnapshot = {
            version: newVersion,
            timestamp: snapTime,
            author: formData.author || "Admin Agent",
            note: `Auto-saved Draft v${newVersion} (${formData.itinerary.length} Days • ₹${(formData.totalQuotedPrice || 0).toLocaleString("en-IN")})`,
            proposalSnapshot: {
              packageTitle: formData.packageTitle,
              customerName: formData.customerName,
              customerPhone: formData.customerPhone,
              customerEmail: formData.customerEmail,
              customerCity: formData.customerCity,
              destination: formData.destination,
              duration: formData.duration,
              totalQuotedPrice: formData.totalQuotedPrice,
              basePricePerPerson: formData.basePricePerPerson,
              itinerary: JSON.parse(JSON.stringify(formData.itinerary)),
              hotelDetails: formData.hotelDetails ? JSON.parse(JSON.stringify(formData.hotelDetails)) : [],
              hotelCategory: formData.hotelCategory,
              roomCategory: formData.roomCategory,
              inclusions: [...(formData.inclusions || [])],
              exclusions: [...(formData.exclusions || [])],
              vehicleType: formData.vehicleType,
              specialNotes: formData.specialNotes,
            },
          };
          updatedHistory = [autoSnap, ...updatedHistory].slice(0, 25);
          lastSnapshotHashRef.current = contentHash;

          setFormData((prev) => ({
            ...prev,
            status: "Draft",
            version: newVersion,
            versionHistory: updatedHistory,
          }));
        }

        const draftPayload = {
          ...formData,
          status: "Draft",
          version: newVersion,
          versionHistory: updatedHistory,
        };

        // 1. Save to local storage
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
        localStorage.setItem(DRAFT_TIMESTAMP_KEY, nowFormatted);
        setLastSavedTime(nowFormatted);

        // 2. Auto-save to Database API as Draft
        if (formData.packageTitle?.trim() && formData.customerName?.trim() && formData.itinerary.length > 0) {
          fetch("/api/admin/crm/proposals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draftPayload),
          }).catch(() => {});
        }

        setAutoSaveStatus(`Auto-saved (Draft v${newVersion})`);
      } catch (err) {
        console.warn("Auto-save failed:", err);
        setAutoSaveStatus("Save error");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

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
        hotelCategory: "3 star hotel",
        roomCategory: "Standard Room",
        vehicleType: "Private AC Sedan (Dzire / Etios)",
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
      setFormData({
        ...initialProposal,
        hotelCategory: initialProposal.hotelCategory || "3 star hotel",
        roomCategory: initialProposal.roomCategory || "Standard Room",
        vehicleType: initialProposal.vehicleType || "Private AC Sedan (Dzire / Etios)",
      });
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

  // Load existing package template (stripping any raw asterisks)
  const handleSelectPackageTemplate = (slug: string) => {
    setSelectedPackageSlug(slug);
    if (!slug) return;

    const pkg = packages.find((p) => p.slug === slug);
    if (!pkg) return;

    const mappedItinerary: ItineraryProposalDay[] = (pkg.itinerary || []).map((day: any, idx: number) => ({
      day: day.day || idx + 1,
      title: cleanAsterisks(day.title || `Day ${idx + 1}`),
      description: cleanAsterisks(day.description || day.desc || ""),
      stay: cleanAsterisks(day.stay || "Standard Accommodation"),
      hotelName: cleanAsterisks(day.hotelName || day.stay || "Standard Hotel"),
      hotelRating: cleanAsterisks(day.hotelRating || "3-Star Standard"),
      roomType: cleanAsterisks(day.roomType || "Standard Room"),
      mealPlan: cleanAsterisks(day.mealPlan || "MAP"),
      meal: cleanAsterisks(day.meal || "Breakfast Included"),
      activities: cleanAsterisks(day.activities || ""),
      distance: cleanAsterisks(day.distance || ""),
      altitude: cleanAsterisks(day.altitude || ""),
    }));

    const inclusions = Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0
      ? pkg.inclusions.map((item) => cleanAsterisks(item))
      : [
        "All verified accommodation as per selected plan",
        "Dedicated private transport with experienced mountain chauffeur",
        "Daily breakfast and dinner (MAP plan)",
        "Certified trek leader and local safety guides",
        "All forest permits, entry passes, and state tolls",
      ];

    const exclusions = Array.isArray(pkg.exclusions) && pkg.exclusions.length > 0
      ? pkg.exclusions.map((item) => cleanAsterisks(item))
      : [
        "Personal travel and medical insurance",
        "Airfare or train journey to starting point",
        "Any personal expenses, tips, and optional activities",
        "Applicable 5% GST",
      ];

    const basePrice = pkg.price || 9999;
    const adults = formData.adultsCount || 2;
    const total = basePrice * adults;
    const deposit = Math.round(total * 0.3);

    setFormData((prev) => ({
      ...prev,
      packageTitle: cleanAsterisks(pkg.name),
      basePackageSlug: pkg.slug,
      destination: cleanAsterisks(pkg.location || pkg.region || "Uttarakhand, Himalayas"),
      duration: cleanAsterisks(pkg.duration || `${mappedItinerary.length || 5} Days`),
      basePricePerPerson: basePrice,
      totalQuotedPrice: total,
      advanceDepositRequired: deposit,
      itinerary: mappedItinerary,
      inclusions: inclusions,
      exclusions: exclusions,
      hotelCategory: pkg.region === "Himalayas" ? "Alpine Dome Tents + Standard Homestay" : "3 star hotel",
      roomCategory: "Standard Room",
      vehicleType: adults > 4 ? "Private 12-Seater Tempo Traveller" : "Private AC Sedan (Dzire / Etios)",
      pickupLocation: cleanAsterisks(pkg.pickupDrop || pkg.baseCamp || pkg.location || "Dehradun / Base Hub"),
      dropLocation: cleanAsterisks(pkg.pickupDrop || pkg.baseCamp || pkg.location || "Dehradun / Base Hub"),
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

  // Quick Days Trimmer / Duration Adjuster (Trim or Expand seamlessly)
  const handleTrimOrExtendDays = (targetDays: number) => {
    if (targetDays < 1) return;
    setFormData((prev) => {
      const current = prev.itinerary || [];
      if (current.length === targetDays) return prev;

      let newItinerary: ItineraryProposalDay[];
      if (current.length > targetDays) {
        // Trim to target days
        newItinerary = current.slice(0, targetDays).map((d, i) => ({ ...d, day: i + 1 }));
      } else {
        // Extend to target days
        newItinerary = [...current];
        for (let i = current.length + 1; i <= targetDays; i++) {
          newItinerary.push({
            day: i,
            title: `Day ${i} - Guided Exploration & Mountain Viewpoints`,
            description: "Explore prominent scenic trails, panoramic viewpoints, and authentic cultural experiences.",
            stay: "Verified 3-Star Hotel / Resort",
            meal: "Breakfast & Dinner",
            distance: "35 km / Scenic Transfer",
            duration: "Full Day Activity",
            altitude: "",
          });
        }
      }
      return {
        ...prev,
        itinerary: newItinerary,
        duration: `${targetDays} Days / ${Math.max(1, targetDays - 1)} Nights`,
      };
    });
  };

  // Start 100% custom from scratch (Blank Canvas)
  const handleStartCustomBlank = () => {
    setSelectedPackageSlug("");
    setFormData((prev) => ({
      ...prev,
      packageTitle: prev.packageTitle ? `${prev.packageTitle} (Custom)` : "Bespoke Custom Travel Itinerary",
      destination: prev.destination || "",
      duration: "4 Days / 3 Nights",
      basePackageSlug: "",
      itinerary: [
        {
          day: 1,
          title: "Day 1 - Arrival, VIP Transfer & Hotel Check-in",
          description: "Arrive at destination airport / railway station. Dedicated private vehicle transfer to verified hotel. Evening at leisure for local exploration.",
          stay: "Verified 3-Star Hotel / Resort",
          meal: "Dinner Included",
          distance: "25 km",
          duration: "1 Hour Transfer",
        },
        {
          day: 2,
          title: "Day 2 - Full Day Guided Sightseeing & Scenic Highlights",
          description: "Full day sightseeing of prominent natural monuments, heritage viewpoints, and cultural attractions with private vehicle and driver.",
          stay: "Verified 3-Star Hotel / Resort",
          meal: "Breakfast & Dinner",
          distance: "45 km",
          duration: "Full Day Excursion",
        },
        {
          day: 3,
          title: "Day 3 - Nature Trails, Waterfalls & Leisure Excursion",
          description: "Drive through scenic landscapes and pine valleys. Explore tranquil lakes/waterfalls with time for photography and local crafts shopping.",
          stay: "Verified 3-Star Hotel / Resort",
          meal: "Breakfast & Dinner",
          distance: "40 km",
          duration: "5 Hours",
        },
        {
          day: 4,
          title: "Day 4 - Leisure Morning Breakfast & Departure Transfer",
          description: "Wholesome breakfast at hotel and checkout. Transfer comfortably to airport / station for your return journey.",
          stay: "Checkout",
          meal: "Breakfast Included",
          distance: "25 km",
          duration: "1 Hour Transfer",
        },
      ],
      totalQuotedPrice: 24999,
      basePricePerPerson: 12499,
      status: "Draft",
    }));
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

  // Copy full package JSON
  const handleCopyPackage = () => {
    try {
      const jsonExport = JSON.stringify(formData, null, 2);
      navigator.clipboard.writeText(jsonExport);
      setCopiedToast("📋 Full Package JSON copied to clipboard!");
      setTimeout(() => setCopiedToast(""), 3000);
    } catch {
      alert("Failed to copy to clipboard");
    }
  };

  // Copy readable text for WhatsApp / Client
  const handleCopyTextSummary = () => {
    try {
      const summary = `*${formData.packageTitle}* (${formData.duration})
Destination: ${formData.destination}
Price: ₹${formData.totalQuotedPrice.toLocaleString("en-IN")} for ${formData.adultsCount} Pax
Accommodation: ${formData.hotelCategory || "3 star hotel"}
Room Category: ${formData.roomCategory || "Standard Room"}
Vehicle: ${formData.vehicleType || "Private AC Sedan"}
${formData.validUntil ? `Quotation Validity: ${formData.validUntil}\n` : ""}
DAY-BY-DAY ITINERARY:
${formData.itinerary
  .map(
    (d) =>
      `• *Day ${d.day}: ${d.title}*\n  ${d.description}\n  Stay: ${d.hotelName || d.stay || "Included"} | Meals: ${d.meal || "Included"}`
  )
  .join("\n\n")}

INCLUSIONS:
${formData.inclusions.map((inc) => `✓ ${inc}`).join("\n")}

EXCLUSIONS:
${formData.exclusions.map((exc) => `✗ ${exc}`).join("\n")}
`;
      navigator.clipboard.writeText(summary);
      setCopiedToast("📄 Client Itinerary Text copied to clipboard!");
      setTimeout(() => setCopiedToast(""), 3000);
    } catch {
      alert("Failed to copy to clipboard");
    }
  };

  // Paste / Import package from JSON
  const handlePastePackage = () => {
    try {
      if (!pasteJsonInput.trim()) return;
      const parsed = JSON.parse(pasteJsonInput.trim());
      if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
        alert("Invalid format: Must contain an 'itinerary' array.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        packageTitle: parsed.packageTitle || parsed.name || prev.packageTitle,
        destination: parsed.destination || parsed.region || prev.destination,
        duration: parsed.duration || prev.duration,
        basePricePerPerson: Number(parsed.basePricePerPerson || parsed.price) || prev.basePricePerPerson,
        totalQuotedPrice: Number(parsed.totalQuotedPrice || parsed.price) || prev.totalQuotedPrice,
        hotelCategory: parsed.hotelCategory || prev.hotelCategory,
        vehicleType: parsed.vehicleType || prev.vehicleType,
        itinerary: (parsed.itinerary || []).map((d: any, idx: number) => ({
          day: idx + 1,
          title: d.title || `Day ${idx + 1}`,
          description: d.description || "",
          stay: d.stay || d.hotelName || "Verified Stay",
          hotelName: d.hotelName || d.stay || "",
          hotelRating: d.hotelRating || "4-Star Deluxe",
          roomType: d.roomType || "Deluxe Room",
          mealPlan: d.mealPlan || "MAP",
          meal: d.meal || "Breakfast & Dinner",
          distance: d.distance || "",
          duration: d.duration || "",
          altitude: d.altitude || "",
        })),
        inclusions: Array.isArray(parsed.inclusions) ? parsed.inclusions : prev.inclusions,
        exclusions: Array.isArray(parsed.exclusions) ? parsed.exclusions : prev.exclusions,
      }));
      setShowPasteModal(false);
      setPasteJsonInput("");
      setCopiedToast("✨ Package successfully imported & loaded into Studio!");
      setTimeout(() => setCopiedToast(""), 3000);
    } catch (err: any) {
      alert(`Invalid JSON: ${err?.message || "Failed to parse JSON"}`);
    }
  };

  // Manual snapshot capture
  const handleManualSnapshot = (customNote?: string) => {
    const currentVer = formData.version || 1;
    const nextVer = (formData.versionHistory?.length || 0) + 1;
    const now = new Date().toISOString();
    const newSnapshot: ProposalVersionSnapshot = {
      version: nextVer,
      timestamp: now,
      author: formData.author || "Admin Agent",
      note: customNote || `Manual Snapshot v${nextVer} (${formData.itinerary.length} Days • ₹${(formData.totalQuotedPrice || 0).toLocaleString("en-IN")})`,
      proposalSnapshot: {
        packageTitle: formData.packageTitle,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        customerCity: formData.customerCity,
        destination: formData.destination,
        duration: formData.duration,
        totalQuotedPrice: formData.totalQuotedPrice,
        basePricePerPerson: formData.basePricePerPerson,
        itinerary: JSON.parse(JSON.stringify(formData.itinerary)),
        hotelDetails: formData.hotelDetails ? JSON.parse(JSON.stringify(formData.hotelDetails)) : [],
        hotelCategory: formData.hotelCategory,
        roomCategory: formData.roomCategory,
        inclusions: [...(formData.inclusions || [])],
        exclusions: [...(formData.exclusions || [])],
        vehicleType: formData.vehicleType,
        specialNotes: formData.specialNotes,
      },
    };
    const updatedHistory = [newSnapshot, ...(formData.versionHistory || [])].slice(0, 25);
    setFormData((prev) => ({
      ...prev,
      status: "Draft",
      version: nextVer,
      versionHistory: updatedHistory,
      updatedAt: now,
    }));
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
        ...formData,
        status: "Draft",
        version: nextVer,
        versionHistory: updatedHistory,
      }));
    } catch {}
    setCopiedToast(`📸 Revision snapshot v${nextVer} captured!`);
    setTimeout(() => setCopiedToast(""), 3000);
  };

  // Restore snapshot from version history
  const handleRestoreVersion = (snapshot: any, versionNum: number) => {
    if (confirm(`Restore revision v${versionNum}? Current unsaved edits will be replaced.`)) {
      isRestoringRef.current = true;
      setFormData((prev) => ({
        ...prev,
        ...snapshot.proposalSnapshot,
        status: "Draft",
        updatedAt: new Date().toISOString(),
      }));
      setShowHistoryModal(false);
      setCopiedToast(`🕒 Restored revision v${versionNum}!`);
      setTimeout(() => setCopiedToast(""), 3000);
    }
  };

  // Hotel Directory Selection
  const handleSelectHotelForDay = (dayIdx: number, hotel: typeof POPULAR_HOTEL_DIRECTORY[0]) => {
    handleUpdateDay(dayIdx, "hotelName", hotel.name);
    handleUpdateDay(dayIdx, "stay", `${hotel.name} (${hotel.city})`);
    handleUpdateDay(dayIdx, "hotelRating", hotel.rating);
    handleUpdateDay(dayIdx, "roomType", hotel.roomType);
    handleUpdateDay(dayIdx, "mealPlan", hotel.mealPlan);
    setHotelPickerDayIdx(null);
    setCopiedToast(`🏨 Hotel "${hotel.name}" assigned to Day ${dayIdx + 1}`);
    setTimeout(() => setCopiedToast(""), 3000);
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
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onOpenDrafts && (
              <button
                type="button"
                onClick={onOpenDrafts}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 font-bold transition text-xs border border-amber-400/60 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>All Drafts Hub</span>
                {draftCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black">
                    {draftCount}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={handleClearDraft}
              className="px-3 py-1.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-900 font-bold transition text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard Draft</span>
            </button>
            <button
              type="button"
              onClick={() => setDraftRecoveredNotice(false)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 font-bold transition text-xs border border-amber-300/60 cursor-pointer"
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

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyPackage}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
              title="Copy entire package JSON to clipboard"
            >
              <ClipboardCopy className="w-3.5 h-3.5 text-sky-300" />
              <span>Copy JSON</span>
            </button>
            <button
              type="button"
              onClick={handleCopyTextSummary}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
              title="Copy clean formatted itinerary text for WhatsApp or client email"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-300" />
              <span>Copy Text</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPasteModal(true)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
              title="Paste / Import package from clipboard JSON"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-amber-300" />
              <span>Paste Package</span>
            </button>
            {onOpenDrafts && (
              <button
                type="button"
                onClick={onOpenDrafts}
                className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-400/30 cursor-pointer"
                title="View All Saved Itinerary Drafts"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Drafts Hub</span>
                {draftCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                    {draftCount}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-purple-400/30"
              title="View revision history and past snapshots"
            >
              <History className="w-3.5 h-3.5 text-purple-300" />
              <span>History (v{formData.version || 1})</span>
            </button>
            <button
              type="button"
              onClick={handleClearDraft}
              className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-500/30"
              title="Clear draft and start with a blank proposal"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-300" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => onPreview(formData)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-3.5 h-3.5 text-[#FF6B35]" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Action / Toast Banner */}
        {copiedToast && (
          <div className="mt-3 py-2 px-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{copiedToast}</span>
          </div>
        )}
      </div>

      {/* Blueprint Selector Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Package Blueprint Dropdown */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center">
                1
              </span>
              <span>Tour / Trek Blueprint Template</span>
            </label>
            <button
              type="button"
              onClick={handleStartCustomBlank}
              className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Start a fresh, 100% custom itinerary from scratch"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>+ Build Custom Itinerary</span>
            </button>
          </div>
          <select
            value={selectedPackageSlug}
            onChange={(e) => handleSelectPackageTemplate(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 transition-all cursor-pointer"
          >
            <option value="">-- Choose from {distinctPackages.length} Existing Packages --</option>
            <optgroup label="🏖️ Domestic Tours">
              {distinctPackages
                .filter(isDomesticPkg)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.duration} • ₹{p.price.toLocaleString("en-IN")})
                  </option>
                ))}
            </optgroup>
            <optgroup label="🌐 International Tours">
              {distinctPackages
                .filter(isInternationalPkg)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.duration} • ₹{p.price.toLocaleString("en-IN")})
                  </option>
                ))}
            </optgroup>
            <optgroup label="📅 Fixed Departures">
              {distinctPackages
                .filter(isFixedPkg)
                .map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.duration} • ₹{p.price.toLocaleString("en-IN")})
                  </option>
                ))}
            </optgroup>
            <optgroup label="🏔️ Himalayan Treks">
              {distinctPackages
                .filter(isTrekPkg)
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
                <CustomEditableField
                  label="Package Proposal Title *"
                  value={formData.packageTitle}
                  onChange={(val) => setFormData({ ...formData, packageTitle: val })}
                  placeholder="e.g. Kedarkantha Winter Snow Summit Expedition"
                  required
                />
              </div>

              <div>
                <CustomEditableField
                  label="Destination"
                  value={formData.destination}
                  onChange={(val) => setFormData({ ...formData, destination: val })}
                  placeholder="e.g. Uttarakhand / Rajasthan"
                />
              </div>

              <div>
                <CustomEditableField
                  label="Duration"
                  value={formData.duration}
                  onChange={(val) => setFormData({ ...formData, duration: val })}
                  placeholder="e.g. 5 Days / 4 Nights"
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
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Bed className="w-4 h-4 text-purple-600" />
              <span>Accommodation, Vehicle & Room Category Specifications</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Live Backend-Linked Options
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            {/* 1. ACCOMMODATION CATEGORY */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Accommodation Category
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOptionModal("accommodation");
                    setCustomOptionInput("");
                  }}
                  className="text-[10px] font-black text-purple-700 hover:text-purple-900 flex items-center gap-0.5 cursor-pointer"
                  title="Add new category and save to backend"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add New</span>
                </button>
              </div>

              {isEditingAccommodation ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="text"
                    value={formData.hotelCategory}
                    onChange={(e) => setFormData({ ...formData, hotelCategory: cleanAsterisks(e.target.value) })}
                    className="w-full bg-white border border-purple-400 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g. 3 star hotel / Guest house"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingAccommodation(false);
                      if (formData.hotelCategory) handleSaveNewOption("accommodation", formData.hotelCategory);
                    }}
                    className="px-2.5 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 cursor-pointer shrink-0"
                    title="Save to backend"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <select
                    value={formData.hotelCategory}
                    onChange={(e) => {
                      if (e.target.value === "__ADD_NEW__") {
                        setShowAddOptionModal("accommodation");
                        setCustomOptionInput("");
                      } else {
                        setFormData({ ...formData, hotelCategory: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                  >
                    {accommodationCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">✨ + Add New Category (Save to Backend)...</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsEditingAccommodation(true)}
                    className="p-2 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    title="Edit custom category text directly"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 2. ROOM CATEGORY */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Room Category
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOptionModal("room");
                    setCustomOptionInput("");
                  }}
                  className="text-[10px] font-black text-indigo-700 hover:text-indigo-900 flex items-center gap-0.5 cursor-pointer"
                  title="Add new room category and save to backend"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add New</span>
                </button>
              </div>

              {isEditingRoom ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="text"
                    value={formData.roomCategory || "Standard Room"}
                    onChange={(e) => setFormData({ ...formData, roomCategory: cleanAsterisks(e.target.value) })}
                    className="w-full bg-white border border-indigo-400 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g. Deluxe Room / Suite Room"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingRoom(false);
                      if (formData.roomCategory) handleSaveNewOption("room", formData.roomCategory);
                    }}
                    className="px-2.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer shrink-0"
                    title="Save to backend"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <select
                    value={formData.roomCategory || "Standard Room"}
                    onChange={(e) => {
                      if (e.target.value === "__ADD_NEW__") {
                        setShowAddOptionModal("room");
                        setCustomOptionInput("");
                      } else {
                        setFormData({ ...formData, roomCategory: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                  >
                    {roomCategories.map((rc) => (
                      <option key={rc} value={rc}>
                        {rc}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">✨ + Add New Room Category (Save to Backend)...</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsEditingRoom(true)}
                    className="p-2 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    title="Edit custom room text directly"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 3. VEHICLE TYPE */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Vehicle Type
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddOptionModal("vehicle");
                    setCustomOptionInput("");
                  }}
                  className="text-[10px] font-black text-blue-700 hover:text-blue-900 flex items-center gap-0.5 cursor-pointer"
                  title="Add new vehicle and save to backend"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add New</span>
                </button>
              </div>

              {isEditingVehicle ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="text"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: cleanAsterisks(e.target.value) })}
                    className="w-full bg-white border border-blue-400 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. Private AC Sedan (Dzire / Etios)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingVehicle(false);
                      if (formData.vehicleType) handleSaveNewOption("vehicle", formData.vehicleType);
                    }}
                    className="px-2.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer shrink-0"
                    title="Save to backend"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => {
                      if (e.target.value === "__ADD_NEW__") {
                        setShowAddOptionModal("vehicle");
                        setCustomOptionInput("");
                      } else {
                        setFormData({ ...formData, vehicleType: e.target.value });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white cursor-pointer"
                  >
                    {vehicleTypes.map((vt) => (
                      <option key={vt} value={vt}>
                        {vt}
                      </option>
                    ))}
                    <option value="__ADD_NEW__">✨ + Add New Vehicle Type (Save to Backend)...</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsEditingVehicle(true)}
                    className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl border border-slate-200 cursor-pointer shrink-0"
                    title="Edit custom vehicle text directly"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. QUOTATION VALIDITY */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Quotation Validity
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 7);
                      setFormData({ ...formData, validUntil: d.toISOString().split("T")[0] });
                    }}
                    className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition cursor-pointer"
                    title="Add 7 Days validity"
                  >
                    +7d
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 15);
                      setFormData({ ...formData, validUntil: d.toISOString().split("T")[0] });
                    }}
                    className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition cursor-pointer"
                    title="Add 15 Days validity"
                  >
                    +15d
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const d = new Date();
                      d.setDate(d.getDate() + 30);
                      setFormData({ ...formData, validUntil: d.toISOString().split("T")[0] });
                    }}
                    className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 transition cursor-pointer"
                    title="Add 30 Days validity"
                  >
                    +30d
                  </button>
                </div>
              </div>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 mt-1 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <CustomEditableField
                label="Special Dietary & Expedition Instructions"
                value={formData.specialNotes}
                onChange={(val) => setFormData({ ...formData, specialNotes: cleanAsterisks(val) })}
                placeholder="e.g. Pure Vegetarian/Jain meal requirement, Anniversary welcome flowers, microspikes included"
              />
            </div>
          </div>
        </div>

        {/* Itinerary Inventory & Room/Vehicle Capacity Block */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-teal-600" />
              <span>Itinerary Inventory & Capacity Allocation</span>
            </h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
              Real-Time Stock
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Batch Departure Date
              </label>
              <input
                type="date"
                value={formData.inventory?.batchDate || formData.startDate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inventory: { ...(formData.inventory || {}), batchDate: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Slots / Travelers Blocked
              </label>
              <input
                type="number"
                min={1}
                value={formData.inventory?.slotsBlocked || formData.adultsCount || 2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inventory: { ...(formData.inventory || {}), slotsBlocked: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Hotel Rooms Blocked
              </label>
              <input
                type="number"
                min={1}
                value={formData.inventory?.hotelRoomsBlocked || Math.ceil((formData.adultsCount || 2) / 2)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inventory: { ...(formData.inventory || {}), hotelRoomsBlocked: Number(e.target.value) },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Inventory Status
              </label>
              <select
                value={formData.inventory?.status || "Reserved"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    inventory: { ...(formData.inventory || {}), status: e.target.value as any },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white cursor-pointer"
              >
                <option value="Reserved">🟡 Reserved (Tentative)</option>
                <option value="Confirmed">🟢 Confirmed (Allotted)</option>
                <option value="Waitlist">🟠 Waitlist</option>
                <option value="Released">⚪ Released / Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Day-by-Day Editor */}
        <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Day-by-Day Itinerary Schedule ({formData.itinerary.length} Days)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Craft custom stops, trekking distances, elevations, stays, and meal plans.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* View Mode Toggle: Edit Mode vs Live Client View */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setStudioViewMode("edit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    studioViewMode === "edit"
                      ? "bg-white text-emerald-800 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>✏️ Day Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStudioViewMode("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    studioViewMode === "preview"
                      ? "bg-[#0F3A2E] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>👁️ Live Client View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPreview(formData)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs hover:from-emerald-700 hover:to-teal-800 active:scale-95"
                  title="Generate & Download Official Domestic PDF Itinerary (Same as Domestic Packages)"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-200" />
                  <span>📄 Domestic PDF</span>
                </button>
              </div>

              {/* Quick Duration Trimmer / Extender Toolbar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Duration:</span>
                {[3, 4, 5, 6, 7, 8].map((daysCount) => (
                  <button
                    key={daysCount}
                    type="button"
                    onClick={() => handleTrimOrExtendDays(daysCount)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                      formData.itinerary.length === daysCount
                        ? "bg-[#0F3A2E] text-white border-[#0F3A2E] shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                    title={`Adjust schedule to ${daysCount} Days`}
                  >
                    {daysCount}D
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleTrimOrExtendDays(Math.max(1, formData.itinerary.length - 1))}
                  disabled={formData.itinerary.length <= 1}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 disabled:opacity-30 text-rose-700 text-xs font-bold border border-rose-200 transition cursor-pointer"
                  title="Trim last day (- 1 Day)"
                >
                  - 1D
                </button>
                <button
                  type="button"
                  onClick={handleAddDay}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                  title="Add day (+ 1 Day)"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ 1D</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Route Flow Map */}
          {formData.itinerary.length > 0 && (
            <ItineraryRouteMap
              itinerary={formData.itinerary}
              destination={formData.destination}
              pickupLocation={formData.pickupLocation}
              dropLocation={formData.dropLocation}
            />
          )}

          {formData.itinerary.length === 0 ? (
            <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs space-y-2">
              <Calendar className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-500">No itinerary days added yet.</p>
              <p className="text-slate-400">Choose a package template above or click &ldquo;Add Day&rdquo; below to start building.</p>
            </div>
          ) : studioViewMode === "preview" ? (
            /* Live Client View - Exactly Matches Client Detail Page Timeline */
            <div className="relative space-y-6 before:absolute before:inset-0 before:left-[23px] sm:before:left-[27px] before:w-[3px] before:bg-gradient-to-b before:from-emerald-500 before:via-[#0F3A2E] before:to-emerald-400 before:rounded-full before:opacity-30 pt-2 pb-2">
              {formData.itinerary.map((d, idx) => {
                const transit = parseTransitRoute(d.title);
                const tags = getTerrainTags(d.title, d.description);
                const hotelDisplayName = d.hotelName || d.stay;

                return (
                  <div key={idx} className="relative flex items-start gap-4 sm:gap-6 group">
                    {/* Circular Day Badge Centered on Vertical Line */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0F3A2E] text-white flex flex-col items-center justify-center font-sans shadow-md border-2 border-white ring-4 ring-[#0F3A2E]/15 shrink-0 z-10 select-none">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider leading-none">
                        Day
                      </span>
                      <span className="text-sm sm:text-base font-black leading-none mt-0.5">
                        {d.day}
                      </span>
                    </div>

                    {/* Day Content Card */}
                    <div className="flex-1 min-w-0 bg-white border border-slate-200/90 rounded-2xl shadow-xs p-5 sm:p-6 space-y-3.5 hover:shadow-md transition duration-300">
                      {/* Top Header: Day Badge & Route Transit */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            Day {d.day} Schedule
                          </span>
                          {transit && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                              <span>{transit.from}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span className="font-bold text-slate-900">{transit.to}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {hotelDisplayName && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80">
                              <Building2 className="w-3 h-3 text-blue-600" />
                              <span>{hotelDisplayName}</span>
                              {d.roomType && <span className="text-blue-500 font-normal">({d.roomType})</span>}
                              {d.mealPlan && (
                                <span className="bg-blue-200/70 text-blue-900 text-[9px] px-1.5 py-0.5 rounded font-black ml-1">
                                  {d.mealPlan}
                                </span>
                              )}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setStudioViewMode("edit")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition border border-slate-200 cursor-pointer"
                            title="Switch to editor to customize this day"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Day</span>
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 brand-font leading-snug">
                        {d.title}
                      </h4>

                      {/* 4-Item Metric Ribbon */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                        {/* Duration */}
                        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">Duration</span>
                            <span className="block text-xs sm:text-sm font-extrabold text-amber-950 truncate">
                              {d.duration || "Day Activity"}
                            </span>
                          </div>
                        </div>

                        {/* Distance */}
                        <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                            <Milestone className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-600">Distance</span>
                            <span className="block text-xs sm:text-sm font-extrabold text-purple-950 truncate">
                              {d.distance || "Scenic Route"}
                            </span>
                          </div>
                        </div>

                        {/* Altitude */}
                        <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                            <Mountain className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-sky-600">Elevation</span>
                            <span className="block text-xs sm:text-sm font-extrabold text-sky-950 truncate">
                              {d.altitude || "Alpine Trail"}
                            </span>
                          </div>
                        </div>

                        {/* Meals */}
                        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Meals</span>
                            <span className="block text-xs sm:text-sm font-extrabold text-emerald-950 truncate">
                              {d.meal || "Included"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Experience Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tag.bg} ${tag.text}`}
                            >
                              <span>{tag.icon}</span>
                              <span>{tag.label}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-1">
                        {d.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {formData.itinerary.map((day, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => {
                    setDraggedStudioDayIdx(idx);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedStudioDayIdx !== null && draggedStudioDayIdx !== idx) {
                      handleMoveDay(draggedStudioDayIdx, idx);
                    }
                    setDraggedStudioDayIdx(null);
                  }}
                  onDragEnd={() => setDraggedStudioDayIdx(null)}
                  className={`bg-white border rounded-2xl shadow-xs transition duration-300 overflow-hidden ${
                    draggedStudioDayIdx === idx
                      ? "border-emerald-500 bg-emerald-50/50 opacity-60 shadow-md ring-2 ring-emerald-500/30"
                      : "border-slate-200/90 hover:shadow-md"
                  }`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Header: Day Badge & Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded-md transition"
                          title="Drag to reorder day"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
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
                      <CustomEditableField
                        label="Day Title"
                        value={day.title}
                        onChange={(val) => handleUpdateDay(idx, "title", val)}
                        placeholder="Day Title (e.g. Scenic Drive from Dehradun to Sankri Basecamp)"
                        inputClassName="text-base sm:text-lg font-extrabold text-slate-900"
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
                      <CustomEditableField
                        multiline
                        rows={3}
                        label="Day Narrative & Activities"
                        value={day.description}
                        onChange={(val) => handleUpdateDay(idx, "description", val)}
                        placeholder="Detailed activities, viewpoints, mountain trail terrain, resting points, and highlights..."
                      />
                    </div>
                  </div>

                  {/* Bottom Hospitality Bar with Hotel, Room & Meal Plan Selector */}
                  <div className="bg-slate-50/95 px-5 sm:px-6 py-3.5 border-t border-slate-200/80 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Day {day.day} Hotel & Accommodation:
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setHotelPickerDayIdx(idx);
                          setHotelSearchQuery("");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                      >
                        <Building2 className="w-3 h-3" />
                        <span>🏨 Pick from Hotel Library</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Hotel / Resort Name & City
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. The Leela Goa (Cavelossim) / Apple Country Resort (Manali)"
                          value={day.hotelName || day.stay || ""}
                          onChange={(e) => {
                            handleUpdateDay(idx, "hotelName", e.target.value);
                            handleUpdateDay(idx, "stay", e.target.value);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Room Type / Category
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Deluxe Room / Valley Suite"
                          value={day.roomType || ""}
                          onChange={(e) => handleUpdateDay(idx, "roomType", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Meal Plan
                        </label>
                        <select
                          value={day.mealPlan || "MAP"}
                          onChange={(e) => handleUpdateDay(idx, "mealPlan", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                        >
                          <option value="EP">EP (Room Only)</option>
                          <option value="CP">CP (Breakfast)</option>
                          <option value="MAP">MAP (Breakfast + Dinner)</option>
                          <option value="AP">AP (All Meals: B, L, D)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Day / Activity Button - Positioned at Bottom */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t-2 border-slate-100 mt-2">
            <span className="text-xs text-slate-500 font-semibold">
              Total {formData.itinerary.length} Days / Activities configured
            </span>
            <button
              type="button"
              onClick={handleAddDay}
              className="px-5 py-2.5 bg-[#0F3A2E] hover:bg-[#14483a] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer self-end"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Day / Activity {formData.itinerary.length + 1}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Inclusions & Exclusions Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inclusions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Inclusions List ({formData.inclusions.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCustomOptionInput("");
                  setShowAddOptionModal("inclusion");
                }}
                className="text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                title="Add new inclusion and save to backend database presets"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add New to Backend</span>
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <CustomEditableField
                  compact
                  value={newInclusion}
                  onChange={(val) => setNewInclusion(cleanAsterisks(val))}
                  placeholder="Add inclusion item..."
                />
              </div>
              <button
                type="button"
                onClick={handleAddInclusion}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Add
              </button>
              {newInclusion.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    handleSaveNewOption("inclusion", newInclusion.trim());
                    setNewInclusion("");
                  }}
                  className="px-2.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1"
                  title="Save this inclusion to backend presets"
                >
                  <Save className="w-3 h-3" />
                  <span>Save to Backend</span>
                </button>
              )}
            </div>

            {/* Quick Inclusions Chips */}
            {customInclusions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 self-center">Presets:</span>
                {customInclusions.slice(-6).map((preset, pIdx) => {
                  const isAdded = formData.inclusions.includes(preset);
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        if (!isAdded) {
                          setFormData((prev) => ({ ...prev, inclusions: [...prev.inclusions, preset] }));
                        }
                      }}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        isAdded
                          ? "bg-slate-100 text-slate-400 border-slate-200"
                          : "bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      }`}
                    >
                      {isAdded ? "✓" : "+"} {preset.length > 32 ? preset.slice(0, 32) + "..." : preset}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {formData.inclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-1.5 bg-emerald-50/50 border border-emerald-100 rounded-xl"
                >
                  <CustomEditableField
                    compact
                    value={item}
                    onChange={(val) => {
                      const updated = [...formData.inclusions];
                      updated[idx] = cleanAsterisks(val);
                      setFormData({ ...formData, inclusions: updated });
                    }}
                    placeholder="Inclusion item..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInclusion(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                    title="Remove inclusion"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Exclusions List ({formData.exclusions.length})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setCustomOptionInput("");
                  setShowAddOptionModal("exclusion");
                }}
                className="text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
                title="Add new exclusion and save to backend database presets"
              >
                <Plus className="w-3 h-3" />
                <span>+ Add New to Backend</span>
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <CustomEditableField
                  compact
                  value={newExclusion}
                  onChange={(val) => setNewExclusion(cleanAsterisks(val))}
                  placeholder="Add exclusion item..."
                />
              </div>
              <button
                type="button"
                onClick={handleAddExclusion}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Add
              </button>
              {newExclusion.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    handleSaveNewOption("exclusion", newExclusion.trim());
                    setNewExclusion("");
                  }}
                  className="px-2.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1"
                  title="Save this exclusion to backend presets"
                >
                  <Save className="w-3 h-3" />
                  <span>Save to Backend</span>
                </button>
              )}
            </div>

            {/* Quick Exclusions Chips */}
            {customExclusions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 self-center">Presets:</span>
                {customExclusions.slice(-6).map((preset, pIdx) => {
                  const isAdded = formData.exclusions.includes(preset);
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => {
                        if (!isAdded) {
                          setFormData((prev) => ({ ...prev, exclusions: [...prev.exclusions, preset] }));
                        }
                      }}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        isAdded
                          ? "bg-slate-100 text-slate-400 border-slate-200"
                          : "bg-rose-50/70 text-rose-800 border-rose-200 hover:bg-rose-100"
                      }`}
                    >
                      {isAdded ? "✓" : "+"} {preset.length > 32 ? preset.slice(0, 32) + "..." : preset}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {formData.exclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-1.5 bg-rose-50/50 border border-rose-100 rounded-xl"
                >
                  <CustomEditableField
                    compact
                    value={item}
                    onChange={(val) => {
                      const updated = [...formData.exclusions];
                      updated[idx] = cleanAsterisks(val);
                      setFormData({ ...formData, exclusions: updated });
                    }}
                    placeholder="Exclusion item..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExclusion(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                    title="Remove exclusion"
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

          {/* Official Bank Account & Deposit Information Ribbon */}
          <div className="pt-2 pb-2">
            <div className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Official Company Bank Account &amp; UPI Details (Included in Client Voucher &amp; PDF)</span>
              <span className="text-[10px] text-emerald-600 font-semibold">ICICI Bank • Verified Merchant</span>
            </div>
            <ItineraryBankingDetails compact={true} showSocials={true} />
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
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Preview & Download Official Domestic Tour Itinerary PDF (Same as Website Domestic Trips)"
              >
                <Download className="w-4 h-4 text-emerald-300" />
                <span>📄 Domestic PDF Itinerary</span>
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

      {/* 1. REVISION HISTORY & VERSION RESTORE MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Itinerary Revision History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Current Version: <strong className="text-purple-700">v{formData.version || 1}</strong> • Auto-saved snapshots & version rollback
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleManualSnapshot()}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Capture an instant snapshot of current edits"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save Snapshot Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
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
                {formData.versionHistory?.length || 0} Snapshots
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {(!formData.versionHistory || formData.versionHistory.length === 0) ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs space-y-3">
                  <History className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No previous revisions recorded yet.</p>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    Data auto-saves continuously in the background into Draft. Click below to capture an immediate snapshot now.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleManualSnapshot("Initial Workspace Snapshot")}
                    className="px-4 py-2 rounded-xl bg-[#0F3A2E] hover:bg-[#0A261E] text-white font-bold text-xs shadow-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Create First Snapshot (v1)</span>
                  </button>
                </div>
              ) : (
                formData.versionHistory.map((snap, idx) => (
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
                      {snap.proposalSnapshot && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                          <span>{snap.proposalSnapshot.packageTitle}</span>
                          <span>•</span>
                          <span>{snap.proposalSnapshot.itinerary?.length || 0} Days</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">
                            ₹{(snap.proposalSnapshot.totalQuotedPrice || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreVersion(snap, snap.version)}
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
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PASTE & IMPORT PACKAGE MODAL */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ClipboardPaste className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Paste / Import Package & Itinerary
                  </h3>
                  <p className="text-xs text-slate-500">
                    Paste copied package JSON from clipboard to instantly populate all fields
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Paste JSON Payload:
              </label>
              <textarea
                rows={9}
                value={pasteJsonInput}
                onChange={(e) => setPasteJsonInput(e.target.value)}
                placeholder={'{\n  "packageTitle": "Goa Beach & Heritage Tour",\n  "destination": "Goa",\n  "itinerary": [\n    {"day": 1, "title": "North Goa Beaches", "description": "..."}\n  ]\n}'}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setPasteJsonInput(text);
                  } catch {
                    alert("Unable to read from clipboard automatically. Please paste with Ctrl+V.");
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste from Clipboard</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePastePackage}
                  className="px-4 py-2 bg-[#0F3A2E] hover:bg-[#154e3f] text-white rounded-xl text-xs font-extrabold transition shadow-xs"
                >
                  Import into Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HOTEL DIRECTORY PICKER MODAL */}
      {hotelPickerDayIdx !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Select Hotel for Day {hotelPickerDayIdx + 1}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curated hotel & resort directory across popular Indian & international destinations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHotelPickerDayIdx(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Toolbar: Search + Add Hotel to Directory */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search hotel by name or city (e.g. Goa, Manali, Munnar, Jaipur, Cherrapunji)..."
                  value={hotelSearchQuery}
                  onChange={(e) => setHotelSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAddHotelModal(!showAddHotelModal)}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddHotelModal ? "Hide Form" : "Add New Hotel to Library"}</span>
              </button>
            </div>

            {/* Add New Hotel to Directory Inline Form */}
            {showAddHotelModal && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
                <span className="text-xs font-extrabold text-emerald-950 block">
                  Add New Hotel to Directory & Assign to Day {(hotelPickerDayIdx || 0) + 1}:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Hotel / Resort Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grand Hyatt Goa / Wildflower Hall"
                      value={newHotelForm.name}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bambolim, Goa / Shimla, HP"
                      value={newHotelForm.city}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, city: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Rating / Class
                    </label>
                    <select
                      value={newHotelForm.rating}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, rating: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 cursor-pointer"
                    >
                      <option value="5-Star Luxury">5-Star Luxury</option>
                      <option value="4-Star Deluxe">4-Star Deluxe</option>
                      <option value="3-Star Standard">3-Star Standard</option>
                      <option value="2-Star Hotel">2-Star Hotel</option>
                      <option value="Guest House">Guest House</option>
                      <option value="Alpine Camp">Alpine Camp</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Room Type
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Deluxe Room / Sea View Suite"
                      value={newHotelForm.roomType}
                      onChange={(e) => setNewHotelForm({ ...newHotelForm, roomType: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddHotelModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!newHotelForm.name.trim() || !newHotelForm.city.trim()) {
                        alert("Please provide Hotel Name and City.");
                        return;
                      }
                      const hotelObj = {
                        name: cleanAsterisks(newHotelForm.name.trim()),
                        city: cleanAsterisks(newHotelForm.city.trim()),
                        rating: newHotelForm.rating,
                        roomType: cleanAsterisks(newHotelForm.roomType.trim() || "Standard Room"),
                        mealPlan: newHotelForm.mealPlan,
                      };
                      setPopularHotels((prev) => [hotelObj, ...prev]);
                      if (hotelPickerDayIdx !== null) {
                        handleSelectHotelForDay(hotelPickerDayIdx, hotelObj);
                      }
                      setShowAddHotelModal(false);
                      setNewHotelForm({
                        name: "",
                        city: "",
                        rating: "3-Star Standard",
                        roomType: "Deluxe Room",
                        mealPlan: "MAP",
                      });
                      try {
                        await fetch("/api/admin/crm/studio-options", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ type: "hotel", hotel: hotelObj }),
                        });
                        setCopiedToast(`Added "${hotelObj.name}" to directory & saved to backend!`);
                      } catch (err) {
                        console.error("Error saving hotel to backend:", err);
                        setCopiedToast(`Added "${hotelObj.name}" to directory!`);
                      }
                      setTimeout(() => setCopiedToast(""), 3000);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
                  >
                    Save Hotel & Assign
                  </button>
                </div>
              </div>
            )}

            {/* Hotel Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {popularHotels
                .filter((h) => {
                  const q = hotelSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.rating.toLowerCase().includes(q);
                })
                .map((hotel, hIdx) => (
                  <div
                    key={hIdx}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-500 transition-all flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
                    onClick={() => handleSelectHotelForDay(hotelPickerDayIdx, hotel)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {hotel.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {hotel.rating}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{hotel.city}</span>
                        </span>
                        <span>•</span>
                        <span>{hotel.roomType}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          {hotel.mealPlan} Plan
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHotelForDay(hotelPickerDayIdx, hotel);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
                    >
                      Choose Hotel
                    </button>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setHotelPickerDayIdx(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ADD NEW STUDIO OPTION MODAL (Saves to Backend API) */}
      {showAddOptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Add New{" "}
                    {showAddOptionModal === "accommodation"
                      ? "Accommodation Category"
                      : showAddOptionModal === "room"
                      ? "Room Category"
                      : showAddOptionModal === "vehicle"
                      ? "Vehicle Type"
                      : showAddOptionModal === "inclusion"
                      ? "Inclusion Preset"
                      : "Exclusion Preset"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Saves permanently to backend database & studio presets
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddOptionModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                {showAddOptionModal === "accommodation"
                  ? "Category Name (e.g. 5 star hotel, Luxury Heritage Haveli, Eco Bamboo Cottages)"
                  : showAddOptionModal === "room"
                  ? "Room Type (e.g. Suite Room, Premium Mountain View Room, Executive Room)"
                  : showAddOptionModal === "vehicle"
                  ? "Vehicle Specification (e.g. Private AC Innova Crysta, 17-Seater Force Urbania)"
                  : showAddOptionModal === "inclusion"
                  ? "Inclusion Description (e.g. Candlelight Dinner with Cake, Houseboat Shikara Ride)"
                  : "Exclusion Description (e.g. Rohtang Pass Green Permit, Personal Laundry, Heaters)"}
              </label>
              <input
                type="text"
                autoFocus
                value={customOptionInput}
                onChange={(e) => setCustomOptionInput(cleanAsterisks(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (customOptionInput.trim()) {
                      handleSaveNewOption(showAddOptionModal, customOptionInput.trim());
                    }
                  }
                }}
                placeholder="Type item name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddOptionModal(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingCustomOption || !customOptionInput.trim()}
                onClick={() => {
                  if (customOptionInput.trim()) {
                    handleSaveNewOption(showAddOptionModal, customOptionInput.trim());
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#0F3A2E] hover:bg-[#164e3f] disabled:opacity-50 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingCustomOption ? "Saving..." : "Save to Backend"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
