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

export interface LandingPageHighlight {
  title: string;
  desc: string;
  icon?: string;
}

export interface LandingPageFAQ {
  question: string;
  answer: string;
}

export interface LandingPageTestimonial {
  name: string;
  city: string;
  text: string;
  rating: number;
  batch: string;
}

export interface LandingPageData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  heroImage: string;
  promoOffer?: {
    tag: string;
    discountText: string;
    code: string;
    expiryDate?: string;
  };
  highlights: LandingPageHighlight[];
  featuredTrekSlugs: string[];
  inclusions: string[];
  exclusions?: string[];
  leadFormConfig: {
    title: string;
    subtitle: string;
    ctaText: string;
  };
  whatsappNumber?: string;
  whatsappMessage?: string;
  faqs?: LandingPageFAQ[];
  testimonials?: LandingPageTestimonial[];
  status: "Published" | "Draft";
  sectionsEnabled: {
    hero: boolean;
    countdown: boolean;
    highlights: boolean;
    treks: boolean;
    inclusions: boolean;
    leadForm: boolean;
    testimonials: boolean;
    faqs: boolean;
  };
  createdAt: string;
  updatedAt: string;
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
  landingPages: LandingPageData[];
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

export function getDefaultLandingPages(): LandingPageData[] {
  return [
    {
      id: "lp-kedarkantha-winter-2026",
      slug: "kedarkantha-winter-summit",
      title: "Kedarkantha Winter Summit Expedition 2026",
      subtitle: "Step into an ethereal winter wonderland. Experience 360° summit panoramas of 13 Himalayan giants, guaranteed fresh snow trails, luxury 4-season heated basecamps, and 100% certified mountaineers.",
      badge: "🔥 LIMITED 2026 WINTER DEPARTURES • 4.9★ RATED",
      heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "WINTER SUMMIT PASS",
        discountText: "Flat ₹2,500 OFF Early Bird Discount",
        code: "WINTER2026",
        expiryDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      },
      highlights: [
        {
          title: "12,500 ft Himalayan Summit",
          desc: "Unmatched 360° views of Swargarohini, Black Peak, and Bandarpoonch massifs.",
          icon: "Mountain",
        },
        {
          title: "Knee-Deep Fresh Snow Trail",
          desc: "The undisputed queen of Indian winter treks through dense snow-covered pine forests.",
          icon: "Snowflake",
        },
        {
          title: "Certified Mountaineering Guides",
          desc: "NIM / HMI certified alpine expedition leaders with pulse oximeters and medical oxygen.",
          icon: "ShieldCheck",
        },
        {
          title: "Wholesome Hot Mountain Feasts",
          desc: "3 fresh nutritious meals daily plus hot garlic soups and evening hot chocolate.",
          icon: "Flame",
        },
      ],
      featuredTrekSlugs: ["kedarkantha-summit-trek", "har-ki-dun-valley"],
      inclusions: [
        "All accommodations in 4-season Alpine Tents (Twin/Triple Sharing) with thermal foam mats",
        "All nutritious hot meals from Sankri basecamp to summit (Breakfast, Lunch, Evening Snacks & Dinner)",
        "Certified Alpine Expedition Leader, Camp Cook, and local mountain support staff",
        "Microspikes, Snow Gaiters & Trekking Poles provided on snow sections",
        "Forest Entry Permits, Wildlife Sanctuaries & Environmental Green Fees",
        "Medical Oxygen Cylinder, Stretcher on standby & Comprehensive First-Aid kit",
      ],
      exclusions: [
        "Transportation to/from Dehradun Railway Station (Available on request via shared cab)",
        "Personal gear (Thermal layers, waterproof trekking shoes, personal backpack)",
        "Emergency medical evacuation or unforeseen landslide accommodation expenses",
      ],
      leadFormConfig: {
        title: "Claim Offer & Get Expedition Dossier",
        subtitle: "Leave your contact details to instantly receive detailed PDF itinerary, batch dates & gear checklist.",
        ctaText: "Reserve Early-Bird Slot",
      },
      whatsappNumber: "917500222141",
      whatsappMessage: "Hi KRADIND! I want to book my slot for the Kedarkantha Winter Summit 2026 expedition.",
      faqs: [
        {
          question: "Can beginners do the Kedarkantha Winter Trek?",
          answer: "Absolutely! Kedarkantha has gradual ascent gradients and is considered one of the friendliest winter snow peaks for beginners. A baseline fitness of 30-40 min brisk walking/jogging is sufficient.",
        },
        {
          question: "How cold does it get at high camps?",
          answer: "Daytime temperatures are pleasant (8°C to 14°C) with bright sun. Night temperatures range from -2°C to -8°C. We provide sub-zero rated sleeping bags (-10°C) and high-density thermal floor insulation.",
        },
        {
          question: "What equipment do I need to carry?",
          answer: "You only need personal clothing: waterproof trekking shoes, thermals, fleece, down feather jacket, gloves, and sunglasses. Central gear like tents, sleeping bags, gaiters, and microspikes are fully provided by KRADIND.",
        },
      ],
      testimonials: [
        {
          name: "Vikram Malhotra",
          city: "New Delhi",
          text: "Summit morning at 12,500 ft was pure magic! The golden sunrise hitting Swargarohini took my breath away. The safety protocols and hot food provided by KRADIND were world-class.",
          rating: 5,
          batch: "Dec 2025 Winter Batch",
        },
        {
          name: "Dr. Sneha Kulkarni",
          city: "Pune",
          text: "As a solo trekker, I felt completely safe and cared for. Our expedition lead Ashish checked our oxygen levels twice daily. Best Himalayan experience ever!",
          rating: 5,
          batch: "Jan 2026 Batch",
        },
      ],
      status: "Published",
      sectionsEnabled: {
        hero: true,
        countdown: true,
        highlights: true,
        treks: true,
        inclusions: true,
        leadForm: true,
        testimonials: true,
        faqs: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "lp-kashmir-great-lakes-2026",
      slug: "kashmir-great-lakes",
      title: "Kashmir Great Lakes Alpine Odyssey 2026",
      subtitle: "7 High Altitude Alpine Lakes • Emerald Valleys • Gadsar Pass at 13,800 ft. Often hailed as the most beautiful alpine trek on the planet.",
      badge: "⭐ THE POSTCARD EXPEDITION OF INDIA • LIMITED BATCHES",
      heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "SUMMER EXPEDITION SPECIAL",
        discountText: "Save ₹3,000 on Group Bookings (3+ Trekkers)",
        code: "KASHMIR2026",
        expiryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
      highlights: [
        {
          title: "7 Pristine Alpine Lakes",
          desc: "Camp beside Vishansar, Kishansar, Gadsar, Satsar, Gangabal & Nundkol turquoise waters.",
          icon: "Sparkles",
        },
        {
          title: "Lush Kashmiri Valleys",
          desc: "Walk through carpeted meadows of wild yellow buttercups, iris blooms, and maple forests.",
          icon: "Compass",
        },
        {
          title: "High Mountain Passes",
          desc: "Conquer Nichnai Pass (13,100 ft) and the dramatic Gadsar Pass at 13,800 ft with alpine views.",
          icon: "Mountain",
        },
        {
          title: "Small Eco-Safe Batches",
          desc: "Capped strictly at 14 trekkers to protect sensitive fragile alpine ecosystems.",
          icon: "ShieldCheck",
        },
      ],
      featuredTrekSlugs: ["kashmir-great-lakes", "hampta-pass-crossover"],
      inclusions: [
        "7 Nights camping in pristine alpine meadows in high-grade weatherproof tents",
        "All meals prepared fresh by Kashmiri camp chefs featuring local culinary delights",
        "Certified mountain expedition leaders and local Gujjar route experts",
        "Horses / Mules for carrying central kitchen equipment, ration and safety gear",
        "All army clearances, inner-line permits, and tourist entry authorizations",
        "High altitude medical kit with portable oxygen cylinders and pulse monitors",
      ],
      exclusions: [
        "Transportation between Srinagar Airport and Sonamarg basecamp",
        "Offloading of personal backpack (Available on advance booking)",
        "Personal shopping or tips to pony handlers",
      ],
      leadFormConfig: {
        title: "Check Available Kashmir 2026 Dates",
        subtitle: "Summer batches open between July and September only. Early reservations strongly recommended.",
        ctaText: "Check Batch Availability",
      },
      whatsappNumber: "917500222141",
      whatsappMessage: "Hi KRADIND! I want to check batch availability for Kashmir Great Lakes 2026.",
      faqs: [
        {
          question: "When is the best time to do the Kashmir Great Lakes Trek?",
          answer: "The ideal window is July to early September when the alpine snow melts, revealing shimmering turquoise waters and flowering meadows.",
        },
        {
          question: "Is it safe to trek in Kashmir?",
          answer: "Yes, 100%. The KGL trail is located in a peaceful high-altitude region far from urban centers, with Army checkposts at regular intervals ensuring traveler safety.",
        },
      ],
      testimonials: [
        {
          name: "Aditya Roy",
          city: "Bengaluru",
          text: "Pictures simply don't do justice to the Kashmir Great Lakes. Waking up beside Vishansar lake was a dream. KRADIND's logistics and support team were unmatched!",
          rating: 5,
          batch: "August 2025 Batch",
        },
      ],
      status: "Published",
      sectionsEnabled: {
        hero: true,
        countdown: true,
        highlights: true,
        treks: true,
        inclusions: true,
        leadForm: true,
        testimonials: true,
        faqs: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "lp-kedarnath-tour-package",
      slug: "kedarnath-tour-package",
      title: "Kedarnath Tour Package – 6 Days / 5 Nights",
      subtitle:
        "Sacred Kedarnath Dham Pilgrimage from Delhi with private AC vehicle, Haridwar Ganga Aarti, Sonprayag transfers, comfortable stays, and complete yatra registration guidance.",
      badge: "🕉️ SACRED DHAM PILGRIMAGE 2026 • FROM DELHI",
      heroImage:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "EARLY YATRA SPECIAL",
        discountText: "Save Flat ₹3,000 on Private Group Bookings",
        code: "KEDAR2026",
        expiryDate: "2026-10-31T23:59:59.000Z",
      },
      highlights: [
        {
          title: "Private Road Transportation",
          desc: "Dedicated sanitized AC vehicle with experienced mountain driver from Delhi pickup to drop.",
          icon: "ShieldCheck",
        },
        {
          title: "16 km Kedarnath Trek Assistance",
          desc: "Guidance for Gaurikund-Kedarnath trek, plus optional pony, palki, and helicopter booking support.",
          icon: "Mountain",
        },
        {
          title: "Mandatory Registration Guidance",
          desc: "Complete support for Uttarakhand Tourist Care portal registration and biometric verification.",
          icon: "Sparkles",
        },
        {
          title: "Thoughtful Buffer Itinerary",
          desc: "Realistic driving times with rest days in Haridwar & Guptkashi instead of exhausting rushed travel.",
          icon: "Compass",
        },
      ],
      featuredTrekSlugs: ["chopta-tungnath-chandrashila", "nainital-tour-package"],
      inclusions: [
        "5 Nights comfortable accommodation on double/twin sharing (Haridwar, Guptkashi/Sitapur, Kedarnath)",
        "Daily Breakfast & Dinner (wholesome pure vegetarian meals in mountain sectors)",
        "Private AC vehicle for the entire Delhi-Haridwar-Kedarnath-Delhi circuit",
        "All toll taxes, fuel charges, state permits, and driver allowances",
        "Har Ki Pauri Ganga Aarti experience in Haridwar",
        "Complete yatra registration & trek route planning assistance",
      ],
      exclusions: [
        "Lunches and personal expenses / beverages",
        "Pony, Palki, Doli, or Porter charges on the Gaurikund trek",
        "Helicopter tickets (arranged separately on advance request)",
        "Special / VIP Darshan puja charges and personal donations",
      ],
      leadFormConfig: {
        title: "Get Kedarnath Yatra Itinerary & Quotation",
        subtitle:
          "Leave your WhatsApp number to receive complete day-by-day travel plan, hotel options, and group discounts.",
        ctaText: "Get Free Kedarnath Itinerary",
      },
      whatsappNumber: "917500222141",
      whatsappMessage:
        "Hi KRADIND! I want to plan the 6 Days / 5 Nights Kedarnath Tour Package from Delhi.",
      faqs: [
        {
          question: "How long is the Kedarnath trek?",
          answer:
            "The trek from Gaurikund to Kedarnath is approximately 16 km with a gradual uphill climb. Ponies, palkis, and helicopters are also available subject to weather and availability.",
        },
        {
          question: "Is this package suitable for senior citizens?",
          answer:
            "Yes! The 6-day itinerary includes comfortable buffer days and private vehicle travel. We also assist with pony, palki, or helicopter bookings for senior pilgrims.",
        },
        {
          question: "Is registration mandatory for Kedarnath?",
          answer:
            "Yes, official Uttarakhand Tourist Care registration is mandatory. Our team guides and assists you through the entire registration process.",
        },
      ],
      testimonials: [
        {
          name: "Sunil & Meenakshi Joshi",
          city: "Delhi NCR",
          text: "Superbly organized! Traveling with my elderly parents, we were worried about mountain driving, but the driver was exceptionally skilled and the hotels in Guptkashi were clean and warm.",
          rating: 5,
          batch: "May 2025 Yatra",
        },
        {
          name: "Rameshwar Aggarwal",
          city: "Jaipur",
          text: "Kedarnath Darshan was an unforgettable spiritual experience. The KRADIND team handled our biometric slips and registration seamlessly.",
          rating: 5,
          batch: "Oct 2025 Yatra",
        },
      ],
      status: "Published",
      sectionsEnabled: {
        hero: true,
        countdown: true,
        highlights: true,
        treks: true,
        inclusions: true,
        leadForm: true,
        testimonials: true,
        faqs: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "lp-char-dham-yatra-package",
      slug: "char-dham-yatra-package",
      title: "Char Dham Yatra Package – 12 Days / 11 Nights",
      subtitle:
        "Complete sacred pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath with private transfers, carefully selected hotels, scenic Himalayan valleys, and dedicated yatra support.",
      badge: "🙏 THE MAHA CHAR DHAM YATRA • 4 SACRED SHRINES",
      heroImage:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "CHAR DHAM 2026 OPEN",
        discountText: "Early Bird Privilege: Flat ₹5,000 Off per Family",
        code: "CHARDHAM2026",
        expiryDate: "2026-10-31T23:59:59.000Z",
      },
      highlights: [
        {
          title: "All 4 Sacred Dhams Covered",
          desc: "Complete pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath in one harmonious route.",
          icon: "Mountain",
        },
        {
          title: "Comfortable 12-Day Buffer Plan",
          desc: "Realistic mountain driving hours designed to give senior citizens and families ample rest and recovery.",
          icon: "ShieldCheck",
        },
        {
          title: "Private Sanitized Vehicles",
          desc: "Dedicated AC transport for the entire circuit from Haridwar/Rishikesh with expert mountain drivers.",
          icon: "Compass",
        },
        {
          title: "Mana Village & Ganga Aarti",
          desc: "Explore Har Ki Pauri Ganga Aarti, Devprayag sangam, Rudraprayag, and India's first village Mana.",
          icon: "Sparkles",
        },
      ],
      featuredTrekSlugs: ["chopta-tungnath-chandrashila", "hampta-pass"],
      inclusions: [
        "11 Nights accommodation in Barkot, Uttarkashi, Guptkashi/Sitapur, Kedarnath, and Badrinath/Joshimath",
        "Daily Breakfast & Dinner (wholesome pure vegetarian meals at all stops)",
        "Dedicated private vehicle for the entire 12-day circuit",
        "Driver allowances, fuel, state road taxes, and toll/parking fees",
        "Official Char Dham biometric and portal registration guidance",
        "Sightseeing to Har Ki Pauri, Devprayag, Surya Kund, and Mana Village",
      ],
      exclusions: [
        "Pony, Palki, Doli, and Porter charges for Yamunotri (6 km) & Kedarnath (16 km)",
        "Helicopter tickets (arranged on advance request)",
        "Lunch and personal laundry/beverage expenses",
        "Special puja / VIP darshan passes and temple donations",
      ],
      leadFormConfig: {
        title: "Receive 12-Day Char Dham Dossier & Pricing",
        subtitle:
          "Leave your details to get complete day-by-day itinerary, vehicle options (Innova / Tempo Traveller), and hotel tiers.",
        ctaText: "Get Free Char Dham Plan",
      },
      whatsappNumber: "917500222141",
      whatsappMessage:
        "Hi KRADIND! I want to enquire about the 12 Days / 11 Nights Char Dham Yatra Package.",
      faqs: [
        {
          question: "What is the order of visiting the Char Dhams?",
          answer:
            "The traditional clockwise circumambulation (Parikrama) starts with Yamunotri, followed by Gangotri, Kedarnath, and concludes with Badrinath.",
        },
        {
          question: "How physically demanding is the 12-day tour?",
          answer:
            "Yamunotri involves a 6 km walk and Kedarnath an approx. 16 km walk. For both Dhams, ponies, palkis, and helicopters can be arranged for those preferring not to trek.",
        },
        {
          question: "Can we start from Delhi instead of Haridwar?",
          answer:
            "Yes! We easily arrange private pickups and drops directly from Delhi Airport, railway station, or your home address.",
        },
      ],
      testimonials: [
        {
          name: "Devendra & Saroj Sharma",
          city: "Ahmedabad",
          text: "Completing Char Dham was a lifelong dream of ours. KRADIND organized the stays so well that we never felt rushed. Badrinath and Kedarnath darshans were serene and smooth.",
          rating: 5,
          batch: "Char Dham May 2025",
        },
        {
          name: "Kavita Singhania",
          city: "Kolkata",
          text: "Exceptional service! The driver was like a family member, very safe on hairpins. The food was warm, hygienic, and purely vegetarian throughout.",
          rating: 5,
          batch: "Char Dham Sep 2025",
        },
      ],
      status: "Published",
      sectionsEnabled: {
        hero: true,
        countdown: true,
        highlights: true,
        treks: true,
        inclusions: true,
        leadForm: true,
        testimonials: true,
        faqs: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "lp-do-dham-yatra-package",
      slug: "do-dham-yatra-package",
      title: "Do Dham Yatra Package – 6 Days / 5 Nights",
      subtitle:
        "Sacred Kedarnath & Badrinath Yatra with private vehicle, Devprayag & Rudraprayag sangams, Mana Village excursion, and carefully scheduled mountain travel from Haridwar/Rishikesh.",
      badge: "🚩 KEDARNATH & BADRINATH • DO DHAM YATRA",
      heroImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "DO DHAM SPECIAL",
        discountText: "Save ₹2,500 on Group Bookings (4+ Pilgrims)",
        code: "DODHAM2026",
        expiryDate: "2026-10-31T23:59:59.000Z",
      },
      highlights: [
        {
          title: "Kedarnath & Badrinath Shrines",
          desc: "Visit Lord Shiva's sacred Jyotirlinga and Lord Vishnu's holy abode in one comprehensive 6-day circuit.",
          icon: "Mountain",
        },
        {
          title: "Sacred River Confluences",
          desc: "Witness the divine confluences of Devprayag (Bhagirathi & Alaknanda) and Rudraprayag (Mandakini & Alaknanda).",
          icon: "Sparkles",
        },
        {
          title: "Mana: The First Indian Village",
          desc: "Explore Vyas Gufa, Ganesh Gufa, Bhim Pul, and Saraswati River origin near Badrinath.",
          icon: "Compass",
        },
        {
          title: "Private Sanitized Transport",
          desc: "Travel safely in private AC vehicles with experienced Garhwal mountain drivers and 24/7 on-call coordination.",
          icon: "ShieldCheck",
        },
      ],
      featuredTrekSlugs: ["chopta-tungnath-chandrashila", "hampta-pass"],
      inclusions: [
        "5 Nights accommodation in Guptkashi/Sitapur, Kedarnath, Badrinath, and Haridwar/Rishikesh",
        "Daily Breakfast and Dinner (wholesome vegetarian meals)",
        "Private transport throughout the Haridwar-Kedarnath-Badrinath-Haridwar route",
        "All toll, parking, driver charges, and state taxes",
        "Complete Do Dham registration & darshan slot coordination guidance",
      ],
      exclusions: [
        "Kedarnath trek pony, doli, or helicopter fares",
        "Lunches and personal refreshments",
        "VIP Puja passes, temple priest donations",
        "Emergency evacuation or medical insurance",
      ],
      leadFormConfig: {
        title: "Get Custom Do Dham Itinerary & Quotation",
        subtitle:
          "Tell us your preferred dates and group size. We'll send an instant WhatsApp quotation and itinerary.",
        ctaText: "Get Free Do Dham Quotation",
      },
      whatsappNumber: "917500222141",
      whatsappMessage:
        "Hi KRADIND! I'm interested in the 6 Days / 5 Nights Do Dham Yatra (Kedarnath & Badrinath).",
      faqs: [
        {
          question: "Which two temples are covered in Do Dham Yatra?",
          answer:
            "The Do Dham Yatra in Uttarakhand traditionally refers to Kedarnath Dham (Lord Shiva) and Badrinath Dham (Lord Vishnu).",
        },
        {
          question: "Can Do Dham Yatra be completed in 6 days?",
          answer:
            "Yes, 6 Days / 5 Nights is the optimal timeframe from Haridwar/Rishikesh, allowing sufficient time for darshan at both temples without rushing the mountain roads.",
        },
        {
          question: "Can we add Chopta Tungnath to this itinerary?",
          answer:
            "Yes! We can customize the itinerary to include Chopta and Tungnath (the highest Shiva temple in the world) by adding 1 extra night.",
        },
      ],
      testimonials: [
        {
          name: "Rajesh & Anupama Bansal",
          city: "Indore",
          text: "Covering both Kedarnath and Badrinath in 6 days was seamless and spiritually uplifting. Mana village was fascinating and the hotel arrangements in Guptkashi were great.",
          rating: 5,
          batch: "Do Dham June 2025",
        },
        {
          name: "Siddharth Nambiar",
          city: "Bengaluru",
          text: "The private Innova was clean and the driver was punctual and courteous throughout. Highly recommend KRADIND for Uttarakhand pilgrimages.",
          rating: 5,
          batch: "Do Dham Sep 2025",
        },
      ],
      status: "Published",
      sectionsEnabled: {
        hero: true,
        countdown: true,
        highlights: true,
        treks: true,
        inclusions: true,
        leadForm: true,
        testimonials: true,
        faqs: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
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
        note: "Moderate river crossing depth; ropes secured at Shea Goru.",
      },
      {
        id: 3,
        trail: "Valley of Flowers & Hemkund",
        region: "Chamoli, Uttarakhand",
        status: "open",
        temperature: "14°C",
        weather: "Partly Cloudy",
        updatedAt: "1 hr ago",
        note: "Brahmakamal in full bloom; stone pathways clear.",
      },
    ],
    bookings: [
      {
        id: "BK-8841",
        customerName: "Aarav Sharma",
        email: "aarav.sharma@gmail.com",
        phone: "+91 98765 43210",
        trekSlug: "kedarkantha-summit-trek",
        trekName: "Kedarkantha Summit Trek",
        batchDate: "2026-10-15",
        travelers: 2,
        totalAmount: 19000,
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
    landingPages: getDefaultLandingPages(),
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
    let updated = false;

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
      ];
      updated = true;
    }

    if (!parsed.landingPages || parsed.landingPages.length === 0) {
      parsed.landingPages = getDefaultLandingPages();
      updated = true;
    }

    if (updated) {
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
