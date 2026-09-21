import fs from "fs";
import path from "path";
import crypto from "crypto";
import { treks as defaultTreks } from "./travel-data";
import { getDb } from "./mongodb";

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
  duration?: string;
  altitude?: string;
  meal?: string;
  stay?: string;
  activities?: string;
}

export interface TrekData {
  id: number | string;
  slug: string;
  name: string;
  file?: string;
  category?: string;
  categories: string[];
  location: string;
  region: string;
  image: string;
  imageAlt?: string;
  gallery: string[];
  tagline: string;
  description?: string;
  overview?: string;
  highlights?: string[];
  defaultHighlights?: string[];
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
  travelTips?: { title: string; desc: string }[];
  bookingPolicy?: string[];
  costFactors?: string[];
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

export interface TrustSignalItem {
  title: string;
  desc: string;
  badge?: string;
  icon?: string;
}

export interface SectionFaqItem {
  q: string;
  a: string;
}

export interface HomeSectionsConfig {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    bgImage: string;
    imageAlt?: string;
    searchPlaceholder?: string;
    popularTags?: string[];
  };
  monsoon: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    promoCode: string;
    discountPercent: number;
    badge?: string;
  };
  topBar: {
    supportPhone: string;
    leaveNoTrace: string;
    whatsappNumber?: string;
    announcementText?: string;
    announcementLink?: string;
  };
  bestTreks: {
    badge: string;
    title: string;
    subtitle: string;
    featuredSlugs: string[];
  };
  weekendTreks: {
    badge: string;
    title: string;
    subtitle: string;
    featuredSlugs: string[];
  };
  international?: {
    enabled: boolean;
    badge: string;
    title: string;
    subtitle: string;
    featuredSlugs?: string[];
  };
  eeat: {
    badge: string;
    title: string;
    role: string;
    description: string;
    lastReviewed: string;
    policyLinkText: string;
    policyLinkUrl: string;
    auditBadgeText: string;
    trustCards: TrustSignalItem[];
    faqs: SectionFaqItem[];
  };
  contactAndFooter: {
    supportEmail: string;
    supportPhone: string;
    whatsappLink: string;
    address: string;
    officeHours?: string;
    instagramUrl: string;
    facebookUrl: string;
    youtubeUrl: string;
    twitterUrl: string;
    threadsUrl: string;
    pinterestUrl: string;
    copyrightText: string;
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
  heroImageAlt?: string;
  imageAlt?: string;
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

export interface DestinationData {
  id: string | number;
  name: string;
  slug: string;
  category?: "Domestic" | "International" | "Trek" | "Heritage" | "Beach" | string;
  tagline: string;
  image: string;
  gallery?: string[];
  badge?: string;
  highlights?: string[];
  color?: string;
  icon?: string;
  status: "Published" | "Draft";
  createdAt?: string;
  updatedAt?: string;
  duration?: string;
  price?: number;
  originalPrice?: number;
  bestSeason?: string;
  pickupDrop?: string;
  suitableFor?: string;
  overview?: string;
  itinerary?: TrekItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  faqs?: { question: string; answer: string }[];
  travelTips?: string[];
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
  destinations?: DestinationData[];
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

export function getDefaultDestinations(): DestinationData[] {
  const commonInclusions = [
    "Accommodation in verified 3-Star/4-Star hotels or heritage stays on twin/triple sharing",
    "Daily wholesome Breakfast and Dinner at hotel restaurants",
    "Private AC Sedan/SUV for all airport transfers, intercity travel & sightseeing",
    "Commercial driver allowances, fuel, state road permits, toll taxes, and parking fees",
    "Pick-up and drop-off from designated Airport or Railway Station",
    "24/7 on-tour KRADIND Tour Operations assistance throughout the circuit",
  ];

  const commonExclusions = [
    "Airfare or Train tickets to and from the starting destination",
    "Daily Lunches, personal refreshments, and room service/laundry expenses",
    "Monument, museum, palace, and national park entry fees",
    "Optional adventure sports (river rafting, paragliding, ropeway, boat rides, camel safaris)",
    "Unforeseen costs due to roadblocks, weather disruptions, natural hazards or flight delays",
    "Applicable Government GST (5%)",
  ];

  return [
    {
      id: "dest-rajasthan",
      name: "Rajasthan",
      slug: "rajasthan",
      category: "Heritage",
      tagline: "Royal Forts, Opulent Palaces, Camel Safaris & Golden Sand Dunes",
      duration: "5 Nights / 6 Days",
      price: 24999,
      originalPrice: 29999,
      bestSeason: "October to March",
      pickupDrop: "Jaipur Airport / Udaipur Airport",
      suitableFor: "Families, Couples & Heritage Lovers",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
      badge: "Royal Heritage",
      highlights: ["Jaipur Amber Fort", "Jodhpur Mehrangarh", "Jaisalmer Sam Dunes", "Udaipur Lake Pichola"],
      color: "from-amber-900/80",
      icon: "🏰",
      status: "Published",
      overview: "Experience timeless regal grandeur in the land of kings. From the pink-hued palaces of Jaipur and the imposing sun fortress of Mehrangarh to the golden desert dunes of Jaisalmer and the romantic lake palaces of Udaipur, this 6-day circuit offers an unforgettable journey into royal Rajput hospitality, folk performances, and rich desert landscapes.",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Jaipur & Chokhi Dhani Cultural Village",
          description: "Arrive at Jaipur Airport/Railway Station. Meet your dedicated chauffeur and transfer to your heritage hotel. In the evening, visit Chokhi Dhani ethnic resort for authentic Rajasthani dinner, puppet shows, folk dance, and cultural festivities.",
          activities: "Airport pickup, Hotel check-in, Chokhi Dhani cultural village & Rajasthani Thali",
          meal: "Dinner included",
          stay: "Verified 3-Star Heritage Hotel",
          distance: "35 km",
          duration: "1.5 hrs",
        },
        {
          day: 2,
          title: "Jaipur Full-Day Royal Forts & City Palace Tour",
          description: "Full day sightseeing of the Pink City. Ascend the majestic Amber Fort atop an elephant or jeep. Photo stop at the picturesque Jal Mahal palace floating in Man Sagar Lake. Visit Hawa Mahal (Palace of Winds), the City Palace museum, and the UNESCO-listed Jantar Mantar observatory.",
          activities: "Amber Fort, Jal Mahal photo stop, Hawa Mahal, City Palace, Jantar Mantar",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Heritage Hotel",
          distance: "50 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Jaipur to Jodhpur via Ajmer Sharif & Pushkar Brahma Temple",
          description: "After breakfast, depart for the Blue City of Jodhpur. En route, visit the revered Ajmer Sharif Dargah and the sacred holy lake and world-famous Brahma Temple in Pushkar. Continue drive to Jodhpur and check into hotel.",
          activities: "Drive to Jodhpur, Pushkar Lake & Brahma Temple, Ajmer Sharif visit",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Jodhpur",
          distance: "330 km",
          duration: "6 hrs drive",
        },
        {
          day: 4,
          title: "Jodhpur Mehrangarh Fort to Jaisalmer Sam Sand Dunes Desert Camp",
          description: "Visit the towering Mehrangarh Fort and Jaswant Thada marble cenotaphs in Jodhpur. Drive across the Thar Desert towards the golden city of Jaisalmer. Arrive at Sam Sand Dunes, check into luxury Swiss desert tents, embark on an adventurous camel safari over rolling dunes, and enjoy evening Kalbeliya dance with bonfire.",
          activities: "Mehrangarh Fort, Jaswant Thada, Sam Dunes camel safari, Cultural folk music & bonfire",
          meal: "Breakfast & Dinner",
          stay: "Luxury Swiss Desert Tents (Sam Dunes)",
          distance: "290 km",
          duration: "5.5 hrs drive",
        },
        {
          day: 5,
          title: "Jaisalmer Living Golden Fort, Patwon Ki Haveli & Gadisar Lake",
          description: "Explore the UNESCO-listed Sonar Qila (Jaisalmer Fort) — India's only living fort inhabited by quarter of the city's population. Marvel at intricate yellow sandstone filigree work at Patwon Ki Haveli, Nathmal Ki Haveli, and spend peaceful evening hours at Gadisar Lake.",
          activities: "Jaisalmer Fort exploration, Patwon Ki Haveli, Gadisar Lake boating & bazaar shopping",
          meal: "Breakfast & Dinner",
          stay: "Boutique Heritage Hotel in Jaisalmer",
          distance: "45 km",
          duration: "Full Day",
        },
        {
          day: 6,
          title: "Jaisalmer Local Markets & Final Departure",
          description: "Relish your final breakfast in the desert city. Transfer to Jaisalmer/Jodhpur Airport or Railway Station for your onward return journey with royal memories of Rajasthan.",
          activities: "Breakfast, Souvenir shopping, Airport/Station drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "25 km",
          duration: "1 hr",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Is camel safari and desert camp included in this package?",
          answer: "Yes, 1 night stay in luxury Swiss desert tents at Sam Sand Dunes with evening camel safari and Rajasthani cultural performance is included.",
        },
        {
          question: "Can we extend this tour to include Udaipur?",
          answer: "Yes, we can seamlessly add 2 extra days for Udaipur (Lake Pichola, City Palace, Saheliyon Ki Bari) to make it an 8-day complete Rajasthan Grand Circuit.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-kerala",
      name: "Kerala",
      slug: "kerala",
      category: "Domestic",
      tagline: "God's Own Country: Rolling Tea Gardens, Spice Hills & Backwater Houseboats",
      duration: "5 Nights / 6 Days",
      price: 22999,
      originalPrice: 27999,
      bestSeason: "September to April",
      pickupDrop: "Cochin International Airport (COK)",
      suitableFor: "Honeymooners, Families & Nature Enthusiasts",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      badge: "Tropical Gem",
      highlights: ["Munnar Tea Hills", "Eravikulam National Park", "Thekkady Spice Plantation", "Alleppey Houseboat"],
      color: "from-emerald-950/80",
      icon: "🌴",
      status: "Published",
      overview: "Immerse yourself in tropical heaven where misty green hill stations give way to serene backwaters. This 6-day Kerala holiday takes you through emerald carpeted tea hills of Munnar, wild cardamom aroma of Thekkady, and a fairytale private houseboat cruise along palm-fringed lagoons in Alleppey.",
      itinerary: [
        {
          day: 1,
          title: "Cochin Arrival & Scenic Mountain Drive to Munnar",
          description: "Arrive at Cochin Airport/Station. Meet our driver-guide and drive to Munnar hill station (1,600m). Enjoy roadside vistas of gushing Cheeyappara and Valara waterfalls. Check in at your resort surrounded by tea mist.",
          activities: "Airport pickup, Cheeyappara & Valara waterfalls photo stop, Munnar check-in",
          meal: "Dinner included",
          stay: "Verified 3-Star Resort in Munnar",
          distance: "130 km",
          duration: "4 hrs drive",
        },
        {
          day: 2,
          title: "Munnar Tea Valleys, Eravikulam & Mattupetty Dam",
          description: "Full day exploration of Munnar. Visit Eravikulam National Park, home to the endangered Nilgiri Tahr. Explore the Tata Tea Museum, Mattupetty Lake & Dam, Echo Point, and stroll through aromatic Kundala tea estates.",
          activities: "Eravikulam National Park, Tea Museum tour, Mattupetty Dam boating, Echo Point",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Resort in Munnar",
          distance: "55 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Munnar to Thekkady Periyar Wildlife & Spice Plantation Tour",
          description: "Scenic winding drive to Thekkady (Periyar). Check in to hotel. In the afternoon, enjoy a guided walking tour through aromatic spice plantations (cardamom, pepper, cinnamon, vanilla). In the evening, witness traditional Kathakali dance and Kalaripayattu martial arts.",
          activities: "Drive to Thekkady, Guided Spice Garden Walk, Kathakali & Kalaripayattu evening show",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Thekkady",
          distance: "90 km",
          duration: "3 hrs drive",
        },
        {
          day: 4,
          title: "Thekkady to Alleppey Private Houseboat Backwater Cruise",
          description: "Drive to Alleppey (Alappuzha), known as the Venice of the East. Board your traditional Kerala Kettuvallam (Houseboat) at 12:00 PM. Cruise through tranquil canals, village backwaters, and paddy fields while enjoying freshly prepared authentic Kerala meals.",
          activities: "Houseboat boarding, Backwater canal cruise, Sunset over paddy lagoons",
          meal: "Lunch, Evening Tea & Snacks, Dinner",
          stay: "Private Deluxe Houseboat in Alleppey",
          distance: "140 km",
          duration: "4 hrs drive",
        },
        {
          day: 5,
          title: "Alleppey Backwaters to Cochin Fort Kochi Heritage Stroll",
          description: "Disembark from the houseboat after morning breakfast. Drive to historic Fort Kochi. Visit famous Chinese Fishing Nets, St. Francis Church (India's oldest European church), Santa Cruz Basilica, and colorful Jew Town antique shops.",
          activities: "Houseboat check-out, Fort Kochi heritage walk, Chinese Fishing Nets, Jew Town",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Cochin",
          distance: "65 km",
          duration: "2 hrs drive",
        },
        {
          day: 6,
          title: "Cochin Souvenir Shopping & Airport Departure",
          description: "Enjoy breakfast at hotel. Transfer to Cochin International Airport for return flight with rejuvenating memories of God's Own Country.",
          activities: "Breakfast, Spice & banana chips shopping, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "35 km",
          duration: "1 hr",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Is the houseboat private or shared?",
          answer: "We provide 100% private houseboats dedicated exclusively for your family/group with private bedrooms, living area, and onboard chef.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-uttarakhand",
      name: "Uttarakhand",
      slug: "uttarakhand",
      category: "Domestic",
      tagline: "Land of Gods: Sacred Alpine Meadows, Cedar Forests & Holy Ganga River",
      duration: "5 Nights / 6 Days",
      price: 18999,
      originalPrice: 23999,
      bestSeason: "April to June & September to November",
      pickupDrop: "Dehradun Airport / Haridwar Railway Station",
      suitableFor: "Trekking Enthusiasts, Families & Spiritual Explorers",
      image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
      badge: "Most Popular",
      highlights: ["Rishikesh Ganga Aarti", "Chopta Tungnath Temple", "Deoria Tal Lake", "Haridwar Har Ki Pauri"],
      color: "from-emerald-900/80",
      icon: "🏔️",
      status: "Published",
      overview: "Discover the spiritual and natural majesty of Devbhoomi Uttarakhand. Journey from the sacred ghats of Rishikesh and Haridwar to the Switzerland of India — Chopta, home to the world's highest Shiva temple at Tungnath (12,073 ft) and panoramic summit views from Chandrashila peak.",
      itinerary: [
        {
          day: 1,
          title: "Dehradun/Haridwar Arrival & Rishikesh Ganga Aarti",
          description: "Meet your tour lead at Haridwar or Dehradun. Drive to Rishikesh, check in to resort. In the evening, attend the world-renowned Divine Ganga Aarti at Triveni Ghat or Parmarth Niketan. Walk across Ram Jhula and Lakshman Jhula suspension bridges.",
          activities: "Pickup, Rishikesh check-in, Evening Ganga Aarti, Ram Jhula walk",
          meal: "Dinner included",
          stay: "Verified 3-Star Resort in Rishikesh",
          distance: "45 km",
          duration: "1.5 hrs",
        },
        {
          day: 2,
          title: "Rishikesh to Chopta Alpine Meadows via Devprayag Confluence",
          description: "Embark on a scenic mountain drive towards Chopta (8,790 ft). En route, halt at Devprayag to witness the sacred confluence of rivers Alaknanda and Bhagirathi forming the holy Ganga. Reach Chopta and settle into cozy alpine Swiss camps.",
          activities: "Drive to Chopta, Devprayag Sangam viewpoint, Sunset over Garhwal peaks",
          meal: "Breakfast & Dinner",
          stay: "Alpine Swiss Tents / Resort in Chopta",
          distance: "190 km",
          duration: "6 hrs drive",
        },
        {
          day: 3,
          title: "Chopta to Tungnath Temple & Chandrashila Summit Trek (13,100 ft)",
          description: "Early morning trek (4.5 km) through rhododendron woods to Tungnath, the 1000-year-old highest shrine among Panch Kedar. Continue steep 1 km ascent to Chandrashila summit for 360-degree views of Nanda Devi, Trishul, and Chaukhamba massifs.",
          activities: "Tungnath temple darshan, Chandrashila summit climb, Himalayan panorama",
          meal: "Breakfast & Dinner",
          stay: "Alpine Swiss Tents / Resort in Chopta",
          distance: "10 km trek",
          duration: "5-6 hrs trek",
          altitude: "13,100 ft",
        },
        {
          day: 4,
          title: "Chopta to Deoria Tal Crystal Lake & Scenic Sari Village",
          description: "Short drive to Sari village. Embark on a gentle 2.5 km trail to Deoria Tal, a pristine emerald lake that reflects the mighty Chaukhamba peaks in its crystal waters. Enjoy picnic lunch and descend back to camp.",
          activities: "Deoria Tal lake trek, Chaukhamba reflection photography, Sari village tour",
          meal: "Breakfast & Dinner",
          stay: "Alpine Swiss Tents / Resort in Chopta",
          distance: "5 km trek",
          duration: "3 hrs",
          altitude: "7,998 ft",
        },
        {
          day: 5,
          title: "Chopta to Haridwar via Rudraprayag Confluence",
          description: "Begin descent towards Haridwar. Stop at Rudraprayag confluence of Mandakini and Alaknanda rivers. Arrive in Haridwar, check in, and spend the evening watching the lamps float down Har Ki Pauri ghat.",
          activities: "Rudraprayag Sangam stop, Haridwar check-in, Har Ki Pauri evening darshan",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Haridwar",
          distance: "210 km",
          duration: "7 hrs drive",
        },
        {
          day: 6,
          title: "Haridwar Souvenirs & Final Departure",
          description: "Enjoy breakfast. Transfer to Haridwar Railway Station or Dehradun Jolly Grant Airport for onward journey back home.",
          activities: "Breakfast, Local sweet tasting, Departure drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "35 km",
          duration: "1 hr",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Is the Tungnath trek difficult for beginners?",
          answer: "The trail is well-paved with cobblestones and resting shelters. It is moderate and easily doable by anyone with average fitness.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-himachal-pradesh",
      name: "Himachal Pradesh",
      slug: "himachal-pradesh",
      category: "Domestic",
      tagline: "Apple Orchards, Pine Valleys, Snow Passes & Himalayan Adventures",
      duration: "5 Nights / 6 Days",
      price: 19999,
      originalPrice: 24999,
      bestSeason: "Throughout the year (Snow: Dec-Feb, Pleasant: Apr-Jun)",
      pickupDrop: "Chandigarh Airport / Railway Station (IXC)",
      suitableFor: "Couples, Friends & Adventure Lovers",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      badge: "Trending Valley",
      highlights: ["Shimla Mall Road", "Kullu River Rafting", "Manali Hadimba Temple", "Solang Valley Snow Sports"],
      color: "from-blue-900/80",
      icon: "🌲",
      status: "Published",
      overview: "A classic Himalayan retreat encompassing colonial heritage and adrenaline-pumping mountain sports. Wander through the British-era charms of Shimla, cross roaring Beas river in Kullu, and explore snow-capped pine wonderlands in Manali and Solang Valley.",
      itinerary: [
        {
          day: 1,
          title: "Chandigarh Arrival & Scenic Drive to Shimla",
          description: "Pick up from Chandigarh Airport/Station. Drive up the Himalayan Expressway to Shimla (2,276 m). Check in to hotel. In the evening, stroll along the famous Ridge, Mall Road, and historic Christ Church.",
          activities: "Chandigarh pickup, Shimla drive, Mall Road & Ridge walk",
          meal: "Dinner included",
          stay: "Verified 3-Star Hotel in Shimla",
          distance: "115 km",
          duration: "3.5 hrs drive",
        },
        {
          day: 2,
          title: "Shimla Kufri Excursion & Mountain Drive to Manali",
          description: "Morning visit to Kufri for snow viewpoint, horse rides, and Himalayan Wildlife Zoo. Post lunch, embark on an exhilarating drive along Beas river through Mandi and Kullu towards Manali.",
          activities: "Kufri viewpoint, Apple orchards, Scenic Beas valley drive to Manali",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Resort in Manali",
          distance: "250 km",
          duration: "7 hrs drive",
        },
        {
          day: 3,
          title: "Manali Local Sightseeing: Hadimba Temple, Vashisht & Old Manali",
          description: "Visit the 450-year-old wooden pagoda-style Hadimba Devi Temple amidst towering deodars. Soak in the therapeutic hot sulphur springs of Vashisht village. In the evening, explore vibrant bohemian cafes in Old Manali.",
          activities: "Hadimba Temple, Vashisht Hot Springs, Tibetan Monastery, Old Manali cafes",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Resort in Manali",
          distance: "30 km",
          duration: "Full Day",
        },
        {
          day: 4,
          title: "Solang Valley Adventure Sports & Atal Tunnel Excursion",
          description: "Drive to Solang Valley for thrilling adventure sports (paragliding, zorbing, ATV quad biking, zip-lining). Drive through the engineering marvel of Atal Tunnel (9.02 km) to enter the stark trans-Himalayan landscapes of Sissu in Lahaul Valley.",
          activities: "Solang Valley adventures, Atal Tunnel crossing, Sissu waterfall in Lahaul",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Resort in Manali",
          distance: "60 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Manali to Kullu River Rafting & Naggar Castle",
          description: "Visit historic Naggar Castle, built in 1460 AD with panoramic views of the Kullu Valley. Head to Babeli near Kullu for exciting white water river rafting in the Beas river and visit a local Kullu Shawl weaving factory.",
          activities: "Naggar Castle, Kullu White Water Rafting, Shawl factory visit",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Resort in Manali",
          distance: "50 km",
          duration: "4 hrs",
        },
        {
          day: 6,
          title: "Manali to Chandigarh Airport Departure",
          description: "Check out after breakfast. Drive down the valley back to Chandigarh Airport or Railway Station for your return flight.",
          activities: "Breakfast, Return drive, Chandigarh drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "290 km",
          duration: "7 hrs drive",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Can we visit Rohtang Pass during this tour?",
          answer: "Rohtang Pass excursion is subject to National Green Tribunal (NGT) permits and local taxi union regulations, which can be arranged on direct payment basis.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-kashmir",
      name: "Kashmir",
      slug: "kashmir",
      category: "Domestic",
      tagline: "Paradise on Earth: Romantic Shikara Rides, Snow Valleys & Saffron Meadows",
      duration: "5 Nights / 6 Days",
      price: 26999,
      originalPrice: 32999,
      bestSeason: "March to October & Winter Snow (Dec to Feb)",
      pickupDrop: "Srinagar International Airport (SXR)",
      suitableFor: "Couples, Honeymooners & Families",
      image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
      badge: "Alpine Gem",
      highlights: ["Srinagar Dal Lake Shikara", "Gulmarg Gondola Ride", "Pahalgam Betaab Valley", "Mughal Gardens"],
      color: "from-teal-900/80",
      icon: "❄️",
      status: "Published",
      overview: "Experience why Mughal emperors hailed Kashmir as Jannat on Earth. Glide gracefully on Dal Lake aboard ornate wooden shikaras, take world's second-highest cable car (Gondola) in Gulmarg, and breathe the fresh pine scents of Lidder River in Pahalgam.",
      itinerary: [
        {
          day: 1,
          title: "Srinagar Airport Arrival & Romantic Dal Lake Shikara Ride",
          description: "Land at Srinagar Airport. Transfer to a luxury cedar-wood Houseboat on Dal Lake. In the late afternoon, embark on a 1-hour sunset Shikara ride across Dal Lake, gliding past floating gardens and local handicraft markets.",
          activities: "Airport pickup, Houseboat check-in, Dal Lake Shikara ride, Char Chinar view",
          meal: "Dinner included",
          stay: "Luxury Deluxe Houseboat on Dal Lake",
          distance: "20 km",
          duration: "1 hr",
        },
        {
          day: 2,
          title: "Srinagar Mughal Gardens & Old City Craft Tour",
          description: "Explore the historic Mughal pleasure gardens built in the 17th century: Nishat Bagh (Garden of Bliss) and Shalimar Bagh (Abode of Love). Visit the hillside Chashme Shahi spring and Shankaracharya Temple offering bird's eye views of the entire valley.",
          activities: "Nishat & Shalimar Bagh, Chashme Shahi, Shankaracharya Temple, Pashmina shopping",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Srinagar",
          distance: "35 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Day Excursion to Gulmarg Meadow of Flowers & Gondola",
          description: "Full day excursion to Gulmarg (2,650 m). Walk through pine-clad alpine meadows. Ride the famed Gulmarg Gondola (Phase 1 & Phase 2 up to 13,780 ft) for breathtaking panoramas of Mount Apharwat and snow peaks.",
          activities: "Gulmarg drive, Gondola cable car ride, Apharwat peak snow play",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Srinagar",
          distance: "105 km roundtrip",
          duration: "2 hrs each way",
        },
        {
          day: 4,
          title: "Srinagar to Pahalgam Valley of Shepherds via Saffron Fields",
          description: "Scenic drive to Pahalgam (2,130 m). En route, pass through the fragrant purple saffron fields of Pampore and historic ruins of Avantipura temple. Check into resort alongside the gushing Lidder River.",
          activities: "Pampore saffron fields, Avantipura ruins, Lidder River walk, Pahalgam check-in",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Pahalgam",
          distance: "95 km",
          duration: "3 hrs drive",
        },
        {
          day: 5,
          title: "Pahalgam Betaab Valley, Aru Valley & Chandanwari",
          description: "Board local union vehicles to explore the scenic trio of Pahalgam: Betaab Valley (named after the Bollywood blockbuster), picturesque Aru Valley, and Chandanwari, the starting point of the sacred Amarnath Yatra.",
          activities: "Betaab Valley picnic, Aru Valley photography, Pine forest walks",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Pahalgam",
          distance: "40 km",
          duration: "Full Day",
        },
        {
          day: 6,
          title: "Pahalgam to Srinagar Airport Departure",
          description: "After breakfast, drive back to Srinagar Airport with bags full of dry fruits, saffron, and unforgettable Kashmiri memories.",
          activities: "Breakfast, Airport transfer, Departure",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "90 km",
          duration: "2.5 hrs drive",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "How do we book the Gulmarg Gondola tickets?",
          answer: "Gondola tickets must be booked online in advance due to high demand. Our team assists with ticket reservation slots.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-ladakh",
      name: "Ladakh",
      slug: "ladakh",
      category: "Domestic",
      tagline: "High-Altitude Cold Desert: Ancient Monasteries, Khardung La & Pangong Tso",
      duration: "5 Nights / 6 Days",
      price: 28999,
      originalPrice: 34999,
      bestSeason: "May to October",
      pickupDrop: "Leh Kushok Bakula Rimpochee Airport (IXL)",
      suitableFor: "Adventure Seekers, Photographers & Bikers",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      badge: "High Altitude",
      highlights: ["Leh Palace & Shanti Stupa", "Khardung La Pass (17,982 ft)", "Nubra Hunder Sand Dunes", "Pangong Tso Blue Lake"],
      color: "from-sky-900/80",
      icon: "🏔️",
      status: "Published",
      overview: "Embark on an expedition into the Land of High Passes. Marvel at the dramatic arid mountain sceneries, ancient Buddhist gompas echoing with prayer chants, crossing one of the highest motorable roads on earth, and gazing at the changing blue hues of Pangong Tso.",
      itinerary: [
        {
          day: 1,
          title: "Leh Airport Arrival & Essential Altitude Acclimatization",
          description: "Arrive at Leh Airport (11,500 ft). Transfer to hotel. Full day complete mandatory rest to acclimatize to high altitude and thin air. Evening gentle walk to Leh Market and Shanti Stupa for sunset.",
          activities: "Airport pickup, Hotel check-in, Full rest for acclimatization, Shanti Stupa sunset",
          meal: "Dinner included",
          stay: "Verified 3-Star Hotel in Leh",
          distance: "10 km",
          duration: "30 mins",
          altitude: "11,500 ft",
        },
        {
          day: 2,
          title: "Leh Sham Valley Tour: Hall of Fame, Magnetic Hill & Sangam",
          description: "Explore the scenic Sham Valley: visit the Army Hall of Fame museum, experience the gravity-defying Magnetic Hill, and witness the stunning confluence (Sangam) of Indus and Zanskar rivers. Visit Gurudwara Pathar Sahib.",
          activities: "Hall of Fame, Magnetic Hill, Indus-Zanskar Sangam, Gurudwara Pathar Sahib",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Leh",
          distance: "70 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Leh to Nubra Valley via Khardung La Pass (17,982 ft)",
          description: "Ascend the world-famous Khardung La Pass, among the world's highest motorable passes. Descend into the dramatic Nubra Valley. Visit Diskit Monastery with its 106-ft Maitreya Buddha statue, and enjoy a ride on double-humped Bactrian camels over the white sand dunes of Hunder.",
          activities: "Khardung La crossing, Diskit Monastery, Hunder Sand Dunes & Bactrian camel ride",
          meal: "Breakfast & Dinner",
          stay: "Deluxe Swiss Tents / Hotel in Nubra",
          distance: "125 km",
          duration: "5 hrs drive",
          altitude: "17,982 ft at Pass",
        },
        {
          day: 4,
          title: "Nubra Valley to Pangong Tso Lake via Shayok River Route",
          description: "Drive along the turquoise Shayok River route directly to the world-famous high-altitude Pangong Tso Lake (14,270 ft). Watch the lake change shades from turquoise blue to deep emerald. Check into lakefront camps.",
          activities: "Shayok River drive, Pangong Tso arrival, Photography at 3 Idiots shooting point",
          meal: "Breakfast & Dinner",
          stay: "Lakefront Deluxe Camps at Pangong Tso",
          distance: "160 km",
          duration: "6 hrs drive",
          altitude: "14,270 ft",
        },
        {
          day: 5,
          title: "Pangong Tso Sunrise & Return to Leh via Chang La (17,590 ft)",
          description: "Wake up early for an unforgettable golden sunrise over Pangong Lake. After breakfast, drive back to Leh crossing the high Chang La pass. Halt at Thiksey Monastery and Shey Palace on way.",
          activities: "Pangong sunrise, Chang La pass crossing, Thiksey Monastery, Shey Palace",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Leh",
          distance: "150 km",
          duration: "5 hrs drive",
        },
        {
          day: 6,
          title: "Leh Souvenir Shopping & Airport Departure",
          description: "Check out after breakfast. Transfer to Leh Airport for your return flight with memories of the cold desert kingdom.",
          activities: "Breakfast, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "10 km",
          duration: "30 mins",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Are inner line permits included for Pangong & Nubra?",
          answer: "Yes, all Inner Line Permits (ILP) and wildlife environment fees are included and pre-arranged by our team.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-goa",
      name: "Goa",
      slug: "goa",
      category: "Beach",
      tagline: "Sun-Kissed Golden Beaches, Portuguese Villas, Spices & Vibrant Coastal Cafes",
      duration: "4 Nights / 5 Days",
      price: 17999,
      originalPrice: 21999,
      bestSeason: "October to April",
      pickupDrop: "Goa Airport (GOI/GOX) or Madgaon Railway Station",
      suitableFor: "Friends, Couples & Beach Enthusiasts",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
      badge: "Beach Escapes",
      highlights: ["Calangute & Baga Beach", "Dudhsagar Waterfalls", "Old Goa Basilica", "Mandovi River Sunset Cruise"],
      color: "from-rose-900/80",
      icon: "🌊",
      status: "Published",
      overview: "Unwind on tropical coastlines where Portuguese colonial history blends with golden sand beaches and pulsating seaside shacks. Explore historic forts, spice plantations, and the cascading waters of Dudhsagar.",
      itinerary: [
        {
          day: 1,
          title: "Goa Arrival & Sunset Leisure at Beach Shack",
          description: "Arrive at Goa Airport/Station. Transfer to your coastal beach resort. Evening at leisure to dip your toes in the Arabian Sea and enjoy chilled beverages at a vibrant beach shack.",
          activities: "Airport pickup, Resort check-in, Beach sunset walk",
          meal: "Dinner included",
          stay: "Verified 3-Star Beach Resort",
          distance: "35 km",
          duration: "1 hr",
        },
        {
          day: 2,
          title: "North Goa Sightseeing: Fort Aguada, Baga & Anjuna Beach",
          description: "Explore North Goa's top highlights: the 17th-century Portuguese Fort Aguada with its lighthouse, followed by water sports at Calangute and Baga beaches, and the bohemian cliffside vibes of Anjuna Beach.",
          activities: "Fort Aguada, Calangute watersports, Baga shack life, Anjuna flea market area",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Beach Resort",
          distance: "40 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Dudhsagar Waterfalls Safari & Spice Plantation Tour",
          description: "Day trip into the Mollem National Park for an exhilarating 4x4 open jeep safari to the base of the mighty 4-tiered Dudhsagar Waterfalls. Enjoy an authentic Goan buffet lunch at an organic spice plantation.",
          activities: "Dudhsagar 4x4 Jeep Safari, Natural pool swim, Spice plantation tour with Goan lunch",
          meal: "Breakfast, Lunch & Dinner",
          stay: "Verified 3-Star Beach Resort",
          distance: "140 km roundtrip",
          duration: "Full Day",
        },
        {
          day: 4,
          title: "Old Goa Heritage Churches, Fontainhas & Sunset Cruise",
          description: "Visit UNESCO World Heritage churches: Basilica of Bom Jesus and Se Cathedral. Walk through the picturesque Portuguese Latin Quarter (Fontainhas) in Panaji. Evening 1-hour sunset cruise on Mandovi River with Goan folk dances.",
          activities: "Basilica of Bom Jesus, Se Cathedral, Fontainhas Latin Quarter, Mandovi Sunset Cruise",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Beach Resort",
          distance: "50 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Beach Morning & Airport Departure",
          description: "Enjoy breakfast overlooking the palms. Transfer to Goa Airport for return flight.",
          activities: "Breakfast, Beach walk, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "35 km",
          duration: "1 hr",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Can we rent self-drive scooties or cars during the trip?",
          answer: "Yes, while private AC cabs are included for all sightseeing tours, we also help arrange verified 2-wheelers for evening beach roaming.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-nepal",
      name: "Nepal",
      slug: "nepal",
      category: "International",
      tagline: "Himalayan Kingdom: Ancient Stupas, Pokhara Phewa Lake & Annapurna Horizons",
      duration: "5 Nights / 6 Days",
      price: 32999,
      originalPrice: 38999,
      bestSeason: "September to May",
      pickupDrop: "Kathmandu Tribhuvan International Airport (KTM)",
      suitableFor: "International Explorers, Couples & Families",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      badge: "International",
      highlights: ["Kathmandu Pashupatinath", "Boudhanath Stupa", "Pokhara Phewa Lake", "Sarangkot Annapurna Sunrise"],
      color: "from-purple-900/80",
      icon: "🇳🇵",
      status: "Published",
      overview: "Journey into the mythical Himalayan kingdom where spiritual stupas and snow-crowned summits meet. Experience sacred temples of Kathmandu, tranquil lakeside bliss in Pokhara, and sunrise views of Mount Machapuchare (Fishtail) and the Annapurna range.",
      itinerary: [
        {
          day: 1,
          title: "Kathmandu Arrival & Thamel Stroll",
          description: "Arrive at Tribhuvan International Airport in Kathmandu. Meet our representative and transfer to your hotel. Evening walk through the vibrant tourist streets of Thamel.",
          activities: "Airport pickup, Hotel check-in, Thamel bazaar walk",
          meal: "Dinner included",
          stay: "Verified 3-Star Hotel in Kathmandu",
          distance: "15 km",
          duration: "45 mins",
        },
        {
          day: 2,
          title: "Kathmandu Heritage: Pashupatinath, Boudhanath & Swayambhunath",
          description: "Full day tour of UNESCO heritage wonders: the sacred Hindu temple of Pashupatinath on Bagmati river, the colossal Tibetan Buddhist stupa of Boudhanath, and the hilltop Swayambhunath (Monkey Temple).",
          activities: "Pashupatinath Temple, Boudhanath Stupa, Swayambhunath panoramic city view",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Kathmandu",
          distance: "30 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Kathmandu to Pokhara Scenic Drive via Trishuli River",
          description: "Scenic overland journey to Pokhara (900 m), following the raging Trishuli River. Arrive in Pokhara, the gateway to the Annapurnas, and check in to lakeside hotel. Enjoy a peaceful evening stroll along Phewa Lake.",
          activities: "Drive to Pokhara, River valley vistas, Lakeside promenade walk",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Pokhara",
          distance: "200 km",
          duration: "6 hrs drive",
        },
        {
          day: 4,
          title: "Sarangkot Sunrise over Annapurna & Pokhara Sightseeing",
          description: "Pre-dawn drive to Sarangkot hill for a breathtaking golden sunrise over Mount Dhaulagiri, Annapurna I-IV, and Machapuchare. Post breakfast, visit Davis Fall, Gupteshwor Mahadev Cave, and enjoy 1-hour boating on Phewa Lake to Tal Barahi Temple.",
          activities: "Sarangkot sunrise, Phewa Lake boating, Tal Barahi Temple, Davis Fall, Gupteshwor Cave",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Pokhara",
          distance: "40 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Pokhara to Kathmandu & Patan Durbar Square",
          description: "Drive back to Kathmandu. In the afternoon, visit Patan Durbar Square, renowned for its exquisite Newari architecture, Krishna Mandir, and metal handicrafts.",
          activities: "Return drive to Kathmandu, Patan Durbar Square cultural walk",
          meal: "Breakfast & Dinner",
          stay: "Verified 3-Star Hotel in Kathmandu",
          distance: "200 km",
          duration: "6 hrs drive",
        },
        {
          day: 6,
          title: "Kathmandu Airport Departure",
          description: "Enjoy breakfast at hotel. Transfer to Tribhuvan International Airport for your flight back home.",
          activities: "Breakfast, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "15 km",
          duration: "45 mins",
        },
      ],
      inclusions: [...commonInclusions],
      exclusions: [...commonExclusions],
      faqs: [
        {
          question: "Do Indian citizens need a passport or visa for Nepal?",
          answer: "Indian citizens do not require a visa. Either a valid Indian Passport OR Voter ID card is sufficient for travel to Nepal.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-bali",
      name: "Bali",
      slug: "bali",
      category: "International",
      tagline: "Tropical Island Paradise: Ubud Terraces, Uluwatu Sunsets, Nusa Penida Cliffs & Beach Clubs",
      duration: "6 Nights / 7 Days",
      price: 42999,
      originalPrice: 49999,
      bestSeason: "April to October",
      pickupDrop: "Ngurah Rai International Airport (DPS), Denpasar",
      suitableFor: "Couples, Honeymooners, Families & Friends",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      badge: "Visa On Arrival",
      highlights: [
        "Ubud Monkey Forest & Tegalalang Rice Terraces",
        "Nusa Penida Kelingking T-Rex Beach & Angel's Billabong",
        "Uluwatu Sunset Temple & Fire Dance",
        "Seminyak & Kuta Beachfront Resorts",
      ],
      color: "from-teal-900/80",
      icon: "🏝️",
      status: "Published",
      overview: "Surrender to the enchanting spirit of Bali. From the emerald green cascading rice terraces of Ubud and sacred water temples to the dramatic cliffside panoramas of Nusa Penida and legendary Indian Ocean sunsets in Uluwatu, this 7-day tropical escape combines tranquil wellness with vibrant island nightlife.",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Bali & Transfer to Ubud Cultural Haven",
          description: "Arrive at Ngurah Rai International Airport in Denpasar. Traditional Balinese flower lei welcome by our driver. Transfer to your boutique resort in Ubud. Spend the evening relaxing amidst tranquil tropical greenery.",
          activities: "Airport pickup, Resort check-in, Ubud evening market stroll",
          meal: "Dinner included",
          stay: "Verified 4-Star Boutique Resort in Ubud",
          distance: "38 km",
          duration: "1.5 hrs",
        },
        {
          day: 2,
          title: "Ubud Culture: Tegalalang Rice Terraces, Bali Swing & Monkey Forest",
          description: "Explore the Sacred Monkey Forest Sanctuary inhabited by playful macaques. Walk along the UNESCO-listed Tegalalang rice terraces and soar above the jungle canopy on the iconic Bali Swing. Visit the artisanal craft villages of Celuk and Mas.",
          activities: "Sacred Monkey Forest, Tegalalang Rice Terraces, Aloha Bali Swing, Coffee Luwak plantation",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Boutique Resort in Ubud",
          distance: "40 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Kintamani Mount Batur Volcano View & Tirta Empul Holy Water Temple",
          description: "Drive north to the volcanic highlands of Kintamani with panoramic views of active Mount Batur and Lake Batur. Participate in traditional water purification blessings at the ancient Tirta Empul Holy Spring Temple.",
          activities: "Kintamani Volcano overlook, Tirta Empul holy spring ritual, Tegenungan Waterfall",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Boutique Resort in Ubud",
          distance: "65 km",
          duration: "Full Day",
        },
        {
          day: 4,
          title: "Nusa Penida Island Day Excursion by Speedboat",
          description: "Early morning speed boat transfer from Sanur harbour to the wild island of Nusa Penida. Visit the world-famous Kelingking T-Rex Beach cliff view, the natural infinity pool at Angel's Billabong, and Broken Beach.",
          activities: "Fast boat cruise, Kelingking Beach viewpoint, Broken Beach, Angel's Billabong",
          meal: "Breakfast & Local Lunch",
          stay: "Verified 4-Star Beachfront Hotel in Kuta/Seminyak",
          distance: "Island Boat Tour",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Water Sports at Benoa & Uluwatu Sunset Cliff Temple",
          description: "Head to Tanjung Benoa for thrilling water sports (Banana boat included, parasailing & jet ski optional). In the late afternoon, drive to the dramatic 70-meter limestone sea cliff of Uluwatu Temple to witness the mesmerizing Kecak fire dance against a golden sunset.",
          activities: "Tanjung Benoa water sports, Uluwatu Sea Cliff Temple, Kecak & Fire dance performance",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Beachfront Hotel in Kuta/Seminyak",
          distance: "55 km",
          duration: "Full Day",
        },
        {
          day: 6,
          title: "Tanah Lot Sea Temple & Seminyak Sunset Beach Club",
          description: "Visit the iconic offshore rock temple of Tanah Lot perched amidst crashing waves. Spend the afternoon shopping for souvenirs in Seminyak boutiques and enjoy an evening cocktail at renowned beachfront clubs.",
          activities: "Tanah Lot temple photo stop, Seminyak fashion streets, Sunset beach club experience",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Beachfront Hotel in Kuta/Seminyak",
          distance: "45 km",
          duration: "Full Day",
        },
        {
          day: 7,
          title: "Bali Souvenir Shopping & Denpasar Airport Departure",
          description: "Enjoy breakfast at the resort. Free time for last-minute shopping at Krisna Oleh-Oleh for Balinese coffee and handicrafts. Transfer to Ngurah Rai International Airport for your flight back home.",
          activities: "Resort checkout, Krisna Oleh-Oleh souvenir market, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "15 km",
          duration: "45 mins",
        },
      ],
      inclusions: [
        "6 Nights luxury accommodation (3 Nights Ubud Resort + 3 Nights Seminyak/Kuta Beach Hotel)",
        "Daily international buffet Breakfast and curated Dinners",
        "Private AC vehicle throughout the tour with English-speaking Balinese driver-guide",
        "Round-trip fast boat tickets and private island transport in Nusa Penida",
        "Entrance tickets to Uluwatu Temple, Kecak Dance, Tirta Empul, Monkey Forest & Tanah Lot",
        "Complimentary Banana Boat ride at Tanjung Benoa",
        "Airport pick-up, drop-off, all toll charges, fuel, and parking fees",
        "24/7 dedicated KRADIND International Tour Coordinator on WhatsApp",
      ],
      exclusions: [
        "International airfare to/from Denpasar Bali",
        "Indonesia Visa on Arrival (VOA) fee (~USD 35 per person payable at airport)",
        "Daily Lunches and personal room service / mini bar charges",
        "Water sports upgrades (Scuba diving, Sea walker, Parasailing)",
        "Personal overseas travel insurance (strongly recommended)",
        "Applicable 5% GST and 5% TCS as per RBI guidelines",
      ],
      faqs: [
        {
          question: "Do Indian passport holders get Visa on Arrival in Bali?",
          answer: "Yes! Indian passport holders can easily obtain a 30-day Visa on Arrival (VOA) upon landing at Denpasar Airport for approx. USD 35 (or IDR 500,000). You need at least 6 months passport validity and a confirmed return flight ticket.",
        },
        {
          question: "Can vegetarian and Indian food be arranged in Bali?",
          answer: "Yes, absolutely! Bali has numerous authentic Indian restaurants (both North and South Indian vegetarian). We ensure your dinner reservations include verified Indian cuisine.",
        },
      ],
      travelTips: [
        "Carry a passport with at least 6 months validity from the planned date of departure.",
        "Exchange some Indian Currency / USD to Indonesian Rupiah (IDR) at verified airport exchange counters or use multi-currency Forex cards.",
        "Dress respectfully with a sarong/sash (provided at temple entrances) when visiting Balinese Hindu shrines.",
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-thailand",
      name: "Thailand",
      slug: "thailand",
      category: "International",
      tagline: "Land of Smiles: Phi Phi Speedboats, Bangkok Grand Palaces & Phuket Beach Sunsets",
      duration: "5 Nights / 6 Days",
      price: 38999,
      originalPrice: 44999,
      bestSeason: "November to April",
      pickupDrop: "Phuket International Airport (HKT) / Suvarnabhumi Airport (BKK)",
      suitableFor: "Families, Couples, Friends & Party Explorers",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
      badge: "Visa Free / On Arrival",
      highlights: [
        "Phi Phi Islands & Maya Bay Luxury Speedboat",
        "James Bond Island & Phang Nga Bay Sea Canoeing",
        "Bangkok Wat Arun & Wat Pho Reclining Buddha",
        "Chao Phraya Princess Luxury Dinner Cruise",
      ],
      color: "from-blue-900/80",
      icon: "🇹🇭",
      status: "Published",
      overview: "Experience the vibrant dual soul of Thailand: the crystalline turquoise waters and dramatic limestone karst towers of the Andaman Sea in Phuket, paired with the buzzing street food, golden temple spires, and shopping meccas of cosmopolitan Bangkok.",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Phuket & Patong Beach Sunset Walk",
          description: "Arrive at Phuket International Airport. Private transfer to your beachfront resort in Patong/Karon. Evening free to explore the vibrant Patong promenade, night street markets, and Bangla Road entertainment.",
          activities: "Airport pickup, Hotel check-in, Patong Beach sunset, Night market food walk",
          meal: "Dinner included",
          stay: "Verified 4-Star Resort in Phuket",
          distance: "40 km",
          duration: "1 hr",
        },
        {
          day: 2,
          title: "Phi Phi Island, Maya Bay & Khai Island Speedboat Tour",
          description: "Full day luxury speedboat excursion across the Andaman Sea. Cruise into iconic Maya Bay (filming site of 'The Beach'), snorkel among vibrant coral reefs in Pileh Lagoon, visit Viking Cave, and enjoy beach relaxation on Khai Island.",
          activities: "Speedboat cruise, Maya Bay sightseeing, Pileh Lagoon swimming, Coral snorkeling, Buffet lunch",
          meal: "Breakfast & Island Lunch",
          stay: "Verified 4-Star Resort in Phuket",
          distance: "Island Cruise Tour",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Phuket City Landmarks & Flight to Bangkok",
          description: "Morning checkout followed by Phuket city highlights: Big Buddha hilltop panorama, Wat Chalong temple, and Old Phuket Portuguese heritage quarter. Transfer to airport for short domestic flight to Bangkok. Check-in to Bangkok city center hotel.",
          activities: "Big Buddha, Wat Chalong, Old Phuket Town, Domestic flight to Bangkok, Hotel check-in",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Bangkok",
          distance: "30 km + 1.2 hr flight",
          duration: "Half Day",
        },
        {
          day: 4,
          title: "Bangkok City Temple Tour & Chao Phraya River Dinner Cruise",
          description: "Visit Bangkok's most sacred cultural treasures: Wat Traimit (Golden Buddha) and Wat Pho (Reclining Buddha). In the evening, board the opulent Chao Phraya Princess luxury cruise for an international buffet dinner with live music against illuminated riverfront palaces.",
          activities: "Wat Traimit, Wat Pho, Gems Gallery, Chao Phraya luxury dinner cruise with live band",
          meal: "Breakfast & Cruise Dinner",
          stay: "Verified 4-Star Hotel in Bangkok",
          distance: "35 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Safari World & Marine Park Excursion",
          description: "Spend a thrilling day at Thailand's premier open-zoo Safari World. Drive through the wild African safari wilderness to spot lions and giraffes, followed by spectacular marine mammal performances and stunt shows at Marine Park.",
          activities: "Safari Park open drive, Dolphin & Sea Lion show, Spy War stunt performance, Buffet lunch",
          meal: "Breakfast & Buffet Lunch",
          stay: "Verified 4-Star Hotel in Bangkok",
          distance: "50 km",
          duration: "Full Day",
        },
        {
          day: 6,
          title: "Bangkok Shopping & Suvarnabhumi Airport Departure",
          description: "Enjoy breakfast at hotel. Free morning for duty-free shopping at Pratunam Market, Platinum Mall, or MBK Center. Transfer to Suvarnabhumi / Don Mueang International Airport for flight home.",
          activities: "Hotel checkout, Shopping spree, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "30 km",
          duration: "1 hr",
        },
      ],
      inclusions: [
        "5 Nights accommodation (2 Nights Phuket 4-Star Resort + 3 Nights Bangkok 4-Star Hotel)",
        "Daily international buffet Breakfasts and curated Dinners",
        "Full Day Phi Phi Islands tour by luxury speedboat with buffet lunch, snorkeling masks & life jackets",
        "Opulent Chao Phraya River Dinner Cruise ticket with live entertainment and international buffet",
        "Safari World and Marine Park admission with buffet lunch",
        "Bangkok City Temple tour covering Golden Buddha and Reclining Buddha",
        "All private airport transfers and intercity sightseeing in air-conditioned vehicles",
        "24/7 dedicated on-tour assistance from KRADIND International travel desk",
      ],
      exclusions: [
        "International airfare to Phuket and return from Bangkok",
        "Phuket to Bangkok domestic flight (~₹3,500 - ₹5,000 depending on booking date)",
        "National Park entry fee for Phi Phi Island (THB 400 per person payable directly)",
        "Personal expenses, laundry, alcoholic beverages, and tips",
        "Applicable Government GST & TCS",
      ],
      faqs: [
        {
          question: "Is visa required for Indian tourists traveling to Thailand?",
          answer: "Thailand currently offers Visa-Free entry for Indian tourists (up to 30 days). Ensure your passport has at least 6 months validity from the date of travel.",
        },
        {
          question: "Is Indian food easily available in Phuket and Bangkok?",
          answer: "Yes, both Phuket (Patong) and Bangkok (Sukhumvit, Pratunam) have hundreds of pure vegetarian and multi-cuisine Indian restaurants.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-dubai",
      name: "Dubai",
      slug: "dubai",
      category: "International",
      tagline: "City of Superlatives: Burj Khalifa 124th Floor, Red Dune Desert Safari & Marina Yacht Cruise",
      duration: "4 Nights / 5 Days",
      price: 46999,
      originalPrice: 54999,
      bestSeason: "October to April",
      pickupDrop: "Dubai International Airport (DXB)",
      suitableFor: "Families, Couples & Luxury Seekers",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
      badge: "Futuristic Wonder",
      highlights: [
        "Burj Khalifa 124th & 125th Floor Observatory",
        "Thrill 4x4 Red Dune Bashing Desert Safari with BBQ",
        "Dubai Marina Luxury Dhow Cruise with Tanoura Show",
        "Dubai Mall Aquarium, Underwater Zoo & Fountain Show",
      ],
      color: "from-amber-900/80",
      icon: "🇦🇪",
      status: "Published",
      overview: "Step into the dazzling city of the future. Rise 452 meters above sea level to the observation deck of the world's tallest building, thrill in high-speed desert dune bashing over red Arabian sands, cruise past glittering skyscraper canyons in Dubai Marina, and explore mind-bending architecture.",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Dubai & Marina Dhow Cruise Dinner",
          description: "Arrive at Dubai International Airport. Meet our representative and transfer to your 4-star hotel in downtown Dubai. In the evening, board a traditional illuminated wooden Dhow for a 2-hour luxury cruise through the sparkling skyscrapers of Dubai Marina with international buffet and live Tanoura dance.",
          activities: "Airport transfer, Hotel check-in, Dubai Marina Dhow Cruise Dinner & Tanoura show",
          meal: "Dinner included",
          stay: "Verified 4-Star Hotel in Dubai",
          distance: "25 km",
          duration: "1 hr",
        },
        {
          day: 2,
          title: "Dubai City Tour & Burj Khalifa At The Top (124th Floor)",
          description: "Half-day guided city tour taking in Dubai Frame, Zabeel Palace photo stop, Palm Jumeirah, and Atlantis The Palm. Afternoon visit to Dubai Mall and ascend the world's fastest elevator to the 124th and 125th floor observation decks of Burj Khalifa. Witness the breathtaking Dubai Fountain spectacle.",
          activities: "Dubai City Tour, Palm Jumeirah, Burj Khalifa 124th floor ticket, Dubai Mall fountain show",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Dubai",
          distance: "35 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Dubai Frame & 4x4 Red Dune Desert Safari with BBQ Dinner",
          description: "Morning visit to the iconic Dubai Frame offering 360-degree views of Old and New Dubai through a glass skywalk bridge. Afternoon pickup in 4x4 Land Cruisers for thrilling red dune bashing in the Lahbab Desert, camel riding, sandboarding, and an open-air starlit desert camp with belly dance, fire show, and Arabic BBQ feast.",
          activities: "Dubai Frame Skywalk, 4x4 Dune Bashing, Camel ride, Henna tattooing, Fire show, BBQ dinner",
          meal: "Breakfast & BBQ Dinner",
          stay: "Verified 4-Star Hotel in Dubai",
          distance: "60 km",
          duration: "Full Day",
        },
        {
          day: 4,
          title: "Miracle Garden / Global Village or Aquaventure Waterpark",
          description: "Visit the world's largest natural flower garden, Dubai Miracle Garden, featuring 150 million blooming flowers in full sculptural display. Evening visit to Global Village, bringing together 90+ countries with pavilions, cultural performances, and international food stalls.",
          activities: "Miracle Garden floral exhibits, Global Village international pavilions & night carnival",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Dubai",
          distance: "40 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Gold Souk Shopping & Dubai Airport Departure",
          description: "Enjoy breakfast at hotel. Visit the glittering Gold Souk and Spice Souk in Deira for saffron and gold jewelry. Transfer to Dubai International Airport for your flight back home.",
          activities: "Hotel checkout, Deira Gold Souk & Spice Souk walk, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "15 km",
          duration: "45 mins",
        },
      ],
      inclusions: [
        "4 Nights accommodation in verified 4-Star hotel in Dubai (Bur Dubai / Deira / Al Barsha)",
        "Daily buffet Breakfast at hotel and curated Dinners",
        "Burj Khalifa 124th + 125th Floor non-prime entrance ticket",
        "4x4 Red Dune Desert Safari with BBQ dinner, camel ride, Tanoura & Fire show",
        "Dubai Marina Dhow Cruise with international buffet dinner",
        "Dubai Half-Day City Tour with photo stops at Burj Al Arab and Atlantis",
        "Dubai Frame entrance ticket",
        "Private airport transfers from/to Dubai International Airport (DXB)",
        "24/7 on-tour customer concierge on WhatsApp",
      ],
      exclusions: [
        "International airfare to and from Dubai",
        "UAE Tourist Visa and OK-to-Board fees (~₹6,500 - ₹7,000 per person)",
        "Tourism Dirham Fee payable directly at hotel (~AED 15 per room per night)",
        "Lunches and personal shopping expenses",
        "Applicable GST & TCS",
      ],
      faqs: [
        {
          question: "How do I get a tourist visa for Dubai?",
          answer: "KRADIND provides complete hassle-free UAE eVisa processing. We need your passport front and back copy, pan card, and a white-background passport photo. Normal processing takes 48 to 72 hours.",
        },
        {
          question: "Is alcohol allowed in Dubai?",
          answer: "Yes, alcohol is legally served at licensed restaurants, hotels, lounges, and desert safari camps across Dubai for tourists aged 21 and above.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-vietnam",
      name: "Vietnam",
      slug: "vietnam",
      category: "International",
      tagline: "Heritage & Emerald Waters: Ha Long Bay Overnight Luxury Cruise, Hanoi Train Street & Ninh Binh",
      duration: "5 Nights / 6 Days",
      price: 41999,
      originalPrice: 48999,
      bestSeason: "September to April",
      pickupDrop: "Noi Bai International Airport (HAN), Hanoi",
      suitableFor: "Nature Enthusiasts, Couples & Culture Seekers",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
      badge: "Trending Hotspot",
      highlights: [
        "Ha Long Bay 5-Star Luxury Overnight Cruise",
        "Ninh Binh Trang An UNESCO Grotto Boat Ride",
        "Hanoi Old Quarter & Legendary Train Street Cafe",
        "Kayaking through Limestone Karst Sea Caves",
      ],
      color: "from-emerald-900/80",
      icon: "🇻🇳",
      status: "Published",
      overview: "Discover the ethereal natural drama of Southeast Asia's fastest-growing destination. Sail across thousands of towering emerald limestone karsts in UNESCO World Heritage Ha Long Bay on a luxury overnight cruise, row through secret water grottoes in Ninh Binh, and immerse yourself in Hanoi's 1000-year-old French-colonial heritage.",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Hanoi & Old Quarter Cyclo Heritage Stroll",
          description: "Arrive at Noi Bai International Airport in Hanoi. Private transfer to your hotel in the historic French-colonial Old Quarter. Experience an authentic cycle-rickshaw (Cyclo) ride around Hoan Kiem Lake, Ngoc Son Temple, and the legendary 36 Guild Streets.",
          activities: "Airport pickup, Old Quarter hotel check-in, Hoan Kiem Lake, Hanoi Train Street coffee stop",
          meal: "Dinner included",
          stay: "Verified 4-Star Hotel in Hanoi Old Quarter",
          distance: "30 km",
          duration: "45 mins",
        },
        {
          day: 2,
          title: "Hanoi to Ha Long Bay 5-Star Luxury Cruise Embarkation",
          description: "Morning scenic drive through the Red River Delta to Ha Long Bay. Board your 5-star luxury cruise ship. Enjoy a welcome drink and gourmet seafood/vegetarian lunch while gliding past iconic towering karst islets. Afternoon kayaking through Sung Sot (Surprise) Cave and Ti Top Island panoramic summit hike.",
          activities: "Luxury cruise check-in, Sung Sot cave exploration, Ti Top island beach & summit view, Sunset party",
          meal: "Breakfast, Lunch & Dinner",
          stay: "Luxury 5-Star Ha Long Bay Cruise Cabin",
          distance: "150 km",
          duration: "2.5 hrs drive",
        },
        {
          day: 3,
          title: "Morning Tai Chi on Cruise, Luon Cave & Return to Hanoi",
          description: "Greet dawn with sunrise Tai Chi on the cruise sundeck amidst ethereal limestone karsts. Bamboo boat excursion through Luon Cave. Disembark mid-day after brunch and return to Hanoi for an evening exploring the bustling night weekend markets.",
          activities: "Sunrise Tai Chi, Luon cave bamboo boat, Cruise brunch, Return drive to Hanoi",
          meal: "Breakfast & Brunch",
          stay: "Verified 4-Star Hotel in Hanoi Old Quarter",
          distance: "150 km",
          duration: "2.5 hrs drive",
        },
        {
          day: 4,
          title: "Ninh Binh: Trang An UNESCO Boat Caves & Hang Mua Peak",
          description: "Full-day excursion to Ninh Binh ('Ha Long on Land'). Climb 500 stone steps to the dragon shrine on Hang Mua Peak for breathtaking valley views. Embark on a traditional sampan boat ride along the Trang An river passing through mystical water-carved limestone caves.",
          activities: "Hang Mua peak climb, Trang An riverboat cave tour, Ancient capital of Hoa Lu",
          meal: "Breakfast & Local Lunch",
          stay: "Verified 4-Star Hotel in Hanoi Old Quarter",
          distance: "95 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Hanoi Cultural Landmarks & Water Puppet Theatre",
          description: "Visit the historic Ho Chi Minh Mausoleum complex, the iconic One Pillar Pagoda, and the Temple of Literature (Vietnam's first national university). In the evening, witness the captivating traditional Thang Long Water Puppet performance.",
          activities: "Ho Chi Minh complex, Temple of Literature, Thang Long Water Puppet show, Street food tour",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Hanoi Old Quarter",
          distance: "25 km",
          duration: "Full Day",
        },
        {
          day: 6,
          title: "Hanoi Souvenir Shopping & Departure",
          description: "Enjoy breakfast at hotel. Pick up world-famous Vietnamese drip coffee, lotus tea, and silk handicrafts. Private transfer to Noi Bai International Airport for your flight back home.",
          activities: "Hotel checkout, Coffee & Silk shopping, Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "30 km",
          duration: "45 mins",
        },
      ],
      inclusions: [
        "4 Nights in verified 4-Star Hanoi Old Quarter hotel + 1 Night in 5-Star Luxury Ha Long Bay Cruise cabin",
        "Daily buffet Breakfast, 2 gourmet Cruise Lunches, and curated Dinners",
        "Full Ha Long Bay cruise program: Kayaking, cave excursions, sunset party & Tai Chi lesson",
        "Full-Day Ninh Binh tour with Trang An boat ride and Hang Mua peak entrance",
        "Traditional Thang Long Water Puppet show tickets",
        "All private air-conditioned vehicle transfers including airport pickup and drop",
        "24/7 KRADIND International travel coordinator support on WhatsApp",
      ],
      exclusions: [
        "International flight tickets to/from Hanoi",
        "Vietnam eVisa fee (~USD 25 payable online)",
        "Beverages and personal laundry charges",
        "Tips for tour guide and drivers",
        "Applicable GST & TCS",
      ],
      faqs: [
        {
          question: "How easy is it to get a visa for Vietnam for Indian citizens?",
          answer: "Very easy! Vietnam issues a 30 to 90-day electronic visa (eVisa) online in just 3 to 4 business days for Indian passport holders. We assist you through the complete documentation process.",
        },
        {
          question: "Is vegetarian food available on Ha Long Bay cruises?",
          answer: "Yes, 5-star cruise ships in Ha Long Bay provide dedicated vegetarian and vegan menu options with fresh fruits, noodles, tofu, and sautéed vegetables.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-singapore",
      name: "Singapore",
      slug: "singapore",
      category: "International",
      tagline: "Lion City Wonders: Gardens by the Bay, Universal Studios & Marina Bay Sands SkyPark",
      duration: "4 Nights / 5 Days",
      price: 49999,
      originalPrice: 58999,
      bestSeason: "Year-Round Destination",
      pickupDrop: "Singapore Changi Airport (SIN)",
      suitableFor: "Families with Kids, Couples & Urban Explorers",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
      badge: "Family Favorite",
      highlights: [
        "Gardens by the Bay: Flower Dome & Supertree Grove",
        "Universal Studios Singapore Full-Day Theme Park",
        "Sentosa Island Cable Car & Wings of Time Show",
        "Marina Bay Sands SkyPark Observation Deck",
      ],
      color: "from-sky-900/80",
      icon: "🇸🇬",
      status: "Published",
      overview: "Immerse your family in the cleanest, greenest, and most futuristic metropolis on Earth. Stand beneath the towering neon Supertrees of Gardens by the Bay, experience world-class rollercoasters at Universal Studios Singapore, ride scenic cable cars across Sentosa harbor, and marvel at the Marina Bay skyline.",
      itinerary: [
        {
          day: 1,
          title: "Arrival at Changi Airport & Night Safari Adventure",
          description: "Arrive at world-renowned Singapore Changi Airport. Experience the Jewel indoor rain vortex. Private transfer to your 4-star city hotel. In the evening, visit the world's first Night Safari to observe 900+ nocturnal animals on an open-sided tram ride through 7 geographical zones.",
          activities: "Changi Airport Jewel photo stop, Hotel check-in, Night Safari tram ride & animal show",
          meal: "Dinner included",
          stay: "Verified 4-Star Hotel in Singapore",
          distance: "25 km",
          duration: "45 mins",
        },
        {
          day: 2,
          title: "Singapore City Tour & Gardens by the Bay Supertrees",
          description: "Morning guided city tour: Merlion Park photo stop, Padang, Chinatown, and Little India. In the afternoon, visit the architectural wonders of Gardens by the Bay: walk inside the climate-controlled Flower Dome and misty Cloud Forest with a 35-meter indoor waterfall. Watch the magical Garden Rhapsody light show.",
          activities: "Merlion Park, Chinatown, Little India, Flower Dome, Cloud Forest, Supertree Light Show",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Singapore",
          distance: "30 km",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Universal Studios Singapore Full Day at Resorts World Sentosa",
          description: "Full day of thrilling cinematic adventures at Universal Studios Singapore on Sentosa Island. Ride the Battlestar Galactica dueling coasters, explore Transformers: The Ride 3D, Jurassic Park Rapids Adventure, and meet beloved movie characters.",
          activities: "Universal Studios 1-Day Pass, 7 themed movie zones, Thrill rollercoasters, Character meet & greet",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Singapore",
          distance: "20 km",
          duration: "Full Day",
        },
        {
          day: 4,
          title: "Sentosa Cable Car, Madame Tussauds & Wings of Time",
          description: "Scenic Singapore Cable Car ride across the harbor to Sentosa. Visit Madame Tussauds wax museum and Images of Singapore. In the evening, witness the spectacular Wings of Time multi-sensory laser, water, and fire show set against the open sea.",
          activities: "Singapore Cable Car Skypass, Madame Tussauds, Wings of Time sea fireworks & laser show",
          meal: "Breakfast & Dinner",
          stay: "Verified 4-Star Hotel in Singapore",
          distance: "25 km",
          duration: "Full Day",
        },
        {
          day: 5,
          title: "Marina Bay Sands SkyPark & Changi Airport Departure",
          description: "Enjoy breakfast at hotel. Visit the 57th floor Marina Bay Sands SkyPark Observation Deck for breathtaking 360-degree views across Singapore Strait. Transfer to Changi Airport for your flight back home.",
          activities: "Marina Bay Sands SkyPark, Orchard Road shopping, Changi Airport drop-off",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "20 km",
          duration: "40 mins",
        },
      ],
      inclusions: [
        "4 Nights accommodation in verified 4-Star hotel in Singapore (Bugis / Orchard / Clarke Quay area)",
        "Daily international buffet Breakfast and Indian Dinners",
        "Universal Studios Singapore 1-Day Pass with unlimited rides",
        "Gardens by the Bay double conservatory tickets (Flower Dome & Cloud Forest)",
        "Night Safari admission with tram ride and Creature of the Night show",
        "Singapore Cable Car Skypass round-trip tickets",
        "Wings of Time evening sea show tickets",
        "All private airport and sightseeing transfers in AC vehicles",
        "24/7 KRADIND on-tour assistance",
      ],
      exclusions: [
        "International flight tickets to/from Singapore",
        "Singapore eVisa processing fee (~₹2,500 per person)",
        "Universal Studios Express Pass (optional add-on)",
        "Lunches and personal shopping expenses",
        "Applicable GST & TCS",
      ],
      faqs: [
        {
          question: "How do Indian citizens apply for a Singapore Visa?",
          answer: "Singapore requires an electronic Visa (eVisa) applied via authorized visa agents. KRADIND provides complete visa submission assistance. Typical processing takes 3 to 5 working days.",
        },
        {
          question: "Is Singapore suitable for a family vacation with young children?",
          answer: "Singapore is the #1 family destination in Asia. The city is exceptionally safe, stroller-friendly, and offers world-class theme parks, aquariums, and interactive science centers.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "dest-maldives",
      name: "Maldives",
      slug: "maldives",
      category: "International",
      tagline: "Pristine Luxury: Private Island Resort, Turquoise Lagoons & Overwater Villa Escapes",
      duration: "3 Nights / 4 Days",
      price: 59999,
      originalPrice: 69999,
      bestSeason: "November to April",
      pickupDrop: "Velana International Airport (MLE), Malé (Speedboat / Seaplane Transfer)",
      suitableFor: "Honeymooners, Couples & Luxury Travelers",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
      badge: "Luxury Island",
      highlights: [
        "Overwater Lagoon Villa Stay with Direct Ocean Access",
        "Snorkeling with Sea Turtles, Reef Sharks & Manta Rays",
        "Romantic Sunset Dolphin Cruise",
        "Complimentary Speedboat Transfers across Turquoise Waters",
      ],
      color: "from-cyan-900/80",
      icon: "🇲🇻",
      status: "Published",
      overview: "Escape to the postcard-perfect paradise of the Indian Ocean. Stay in secluded private island villas perched over crystalline turquoise lagoons, snorkel through kaleidoscopic coral gardens teeming with tropical marine life, and celebrate romantic sunset moments on powder-soft white sand beaches.",
      itinerary: [
        {
          day: 1,
          title: "Arrival in Malé & Luxury Speedboat Transfer to Island Resort",
          description: "Arrive at Velana International Airport in Malé. Meet your resort host at the arrival terminal and board a high-speed speedboat slicing through turquoise waters to your private island resort. Check into your deluxe beach or water villa and sip a welcome tropical cocktail.",
          activities: "Airport welcome, Luxury speedboat transfer, Villa check-in, Sunset beach walk",
          meal: "Dinner included",
          stay: "Verified 4-Star / 5-Star Private Island Resort in Maldives",
          distance: "Speedboat Transfer",
          duration: "45 mins boat ride",
        },
        {
          day: 2,
          title: "House Reef Snorkeling & Sunset Dolphin Cruise",
          description: "Wake up to endless ocean vistas. After an international breakfast buffet, gear up with complimentary snorkeling equipment to explore the vibrant house reef just steps from your villa. In the late afternoon, set sail on a traditional wooden Dhoni for a sunset cruise to spot wild spinner dolphins leaping in the golden waves.",
          activities: "House reef snorkeling, Kayaking & Stand-up paddleboarding, Sunset Dolphin Cruise",
          meal: "Breakfast, Lunch & Dinner",
          stay: "Verified 4-Star / 5-Star Private Island Resort in Maldives",
          distance: "Island Resort",
          duration: "Full Day",
        },
        {
          day: 3,
          title: "Overwater Villa Bliss, Spa Relaxation & Candlelight Beach Dinner",
          description: "Enjoy a day of pure indulgence in your overwater villa. Step directly from your private sun deck into warm crystal waters. Book a soothing holistic couples massage at the overwater spa. In the evening, savor an unforgettable candlelight beachfront dinner under millions of twinkling stars.",
          activities: "Overwater villa lounging, Lagoon swimming, Optional couples spa session, Candlelight dinner",
          meal: "Breakfast, Lunch & Dinner",
          stay: "Overwater Lagoon Villa (Maldives Island Resort)",
          distance: "Island Resort",
          duration: "Full Day",
        },
        {
          day: 4,
          title: "Sunrise Lagoon Dip & Speedboat Transfer to Malé Airport",
          description: "Take a final morning dip in the turquoise lagoon. Enjoy a leisurely breakfast overlooking the ocean. Board your return speedboat to Velana International Airport for your flight back home with lifetime memories.",
          activities: "Leisurely breakfast, Resort checkout, Speedboat transfer to Malé Airport",
          meal: "Breakfast only",
          stay: "Departure (No stay)",
          distance: "Speedboat Transfer",
          duration: "45 mins boat ride",
        },
      ],
      inclusions: [
        "3 Nights luxury accommodation at verified 4-Star / 5-Star Private Island Resort",
        "Upgrade to Overwater Lagoon Villa included for 1 or 2 nights",
        "All-Inclusive / Full Board Meal Plan (Daily Breakfast, Lunch, and Dinners)",
        "Round-trip shared Speedboat transfers between Malé Airport and Resort",
        "Complimentary non-motorized water sports (Kayaking, Snorkeling gear, Stand-up paddleboarding)",
        "Sunset Dolphin Cruise excursion",
        "All Maldives Green Tax and resort service charges included",
        "24/7 KRADIND concierge support",
      ],
      exclusions: [
        "International airfare to and from Malé",
        "Motorized water sports (Jet skiing, Seabob, Parasailing)",
        "Spa treatments and premium imported champagne",
        "Personal overseas travel insurance",
        "Applicable GST & TCS",
      ],
      faqs: [
        {
          question: "Is visa required for Indian tourists visiting the Maldives?",
          answer: "No prior visa is needed! Maldives provides a FREE 30-day Visa on Arrival for Indian passport holders with confirmed hotel bookings and return flight tickets.",
        },
        {
          question: "How do transfers work from Malé Airport to the resort?",
          answer: "Our resort team greets you at the airport arrivals area. Depending on your resort's distance, you will board either a private speedboat (for South/North Malé Atolls) or a scenic seaplane.",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
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
          text: "As a solo trekker, I felt completely safe and cared for. Our expedition leader checked our oxygen levels twice daily. Best Himalayan experience ever!",
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
    {
      id: "lp-rajasthan-tour-package-6-days",
      slug: "rajasthan-tour-package-6-days",
      title: "Rajasthan Tour Package – 6 Days / 5 Nights",
      subtitle:
        "See the royal side of Rajasthan on a private 6-day journey through Jaipur, Jodhpur and Udaipur with private Swift Dzire, 3-star stays and meals.",
      badge: "⭐ PRIVATE COUPLE TOUR • JAIPUR - JODHPUR - UDAIPUR",
      heroImage:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "COUPLE SPECIAL OFFER",
        discountText: "Flat ₹42,999 (Breakfast) / ₹49,999 (Breakfast + Dinner)",
        code: "PADHARO2026",
        expiryDate: "2026-12-31T23:59:59.000Z",
      },
      highlights: [
        {
          title: "Three Major Cities in One Route",
          desc: "Connects the Pink City (Jaipur), the Blue City (Jodhpur), and the City of Lakes (Udaipur).",
          icon: "Sparkles",
        },
        {
          title: "Dedicated Private Swift Dzire",
          desc: "Car reserved exclusively for your couple for all 6 days with no large group rush.",
          icon: "ShieldCheck",
        },
        {
          title: "Practical 3-Star Accommodations",
          desc: "Clean, comfortable verified 3-star stays in central locations.",
          icon: "Mountain",
        },
        {
          title: "Two Meal Plan Options",
          desc: "Choose between Breakfast Only (₹42,999) or Breakfast + Dinner (₹49,999) for 2 adults.",
          icon: "Compass",
        },
      ],
      featuredTrekSlugs: ["chopta-tungnath-chandrashila", "hampta-pass"],
      inclusions: [
        "5 nights accommodation in selected 3-star hotels for 2 adults",
        "Private AC Swift Dzire for the complete itinerary with Jaipur pickup & Udaipur drop",
        "Daily breakfast (plus dinner if selecting the ₹49,999 plan)",
        "All driver allowances, fuel, tolls, and standard parking fees",
        "Sightseeing to Amber Fort, Mehrangarh, City Palace, Ranakpur & Lake Pichola",
      ],
      exclusions: [
        "Airfare or train tickets",
        "Monument, museum, fort entry tickets",
        "Lake Pichola boat ride",
        "Tourist guides & personal shopping",
      ],
      leadFormConfig: {
        title: "Get Your Rajasthan Tour Quote",
        subtitle:
          "Leave your WhatsApp number to receive complete day-by-day travel plan, hotel options, and booking voucher.",
        ctaText: "Get Rajasthan Quotation",
      },
      whatsappNumber: "917500222141",
      whatsappMessage:
        "Hi KRADIND! I want to book the Rajasthan Tour Package (6 Days / 5 Nights: Jaipur, Jodhpur, Udaipur).",
      faqs: [
        {
          question: "What is included in the 6-day Rajasthan tour package?",
          answer:
            "The package includes 5 nights of 3-star accommodation, private Swift Dzire transportation, Jaipur Airport/Railway Station pickup, Udaipur Airport/Railway Station drop, sightseeing and transfers listed in the itinerary, driver charges, fuel, tolls and standard parking. Breakfast is included in both plans, while the ₹49,999 option also includes dinner.",
        },
        {
          question: "Is this Rajasthan tour package private for couples?",
          answer:
            "Yes. The package is planned for 2 adults / one couple with a private Swift Dzire. You do not have to share the vehicle with another tourist group.",
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
      id: "lp-kerala-tour-package-5-nights-6-days",
      slug: "kerala-tour-package-5-nights-6-days",
      title: "Kerala Tour Package – 5 Nights / 6 Days",
      subtitle:
        "A well-planned Kerala holiday for couples covering Munnar tea hills, Thekkady wildlife, an Alleppey traditional houseboat stay, and Kochi heritage with private Swift Dzire.",
      badge: "⭐ PRIVATE COUPLE TOUR • KOCHI - MUNNAR - THEKKADY - ALLEPPEY",
      heroImage:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85",
      promoOffer: {
        tag: "COUPLE ALL-INCLUSIVE SPECIAL",
        discountText: "Flat ₹60,000 Total for 2 Adults (₹30,000 / person)",
        code: "KERALA2026",
        expiryDate: "2026-12-31T23:59:59.000Z",
      },
      highlights: [
        {
          title: "Private Swift Dzire For Complete Tour",
          desc: "Reserved exclusively for your couple for all 6 days from Kochi pickup to drop.",
          icon: "ShieldCheck",
        },
        {
          title: "Traditional Alleppey Houseboat Night",
          desc: "Backwater cruise through Vembanad Lake including lunch, snacks, candlelight dinner & breakfast.",
          icon: "Sparkles",
        },
        {
          title: "Munnar Hills & Thekkady Spices",
          desc: "Explore tea museums, Mattupetty dam, cardamom plantations, and Periyar wildlife.",
          icon: "Mountain",
        },
        {
          title: "Full Breakfast & Dinner Included",
          desc: "Daily breakfast and daily dinners at verified 3-star hotel stays plus full houseboat board.",
          icon: "Compass",
        },
      ],
      featuredTrekSlugs: ["kerala-tour-package"],
      inclusions: [
        "5 nights accommodation (2N Munnar, 1N Thekkady, 1N Alleppey Houseboat, 1N Kochi) for 2 adults",
        "Private AC Swift Dzire for the full 6-day itinerary",
        "Daily breakfast and daily dinners at hotels",
        "Houseboat lunch, evening tea/snacks, dinner and breakfast",
        "Kochi Airport / Railway Station pickup & drop + fuel, tolls and parking",
      ],
      exclusions: [
        "Airfare or train tickets to/from Kochi",
        "Monument, park, museum, and attraction entry fees",
        "Boating tickets (Mattupetty, Kundala, Periyar)",
        "Wildlife activities, elephant safari, Kathakali / martial arts show tickets",
      ],
      leadFormConfig: {
        title: "Get Your Kerala Tour Quote",
        subtitle:
          "Leave your WhatsApp number to receive complete day-by-day travel plan, hotel vouchers, and instant confirmation.",
        ctaText: "Get Kerala Quotation",
      },
      whatsappNumber: "917500222141",
      whatsappMessage:
        "Hi KRADIND! I want to book the Kerala Tour Package (5 Nights / 6 Days: Kochi, Munnar, Thekkady, Alleppey Houseboat).",
      faqs: [
        {
          question: "What is the cost of this 5 nights 6 days Kerala tour package?",
          answer:
            "The package costs ₹60,000 for 2 adults, which works out to ₹30,000 per person. It includes 3-star accommodation, private Swift Dzire transportation, daily breakfast and dinner at hotels, plus one night in an Alleppey houseboat with full houseboat meals.",
        },
        {
          question: "Is the Alleppey houseboat stay included?",
          answer:
            "Yes. The package includes one night on an Alleppey houseboat. The houseboat plan includes lunch, evening tea/snacks and dinner, along with breakfast as specified in the itinerary.",
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

export function getDefaultHomeSections(): HomeSectionsConfig {
  return {
    hero: {
      badge: "Certified Himalayan Guides • Small Safe Batches",
      title: "Experience the Himalayas",
      subtitle: "Explore handpicked Himalayan treks, tropical road trips, and international backpacking circuits.",
      bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
      imageAlt: "Domestic and international tour packages by KRAD Global in Dehradun",
      searchPlaceholder: "Search by trek name, state, pass or elevation...",
      popularTags: ["Kedarkantha", "Chopta Tungnath", "Hampta Pass", "Leh Ladakh", "Char Dham"],
    },
    monsoon: {
      enabled: true,
      title: "Monsoon Specials & Valley Blooms",
      subtitle: "Unlock exclusive rainy season discounts on UNESCO Valley of Flowers, Hampta Pass, and Kashmir circuits.",
      promoCode: "MONSOON2026",
      discountPercent: 20,
      badge: "Limited Season Offer",
    },
    topBar: {
      supportPhone: "+91 75002 22141",
      leaveNoTrace: "🌱 Leave No Trace Certified Operator",
      whatsappNumber: "+91 75002 22141",
      announcementText: "🔥 2026 Himalayan Batches Now Live with Early-Bird Discounts",
      announcementLink: "/treks",
    },
    bestTreks: {
      badge: "4.9+ Rated Flagship Expeditions",
      title: "Top Himalayan Treks & High Passes",
      subtitle: "Highest rated high-altitude alpine routes led by NIM-certified leaders.",
      featuredSlugs: [
        "chopta-tungnath-chandrashila",
        "hampta-pass",
        "kheerganga-trek",
        "leh-ladakh-tour-package",
      ],
    },
    weekendTreks: {
      badge: "Zero Work Leave Needed",
      title: "Weekend Escapes & Short Breaks",
      subtitle: "Quick Himalayan recharges designed to fit comfortably into Friday to Sunday departures.",
      featuredSlugs: [
        "chopta-tungnath-chandrashila",
        "kheerganga-trek",
        "nainital-tour-package",
        "jaipur-tour-package",
      ],
    },
    international: {
      enabled: true,
      badge: "World Expeditions & Island Escapes",
      title: "International Holiday Packages",
      subtitle: "Explore handpicked global destinations with complete visa assistance, verified stays, and private transfers.",
      featuredSlugs: ["nepal", "bali", "thailand", "dubai", "vietnam", "singapore", "maldives"],
    },
    eeat: {
      badge: "Expedition Authority & Curation",
      title: "Curated by KRADIND Expedition Team",
      role: "Chief Expedition Directorate • Nehru Institute of Mountaineering (NIM) Certified Leaders • WFA Certified",
      description: "Leading certified high-altitude alpine expeditions across Garhwal, Himachal, and Ladakh with over a decade of technical mountain terrain leadership and comprehensive mountain weather monitoring.",
      lastReviewed: "14 September 2026",
      policyLinkText: "Read Our Editorial & Safety Policy",
      policyLinkUrl: "/editorial-policy",
      auditBadgeText: "Fact-Checked & NIM/HMI Audited",
      trustCards: [
        {
          title: "4.9 / 5 Verified Rating",
          desc: "Consistently rated top-tier by over 2,480+ trekkers across India for certified safety, authentic trail guidance, and hygienic summit camps.",
          badge: "Award",
          icon: "Award",
        },
        {
          title: "Wilderness First Aid (WFA)",
          desc: "All guides undergo rigorous Wilderness First Aid training, carry dedicated oxygen canisters, pulse oximeters, and adhere to strict AMS protocols.",
          badge: "Activity",
          icon: "Activity",
        },
        {
          title: "Leave No Trace (LNT)",
          desc: "We adhere to strict zero-waste alpine ethics. All non-biodegradable waste is catalogued and packed down for eco-certified recycling in Dehradun.",
          badge: "Compass",
          icon: "Compass",
        },
        {
          title: "Small Batches (Max 15)",
          desc: "We limit departures to small groups for personalized guiding, optimal safety management, and uncompromised silence on pristine Himalayan ridges.",
          badge: "HeartHandshake",
          icon: "HeartHandshake",
        },
      ],
      faqs: [
        {
          q: "How does KRADIND Adventures verify high-altitude trail safety and weather?",
          a: "Our certified expedition leaders maintain direct VHF radio and satellite communication with base camps across Uttarakhand, Himachal Pradesh, and Ladakh. Every 24 hours, our ground coordinators inspect ridge stability, avalanche risks, and fresh snow levels before batch movements. When conditions change, updates are posted immediately to our Live Ground Radar.",
        },
        {
          q: "What medical and safety equipment is carried on Himalayan treks?",
          a: "Every departure carries high-altitude medical oxygen cylinders, pulse oximeters, automated first-aid trauma kits, and Gamow hyperbaric emergency protocols. All expedition directors are graduates of the Nehru Institute of Mountaineering (NIM) and hold Wilderness First Aid (WFA) certification to manage Acute Mountain Sickness (AMS) and high-altitude emergencies.",
        },
        {
          q: "What is your batch size policy and Leave No Trace (LNT) standard?",
          a: "We operate with a strict cap of 15 trekkers per batch to preserve trail silence, minimize alpine degradation, and provide 1:5 guide-to-trekker safety ratios. Under our Leave No Trace protocol, our teams collect and pack back all non-biodegradable waste from camps and mountain ridges for certified recycling in Dehradun.",
        },
        {
          q: "Why choose KRAD Global as your tour and travel company in Dehradun?",
          a: "KRAD Global is a trusted Dehradun-based tour and travel company offering domestic and international tour packages, customized holidays, Himalayan treks, and complete travel planning. We provide local Himalayan expertise, verified accommodations, licensed wilderness leaders, and 24/7 ground assistance.",
        },
        {
          q: "How can beginner trekkers prepare for their first Himalayan summit?",
          a: "We recommend four to six weeks of cardiovascular conditioning, including stair climbing, brisk walking, and core strengthening. Our trek desk provides customized training guides, gear rental checklists, and personalized consultations to ensure you have the correct footwear, layered clothing, and physical stamina before your departure.",
        },
      ],
    },
    contactAndFooter: {
      supportEmail: "support@kradind.com",
      supportPhone: "+91 75002 22141",
      whatsappLink: "https://wa.link/n3u8c0",
      address: "Rajpur Road, Jakhan, Dehradun, Uttarakhand – 248001, India",
      officeHours: "Open 24/7 for Expedition & Ground Support",
      instagramUrl: "https://www.instagram.com/kradglobal/",
      facebookUrl: "https://www.facebook.com/share/189E2RUcH4/",
      youtubeUrl: "https://youtube.com/@kradglobaltravels?si=jZDwhsl-h42P_YZW",
      twitterUrl: "https://x.com/KradGlobalTour",
      threadsUrl: "https://www.threads.net/@kradglobal",
      pinterestUrl: "https://in.pinterest.com/KradGlobalTravels/",
      copyrightText: "© 2026 KRADIND Adventures Private Limited. All rights reserved. Registered under Ministry of Tourism.",
    },
  };
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
    homeSections: getDefaultHomeSections(),
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
    destinations: getDefaultDestinations(),
  };
}

let memoryStore: CMSStoreData | null = null;
const TMP_STORE_FILE = path.resolve("/tmp", "cms-store.json");

export function readStore(): CMSStoreData {
  if (memoryStore) {
    return memoryStore;
  }

  // Check /tmp first if running on serverless
  try {
    if (fs.existsSync(TMP_STORE_FILE)) {
      const tmpRaw = fs.readFileSync(TMP_STORE_FILE, "utf8");
      const parsed: CMSStoreData = JSON.parse(tmpRaw);
      memoryStore = parsed;
      return parsed;
    }
  } catch {}

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {}
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial = getInitialStore();
      try {
        fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), "utf8");
      } catch {}
      memoryStore = initial;
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

    if (!parsed.destinations || parsed.destinations.length === 0) {
      parsed.destinations = getDefaultDestinations();
      updated = true;
    }

    const defaultSections = getDefaultHomeSections();
    const rawHome = parsed.homeSections as Partial<HomeSectionsConfig> | undefined;

    parsed.homeSections = {
      hero: { ...defaultSections.hero, ...(rawHome?.hero || {}) },
      monsoon: { ...defaultSections.monsoon, ...(rawHome?.monsoon || {}) },
      topBar: { ...defaultSections.topBar, ...(rawHome?.topBar || {}) },
      bestTreks: {
        badge: rawHome?.bestTreks?.badge || defaultSections.bestTreks.badge,
        title: rawHome?.bestTreks?.title || defaultSections.bestTreks.title,
        subtitle: rawHome?.bestTreks?.subtitle || defaultSections.bestTreks.subtitle,
        featuredSlugs:
          rawHome?.bestTreks?.featuredSlugs && rawHome.bestTreks.featuredSlugs.length > 0
            ? rawHome.bestTreks.featuredSlugs
            : defaultSections.bestTreks.featuredSlugs,
      },
      weekendTreks: {
        badge: rawHome?.weekendTreks?.badge || defaultSections.weekendTreks.badge,
        title: rawHome?.weekendTreks?.title || defaultSections.weekendTreks.title,
        subtitle: rawHome?.weekendTreks?.subtitle || defaultSections.weekendTreks.subtitle,
        featuredSlugs:
          rawHome?.weekendTreks?.featuredSlugs && rawHome.weekendTreks.featuredSlugs.length > 0
            ? rawHome.weekendTreks.featuredSlugs
            : defaultSections.weekendTreks.featuredSlugs,
      },
      international: {
        enabled: rawHome?.international?.enabled ?? defaultSections.international?.enabled ?? true,
        badge: rawHome?.international?.badge || defaultSections.international?.badge || "World Expeditions",
        title: rawHome?.international?.title || defaultSections.international?.title || "International Holiday Packages",
        subtitle: rawHome?.international?.subtitle || defaultSections.international?.subtitle || "Explore handpicked global destinations with complete visa assistance.",
        featuredSlugs:
          rawHome?.international?.featuredSlugs && rawHome.international.featuredSlugs.length > 0
            ? rawHome.international.featuredSlugs
            : defaultSections.international?.featuredSlugs || ["nepal", "bali", "thailand", "dubai", "vietnam", "singapore", "maldives"],
      },
      eeat: {
        badge: rawHome?.eeat?.badge || defaultSections.eeat.badge,
        title: rawHome?.eeat?.title || defaultSections.eeat.title,
        role: rawHome?.eeat?.role || defaultSections.eeat.role,
        description: rawHome?.eeat?.description || defaultSections.eeat.description,
        lastReviewed: rawHome?.eeat?.lastReviewed || defaultSections.eeat.lastReviewed,
        policyLinkText: rawHome?.eeat?.policyLinkText || defaultSections.eeat.policyLinkText,
        policyLinkUrl: rawHome?.eeat?.policyLinkUrl || defaultSections.eeat.policyLinkUrl,
        auditBadgeText: rawHome?.eeat?.auditBadgeText || defaultSections.eeat.auditBadgeText,
        trustCards:
          rawHome?.eeat?.trustCards && rawHome.eeat.trustCards.length > 0
            ? rawHome.eeat.trustCards
            : defaultSections.eeat.trustCards,
        faqs:
          rawHome?.eeat?.faqs && rawHome.eeat.faqs.length > 0
            ? rawHome.eeat.faqs
            : defaultSections.eeat.faqs,
      },
      contactAndFooter: {
        supportEmail: rawHome?.contactAndFooter?.supportEmail || defaultSections.contactAndFooter.supportEmail,
        supportPhone: rawHome?.contactAndFooter?.supportPhone || defaultSections.contactAndFooter.supportPhone,
        whatsappLink: rawHome?.contactAndFooter?.whatsappLink || defaultSections.contactAndFooter.whatsappLink,
        address: rawHome?.contactAndFooter?.address || defaultSections.contactAndFooter.address,
        officeHours: rawHome?.contactAndFooter?.officeHours || defaultSections.contactAndFooter.officeHours,
        instagramUrl: rawHome?.contactAndFooter?.instagramUrl || defaultSections.contactAndFooter.instagramUrl,
        facebookUrl: rawHome?.contactAndFooter?.facebookUrl || defaultSections.contactAndFooter.facebookUrl,
        youtubeUrl: rawHome?.contactAndFooter?.youtubeUrl || defaultSections.contactAndFooter.youtubeUrl,
        twitterUrl: rawHome?.contactAndFooter?.twitterUrl || defaultSections.contactAndFooter.twitterUrl,
        threadsUrl: rawHome?.contactAndFooter?.threadsUrl || defaultSections.contactAndFooter.threadsUrl,
        pinterestUrl: rawHome?.contactAndFooter?.pinterestUrl || defaultSections.contactAndFooter.pinterestUrl,
        copyrightText: rawHome?.contactAndFooter?.copyrightText || defaultSections.contactAndFooter.copyrightText,
      },
    };

    if (updated) {
      writeStore(parsed);
    }

    memoryStore = parsed;
    return parsed;
  } catch (error) {
    console.error("Error reading CMS store:", error);
    const initial = getInitialStore();
    memoryStore = initial;
    return initial;
  }
}

export function writeStore(data: CMSStoreData): void {
  memoryStore = data;
  const content = JSON.stringify(data, null, 2);

  // 1. Try primary file write
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    try {
      const tempFile = `${STORE_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, content, "utf8");
      fs.renameSync(tempFile, STORE_FILE);
      return;
    } catch {
      fs.writeFileSync(STORE_FILE, content, "utf8");
      return;
    }
  } catch (fsErr: any) {
    // Gracefully handle EROFS (Read-only file system on Vercel / serverless)
    console.warn("Primary file write skipped (serverless read-only filesystem):", fsErr?.message || fsErr);
  }

  // 2. Try /tmp write for serverless lambda caching
  try {
    fs.writeFileSync(TMP_STORE_FILE, content, "utf8");
  } catch (tmpErr: any) {
    console.warn("/tmp cache write skipped:", tmpErr?.message || tmpErr);
  }
}

export function getStoreTreks(): TrekData[] {
  try {
    return readStore().treks || [];
  } catch {
    return defaultTreks as unknown as TrekData[];
  }
}

export function getPublishedTreks(): TrekData[] {
  try {
    const all = getStoreTreks();
    return all.filter((t) => t.status === "Published");
  } catch {
    return defaultTreks as unknown as TrekData[];
  }
}

// ---------------------------------------------------------------------------
// Asynchronous MongoDB-Backed CMS Persistence Functions
// ---------------------------------------------------------------------------

export async function getHomeSectionsAsync(): Promise<HomeSectionsConfig> {
  try {
    const db = await getDb();
    const doc = await db.collection("kradind_config").findOne({ configKey: "homeSections" });
    if (doc) {
      const { _id, configKey, ...sections } = doc as any;
      if (sections.hero && sections.monsoon && sections.topBar) {
        const store = readStore();
        store.homeSections = sections as HomeSectionsConfig;
        return sections as HomeSectionsConfig;
      }
    }
  } catch (err) {
    console.warn("MongoDB getHomeSections error, fallback to local store:", err);
  }
  return readStore().homeSections;
}

export async function syncHomeSectionsToMongo(sections: HomeSectionsConfig): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("kradind_config").updateOne(
      { configKey: "homeSections" },
      { $set: { configKey: "homeSections", ...sections } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Failed to sync homeSections to MongoDB:", err);
  }
}

export async function getTreksAsync(): Promise<TrekData[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("kradind_treks").find({}).toArray();
    if (docs && docs.length > 0) {
      const cleanTreks = docs.map((doc: any) => {
        const { _id, ...rest } = doc;
        return rest as TrekData;
      });
      const store = readStore();
      store.treks = cleanTreks;
      return cleanTreks;
    }
  } catch (err) {
    console.warn("MongoDB getTreks error, fallback to local store:", err);
  }
  return readStore().treks || [];
}

export async function syncTreksToMongo(treks: TrekData[]): Promise<void> {
  try {
    const db = await getDb();
    const col = db.collection("kradind_treks");
    await col.deleteMany({});
    if (treks.length > 0) {
      await col.insertMany(treks);
    }
  } catch (err) {
    console.error("Failed to sync treks to MongoDB:", err);
  }
}

export async function getTrailReportsAsync(): Promise<TrailRadarReport[]> {
  try {
    const db = await getDb();
    const doc = await db.collection("kradind_config").findOne({ configKey: "trailReports" });
    if (doc && Array.isArray((doc as any).reports)) {
      const store = readStore();
      store.trailReports = (doc as any).reports;
      return (doc as any).reports;
    }
  } catch (err) {
    console.warn("MongoDB getTrailReports error, fallback to local store:", err);
  }
  return readStore().trailReports || [];
}

export async function syncTrailReportsToMongo(reports: TrailRadarReport[]): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("kradind_config").updateOne(
      { configKey: "trailReports" },
      { $set: { configKey: "trailReports", reports } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Failed to sync trailReports to MongoDB:", err);
  }
}

export async function getLandingPagesAsync(): Promise<LandingPageData[]> {
  try {
    const db = await getDb();
    const doc = await db.collection("kradind_config").findOne({ configKey: "landingPages" });
    if (doc && Array.isArray((doc as any).pages)) {
      const store = readStore();
      store.landingPages = (doc as any).pages;
      return (doc as any).pages;
    }
  } catch (err) {
    console.warn("MongoDB getLandingPages error, fallback to local store:", err);
  }
  return readStore().landingPages || [];
}

export async function syncLandingPagesToMongo(pages: LandingPageData[]): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("kradind_config").updateOne(
      { configKey: "landingPages" },
      { $set: { configKey: "landingPages", pages } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Failed to sync landingPages to MongoDB:", err);
  }
}

export function getStoreDestinations(): DestinationData[] {
  try {
    return readStore().destinations || getDefaultDestinations();
  } catch {
    return getDefaultDestinations();
  }
}

export function getPublishedDestinations(): DestinationData[] {
  try {
    return getStoreDestinations().filter((d) => d.status === "Published");
  } catch {
    return getDefaultDestinations();
  }
}

export async function getDestinationsAsync(): Promise<DestinationData[]> {
  try {
    const db = await getDb();
    const doc = await db.collection("kradind_config").findOne({ configKey: "destinations" });
    if (doc && Array.isArray((doc as any).destinations) && (doc as any).destinations.length > 0) {
      const store = readStore();
      store.destinations = (doc as any).destinations;
      return (doc as any).destinations;
    }
  } catch (err) {
    console.warn("MongoDB getDestinations error, fallback to local store:", err);
  }
  return readStore().destinations || getDefaultDestinations();
}

export async function syncDestinationsToMongo(destinations: DestinationData[]): Promise<void> {
  try {
    const db = await getDb();
    await db.collection("kradind_config").updateOne(
      { configKey: "destinations" },
      { $set: { configKey: "destinations", destinations } },
      { upsert: true }
    );
  } catch (err) {
    console.error("Failed to sync destinations to MongoDB:", err);
  }
}

export async function getInternationalDestinationsAsync(): Promise<DestinationData[]> {
  const all = await getDestinationsAsync();
  return all.filter((d) => d.category === "International");
}


