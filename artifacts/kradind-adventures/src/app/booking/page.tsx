"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TopBar } from "@/components/top-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Mountain,
  Compass,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Send,
  Star,
  Tag,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  Award,
  ShieldAlert,
  Clock,
  ChevronDown,
} from "lucide-react";
import type { TrekData, TrekBatch } from "@/lib/travel-data";
import { treks as defaultTreks } from "@/lib/travel-data";

function ensureBatches(trek: any): TrekBatch[] {
  if (Array.isArray(trek?.batches) && trek.batches.length > 0) {
    return trek.batches;
  }
  const isDomestic =
    (trek?.category || "").toLowerCase() === "domestic" ||
    (trek?.categories || []).some((c: string) => (c || "").toLowerCase() === "domestic") ||
    (trek?.name || "").toLowerCase().includes("tour package");

  const isIntl =
    (trek?.category || "").toLowerCase() === "international" ||
    (trek?.categories || []).some((c: string) => (c || "").toLowerCase() === "international");

  const basePrice = trek?.price || (isIntl ? 39999 : isDomestic ? 18999 : 8999);

  return [
    {
      id: 1,
      startDate: "Oct 24",
      endDate: "Oct 28, 2026",
      slotsLeft: 8,
      price: basePrice,
      status: "AVBL",
    },
    {
      id: 2,
      startDate: "Nov 07",
      endDate: "Nov 11, 2026",
      slotsLeft: 6,
      price: basePrice,
      status: "AVBL",
    },
    {
      id: 3,
      startDate: "Nov 21",
      endDate: "Nov 25, 2026",
      slotsLeft: 10,
      price: basePrice,
      status: "AVBL",
    },
    {
      id: 4,
      startDate: "Flexible / Custom Departure Date",
      endDate: "On Request",
      slotsLeft: 15,
      price: basePrice,
      status: "AVBL",
    },
  ];
}

