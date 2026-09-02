import fs from "fs";
import path from "path";
import crypto from "crypto";

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
  altitude: string;
  meal?: string;
}

export interface TrekData {
  id: number | string;
  slug: string;
  name: string;
  location: string;
  region: string;
  image: string;
  gallery: string[];
  tagline: string;
  description: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  altitude: string;
  distance: string;
  baseCamp: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  badge: string;
  categories: string[];
  status: "Published" | "Draft";
  batches: TrekBatch[];
  itinerary: TrekItineraryDay[];
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
    treks: [
      {
        id: 1,
        slug: "kedarkantha",
        name: "Kedarkantha Summit Trek",
        location: "Uttarakhand",
        region: "Garhwal",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
        gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85"],
        tagline: "Dense pine forests, snow glades, and dramatic summit ridge.",
        description: "Kedarkantha is famous for its dramatic 360-degree summit views of Swargarohini, Bandarpoonch, and Black Peak.",
        duration: "6D / 5N",
        difficulty: "Moderate",
        altitude: "12,500 Ft",
        distance: "23 km",
        baseCamp: "Sankri",
        rating: 4.9,
        reviewCount: 280,
        price: 8999,
        originalPrice: 10999,
        badge: "Bestseller",
        categories: ["Himalayas", "Summit", "Snow"],
        status: "Published",
        batches: [
          { id: 101, startDate: "Jun 14", endDate: "Jun 18, 2026", slotsLeft: 6, price: 8999 },
          { id: 102, startDate: "Jun 28", endDate: "Jul 02, 2026", slotsLeft: 12, price: 8999 },
        ],
        itinerary: [
          { day: 1, title: "Drive to Sankri (6,400 ft)", description: "Scenic drive along Yamuna and Tons rivers.", altitude: "6,400 Ft" },
          { day: 2, title: "Sankri to Juda Ka Talab", description: "Climb through pine and maple forests to a frozen lake camp.", altitude: "9,100 Ft" },
          { day: 3, title: "Base Camp & Summit Ridge", description: "Summit push for dramatic sunrise views.", altitude: "12,500 Ft" },
        ],
      },
      {
        id: 2,
        slug: "hampta-pass",
        name: "Hampta Pass Crossover",
        location: "Himachal Pradesh",
        region: "Manali",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
        gallery: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85"],
        tagline: "A dramatic crossing from green valleys into the high desert.",
        description: "Hampta Pass is the Himalayas in one unforgettable frame: lush meadows, glacial rivers, and a warm night at Chandratal Lake.",
        duration: "5D / 4N",
        difficulty: "Moderate",
        altitude: "14,100 Ft",
        distance: "35 km",
        baseCamp: "Manali",
        rating: 4.9,
        reviewCount: 184,
        price: 11199,
        originalPrice: 13999,
        badge: "Fast filling",
        categories: ["Himalayas", "High Pass", "Monsoon"],
        status: "Published",
        batches: [
          { id: 201, startDate: "Jun 14", endDate: "Jun 18, 2026", slotsLeft: 6, price: 11199 },
          { id: 202, startDate: "Jun 28", endDate: "Jul 02, 2026", slotsLeft: 12, price: 11199 },
        ],
        itinerary: [
          { day: 1, title: "Manali to Jobra & Chika", description: "Short forest trail opening into wide alpine meadows.", altitude: "10,100 Ft" },
          { day: 2, title: "Cross Hampta Pass to Shea Goru", description: "Snowfields and 14,100 Ft pass.", altitude: "14,100 Ft" },
        ],
      },
      {
        id: 3,
        slug: "nag-tibba",
        name: "Nag Tibba Weekend Summit",
        location: "Uttarakhand",
        region: "Dehradun",
        image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85",
        gallery: ["https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=85"],
        tagline: "A first Himalayan summit, just a night bus away.",
        description: "Walk through cedar forests, sleep under stars, and catch sunrise over five ranges.",
        duration: "2D / 1N",
        difficulty: "Easy",
        altitude: "9,915 Ft",
        distance: "16 km",
        baseCamp: "Pantwari",
        rating: 4.8,
        reviewCount: 327,
        price: 2899,
        originalPrice: 3899,
        badge: "Friday night bus",
        categories: ["Weekend", "Beginner", "Himalayas"],
        status: "Published",
        batches: [
          { id: 301, startDate: "Jun 06", endDate: "Jun 07, 2026", slotsLeft: 8, price: 2899 },
        ],
        itinerary: [
          { day: 1, title: "Dehradun to Pantwari & Camp", description: "Forest climb into campsite.", altitude: "8,500 Ft" },
          { day: 2, title: "Summit Sunrise & Return", description: "Catch summit sunrise and descend.", altitude: "9,915 Ft" },
        ],
      },
      {
        id: 4,
        slug: "valley-of-flowers",
        name: "Valley of Flowers & Hemkund",
        location: "Uttarakhand",
        region: "Govindghat",
        image: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1600&q=85",
        gallery: ["https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1600&q=85"],
        tagline: "A living carpet of alpine blooms beneath Nanda Devi.",
        description: "Every monsoon, the Valley of Flowers turns into a surreal high-altitude garden with 500+ wildflowers.",
        duration: "6D / 5N",
        difficulty: "Moderate",
        altitude: "14,107 Ft",
        distance: "38 km",
        baseCamp: "Govindghat",
        rating: 4.9,
        reviewCount: 216,
        price: 9999,
        originalPrice: 12499,
        badge: "Monsoon special",
        categories: ["Monsoon", "Wildflowers", "Himalayas"],
        status: "Published",
        batches: [
          { id: 401, startDate: "Jul 04", endDate: "Jul 09, 2026", slotsLeft: 10, price: 9999 },
        ],
        itinerary: [
          { day: 1, title: "Govindghat to Ghangaria", description: "Follow the Pushpawati river.", altitude: "10,000 Ft" },
          { day: 2, title: "Explore Valley of Flowers", description: "Full day in the blooming valley.", altitude: "12,700 Ft" },
        ],
      },
      {
        id: 5,
        slug: "triund",
        name: "Triund Ridge & Snowline",
        location: "Himachal Pradesh",
        region: "McLeod Ganj",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85",
        gallery: ["https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85"],
        tagline: "Big views, little effort, zero reason to stay in.",
        description: "An easy weekend trek under the towering Dhauladhar mountains with panoramic sunset views.",
        duration: "2D / 1N",
        difficulty: "Easy",
        altitude: "9,350 Ft",
        distance: "14 km",
        baseCamp: "McLeod Ganj",
        rating: 4.7,
        reviewCount: 403,
        price: 1999,
        originalPrice: 2990,
        badge: "Easy escape",
        categories: ["Weekend", "Beginner"],
        status: "Published",
        batches: [
          { id: 501, startDate: "Jun 06", endDate: "Jun 07, 2026", slotsLeft: 18, price: 1999 },
        ],
        itinerary: [
          { day: 1, title: "McLeod Ganj to Triund Top", description: "Climb through oak forests to camp.", altitude: "9,350 Ft" },
        ],
      },
      {
        id: 6,
        slug: "kashmir-great-lakes",
        name: "Kashmir Great Lakes",
        location: "Kashmir",
        region: "Sonamarg",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
        gallery: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85"],
        tagline: "Turquoise glacial waters across seven dramatic alpine valleys.",
        description: "Kashmir Great Lakes is renowned worldwide for its 7 emerald alpine tarns nestled under high snow-clad peaks.",
        duration: "7D / 6N",
        difficulty: "Challenging",
        altitude: "13,800 Ft",
        distance: "72 km",
        baseCamp: "Sonamarg",
        rating: 5.0,
        reviewCount: 310,
        price: 15999,
        originalPrice: 18999,
        badge: "Pristine",
        categories: ["High Pass", "Himalayas"],
        status: "Published",
        batches: [
          { id: 601, startDate: "Jul 11", endDate: "Jul 17, 2026", slotsLeft: 5, price: 15999 },
        ],
        itinerary: [
          { day: 1, title: "Sonamarg to Nichnai", description: "Trek through silver birch woods.", altitude: "11,500 Ft" },
        ],
      },
    ],
    trailReports: [
      {
        id: 1,
        trail: "Kedarkantha (Sankri)",
        region: "Uttarakhand",
        status: "open",
        temperature: "2°C Night",
        weather: "Clear Skies",
        updatedAt: "10 min ago",
        note: "Clear skies and stable summit conditions.",
      },
      {
        id: 2,
        trail: "Hampta Pass (Jobra)",
        region: "Himachal Pradesh",
        status: "active",
        temperature: "8°C",
        weather: "Monsoon Green",
        updatedAt: "25 min ago",
        note: "River crossing is clear and well-guided.",
      },
      {
        id: 3,
        trail: "Pin Bhaba Pass",
        region: "Himachal Pradesh",
        status: "caution",
        temperature: "1°C",
        weather: "High Altitude Winds",
        updatedAt: "40 min ago",
        note: "High altitude clearance checked by trek leaders.",
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
