"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  X,
  Compass,
} from "lucide-react";
import { MountainAtmosphere, AtmosphereMode } from "@/components/mountain-atmosphere";
import { FormattedText } from "@/components/formatted-text";

interface CarouselSlide {
  id: string;
  image: string;
  badge: string;
  title: string;
  tagline: string;
  altText: string;
  weatherMode: AtmosphereMode;
}

export interface SearchSuggestionItem {
  id: string;
  title: string;
  slug: string;
  categoryType: "trek" | "domestic" | "international";
  categoryBadge: string;
  categoryIcon: string;
  badgeClass: string;
  location: string;
  duration?: string;
  price?: number;
  image?: string;
  url: string;
  searchTokens: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "ocean-sunrise",
    image: "/ocean-sunrise.webp",
    badge: "🌅 Ocean Sunrise • Goa & Kerala Sea",
    title: "Golden Ocean Sunrise",
    tagline: "Golden sun rising over open sea waters with shimmering wave reflections",
    altText: "Domestic and international tour packages by KRAD Global in Dehradun",
    weatherMode: "sunrise",
  },
  {
    id: "himalayan-snow",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1080&q=70",
    badge: "❄️ Alpine Snow • Kedarkantha & Chopta",
    title: "Himalayan Snow Peaks",
    tagline: "High-altitude frosty alpine summits & certified winter mountaineering",
    altText: "Himalayan trekking package by KRAD Global",
    weatherMode: "snow",
  },
  {
    id: "monsoon-rain",
    image: "/monsoon-rain.webp",
    badge: "🌧️ Monsoon Rain • Storm Clouds & Falls",
    title: "Monsoon Rain & Mist",
    tagline: "Authentic monsoon rainfall, stormy mountain ridges & lush misty valleys",
    altText: "Popular India holiday destination featured by KRAD Global",
    weatherMode: "rain",
  },
  {
    id: "kerala-backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1080&q=70",
    badge: "🌴 Clear Skies • Alleppey & Munnar",
    title: "Backwaters & Palms",
    tagline: "Peaceful houseboat cruises, sunny palm groves & clear emerald tea gardens",
    altText: "Customized holiday package by KRAD Global",
    weatherMode: "clear",
  },
];