const SEED_DESTINATIONS: TrekData[] = [
  // 🇮🇳 Domestic Tour Packages
  {
    id: "dest-rajasthan",
    name: "Rajasthan Tour Package (Jaipur, Jodhpur & Jaisalmer)",
    slug: "rajasthan",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Heritage"],
    location: "Rajasthan",
    region: "North India",
    duration: "5 Nights / 6 Days",
    difficulty: "Leisure",
    altitude: "Desert & Heritage",
    price: 24999,
    originalPrice: 29999,
    badge: "Royal Heritage",
    rating: 4.9,
    reviewCount: 164,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"],
    tagline: "Royal Forts, Opulent Palaces, Camel Safaris & Golden Sand Dunes",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Saturday", slotsLeft: 8, price: 24999, status: "AVBL" },
      { id: 2, startDate: "Nov 07", endDate: "Nov 12, 2026", slotsLeft: 6, price: 24999, status: "AVBL" },
      { id: 3, startDate: "Nov 21", endDate: "Nov 26, 2026", slotsLeft: 10, price: 24999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 24999, status: "AVBL" },
    ],
  },
  {
    id: "dest-goa",
    name: "Goa Tour Package (Beaches, Dudhsagar & Old Goa)",
    slug: "goa",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Beach"],
    location: "Goa",
    region: "West Coast India",
    duration: "4 Nights / 5 Days",
    difficulty: "Leisure",
    altitude: "Coastal Sea Level",
    price: 17999,
    originalPrice: 22999,
    badge: "Top Coastal Escape",
    rating: 4.8,
    reviewCount: 182,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"],
    tagline: "Sun-Kissed Beaches, Portuguese Architecture, Waterfalls & Sunset Cruises",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Friday", slotsLeft: 10, price: 17999, status: "AVBL" },
      { id: 2, startDate: "Nov 06", endDate: "Nov 10, 2026", slotsLeft: 8, price: 17999, status: "AVBL" },
      { id: 3, startDate: "Nov 20", endDate: "Nov 24, 2026", slotsLeft: 12, price: 17999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 17999, status: "AVBL" },
    ],
  },
  {
    id: "dest-kashmir",
    name: "Kashmir Tour Package (Srinagar, Gulmarg & Pahalgam)",
    slug: "kashmir",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Valley"],
    location: "Kashmir",
    region: "Kashmir Valley",
    duration: "5 Nights / 6 Days",
    difficulty: "Leisure",
    altitude: "Paradise on Earth",
    price: 26999,
    originalPrice: 32999,
    badge: "Paradise on Earth",
    rating: 4.9,
    reviewCount: 210,
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80"],
    tagline: "Dal Lake Houseboats, Shikara Rides, Gulmarg Gondola & Betaab Valley",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Sunday", slotsLeft: 6, price: 26999, status: "AVBL" },
      { id: 2, startDate: "Nov 08", endDate: "Nov 13, 2026", slotsLeft: 4, price: 26999, status: "AVBL" },
      { id: 3, startDate: "Nov 22", endDate: "Nov 27, 2026", slotsLeft: 8, price: 26999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 26999, status: "AVBL" },
    ],
  },
  {
    id: "dest-kerala",
    name: "Kerala Backwaters & Munnar Tea Hills Package",
    slug: "kerala",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Nature"],
    location: "Kerala",
    region: "South India",
    duration: "5 Nights / 6 Days",
    difficulty: "Leisure",
    altitude: "Tea Hills & Coastal Lagoon",
    price: 25999,
    originalPrice: 31999,
    badge: "God's Own Country",
    rating: 4.9,
    reviewCount: 195,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"],
    tagline: "Alleppey Luxury Houseboats, Munnar Mist & Thekkady Spice Plantations",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Saturday", slotsLeft: 8, price: 25999, status: "AVBL" },
      { id: 2, startDate: "Nov 07", endDate: "Nov 12, 2026", slotsLeft: 6, price: 25999, status: "AVBL" },
      { id: 3, startDate: "Nov 21", endDate: "Nov 26, 2026", slotsLeft: 10, price: 25999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 25999, status: "AVBL" },
    ],
  },
  {
    id: "dest-ladakh",
    name: "Leh Ladakh Road Trip (Nubra, Khardung La & Pangong)",
    slug: "ladakh",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Road Trip"],
    location: "Leh Ladakh",
    region: "Trans-Himalayas",
    duration: "6 Nights / 7 Days",
    difficulty: "Moderate",
    altitude: "17,582 Ft (Khardung La)",
    price: 28999,
    originalPrice: 35999,
    badge: "High Altitude Road Trip",
    rating: 4.9,
    reviewCount: 230,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"],
    tagline: "Ancient Buddhist Monasteries, Double-Humped Camels & Azure High Lakes",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Sunday", slotsLeft: 6, price: 28999, status: "AVBL" },
      { id: 2, startDate: "Nov 08", endDate: "Nov 14, 2026", slotsLeft: 5, price: 28999, status: "AVBL" },
      { id: 3, startDate: "Nov 22", endDate: "Nov 28, 2026", slotsLeft: 8, price: 28999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 28999, status: "AVBL" },
    ],
  },
  {
    id: "dest-chardham",
    name: "Char Dham Yatra (Yamunotri, Gangotri, Kedarnath, Badrinath)",
    slug: "char-dham-yatra-package-11-nights-12-days",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Pilgrimage"],
    location: "Uttarakhand",
    region: "Garhwal Himalayas",
    duration: "11 Nights / 12 Days",
    difficulty: "Moderate",
    altitude: "11,755 Ft",
    price: 36999,
    originalPrice: 44999,
    badge: "Sacred Pilgrimage",
    rating: 4.9,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"],
    tagline: "Complete holy circuit with VIP darshan coordination, sanitized stays & private transfers",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Oct 25", endDate: "Nov 05, 2026", slotsLeft: 5, price: 36999, status: "AVBL" },
      { id: 2, startDate: "Nov 05", endDate: "Nov 16, 2026", slotsLeft: 7, price: 36999, status: "AVBL" },
      { id: 3, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 36999, status: "AVBL" },
    ],
  },
  {
    id: "dest-meghalaya",
    name: "Meghalaya Northeast Explorer (Shillong, Cherrapunji & Dawki)",
    slug: "meghalaya-tour-package-5-nights-6-days",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "Nature"],
    location: "Meghalaya",
    region: "Northeast India",
    duration: "5 Nights / 6 Days",
    difficulty: "Easy to Moderate",
    altitude: "Abode of Clouds",
    price: 23999,
    originalPrice: 29999,
    badge: "Abode of Clouds",
    rating: 4.9,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80"],
    tagline: "Double Decker Living Root Bridges, Crystal Clear Umngot River & Majestic Waterfalls",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Saturday", slotsLeft: 8, price: 23999, status: "AVBL" },
      { id: 2, startDate: "Nov 07", endDate: "Nov 12, 2026", slotsLeft: 6, price: 23999, status: "AVBL" },
      { id: 3, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 23999, status: "AVBL" },
    ],
  },
  // ✈️ International Tour Packages
  {
    id: "intl-bali",
    name: "Bali Island Tour Package (Ubud, Nusa Penida & Uluwatu)",
    slug: "bali",
    category: "International",
    categories: ["International", "Holiday Package", "Island"],
    location: "Bali, Indonesia",
    region: "Southeast Asia",
    duration: "6 Nights / 7 Days",
    difficulty: "Leisure",
    altitude: "Tropical Island",
    price: 42999,
    originalPrice: 51999,
    badge: "Visa On Arrival",
    rating: 4.9,
    reviewCount: 220,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"],
    tagline: "Emerald Rice Terraces, Secret Waterfalls, Ocean Temples & Sunset Beach Clubs",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Sunday", slotsLeft: 8, price: 42999, status: "AVBL" },
      { id: 2, startDate: "Nov 08", endDate: "Nov 14, 2026", slotsLeft: 6, price: 42999, status: "AVBL" },
      { id: 3, startDate: "Nov 22", endDate: "Nov 28, 2026", slotsLeft: 10, price: 42999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 42999, status: "AVBL" },
    ],
  },
  {
    id: "intl-thailand",
    name: "Thailand Holiday Package (Phuket, Phi Phi & Bangkok)",
    slug: "thailand",
    category: "International",
    categories: ["International", "Holiday Package", "Beach"],
    location: "Phuket & Bangkok, Thailand",
    region: "Southeast Asia",
    duration: "5 Nights / 6 Days",
    difficulty: "Leisure",
    altitude: "Coastal Islands",
    price: 38999,
    originalPrice: 46999,
    badge: "Visa Free for Indians",
    rating: 4.9,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80"],
    tagline: "Speedboat Tours to Maya Bay, Golden Buddha Temples & Floating Markets",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Saturday", slotsLeft: 8, price: 38999, status: "AVBL" },
      { id: 2, startDate: "Nov 07", endDate: "Nov 12, 2026", slotsLeft: 6, price: 38999, status: "AVBL" },
      { id: 3, startDate: "Nov 21", endDate: "Nov 26, 2026", slotsLeft: 10, price: 38999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 38999, status: "AVBL" },
    ],
  },
  {
    id: "intl-dubai",
    name: "Dubai City of Superlatives (Burj Khalifa & Desert Safari)",
    slug: "dubai",
    category: "International",
    categories: ["International", "Holiday Package", "Luxury"],
    location: "Dubai, UAE",
    region: "Middle East",
    duration: "4 Nights / 5 Days",
    difficulty: "Leisure",
    altitude: "Modern Metropolis",
    price: 46999,
    originalPrice: 55999,
    badge: "Luxury Cityscape",
    rating: 4.9,
    reviewCount: 175,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"],
    tagline: "124th Floor Burj Khalifa, 4x4 Dune Bashing, Marina Dhow Dinner Cruise",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Thursday", slotsLeft: 8, price: 46999, status: "AVBL" },
      { id: 2, startDate: "Nov 05", endDate: "Nov 09, 2026", slotsLeft: 6, price: 46999, status: "AVBL" },
      { id: 3, startDate: "Nov 19", endDate: "Nov 23, 2026", slotsLeft: 10, price: 46999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 46999, status: "AVBL" },
    ],
  },
  {
    id: "intl-singapore",
    name: "Singapore Highlights & Sentosa Island Tour",
    slug: "singapore",
    category: "International",
    categories: ["International", "Holiday Package", "City & Theme Parks"],
    location: "Singapore",
    region: "Southeast Asia",
    duration: "4 Nights / 5 Days",
    difficulty: "Leisure",
    altitude: "Island City State",
    price: 49999,
    originalPrice: 59999,
    badge: "Theme Parks & City",
    rating: 4.9,
    reviewCount: 160,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80"],
    tagline: "Universal Studios, Gardens by the Bay Avatar Experience & Marina Bay Sands",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Friday", slotsLeft: 6, price: 49999, status: "AVBL" },
      { id: 2, startDate: "Nov 06", endDate: "Nov 10, 2026", slotsLeft: 5, price: 49999, status: "AVBL" },
      { id: 3, startDate: "Nov 20", endDate: "Nov 24, 2026", slotsLeft: 8, price: 49999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 49999, status: "AVBL" },
    ],
  },
  {
    id: "intl-maldives",
    name: "Maldives Luxury Overwater Lagoon Villa Retreat",
    slug: "maldives",
    category: "International",
    categories: ["International", "Holiday Package", "Luxury Villa"],
    location: "Private Island Resort, Maldives",
    region: "Indian Ocean",
    duration: "3 Nights / 4 Days",
    difficulty: "Leisure",
    altitude: "Coral Atolls",
    price: 59999,
    originalPrice: 74999,
    badge: "Luxury Overwater Stay",
    rating: 5.0,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80"],
    tagline: "All-Inclusive Speedboat Transfers, Water Villa with Sun Deck & Sunset Dolphin Cruise",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Sunday", slotsLeft: 4, price: 59999, status: "AVBL" },
      { id: 2, startDate: "Nov 08", endDate: "Nov 11, 2026", slotsLeft: 4, price: 59999, status: "AVBL" },
      { id: 3, startDate: "Nov 22", endDate: "Nov 25, 2026", slotsLeft: 6, price: 59999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 59999, status: "AVBL" },
    ],
  },
  {
    id: "intl-nepal",
    name: "Nepal Kathmandu & Pokhara Annapurna Horizons",
    slug: "nepal",
    category: "International",
    categories: ["International", "Holiday Package", "Himalayas"],
    location: "Kathmandu & Pokhara, Nepal",
    region: "Himalayas",
    duration: "5 Nights / 6 Days",
    difficulty: "Leisure",
    altitude: "Valley & Lake Views",
    price: 32999,
    originalPrice: 39999,
    badge: "No Visa Needed for Indians",
    rating: 4.8,
    reviewCount: 180,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    gallery: ["https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"],
    tagline: "Pashupatinath Temple, Boating in Phewa Lake, Sarangkot Sunrise over Annapurna",
    status: "Published",
    itinerary: [],
    batches: [
      { id: 1, startDate: "Weekly Departure", endDate: "Every Saturday", slotsLeft: 8, price: 32999, status: "AVBL" },
      { id: 2, startDate: "Nov 07", endDate: "Nov 12, 2026", slotsLeft: 6, price: 32999, status: "AVBL" },
      { id: 3, startDate: "Nov 21", endDate: "Nov 26, 2026", slotsLeft: 10, price: 32999, status: "AVBL" },
      { id: 4, startDate: "Flexible / Custom Departure Date", endDate: "On Request", slotsLeft: 15, price: 32999, status: "AVBL" },
    ],
  },
];

