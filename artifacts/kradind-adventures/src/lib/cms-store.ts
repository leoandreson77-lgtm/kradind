import fs from "fs";
import path from "path";
import crypto from "crypto";
import { treks as defaultTreks } from "./travel-data";

export interface TrekBatch {
  id: number;
  startDate: string;
  endDate: string;
  slotsLeft: number;
  price: number;
}

export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  distance?: string;
  altitude?: string;
  meal?: string;
  stay?: string;
}

export interface TrekData {
  id: number | string;
  slug: string;
  name: string;
  category?: string;
  categories: string[];
  location: string;
  region: string;
  image: string;
  gallery: string[];
  tagline: string;
  description?: string;
  overview?: string;
  highlights?: string[];
  duration: string;
  difficulty: string;
  altitude: string;
  distance?: string;
  baseCamp?: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  badge: string;
  status: "Published" | "Draft";
  batches: TrekBatch[];
  itinerary: TrekItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: { question: string; answer: string }[];
}

export interface TrailRadarReport {
  id: number | string;
  trail: string;
  region: string;
  status: "open" | "active" | "caution" | "closed";
  temperature: string;
  weather: string;
  updatedAt: string;
  note: string;
}

export interface HomeSectionsConfig {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    bgImage: string;
  };
  monsoon: {
    enabled: boolean;
    title: string;
    promoCode: string;
    discountPercent: number;
  };
  topBar: {
    supportPhone: string;
    leaveNoTrace: string;
  };
}

export interface BookingRecord {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  trekSlug: string;
  trekName: string;
  batchDate: string;
  travelers: number;
  totalAmount: number;
  promoCode?: string;
  discountApplied: boolean;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  trekInterest?: string;
  message: string;
  source: string;
  status: "New" | "Contacted" | "Qualified" | "Closed";
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface CMSStoreData {
  admins: AdminUser[];
  homeSections: HomeSectionsConfig;
  treks: TrekData[];
  trailReports: TrailRadarReport[];
  bookings: BookingRecord[];
  leads: LeadRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const STORE_FILE = path.resolve(DATA_DIR, "cms-store.json");

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, generatedSalt, 10000, 64, "sha512")
    .toString("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return computed === hash;
}

function getInitialStore(): CMSStoreData {
  const defaultAdmin = hashPassword("Admin@Kradind2026");

  return {
    admins: [
      {
        id: "admin-1",
        email: "admin@kradind.com",
        name: "Head of Expeditions",
        passwordHash: defaultAdmin.hash,
        salt: defaultAdmin.salt,
        createdAt: new Date().toISOString(),
      },
    ],
    homeSections: {
      hero: {
        badge: "Certified Himalayan Guides • Small Safe Batches",
        title: "Find Your Next Adventure...",
        subtitle: "Explore handpicked Himalayan treks, tropical road trips, and international backpacking circuits.",
        bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
      },
      monsoon: {
        enabled: true,
        title: "Monsoon Specials & Valley Blooms",
        promoCode: "MONSOON2026",
        discountPercent: 20,
      },
      topBar: {
        supportPhone: "+91 98765 43210",
        leaveNoTrace: "🌱 Leave No Trace Certified Operator",
      },
    },
    treks: defaultTreks as unknown as TrekData[],
    trailReports: [
      {
        id: 1,
        trail: "Chopta Tungnath Chandrashila",
        region: "Garhwal, Uttarakhand",
        status: "open",
        temperature: "7°C Summit",
        weather: "Clear Skies",
        updatedAt: "10 min ago",
        note: "Summit trail dry and fully open; crystal-clear Himalayan views.",
      },
      {
        id: 2,
        trail: "Hampta Pass Crossover",
        region: "Manali, Himachal Pradesh",
        status: "active",
        temperature: "11°C",
        weather: "Mild Breeze",
        updatedAt: "25 min ago",
        note: "Pass crossover safe, glacial streams guided with safety ropes.",
      },
      {
        id: 3,
        trail: "Kheerganga Hot Springs",
        region: "Parvati Valley, Himachal Pradesh",
        status: "open",
        temperature: "15°C",
        weather: "Sunny",
        updatedAt: "35 min ago",
        note: "Thermal bath open, trails through Nakthan fully clear.",
      },
    ],
    bookings: [
      {
        id: "KR-8849",
        customerName: "Aarav Sharma",
        email: "aarav@gmail.com",
        phone: "+91 98765 43210",
        trekSlug: "kedarkantha",
        trekName: "Kedarkantha Summit Trek",
        batchDate: "Jun 14 - Jun 18, 2026",
        travelers: 2,
        totalAmount: 17998,
        discountApplied: false,
        status: "Confirmed",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "KR-8850",
        customerName: "Priya Verma",
        email: "priya.v@outlook.com",
        phone: "+91 91234 56789",
        trekSlug: "valley-of-flowers",
        trekName: "Valley of Flowers & Hemkund",
        batchDate: "Jul 04 - Jul 09, 2026",
        travelers: 1,
        totalAmount: 7999,
        promoCode: "MONSOON2026",
        discountApplied: true,
        status: "Pending",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    leads: [
      {
        id: "LD-9021",
        name: "Rahul Verma",
        email: "rahul.verma@gmail.com",
        phone: "+91 98112 23344",
        trekInterest: "Kedarkantha Summit Trek",
        message: "Hi team, we are a group of 6 looking for a private batch in late October. Is snow gear included?",
        source: "Contact Page",
        status: "New",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: "LD-9022",
        name: "Ananya Iyer",
        email: "ananya.iyer@techindia.com",
        phone: "+91 97654 32109",
        trekInterest: "Hampta Pass Crossover",
        message: "Can beginners do the Hampta Pass crossover in July? Please share fitness prep details.",
        source: "Contact Page",
        status: "Contacted",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
    ],
  };
}

export function readStore(): CMSStoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial = getInitialStore();
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, "utf8");
    const parsed: CMSStoreData = JSON.parse(raw);
    if (!parsed.leads) {
      parsed.leads = [
        {
          id: "LD-9021",
          name: "Rahul Verma",
          email: "rahul.verma@gmail.com",
          phone: "+91 98112 23344",
          trekInterest: "Kedarkantha Summit Trek",
          message: "Hi team, we are a group of 6 looking for a private batch in late October. Is snow gear included?",
          source: "Contact Page",
          status: "New",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: "LD-9022",
          name: "Ananya Iyer",
          email: "ananya.iyer@techindia.com",
          phone: "+91 97654 32109",
          trekInterest: "Hampta Pass Crossover",
          message: "Can beginners do the Hampta Pass crossover in July? Please share fitness prep details.",
          source: "Contact Page",
          status: "Contacted",
          createdAt: new Date(Date.now() - 14400000).toISOString(),
        },
      ];
      writeStore(parsed);
    }
    return parsed;
  } catch (error) {
    console.error("Error reading CMS store:", error);
    return getInitialStore();
  }
}

export function writeStore(data: CMSStoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${STORE_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempFile, STORE_FILE);
  } catch (error) {
    console.error("Error writing CMS store:", error);
  }
}
