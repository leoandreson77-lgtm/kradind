import { NextRequest, NextResponse } from "next/server";
import { readStore, writeStore } from "@/lib/cms-store";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DEFAULT_ACCOMMODATION_CATEGORIES = [
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
];

const DEFAULT_ROOM_CATEGORIES = [
  "Standard Room",
  "Deluxe Room",
  "Superior Room",
  "Premium Room",
  "Executive Room",
  "Suite Room",
];

const DEFAULT_VEHICLE_TYPES = [
  "Private AC Sedan (Dzire / Etios)",
  "Private AC Ertiga / XL6",
  "Private AC Innova Crysta",
  "Private 12-Seater Tempo Traveller",
  "Shared Mountain Bolero / Sumo",
  "Self-Drive / Not Included",
];

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = readStore();
    const studio = store.studioOptions || {};

    const accommodationCategories = Array.from(
      new Set([
        ...DEFAULT_ACCOMMODATION_CATEGORIES,
        ...(studio.accommodationCategories || []),
      ])
    );

    const roomCategories = Array.from(
      new Set([
        ...DEFAULT_ROOM_CATEGORIES,
        ...(studio.roomCategories || []),
      ])
    );

    const vehicleTypes = Array.from(
      new Set([
        ...DEFAULT_VEHICLE_TYPES,
        ...(studio.vehicleTypes || []),
      ])
    );

    const customHotels = studio.customHotels || [];
    const customInclusions = studio.customInclusions || [];
    const customExclusions = studio.customExclusions || [];

    return NextResponse.json({
      accommodationCategories,
      roomCategories,
      vehicleTypes,
      customHotels,
      customInclusions,
      customExclusions,
    });
  } catch (error) {
    console.error("Error fetching studio options:", error);
    return NextResponse.json(
      {
        accommodationCategories: DEFAULT_ACCOMMODATION_CATEGORIES,
        roomCategories: DEFAULT_ROOM_CATEGORIES,
        vehicleTypes: DEFAULT_VEHICLE_TYPES,
        customHotels: [],
        customInclusions: [],
        customExclusions: [],
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession(request);
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, hotel } = body;

    const store = readStore();
    if (!store.studioOptions) {
      store.studioOptions = {
        accommodationCategories: [...DEFAULT_ACCOMMODATION_CATEGORIES],
        roomCategories: [...DEFAULT_ROOM_CATEGORIES],
        vehicleTypes: [...DEFAULT_VEHICLE_TYPES],
        customHotels: [],
        customInclusions: [],
        customExclusions: [],
      };
    }

    if (type === "hotel") {
      if (!hotel || !hotel.name || !hotel.city) {
        return NextResponse.json(
          { error: "Hotel must include name and city" },
          { status: 400 }
        );
      }
      const hotelObj = {
        name: String(hotel.name).trim().replace(/[*_~`]/g, ""),
        city: String(hotel.city).trim().replace(/[*_~`]/g, ""),
        rating: String(hotel.rating || "3-Star Standard").trim().replace(/[*_~`]/g, ""),
        roomType: String(hotel.roomType || "Standard Room").trim().replace(/[*_~`]/g, ""),
        mealPlan: String(hotel.mealPlan || "MAP").trim().replace(/[*_~`]/g, ""),
      };
      const curHotels = store.studioOptions.customHotels || [];
      const existingIdx = curHotels.findIndex(
        (h) => h.name.toLowerCase() === hotelObj.name.toLowerCase() && h.city.toLowerCase() === hotelObj.city.toLowerCase()
      );
      if (existingIdx >= 0) {
        curHotels[existingIdx] = hotelObj;
      } else {
        curHotels.unshift(hotelObj);
      }
      store.studioOptions.customHotels = curHotels;
      writeStore(store);

      return NextResponse.json({
        success: true,
        message: `Saved hotel '${hotelObj.name}' to directory`,
        hotel: hotelObj,
        options: store.studioOptions,
      });
    }

    if (!type || !name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Invalid type or name parameter" },
        { status: 400 }
      );
    }

    const cleanName = name.trim().replace(/[*_~`]/g, "");

    if (type === "accommodation") {
      const cur = store.studioOptions.accommodationCategories || [
        ...DEFAULT_ACCOMMODATION_CATEGORIES,
      ];
      if (!cur.includes(cleanName)) {
        cur.push(cleanName);
      }
      store.studioOptions.accommodationCategories = cur;
    } else if (type === "room") {
      const cur = store.studioOptions.roomCategories || [
        ...DEFAULT_ROOM_CATEGORIES,
      ];
      if (!cur.includes(cleanName)) {
        cur.push(cleanName);
      }
      store.studioOptions.roomCategories = cur;
    } else if (type === "vehicle") {
      const cur = store.studioOptions.vehicleTypes || [
        ...DEFAULT_VEHICLE_TYPES,
      ];
      if (!cur.includes(cleanName)) {
        cur.push(cleanName);
      }
      store.studioOptions.vehicleTypes = cur;
    } else if (type === "inclusion") {
      const cur = store.studioOptions.customInclusions || [];
      if (!cur.includes(cleanName)) {
        cur.push(cleanName);
      }
      store.studioOptions.customInclusions = cur;
    } else if (type === "exclusion") {
      const cur = store.studioOptions.customExclusions || [];
      if (!cur.includes(cleanName)) {
        cur.push(cleanName);
      }
      store.studioOptions.customExclusions = cur;
    }

    writeStore(store);

    return NextResponse.json({
      success: true,
      message: `Added '${cleanName}' to ${type} options`,
      options: store.studioOptions,
    });
  } catch (error) {
    console.error("Error saving studio option:", error);
    return NextResponse.json(
      { error: "Failed to save option" },
      { status: 500 }
    );
  }
}