function destinationToTrekData(d: any): TrekData {
  const isIntl =
    (d.category || "").toLowerCase() === "international" ||
    ["bali", "thailand", "dubai", "singapore", "maldives", "nepal"].includes(
      (d.slug || "").toLowerCase(),
    );

  const price = d.price || (isIntl ? 39999 : 19999);
  return {
    id: String(d.id),
    slug: d.slug,
    name:
      d.name?.toLowerCase().includes("package") ||
      d.name?.toLowerCase().includes("tour") ||
      d.name?.toLowerCase().includes("trek")
        ? d.name
        : `${d.name} Tour Package`,
    category: isIntl ? "International" : "Domestic",
    categories: isIntl
      ? ["International", "Holiday Package", "Curated Tour"]
      : ["Domestic", "Holiday Package", "Tour Package"],
    location: d.name || "Curated Tour",
    region: d.category || (isIntl ? "International" : "India"),
    image: d.image || "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    gallery: d.gallery && d.gallery.length > 0 ? d.gallery : [d.image].filter(Boolean),
    tagline:
      d.tagline ||
      `${d.name} curated holiday package with verified stays & private transfers`,
    duration: d.duration || "5 Nights / 6 Days",
    difficulty: "Leisure",
    altitude: "Scenic Sightseeing",
    rating: 4.9,
    reviewCount: 184,
    price,
    originalPrice: d.originalPrice || price + 5000,
    badge: d.badge || (isIntl ? "International" : "Popular Domestic"),
    status: "Published",
    itinerary: (d.itinerary as any) || [],
    batches: [
      {
        id: 1,
        startDate: "Weekly Departure",
        endDate: "Every Saturday",
        slotsLeft: 8,
        price,
        status: "AVBL",
      },
      {
        id: 2,
        startDate: "Upcoming 1st – 6th",
        endDate: "Next Month",
        slotsLeft: 10,
        price,
        status: "AVBL",
      },
      {
        id: 3,
        startDate: "Upcoming 15th – 20th",
        endDate: "Next Month",
        slotsLeft: 6,
        price,
        status: "AVBL",
      },
      {
        id: 4,
        startDate: "Flexible / Custom Departure Date",
        endDate: "On Request",
        slotsLeft: 15,
        price,
        status: "AVBL",
      },
    ],
  };
}