// Rich instant seed packages ensuring 0ms suggestion latency
const SEED_SUGGESTIONS: SearchSuggestionItem[] = [
  // 🏔️ HIMALAYAN TREKS
  {
    id: "trek-chopta",
    title: "Chopta Tungnath Chandrashila Trek",
    slug: "chopta-tungnath-chandrashila",
    categoryType: "trek",
    categoryBadge: "Himalayan Trek",
    categoryIcon: "🏔️",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    location: "Rudraprayag, Uttarakhand",
    duration: "3 Days / 2 Nights",
    price: 5499,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    url: "/treks/chopta-tungnath-chandrashila",
    searchTokens: "chopta tungnath chandrashila trek rudraprayag uttarakhand himalayas summit weekend 13000 ft",
  },
  {
    id: "trek-hampta",
    title: "Hampta Pass Crossover Trek",
    slug: "hampta-pass",
    categoryType: "trek",
    categoryBadge: "Himalayan Trek",
    categoryIcon: "🏔️",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    location: "Manali to Lahaul, Himachal Pradesh",
    duration: "5 Days / 4 Nights",
    price: 8999,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    url: "/treks/hampta-pass",
    searchTokens: "hampta pass crossover trek manali lahaul himachal pradesh high pass",
  },
  {
    id: "trek-kheerganga",
    title: "Kheerganga Hot Spring Trek",
    slug: "kheerganga-trek",
    categoryType: "trek",
    categoryBadge: "Himalayan Trek",
    categoryIcon: "🏔️",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    location: "Parvati Valley, Kasol, Himachal Pradesh",
    duration: "2 Days / 1 Night",
    price: 2499,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    url: "/treks/kheerganga-trek",
    searchTokens: "kheerganga hot spring trek kasol parvati valley himachal pradesh weekend",
  },
  {
    id: "trek-kedarkantha",
    title: "Kedarkantha Winter Summit Trek",
    slug: "kedarkantha-summit-trek",
    categoryType: "trek",
    categoryBadge: "Himalayan Trek",
    categoryIcon: "🏔️",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    location: "Sankri, Uttarkashi, Uttarakhand",
    duration: "5 Days / 4 Nights",
    price: 7999,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80",
    url: "/lp/kedarkantha-winter-summit",
    searchTokens: "kedarkantha winter summit snow trek sankri uttarkashi uttarakhand 12500 ft",
  },
  {
    id: "trek-harkidun",
    title: "Har Ki Dun Valley of Gods Trek",
    slug: "har-ki-dun-valley",
    categoryType: "trek",
    categoryBadge: "Himalayan Trek",
    categoryIcon: "🏔️",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    location: "Govind Pashu Vihar, Uttarakhand",
    duration: "7 Days / 6 Nights",
    price: 11499,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    url: "/treks/har-ki-dun-valley",
    searchTokens: "har ki dun valley of gods trek govind pashu vihar uttarakhand",
  },

  // 🇮🇳 DOMESTIC TOUR PACKAGES
  {
    id: "dom-kerala",
    title: "Kerala Tour Package (Munnar, Thekkady, Alleppey Houseboat)",
    slug: "kerala-tour-package-5-nights-6-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Munnar, Thekkady & Alleppey, Kerala",
    duration: "5 Nights / 6 Days",
    price: 22999,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80",
    url: "/treks/kerala-tour-package-5-nights-6-days",
    searchTokens: "kerala tour package 5 nights 6 days munnar alleppey houseboat backwaters god's own country south india",
  },
  {
    id: "dom-rajasthan",
    title: "Royal Rajasthan Tour Package (Jaipur, Jodhpur & Jaisalmer)",
    slug: "rajasthan-tour-package-6-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Jaipur, Jodhpur & Jaisalmer, Rajasthan",
    duration: "6 Days / 5 Nights",
    price: 24999,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=400&q=80",
    url: "/treks/rajasthan-tour-package-6-days",
    searchTokens: "rajasthan tour package 6 days 5 nights jaipur jodhpur jaisalmer royal forts desert camel safari dunes",
  },
  {
    id: "dom-goa",
    title: "Goa Tour Package (Beaches, Dudhsagar & Old Goa)",
    slug: "goa-tour-package-4-nights-5-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "North & South Goa, India",
    duration: "4 Nights / 5 Days",
    price: 17999,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80",
    url: "/treks/goa-tour-package-4-nights-5-days",
    searchTokens: "goa tour package 4 nights 5 days beach dudhsagar calangute baga watersports coastal cruise",
  },
  {
    id: "dom-kashmir",
    title: "Kashmir Tour Package (Srinagar Shikara, Gulmarg Gondola & Pahalgam)",
    slug: "kashmir-tour-package-5-nights-6-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Srinagar, Gulmarg & Pahalgam, Kashmir",
    duration: "5 Nights / 6 Days",
    price: 26999,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=400&q=80",
    url: "/treks/kashmir-tour-package-5-nights-6-days",
    searchTokens: "kashmir tour package 5 nights 6 days srinagar dal lake shikara gulmarg gondola pahalgam betaab valley",
  },
  {
    id: "dom-ladakh",
    title: "Leh Ladakh Itinerary (Nubra Valley, Khardung La & Pangong Tso)",
    slug: "leh-ladakh-itinerary-6-nights-7-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Leh, Nubra Valley & Pangong Tso, Ladakh",
    duration: "6 Nights / 7 Days",
    price: 28999,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    url: "/treks/leh-ladakh-itinerary-6-nights-7-days",
    searchTokens: "leh ladakh itinerary 6 nights 7 days nubra khardung la pangong tso monasteries cold desert trans-himalayas",
  },
  {
    id: "dom-kedarnath",
    title: "Kedarnath Tour Package (Haridwar, Guptkashi & Kedarnath)",
    slug: "kedarnath-tour-package-5-nights-6-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Haridwar, Guptkashi & Kedarnath, Uttarakhand",
    duration: "5 Nights / 6 Days",
    price: 19499,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80",
    url: "/treks/kedarnath-tour-package-5-nights-6-days",
    searchTokens: "kedarnath tour package 5 nights 6 days haridwar guptkashi kedarnath temple yatra devbhoomi uttarakhand",
  },
  {
    id: "dom-chardham",
    title: "Char Dham Yatra Package (Yamunotri, Gangotri, Kedarnath, Badrinath)",
    slug: "char-dham-yatra-package-11-nights-12-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Yamunotri, Gangotri, Kedarnath & Badrinath, Uttarakhand",
    duration: "11 Nights / 12 Days",
    price: 36999,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80",
    url: "/treks/char-dham-yatra-package-11-nights-12-days",
    searchTokens: "char dham yatra package 11 nights 12 days yamunotri gangotri kedarnath badrinath pilgrimage uttarakhand",
  },
  {
    id: "dom-manali",
    title: "Manali Tour Package (Solang Valley, Hadimba & Atal Tunnel)",
    slug: "manali-tour-package-4-nights-5-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Manali & Solang Valley, Himachal Pradesh",
    duration: "4 Nights / 5 Days",
    price: 16999,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    url: "/treks/manali-tour-package-4-nights-5-days",
    searchTokens: "manali tour package 4 nights 5 days solang valley hadimba temple atal tunnel himachal",
  },
  {
    id: "dom-shimla",
    title: "Shimla Tour Package (Mall Road, Kufri & Ridge)",
    slug: "shimla-tour-package-3-nights-4-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Shimla & Kufri, Himachal Pradesh",
    duration: "3 Nights / 4 Days",
    price: 12999,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    url: "/treks/shimla-tour-package-3-nights-4-days",
    searchTokens: "shimla tour package 3 nights 4 days kufri mall road ridge himachal queen of hills",
  },
  {
    id: "dom-andaman",
    title: "Andaman Tour Package (Port Blair, Havelock & Neil Island)",
    slug: "andaman-tour-package-5-nights-6-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Port Blair, Havelock & Neil Island, Andaman",
    duration: "5 Nights / 6 Days",
    price: 29999,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80",
    url: "/treks/andaman-tour-package-5-nights-6-days",
    searchTokens: "andaman tour package 5 nights 6 days port blair havelock neil island radhanagar beach scuba diving",
  },
  {
    id: "dom-meghalaya",
    title: "Meghalaya Tour Package (Shillong, Cherrapunji & Dawki River)",
    slug: "meghalaya-tour-package-5-nights-6-days",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Shillong, Cherrapunji & Dawki, Meghalaya",
    duration: "5 Nights / 6 Days",
    price: 23999,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80",
    url: "/treks/meghalaya-tour-package-5-nights-6-days",
    searchTokens: "meghalaya tour package 5 nights 6 days shillong cherrapunji dawki living root bridge northeast waterfalls",
  },
  {
    id: "dom-nainital",
    title: "Nainital Lake District & Corbett Wildlife Tour",
    slug: "jim-corbett-nainital-kainchi-dham-tour-package",
    categoryType: "domestic",
    categoryBadge: "Domestic Package",
    categoryIcon: "🇮🇳",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    location: "Jim Corbett, Nainital & Kainchi Dham, Uttarakhand",
    duration: "5 Days / 4 Nights",
    price: 18499,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80",
    url: "/treks/jim-corbett-nainital-kainchi-dham-tour-package",
    searchTokens: "jim corbett nainital kainchi dham neem karoli baba tour package safari kumaon hills",
  },

  // ✈️ INTERNATIONAL TOUR PACKAGES
  {
    id: "intl-bali",
    title: "Bali Tropical Island Package (Ubud, Nusa Penida & Uluwatu)",
    slug: "bali",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Ubud, Nusa Penida, Seminyak, Indonesia",
    duration: "6 Nights / 7 Days",
    price: 42999,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/bali",
    searchTokens: "bali tropical island package ubud nusa penida uluwatu seminyak indonesia international visa on arrival",
  },
  {
    id: "intl-thailand",
    title: "Thailand Tour Package (Phuket, Phi Phi Speedboat & Bangkok)",
    slug: "thailand",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Phuket & Bangkok, Thailand",
    duration: "5 Nights / 6 Days",
    price: 38999,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/thailand",
    searchTokens: "thailand phuket phi phi island bangkok maya bay patong beach grand palace international visa free",
  },
  {
    id: "intl-dubai",
    title: "Dubai City of Superlatives (Burj Khalifa & 4x4 Desert Safari)",
    slug: "dubai",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Downtown & Marina, Dubai, UAE",
    duration: "4 Nights / 5 Days",
    price: 46999,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/dubai",
    searchTokens: "dubai burj khalifa desert safari dhow cruise marina abu dhabi uae international",
  },
  {
    id: "intl-vietnam",
    title: "Vietnam Ha Long Bay Overnight Luxury Cruise & Hanoi",
    slug: "vietnam",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Hanoi, Ha Long Bay & Ninh Binh, Vietnam",
    duration: "5 Nights / 6 Days",
    price: 41999,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/vietnam",
    searchTokens: "vietnam ha long bay cruise hanoi ninh binh train street southeast asia international",
  },
  {
    id: "intl-singapore",
    title: "Singapore Lion City & Universal Studios Sentosa",
    slug: "singapore",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Marina Bay & Sentosa, Singapore",
    duration: "4 Nights / 5 Days",
    price: 49999,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/singapore",
    searchTokens: "singapore universal studios sentosa gardens by the bay marina bay sands changi jewel international",
  },
  {
    id: "intl-maldives",
    title: "Maldives Luxury Overwater Lagoon Villa Retreat",
    slug: "maldives",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Private Island Resort, Maldives",
    duration: "3 Nights / 4 Days",
    price: 59999,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/maldives",
    searchTokens: "maldives luxury overwater villa island private resort dolphin cruise turquoise lagoon international",
  },
  {
    id: "intl-nepal",
    title: "Nepal Kathmandu & Pokhara Annapurna Horizons",
    slug: "nepal",
    categoryType: "international",
    categoryBadge: "International Tour",
    categoryIcon: "✈️",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300",
    location: "Kathmandu & Pokhara, Nepal",
    duration: "5 Nights / 6 Days",
    price: 32999,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=80",
    url: "/destinations/nepal",
    searchTokens: "nepal kathmandu pokhara pashupatinath phewa lake annapurna sarangkot international",
  },
];