function getInitialBookingPackages(): TrekData[] {
  const treksMap = new Map<string, TrekData>();

  // 1. Add default treks (with default batches)
  for (const t of defaultTreks) {
    if (t.status === "Published" || !t.status) {
      treksMap.set(t.slug, {
        ...(t as any),
        batches: ensureBatches(t),
        itinerary: (t.itinerary as any) || [],
      });
    }
  }

  // 2. Add seed destinations
  for (const d of SEED_DESTINATIONS) {
    if (!treksMap.has(d.slug)) {
      treksMap.set(d.slug, d);
    }
  }

  return Array.from(treksMap.values());
}

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL query params
  const paramTrek = searchParams.get("trek") || "";
  const paramPackage = searchParams.get("package") || "";
  const paramDestination = searchParams.get("destination") || "";
  const paramBatchDate = searchParams.get("date") || searchParams.get("batch") || "";
  const paramTrekkers = parseInt(searchParams.get("trekkers") || "1", 10);
  const paramMode = searchParams.get("mode") || (paramTrek || paramPackage || paramDestination ? "direct" : "direct");

  // Mode: "direct" (Book specific trek/package) vs "custom" (Plan custom trip)
  const [activeTab, setActiveTab] = useState<"direct" | "custom">("direct");

  // Data - initialized immediately with seed catalog for 0ms latency
  const [allTreks, setAllTreks] = useState<TrekData[]>(() => getInitialBookingPackages());
  const [loadingTreks, setLoadingTreks] = useState(false);

  // Direct Booking Form State
  const [selectedTrekSlug, setSelectedTrekSlug] = useState<string>("");
  const [selectedBatchDate, setSelectedBatchDate] = useState<string>("");
  const [trekkersCount, setTrekkersCount] = useState<number>(isNaN(paramTrekkers) || paramTrekkers < 1 ? 1 : paramTrekkers);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoAppliedMsg, setPromoAppliedMsg] = useState<string>("");

  // Contact details
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [specialNotes, setSpecialNotes] = useState<string>("");

  // Custom Trip Form State
  const [customDestination, setCustomDestination] = useState<string>(paramDestination || "Uttarakhand");
  const [customTravelStyle, setCustomTravelStyle] = useState<string>("Himalayan Trekking");
  const [customDuration, setCustomDuration] = useState<string>("4–6 Days");
  const [customGroupSize, setCustomGroupSize] = useState<string>("Small Group (2–5 People)");
  const [customTravelMonth, setCustomTravelMonth] = useState<string>("Upcoming Month");
  const [customBudget, setCustomBudget] = useState<string>("Comfort Standard");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submittedBooking, setSubmittedBooking] = useState<{
    bookingId: string;
    trekName: string;
    batchDate: string;
    travelers: number;
    totalAmount: number;
    customerName: string;
    phone: string;
    isCustomLead?: boolean;
  } | null>(null);

  // Fetch latest treks & destinations from API and merge
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const [treksRes, destsRes] = await Promise.all([
          fetch("/api/treks").catch(() => null),
          fetch("/api/destinations").catch(() => null),
        ]);

        const mergedMap = new Map<string, TrekData>();
        const currentSeeds = getInitialBookingPackages();
        for (const item of currentSeeds) {
          mergedMap.set(item.slug, item);
        }

        // 1. Process /api/treks
        if (treksRes && treksRes.ok) {
          const treksData = await treksRes.json();
          const list: TrekData[] = Array.isArray(treksData?.treks)
            ? treksData.treks
            : Array.isArray(treksData)
            ? treksData
            : [];

          for (const item of list) {
            if (item.status === "Published" || !item.status) {
              mergedMap.set(item.slug, {
                ...item,
                batches: ensureBatches(item),
              });
            }
          }
        }

        // 2. Process /api/destinations
        if (destsRes && destsRes.ok) {
          const destsData = await destsRes.json();
          const dList: any[] = Array.isArray(destsData) ? destsData : [];
          for (const d of dList) {
            if (d.status === "Published" || !d.status) {
              if (!mergedMap.has(d.slug)) {
                mergedMap.set(d.slug, destinationToTrekData(d));
              }
            }
          }
        }

        if (isMounted && mergedMap.size > 0) {
          setAllTreks(Array.from(mergedMap.values()));
        }
      } catch (err) {
        console.error("Failed to load catalog for booking page:", err);
      } finally {
        if (isMounted) setLoadingTreks(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine current active trek
  const selectedTrek = useMemo(() => {
    if (allTreks.length === 0) return null;

    if (selectedTrekSlug) {
      const match = allTreks.find((t) => t.slug === selectedTrekSlug);
      if (match) return match;
    }

    // Try finding by query param
    const targetQuery = (paramTrek || paramPackage || paramDestination).trim().toLowerCase();
    if (targetQuery) {
      const match = allTreks.find(
        (t) =>
          t.slug.toLowerCase() === targetQuery ||
          t.name.toLowerCase() === targetQuery ||
          t.slug.toLowerCase().includes(targetQuery) ||
          t.name.toLowerCase().includes(targetQuery)
      );
      if (match) return match;
    }

    return allTreks[0] || null;
  }, [allTreks, selectedTrekSlug, paramTrek, paramPackage, paramDestination]);

  // Sync selected trek slug
  useEffect(() => {
    if (selectedTrek && (!selectedTrekSlug || selectedTrekSlug !== selectedTrek.slug)) {
      setSelectedTrekSlug(selectedTrek.slug);
    }
  }, [selectedTrek, selectedTrekSlug]);

  // Active Batches for selected trek
  const activeBatches = useMemo(() => {
    return selectedTrek ? ensureBatches(selectedTrek) : [];
  }, [selectedTrek]);

  // Sync batch date
  useEffect(() => {
    if (paramBatchDate) {
      setSelectedBatchDate(paramBatchDate);
    } else if (selectedTrek) {
      const batches = ensureBatches(selectedTrek);
      if (batches.length > 0) {
        const firstAvailable = batches.find((b) => (b.status || "").toUpperCase() !== "FULL") || batches[0];
        setSelectedBatchDate(`${firstAvailable.startDate} – ${firstAvailable.endDate}`);
      } else {
        setSelectedBatchDate("Flexible / Custom Departure Date");
      }
    }
  }, [paramBatchDate, selectedTrek]);

  // Categorize for clean grouping in dropdown
  const { treksList, domesticList, intlList } = useMemo(() => {
    const treksGroup: TrekData[] = [];
    const domesticGroup: TrekData[] = [];
    const intlGroup: TrekData[] = [];

    for (const t of allTreks) {
      const cat = (t.category || "").toLowerCase();
      const cats = (t.categories || []).map((c) => c.toLowerCase());
      const nameLower = (t.name || "").toLowerCase();
      const slugLower = (t.slug || "").toLowerCase();

      const isIntl =
        cat === "international" ||
        cats.includes("international") ||
        ["bali", "thailand", "dubai", "singapore", "maldives", "nepal", "bhutan", "sri-lanka", "vietnam"].some(
          (k) => slugLower.includes(k) || nameLower.includes(k)
        );

      const isDomestic =
        cat === "domestic" ||
        cats.includes("domestic") ||
        cats.includes("road trip") ||
        nameLower.includes("tour package") ||
        nameLower.includes("itinerary") ||
        nameLower.includes("yatra") ||
        ["rajasthan", "kerala", "goa", "kashmir", "ladakh", "meghalaya", "spiti", "manali", "shimla", "corbett", "kainchi", "chardham", "kedarnath"].some(
          (k) => slugLower.includes(k) || nameLower.includes(k)
        );

      if (isIntl) {
        intlGroup.push(t);
      } else if (isDomestic) {
        domesticGroup.push(t);
      } else {
        treksGroup.push(t);
      }
    }

    return {
      treksList: treksGroup,
      domesticList: domesticGroup,
      intlList: intlGroup,
    };
  }, [allTreks]);

  // Pricing calculations
  const basePrice = selectedTrek ? selectedTrek.price : 8999;
  const subtotal = basePrice * trekkersCount;
  const discountAmount = Math.round(subtotal * promoDiscount);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Apply Promo
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "MONSOON2026" || code === "KRADIND20") {
      setPromoDiscount(0.2);
      setPromoAppliedMsg("Success! 20% discount applied to your expedition.");
    } else if (code === "EARLYBIRD" || code === "HIMALAYAS10") {
      setPromoDiscount(0.1);
      setPromoAppliedMsg("Success! 10% Early Bird discount applied.");
    } else {
      setPromoDiscount(0);
      setPromoAppliedMsg("Invalid code. Use 'MONSOON2026' for 20% OFF.");
    }
  };

  // Submit Direct Booking
  const handleDirectBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMessage("Please fill in your name, contact phone number, and email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          trekSlug: selectedTrek?.slug || selectedTrekSlug || "himalayan-expedition",
          batchDate: selectedBatchDate || "Upcoming Selected Batch",
          trekkersCount,
          promoCode: promoDiscount > 0 ? promoCode : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmittedBooking({
          bookingId: data.id || `KR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          trekName: selectedTrek?.name || data.trekName || "Himalayan Expedition",
          batchDate: selectedBatchDate || "Upcoming Selected Batch",
          travelers: trekkersCount,
          totalAmount,
          customerName: fullName,
          phone,
          isCustomLead: false,
        });
      } else {
        setErrorMessage(data.error || "Failed to confirm booking. Please contact our Dehradun desk directly.");
      }
    } catch {
      setErrorMessage("Network error. Please try again or reach out at +91 9797941414.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Custom Trip Inquiry
  const handleCustomTripSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email) {
      setErrorMessage("Please fill in your name, contact phone number, and email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone,
          email,
          trekInterest: `${customDestination} - ${customTravelStyle}`,
          source: "Booking Page Customizer",
          message: `[Custom Trip Plan]\nDestination: ${customDestination}\nTravel Style: ${customTravelStyle}\nDuration: ${customDuration}\nGroup Size: ${customGroupSize}\nMonth: ${customTravelMonth}\nBudget: ${customBudget}\nDeparture City: ${city || "Not provided"}\nSpecial Requests: ${specialNotes || "None"}`,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmittedBooking({
          bookingId: data.id || `LD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          trekName: `${customDestination} (${customTravelStyle})`,
          batchDate: customTravelMonth,
          travelers: parseInt(customGroupSize.replace(/[^0-9]/g, "") || "2", 10) || 2,
          totalAmount: 0,
          customerName: fullName,
          phone,
          isCustomLead: true,
        });
      } else {
        setErrorMessage(data.error || "Failed to submit plan. Please contact our Dehradun desk directly.");
      }
    } catch {
      setErrorMessage("Network error. Please try again or reach out at +91 9797941414.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70">
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-50 w-full shadow-xs">
        <TopBar />
        <Header />
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Title & Breadcrumbs */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#0F3A2E] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official KRADIND Booking Portal • Zero Booking Fees</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight brand-font">
            Secure Your Adventure Slot
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            Book certified Himalayan treks, scenic domestic holidays, or customize private group expeditions with direct ground operations support from Dehradun.
          </p>

          {/* Mode Switcher Tabs */}
          {!submittedBooking && (
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex bg-slate-200/80 p-1 rounded-2xl shadow-inner border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("direct")}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === "direct"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Mountain className="w-4 h-4 text-emerald-600" />
                  <span>Standard Trek / Tour Booking</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("custom")}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
                    activeTab === "custom"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#FF6B35]" />
                  <span>Custom Trip &amp; Group Quote</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* If Submitted: Full Confirmation View */}
        {submittedBooking ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-12 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full">
                {submittedBooking.isCustomLead ? "Inquiry Confirmed" : "Slot Reserved Successfully"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 brand-font">
                Thank You, {submittedBooking.customerName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your reservation reference has been generated and dispatched to our expedition operations team.
              </p>
            </div>

            {/* Reference Badge Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Booking Ref ID</span>
                <span className="font-mono font-black text-base text-emerald-800 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  #{submittedBooking.bookingId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Expedition / Trip</span>
                  <span className="font-extrabold text-slate-800">{submittedBooking.trekName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travel Date / Window</span>
                  <span className="font-extrabold text-slate-800">{submittedBooking.batchDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Travelers</span>
                  <span className="font-extrabold text-slate-800">{submittedBooking.travelers} Persons</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Cost</span>
                  <span className="font-black text-emerald-700">
                    {submittedBooking.totalAmount > 0 ? `₹${submittedBooking.totalAmount.toLocaleString("en-IN")}` : "Custom Quote on Request"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/919797941414?text=${encodeURIComponent(
                  `Hi KRADIND, I just booked #${submittedBooking.bookingId} for ${submittedBooking.trekName} (${submittedBooking.travelers} travelers). Please send my itinerary and preparation checklist.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20be5a] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp Desk</span>
              </a>

              <a
                href="tel:+919797941414"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Call Ground Desk (+91 9797941414)</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline cursor-pointer"
              >
                Book Another Expedition or Package
              </button>
            </div>
          </div>
        ) : (
          /* Form Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Details (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {activeTab === "direct" ? (
                /* TAB 1: DIRECT EXPEDITION BOOKING */
                <form onSubmit={handleDirectBookingSubmit} className="space-y-6">
                  {/* Step 1: Trek / Tour Selection */}
                  <div className="space-y-2">
                    <label htmlFor="booking-selected-package" className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-1.5">
                        <Mountain className="w-4 h-4 text-emerald-600" />
                        <span>1. Select Trek or Tour Package</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 normal-case">
                        {allTreks.length} packages available
                      </span>
                    </label>

                    {loadingTreks ? (
                      <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                    ) : (
                      <div className="relative">
                        <select
                          id="booking-selected-package"
                          name="selectedPackage"
                          aria-label="Select Trek or Tour Package"
                          value={selectedTrekSlug}
                          onChange={(e) => {
                            const newSlug = e.target.value;
                            setSelectedTrekSlug(newSlug);
                            const t = allTreks.find((x) => x.slug === newSlug);
                            if (t) {
                              const batches = ensureBatches(t);
                              if (batches.length > 0) {
                                const firstAvail = batches.find((b) => (b.status || "").toUpperCase() !== "FULL") || batches[0];
                                setSelectedBatchDate(`${firstAvail.startDate} – ${firstAvail.endDate}`);
                              } else {
                                setSelectedBatchDate("Flexible / Custom Departure Date");
                              }
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:border-emerald-600 appearance-none pr-10 cursor-pointer shadow-sm"
                        >
                          {treksList.length > 0 && (
                            <optgroup label="🏔️ Himalayan Treks">
                              {treksList.map((t) => (
                                <option key={t.id || t.slug} value={t.slug}>
                                  {t.name} — ₹{t.price?.toLocaleString("en-IN") || "8,999"} ({t.duration} • {t.altitude || t.location})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {domesticList.length > 0 && (
                            <optgroup label="🇮🇳 Domestic Tour Packages">
                              {domesticList.map((t) => (
                                <option key={t.id || t.slug} value={t.slug}>
                                  {t.name} — ₹{t.price?.toLocaleString("en-IN") || "18,999"} ({t.duration} • {t.location})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {intlList.length > 0 && (
                            <optgroup label="✈️ International Tour Packages">
                              {intlList.map((t) => (
                                <option key={t.id || t.slug} value={t.slug}>
                                  {t.name} — ₹{t.price?.toLocaleString("en-IN") || "38,999"} ({t.duration} • {t.location})
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Step 2: Date & Batch Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="booking-selected-batch" className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>2. Departure Batch Date</span>
                      </label>
                      <div className="relative">
                        <select
                          id="booking-selected-batch"
                          name="selectedBatch"
                          aria-label="Departure Batch Date"
                          value={selectedBatchDate}
                          onChange={(e) => setSelectedBatchDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 appearance-none pr-8 cursor-pointer"
                        >
                          {activeBatches.map((b) => (
                            <option
                              key={b.id || b.startDate}
                              value={`${b.startDate} – ${b.endDate}`}
                              disabled={(b.status || "").toUpperCase() === "FULL"}
                            >
                              {b.startDate} – {b.endDate} {b.slotsLeft ? `(${b.slotsLeft} slots left)` : ""} [{(b.status || "AVBL").toUpperCase()}]
                            </option>
                          ))}
                          <option value="Flexible / Custom Dates (Mention in Notes)">
                            Flexible / Custom Dates (Mention in Notes)
                          </option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>3. Number of Trekkers</span>
                      </label>
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setTrekkersCount((prev) => Math.max(1, prev - 1))}
                          className="w-10 py-2.5 text-base font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-black text-xs text-slate-900">
                          {trekkersCount} {trekkersCount === 1 ? "Trekker" : "Trekkers"}
                        </div>
                        <button
                          type="button"
                          onClick={() => setTrekkersCount((prev) => prev + 1)}
                          className="w-10 py-2.5 text-base font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Traveler & Contact Info */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      4. Traveler &amp; Lead Contact Details
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp / Phone Number *</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="9797941414"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">City of Departure (Optional)</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Delhi, Mumbai, Bengaluru"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Special Requests / Rental Gear / Dietary Needs (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Need trekking poles, rental shoes, or Jain meal options..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* Promo Code Strip */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2.5">
                    <Tag className="w-4 h-4 text-amber-600 shrink-0 hidden sm:block" />
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter Promo Code (e.g. MONSOON2026)"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase font-mono tracking-wider focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer"
                    >
                      Apply Code
                    </button>
                  </div>
                  {promoAppliedMsg && (
                    <p className={`text-xs font-bold ${promoDiscount > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      {promoAppliedMsg}
                    </p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#f0551d] hover:from-[#e05a26] hover:to-[#df4913] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Reservation...</span>
                    ) : (
                      <>
                        <span>Confirm &amp; Reserve Slot • ₹{totalAmount.toLocaleString("en-IN")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Zero spam guarantee. No payment deducted now — pay post confirmation via UPI/NEFT.
                  </p>
                </form>
              ) : (
                /* TAB 2: CUSTOM TRIP & GROUP QUOTE */
                <form onSubmit={handleCustomTripSubmit} className="space-y-6">
                  {/* Step 1: Destination */}
                  <div className="space-y-2">
                    <label className="block text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>1. Where would you like to travel?</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Uttarakhand",
                        "Himachal Pradesh",
                        "Kashmir",
                        "Ladakh",
                        "Rajasthan",
                        "Kerala",
                        "Goa",
                        "International / Nepal",
                      ].map((dest) => (
                        <button
                          type="button"
                          key={dest}
                          onClick={() => setCustomDestination(dest)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                            customDestination === dest
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {dest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Travel Style */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#FF6B35]" />
                      <span>2. Preferred Travel Style</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        "Himalayan Trekking",
                        "Family Leisure Vacation",
                        "Road Trip & 4x4 Safari",
                        "Weekend Camping Escape",
                        "Romantic Honeymoon",
                        "Corporate / College Group",
                      ].map((style) => (
                        <button
                          type="button"
                          key={style}
                          onClick={() => setCustomTravelStyle(style)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer ${
                            customTravelStyle === style
                              ? "bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Duration & Group Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label htmlFor="booking-custom-duration" className="block text-[11px] font-bold text-slate-700 mb-1 cursor-pointer">
                        Duration
                      </label>
                      <select
                        id="booking-custom-duration"
                        name="customDuration"
                        aria-label="Trip Duration"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="2–3 Days (Weekend)">2–3 Days (Weekend)</option>
                        <option value="4–6 Days (Standard)">4–6 Days (Standard)</option>
                        <option value="7–9 Days (Extended)">7–9 Days (Extended)</option>
                        <option value="10+ Days (Grand Circuit)">10+ Days (Grand Circuit)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="booking-custom-groupsize" className="block text-[11px] font-bold text-slate-700 mb-1 cursor-pointer">
                        Group Size
                      </label>
                      <select
                        id="booking-custom-groupsize"
                        name="customGroupSize"
                        aria-label="Group Size"
                        value={customGroupSize}
                        onChange={(e) => setCustomGroupSize(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Solo (1 Person)">Solo (1 Person)</option>
                        <option value="Couple (2 People)">Couple (2 People)</option>
                        <option value="Small Group (3–5 People)">Small Group (3–5 People)</option>
                        <option value="Large Group (6–15 People)">Large Group (6–15 People)</option>
                        <option value="Corporate / College (15+ People)">Corporate / College (15+ People)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="booking-custom-timing" className="block text-[11px] font-bold text-slate-700 mb-1 cursor-pointer">
                        Tentative Timing
                      </label>
                      <select
                        id="booking-custom-timing"
                        name="customTravelMonth"
                        aria-label="Tentative Travel Timing"
                        value={customTravelMonth}
                        onChange={(e) => setCustomTravelMonth(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-600 cursor-pointer"
                      >
                        <option value="Upcoming 2 Weeks">Upcoming 2 Weeks</option>
                        <option value="Upcoming Month">Upcoming Month</option>
                        <option value="Next 2–3 Months">Next 2–3 Months</option>
                        <option value="Later / Exploring">Later / Exploring</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 4: Contact details */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                      3. Where should we send your custom itinerary?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Priya Nair"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="9797941414"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. priya@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Departure City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Bengaluru, Pune"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Any specific preferences or sights you want included?
                      </label>
                      <textarea
                        rows={3}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="Tell us about sightseeing wishes, hotel star rating, vehicle type..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-emerald-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-[#0F3A2E] hover:bg-[#164e3f] text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Plan...</span>
                    ) : (
                      <>
                        <span>Request Custom Itinerary &amp; Transparent Quote</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: Order Summary & Trust Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Sticky Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Order Summary</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Instant Quote
                  </span>
                </div>

                {selectedTrek && (
                  <div className="space-y-3">
                    <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-900">
                      <img
                        src={selectedTrek.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"}
                        alt={selectedTrek.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-white font-black text-sm line-clamp-1">{selectedTrek.name}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Duration</span>
                        <span className="font-bold text-slate-800">{selectedTrek.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty / Altitude</span>
                        <span className="font-bold text-slate-800">{selectedTrek.difficulty} • {selectedTrek.altitude}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Rate</span>
                        <span className="font-bold text-slate-800">₹{basePrice.toLocaleString("en-IN")} / person</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Travelers</span>
                        <span className="font-bold text-slate-800">{trekkersCount}</span>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-emerald-700 font-bold">
                          <span>Promo Discount ({promoDiscount * 100}%)</span>
                          <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase">Estimated Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-800 brand-font">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">All taxes &amp; permits included</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Certified Mountain Leaders &amp; Wilderness First Responders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Zero Cancellation Fee within 48h of booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct Basecamp Support: +91 9797941414</span>
                  </div>
                </div>

                {/* Need Help Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <span className="text-xs font-black text-slate-900 block">Questions before booking?</span>
                  <p className="text-[11px] text-slate-500">
                    Connect directly with our expedition desk in Dehradun
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <a
                      href="https://wa.me/919797941414?text=Hi%20KRADIND%2C%20I%20have%20questions%20regarding%20booking"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="tel:+919797941414"
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                      <span>Call Us</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 text-sm">
            <svg className="animate-spin h-6 w-6 text-[#FF6B35]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading Booking Portal...</span>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