function highlightText(text: string, query: string) {
  if (!query || !query.trim()) return text;
  const q = query.trim().toLowerCase();
  const index = text.toLowerCase().indexOf(q);
  if (index === -1) return text;
  return (
    <>
      {text.substring(0, index)}
      <span className="text-[#FF6B35] font-extrabold underline decoration-orange-300">
        {text.substring(index, index + q.length)}
      </span>
      {text.substring(index + q.length)}
    </>
  );
}

export function HeroSearch({
  config,
}: {
  config?: { badge?: string; title?: string; subtitle?: string; bgImage?: string; imageAlt?: string };
}) {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState("");
  const [tripType, setTripType] = useState("All");
  const [destination, setDestination] = useState("All");
  const [season, setSeason] = useState("All");

  // Dynamic packages loaded from live API merged with seed suggestions
  const [allSuggestions, setAllSuggestions] = useState<SearchSuggestionItem[]>(SEED_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Ultra-Smooth Unified Carousel Loop (5.0s relaxed cinematic rhythm)
  const [slideIndex, setSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const LOOP_DURATION_MS = 5000;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, LOOP_DURATION_MS);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Fetch live API packages and destinations to merge with suggestions
  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        const [treksRes, destsRes] = await Promise.all([
          fetch("/api/treks").catch(() => null),
          fetch("/api/destinations").catch(() => null),
        ]);

        const merged: SearchSuggestionItem[] = [...SEED_SUGGESTIONS];
        const existingSlugs = new Set(merged.map((s) => s.slug));

        // 1. Process /api/treks
        if (treksRes && treksRes.ok) {
          const treksData = await treksRes.json();
          if (Array.isArray(treksData?.treks)) {
            for (const item of treksData.treks) {
              if (existingSlugs.has(item.slug)) continue;

              const catStr = (item.category || "").toLowerCase();
              const catsArr: string[] = Array.isArray(item.categories)
                ? item.categories.map((c: string) => c.toLowerCase())
                : [];
              const nameLower = (item.name || "").toLowerCase();

              const isDomestic =
                catStr === "domestic" ||
                catsArr.includes("domestic") ||
                nameLower.includes("tour package") ||
                nameLower.includes("itinerary") ||
                nameLower.includes("yatra");

              const isInternational =
                catStr === "international" ||
                catsArr.includes("international");

              let categoryType: "trek" | "domestic" | "international" = "trek";
              let categoryBadge = "Himalayan Trek";
              let categoryIcon = "🏔️";
              let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

              if (isInternational) {
                categoryType = "international";
                categoryBadge = "International Tour";
                categoryIcon = "✈️";
                badgeClass = "bg-indigo-100 text-indigo-900 border-indigo-300";
              } else if (isDomestic) {
                categoryType = "domestic";
                categoryBadge = "Domestic Package";
                categoryIcon = "🇮🇳";
                badgeClass = "bg-amber-100 text-amber-900 border-amber-300";
              }

              merged.push({
                id: `api-trek-${item.slug}`,
                title: item.name,
                slug: item.slug,
                categoryType,
                categoryBadge,
                categoryIcon,
                badgeClass,
                location: item.location || item.region || "India",
                duration: item.duration,
                price: item.price,
                image: item.image,
                url: `/treks/${item.slug}`,
                searchTokens: `${item.name} ${item.location} ${item.region} ${catStr} ${catsArr.join(" ")}`.toLowerCase(),
              });
              existingSlugs.add(item.slug);
            }
          }
        }

        // 2. Process /api/destinations
        if (destsRes && destsRes.ok) {
          const destsData = await destsRes.json();
          if (Array.isArray(destsData)) {
            for (const dest of destsData) {
              if (existingSlugs.has(dest.slug)) continue;

              const isInternational =
                (dest.category || "").toLowerCase() === "international" ||
                ["bali", "thailand", "dubai", "vietnam", "singapore", "maldives", "nepal"].includes(dest.slug);

              const categoryType: "trek" | "domestic" | "international" = isInternational
                ? "international"
                : "domestic";
              const categoryBadge = isInternational ? "International Tour" : "Domestic Destination";
              const categoryIcon = dest.icon || (isInternational ? "✈️" : "🇮🇳");
              const badgeClass = isInternational
                ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                : "bg-amber-100 text-amber-900 border-amber-300";

              merged.push({
                id: `api-dest-${dest.slug}`,
                title: `${dest.name} Tour Package`,
                slug: dest.slug,
                categoryType,
                categoryBadge,
                categoryIcon,
                badgeClass,
                location: dest.name,
                duration: dest.duration || "5 Nights / 6 Days",
                price: dest.price,
                image: dest.image,
                url: `/destinations/${dest.slug}`,
                searchTokens: `${dest.name} ${dest.tagline || ""} ${dest.category || ""}`.toLowerCase(),
              });
              existingSlugs.add(dest.slug);
            }
          }
        }

        if (isMounted) {
          setAllSuggestions(merged);
        }
      } catch (err) {
        console.warn("HeroSearch: live catalog loading fallback to defaults", err);
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside to close auto-suggest dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeSlide = CAROUSEL_SLIDES[slideIndex];

  const handleSelectMode = (mode: AtmosphereMode) => {
    const idx = CAROUSEL_SLIDES.findIndex((s) => s.weatherMode === mode);
    if (idx !== -1) {
      setSlideIndex(idx);
    }
  };

  const handleToggleLoop = () => {
    setIsAutoPlaying((prev) => !prev);
  };

  const badge = config?.badge || activeSlide.badge;
  const title = config?.title || "Experience the Wilderness";
  const subtitle = config?.subtitle || activeSlide.tagline;

  const handleNextSlide = () => {
    setSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setSlideIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleSelectSlide = (idx: number) => {
    setSlideIndex(idx);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("search", keyword.trim());
    if (tripType !== "All") params.set("type", tripType);
    if (destination !== "All") params.set("destination", destination);
    if (season !== "All") params.set("season", season);

    router.push(`/treks?${params.toString()}`);
  };

  // Grouped and sorted suggestions based on keyword and tripType
  const groupedSuggestions = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    // If input is focused but empty, show popular curated recommendations
    if (!query) {
      const treks = allSuggestions.filter((s) => s.categoryType === "trek").slice(0, 3);
      const domestic = allSuggestions.filter((s) => s.categoryType === "domestic").slice(0, 3);
      const international = allSuggestions.filter((s) => s.categoryType === "international").slice(0, 3);

      return {
        treks,
        domestic,
        international,
        totalCount: treks.length + domestic.length + international.length,
        isDefault: true,
      };
    }

    // Filter items matching query
    let matches = allSuggestions.filter((item) => {
      if (tripType === "Trek" && item.categoryType !== "trek") return false;
      if (tripType === "Domestic" && item.categoryType !== "domestic") return false;
      if (tripType === "International" && item.categoryType !== "international") return false;

      return (
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.searchTokens.includes(query) ||
        item.slug.toLowerCase().includes(query)
      );
    });

    // Sort: exact startsWith title comes first, then includes title, then location
    matches.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aStarts = aTitle.startsWith(query);
      const bStarts = bTitle.startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    // Group into categorized sections as requested: Treks in Treks, Domestic in Domestic, International in International
    const treks = matches.filter((s) => s.categoryType === "trek").slice(0, 4);
    const domestic = matches.filter((s) => s.categoryType === "domestic").slice(0, 4);
    const international = matches.filter((s) => s.categoryType === "international").slice(0, 4);

    return {
      treks,
      domestic,
      international,
      totalCount: treks.length + domestic.length + international.length,
      isDefault: false,
    };
  }, [keyword, tripType, allSuggestions]);

  // Flat list for smooth keyboard ArrowDown / ArrowUp navigation
  const flatSuggestions = useMemo(() => {
    return [
      ...groupedSuggestions.treks,
      ...groupedSuggestions.domestic,
      ...groupedSuggestions.international,
    ];
  }, [groupedSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setShowSuggestions(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        flatSuggestions.length > 0 ? (prev + 1) % flatSuggestions.length : -1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        flatSuggestions.length > 0
          ? (prev - 1 + flatSuggestions.length) % flatSuggestions.length
          : -1
      );
    } else if (e.key === "Enter") {
      if (activeSuggestionIndex >= 0 && flatSuggestions[activeSuggestionIndex]) {
        e.preventDefault();
        const selected = flatSuggestions[activeSuggestionIndex];
        setShowSuggestions(false);
        router.push(selected.url);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleSelectSuggestion = (item: SearchSuggestionItem) => {
    setShowSuggestions(false);
    router.push(item.url);
  };

  return (
    <section className="relative bg-[#0F3A2E] text-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 min-h-[620px] group">
      {/* 1. REAL PHOTO BACKGROUND CAROUSEL WITH BUTTERY SMOOTH CROSSFADE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {CAROUSEL_SLIDES.map((slide, idx) => {
          const isActive = slideIndex === idx;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all hero-slide-transition ${
                isActive
                  ? "opacity-100 scale-100 z-1 pointer-events-auto"
                  : "opacity-0 scale-105 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={config?.imageAlt || slide.altText || "Domestic and international tour packages by KRAD Global in Dehradun"}
                width={1080}
                height={600}
                className="w-full h-full object-cover object-center"
                loading={idx < 2 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "low"}
                decoding={idx === 0 ? "sync" : "async"}
              />
            </div>
          );
        })}
        {/* Soft atmospheric gradient allowing real photo details to be crisp, bright & vibrant */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/20 to-[#0b241d]/75 pointer-events-none" />
      </div>

      {/* 2. ATMOSPHERIC PARTICLES SYNCHRONIZED WITH ACTIVE REAL PHOTO */}
      <MountainAtmosphere
        currentMode={activeSlide.weatherMode}
        onSelectMode={handleSelectMode}
        autoLoop={isAutoPlaying}
        onToggleLoop={handleToggleLoop}
        showControls={false}
      />

      {/* 3. CAROUSEL PREV / NEXT ARROW BUTTONS */}
      <button
        type="button"
        onClick={handlePrevSlide}
        aria-label="Previous photo slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/80 backdrop-blur-md border border-white/20 text-white items-center justify-center transition shadow-xl cursor-pointer hover:scale-105 opacity-0 group-hover:opacity-100"
        title="Previous Photo Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNextSlide}
        aria-label="Next photo slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-slate-950/80 backdrop-blur-md border border-white/20 text-white items-center justify-center transition shadow-xl cursor-pointer hover:scale-105 opacity-0 group-hover:opacity-100"
        title="Next Photo Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div suppressHydrationWarning className="relative z-30 max-w-5xl mx-auto text-center space-y-6">
        {/* Animated Text Container with smooth transition */}
        <div key={activeSlide.id} className="transition-all duration-700 ease-out space-y-4 animate-in fade-in zoom-in-95">
          {/* Badge Tagline - Crisp White Frosted Badge with Logo Dark Green Text */}
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-white text-[#0F3A2E] text-xs sm:text-sm font-black px-4 sm:px-5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{badge}</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight brand-font drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {title}
          </h1>

          {/* Subtitle */}
          <div className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
            <FormattedText text={subtitle} />
          </div>
        </div>

        {/* Modern, Clean & High-Impact Floating Search Bar with Auto-Suggest Dropdown */}
        <div ref={searchContainerRef} className="pt-2 max-w-4xl mx-auto relative z-30">
          {/* Form & Floating Suggestions Anchor */}
          <div className="relative z-40">
            <form
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-slate-800 relative z-20"
            >
            {/* 1. Destination / Trek input with real-time suggestions */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full sm:w-auto">
              <label htmlFor="hero-destination-search" className="sr-only">
                Search destination or trek name
              </label>
              <Search className="w-5 h-5 text-emerald-700 shrink-0" />
              <input
                ref={inputRef}
                id="hero-destination-search"
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Where to? (e.g. Kedarkantha, Kerala, Goa, Bali, Manali)..."
                aria-label="Search destination or trek name"
                role="combobox"
                aria-autocomplete="list"
                aria-controls="hero-search-suggestions"
                aria-expanded={showSuggestions}
                autoComplete="off"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
              />
              {keyword.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setKeyword("");
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full transition"
                  title="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-slate-200" />

            {/* 2. Category Dropdown */}
            <div className="w-full sm:w-48 px-3 py-1.5 flex items-center">
              <label htmlFor="hero-trip-type" className="sr-only">
                Filter by trip category
              </label>
              <select
                id="hero-trip-type"
                value={tripType}
                onChange={(e) => {
                  setTripType(e.target.value);
                  setShowSuggestions(true);
                }}
                aria-label="Filter by trip category"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Trek">🏔️ Himalayan Treks</option>
                <option value="Domestic">🚗 Domestic Tours</option>
                <option value="International">✈️ International Trips</option>
                <option value="Weekend">⚡ Weekend Getaways</option>
              </select>
            </div>

            {/* 3. Search Button */}
            <button
              type="submit"
              aria-label="Explore Trips and search catalog"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#FF6B35] hover:bg-[#e8590c] text-white text-xs sm:text-sm font-extrabold rounded-xl sm:rounded-full shadow-lg hover:shadow-orange-500/25 transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Explore Trips</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* REAL-TIME AUTO-SUGGEST DROPDOWN */}
          {showSuggestions && (
            <div
              id="hero-search-suggestions"
              role="listbox"
              aria-label="Package suggestions"
              className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 text-left flex flex-col max-h-[460px]"
            >
              {/* Header Title */}
              <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
                  <span>
                    {groupedSuggestions.isDefault
                      ? "Popular Packages & Top Destinations"
                      : `Matching Packages (${groupedSuggestions.totalCount} found)`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                  title="Close suggestions"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Suggestions Content */}
              <div className="overflow-y-auto max-h-[380px] p-2 space-y-3 divide-y divide-slate-100">
                {/* 1. 🏔️ TREKS SECTION */}
                {groupedSuggestions.treks.length > 0 && (
                  <div className="pt-2 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between px-2.5 py-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <span>🏔️</span>
                        <span>Himalayan Treks ({groupedSuggestions.treks.length})</span>
                      </span>
                      <Link
                        href="/treks?type=Trek"
                        onClick={() => setShowSuggestions(false)}
                        className="text-[11px] font-bold text-[#FF6B35] hover:text-[#e05320] transition"
                      >
                        All Treks →
                      </Link>
                    </div>

                    {groupedSuggestions.treks.map((item) => {
                      const isSelected =
                        activeSuggestionIndex >= 0 &&
                        flatSuggestions[activeSuggestionIndex]?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectSuggestion(item)}
                          className={`flex items-center gap-3 p-2 sm:p-2.5 rounded-xl cursor-pointer transition border group ${
                            isSelected
                              ? "bg-emerald-50/90 border-emerald-300 shadow-sm"
                              : "border-transparent hover:bg-slate-50/90 hover:border-slate-200"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                🏔️
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${item.badgeClass}`}
                              >
                                {item.categoryBadge}
                              </span>
                              {item.duration && (
                                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.duration}</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate mt-0.5 group-hover:text-[#0F3A2E]">
                              {highlightText(item.title, keyword)}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{highlightText(item.location, keyword)}</span>
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            {item.price ? (
                              <div className="text-xs sm:text-sm font-black text-emerald-700">
                                ₹{item.price.toLocaleString("en-IN")}
                              </div>
                            ) : null}
                            <span className="text-[10px] font-bold text-[#FF6B35] flex items-center gap-0.5 justify-end group-hover:translate-x-0.5 transition-transform">
                              <span>View</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. 🇮🇳 DOMESTIC PACKAGES SECTION */}
                {groupedSuggestions.domestic.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="flex items-center justify-between px-2.5 py-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <span>🇮🇳</span>
                        <span>Domestic Tour Packages ({groupedSuggestions.domestic.length})</span>
                      </span>
                      <Link
                        href="/treks?type=Domestic"
                        onClick={() => setShowSuggestions(false)}
                        className="text-[11px] font-bold text-[#FF6B35] hover:text-[#e05320] transition"
                      >
                        All Domestic →
                      </Link>
                    </div>

                    {groupedSuggestions.domestic.map((item) => {
                      const isSelected =
                        activeSuggestionIndex >= 0 &&
                        flatSuggestions[activeSuggestionIndex]?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectSuggestion(item)}
                          className={`flex items-center gap-3 p-2 sm:p-2.5 rounded-xl cursor-pointer transition border group ${
                            isSelected
                              ? "bg-amber-50/90 border-amber-300 shadow-sm"
                              : "border-transparent hover:bg-slate-50/90 hover:border-slate-200"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                🚗
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${item.badgeClass}`}
                              >
                                {item.categoryBadge}
                              </span>
                              {item.duration && (
                                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.duration}</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate mt-0.5 group-hover:text-amber-900">
                              {highlightText(item.title, keyword)}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{highlightText(item.location, keyword)}</span>
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            {item.price ? (
                              <div className="text-xs sm:text-sm font-black text-amber-900">
                                ₹{item.price.toLocaleString("en-IN")}
                              </div>
                            ) : null}
                            <span className="text-[10px] font-bold text-[#FF6B35] flex items-center gap-0.5 justify-end group-hover:translate-x-0.5 transition-transform">
                              <span>View</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. ✈️ INTERNATIONAL TOURS SECTION */}
                {groupedSuggestions.international.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="flex items-center justify-between px-2.5 py-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                        <span>✈️</span>
                        <span>International Tours ({groupedSuggestions.international.length})</span>
                      </span>
                      <Link
                        href="/international-trips"
                        onClick={() => setShowSuggestions(false)}
                        className="text-[11px] font-bold text-[#FF6B35] hover:text-[#e05320] transition"
                      >
                        All International →
                      </Link>
                    </div>

                    {groupedSuggestions.international.map((item) => {
                      const isSelected =
                        activeSuggestionIndex >= 0 &&
                        flatSuggestions[activeSuggestionIndex]?.id === item.id;

                      return (
                        <div
                          key={item.id}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectSuggestion(item)}
                          className={`flex items-center gap-3 p-2 sm:p-2.5 rounded-xl cursor-pointer transition border group ${
                            isSelected
                              ? "bg-indigo-50/90 border-indigo-300 shadow-sm"
                              : "border-transparent hover:bg-slate-50/90 hover:border-slate-200"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                ✈️
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold border ${item.badgeClass}`}
                              >
                                {item.categoryBadge}
                              </span>
                              {item.duration && (
                                <span className="text-[11px] font-medium text-slate-500 flex items-center gap-0.5">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.duration}</span>
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate mt-0.5 group-hover:text-indigo-900">
                              {highlightText(item.title, keyword)}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>{highlightText(item.location, keyword)}</span>
                            </p>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            {item.price ? (
                              <div className="text-xs sm:text-sm font-black text-indigo-900">
                                ₹{item.price.toLocaleString("en-IN")}
                              </div>
                            ) : null}
                            <span className="text-[10px] font-bold text-[#FF6B35] flex items-center gap-0.5 justify-end group-hover:translate-x-0.5 transition-transform">
                              <span>View</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty State when no matches found */}
                {groupedSuggestions.totalCount === 0 && (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-lg">
                      🔍
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        No packages found matching{" "}
                        <span className="text-[#FF6B35]">"{keyword}"</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Try searching for popular treks or domestic holidays:
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {["Chopta", "Kerala", "Goa", "Bali", "Kedarkantha", "Rajasthan"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setKeyword(tag);
                            inputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Footer Action */}
              <button
                type="button"
                onClick={() => handleSearch()}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-between border-t border-slate-100 transition cursor-pointer"
              >
                <span>
                  Press Enter to explore all catalog results for{" "}
                  <span className="text-[#FF6B35]">{keyword ? `"${keyword}"` : "all trips"}</span>
                </span>
                <span className="flex items-center gap-1 text-[#FF6B35]">
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          )}
          </div>

          {/* Quick Discovery Pills (Easy 1-Tap Access) */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-white/80 font-medium text-[11px] hidden sm:inline">Popular:</span>
            {[
              { label: "🏔️ Himalayan Treks", query: "Trek", isType: true },
              { label: "🚗 Kerala Backwaters", query: "Kerala", isType: false },
              { label: "🏰 Royal Rajasthan", query: "Rajasthan", isType: false },
              { label: "⚡ Weekend Escapes", query: "Weekend", isType: true },
              { label: "✈️ International Tours", query: "International", isType: true },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                aria-label={`Discover ${tag.label}`}
                onClick={() => {
                  if (tag.isType) {
                    router.push(`/treks?type=${encodeURIComponent(tag.query)}`);
                  } else {
                    router.push(`/treks?search=${encodeURIComponent(tag.query)}`);
                  }
                }}
                className="px-4 py-2.5 min-h-[44px] inline-flex items-center rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold text-xs transition transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Subtle Carousel Dots Indicator (Accessible 44px Touch Targets) */}
          <div className="mt-5 flex items-center justify-center gap-1">
            {CAROUSEL_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className="p-2 sm:p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer group"
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    slideIndex === idx
                      ? "w-8 h-2.5 bg-white shadow-sm"
                      : "w-2.5 h-2.5 bg-white/50 group-hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

