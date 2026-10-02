const fs = require("fs");
const path = require("path");

const storePath = path.resolve(__dirname, "../data/cms-store.json");

if (!fs.existsSync(storePath)) {
  console.error("Store file not found at:", storePath);
  process.exit(1);
}

const store = JSON.parse(fs.readFileSync(storePath, "utf8"));

// 1. Ensure seasonalCollection in homeSections
if (!store.homeSections) store.homeSections = {};
store.homeSections.seasonalCollection = {
  enabled: true,
  badge: "High Altitude Autumn Window",
  title: "Top 5 Treks for October-November",
  subtitle: "Oct-Nov is the best window for doing the high-altitude treks in our country with the clearest views. Here are the Top 5.",
  seasonTag: "October - November",
  featuredSlugs: [
    "kuari-pass-trek",
    "dayara-bugyal-trek",
    "deoriatal-chandrashila",
    "pench-tiger-trail",
    "chopta-tungnath-chandrashila"
  ]
};

// 2. Define Kuari Pass Batches matching screenshot exactly
const kuariPassBatches = [
  { id: 101, startDate: "3rd Oct", endDate: "8th Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 102, startDate: "4th Oct", endDate: "9th Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 103, startDate: "5th Oct", endDate: "10th Oct", slotsLeft: 0, price: 9999, status: "FULL", experienceTag: "Stargazing", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 104, startDate: "6th Oct", endDate: "11th Oct", slotsLeft: 0, price: 9999, status: "FULL", experienceTag: "Stargazing", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 105, startDate: "9th Oct", endDate: "14th Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 106, startDate: "10th Oct", endDate: "15th Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 107, startDate: "11th Oct", endDate: "16th Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 108, startDate: "12th Oct", endDate: "17th Oct", slotsLeft: 0, price: 9999, status: "FULL", experienceTag: "Stargazing", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 109, startDate: "13th Oct", endDate: "18th Oct", slotsLeft: 0, price: 9999, status: "FULL", experienceTag: "Stargazing", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 110, startDate: "16th Oct", endDate: "21st Oct", slotsLeft: 0, price: 9999, status: "WL", waitlistCount: 4, monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 111, startDate: "17th Oct", endDate: "22nd Oct", slotsLeft: 0, price: 9999, status: "WL", waitlistCount: 5, monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 112, startDate: "18th Oct", endDate: "23rd Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 113, startDate: "19th Oct", endDate: "24th Oct", slotsLeft: 0, price: 9999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 114, startDate: "20th Oct", endDate: "25th Oct", slotsLeft: 0, price: 9999, status: "WL", waitlistCount: 5, monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 115, startDate: "23rd Oct", endDate: "28th Oct", slotsLeft: 12, price: 9999, status: "AVBL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 116, startDate: "24th Oct", endDate: "29th Oct", slotsLeft: 10, price: 9999, status: "AVBL", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 117, startDate: "25th Oct", endDate: "30th Oct", slotsLeft: 1, price: 9999, status: "LAST", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  { id: 118, startDate: "26th Oct", endDate: "31st Oct", slotsLeft: 5, price: 9999, status: "LAST", monthGroup: "October 2026", seasonTheme: "Vibrant Colours" },
  // November batches
  { id: 119, startDate: "2nd Nov", endDate: "7th Nov", slotsLeft: 14, price: 9999, status: "AVBL", monthGroup: "November 2026", seasonTheme: "Clear Skies & First Snow" },
  { id: 120, startDate: "7th Nov", endDate: "12th Nov", slotsLeft: 8, price: 9999, status: "AVBL", experienceTag: "Stargazing", monthGroup: "November 2026", seasonTheme: "Clear Skies & First Snow" },
  { id: 121, startDate: "14th Nov", endDate: "19th Nov", slotsLeft: 2, price: 9999, status: "LAST", monthGroup: "November 2026", seasonTheme: "Clear Skies & First Snow" },
];

// Dayara Bugyal batches
const dayaraBatches = [
  { id: 201, startDate: "2nd Oct", endDate: "7th Oct", slotsLeft: 0, price: 8499, status: "FULL", monthGroup: "October 2026", seasonTheme: "Golden Meadows" },
  { id: 202, startDate: "8th Oct", endDate: "13th Oct", slotsLeft: 0, price: 8499, status: "FULL", experienceTag: "Family Friendly", monthGroup: "October 2026", seasonTheme: "Golden Meadows" },
  { id: 203, startDate: "15th Oct", endDate: "20th Oct", slotsLeft: 0, price: 8499, status: "WL", waitlistCount: 3, monthGroup: "October 2026", seasonTheme: "Golden Meadows" },
  { id: 204, startDate: "22nd Oct", endDate: "27th Oct", slotsLeft: 14, price: 8499, status: "AVBL", experienceTag: "Stargazing", monthGroup: "October 2026", seasonTheme: "Golden Meadows" },
  { id: 205, startDate: "28th Oct", endDate: "2nd Nov", slotsLeft: 2, price: 8499, status: "LAST", monthGroup: "October 2026", seasonTheme: "Golden Meadows" },
  { id: 206, startDate: "5th Nov", endDate: "10th Nov", slotsLeft: 12, price: 8499, status: "AVBL", monthGroup: "November 2026", seasonTheme: "Crisp Autumn" },
];

// Deoriatal Chandrashila batches
const deoriatalBatches = [
  { id: 301, startDate: "4th Oct", endDate: "9th Oct", slotsLeft: 0, price: 7999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Sunrise 360" },
  { id: 302, startDate: "11th Oct", endDate: "16th Oct", slotsLeft: 0, price: 7999, status: "WL", waitlistCount: 6, monthGroup: "October 2026", seasonTheme: "Sunrise 360" },
  { id: 303, startDate: "18th Oct", endDate: "23rd Oct", slotsLeft: 11, price: 7999, status: "AVBL", experienceTag: "Full Moon", monthGroup: "October 2026", seasonTheme: "Sunrise 360" },
  { id: 304, startDate: "25th Oct", endDate: "30th Oct", slotsLeft: 3, price: 7999, status: "LAST", monthGroup: "October 2026", seasonTheme: "Sunrise 360" },
];

// Pench Tiger Trail batches
const penchBatches = [
  { id: 401, startDate: "5th Oct", endDate: "8th Oct", slotsLeft: 0, price: 6999, status: "FULL", monthGroup: "October 2026", seasonTheme: "Wildlife Safari" },
  { id: 402, startDate: "12th Oct", endDate: "15th Oct", slotsLeft: 0, price: 6999, status: "WL", waitlistCount: 2, monthGroup: "October 2026", seasonTheme: "Wildlife Safari" },
  { id: 403, startDate: "19th Oct", endDate: "22nd Oct", slotsLeft: 10, price: 6999, status: "AVBL", experienceTag: "Photowalk", monthGroup: "October 2026", seasonTheme: "Wildlife Safari" },
  { id: 404, startDate: "26th Oct", endDate: "29th Oct", slotsLeft: 1, price: 6999, status: "LAST", monthGroup: "October 2026", seasonTheme: "Wildlife Safari" },
];

const newTreks = [
  {
    id: 9001,
    slug: "kuari-pass-trek",
    name: "Kuari Pass Trek",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Summit", "Autumn Special"],
    location: "Joshimath, Uttarakhand",
    region: "Garhwal Himalayas",
    duration: "6 Days",
    altitude: "12,516 ft",
    difficulty: "Moderate",
    price: 9999,
    originalPrice: 12999,
    badge: "Top Autumn Pick",
    rating: 4.9,
    reviewCount: 420,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    ],
    tagline: "The trek with the grandest mountain views of Uttarakhand",
    description: "Kuari Pass is known as the Curzon Trail, offering unmatched panoramic views of Mt Nanda Devi (India's second highest peak), Kamet, Dronagiri, and Chaukhamba. Oct-Nov brings crystal clear azure skies and vibrant alpine meadows.",
    overview: "Walk along ridge walks with 360 degree Himalayan mountain vistas. Camp under rhododendron glades and spot Nanda Devi sanctuary.",
    highlights: [
      "Unrivaled close-up vistas of India's highest peaks: Nanda Devi, Kamet, Trishul",
      "Spectacular ridge walk from Tali top to Khullara camp",
      "Pristine oak and rhododendron forest walking trails",
      "High altitude stargazing with zero light pollution"
    ],
    status: "Published",
    batches: kuariPassBatches,
    itinerary: [
      { day: 1, title: "Rishikesh to Joshimath drive (255 km)", description: "Drive along the holy confluence rivers Alaknanda and Mandakini.", altitude: "6,150 ft" },
      { day: 2, title: "Joshimath to Dhak drive, trek to Gulling camp", description: "Gradual climb through terraced villages into alpine forests.", altitude: "9,600 ft" },
      { day: 3, title: "Gulling to Tali Top campsite", description: "Climb through dense forests into open alpine meadows.", altitude: "11,000 ft" },
      { day: 4, title: "Tali to Kuari Pass summit (12,516 ft) and back to Khullara", description: "The grand summit day with 360 panorama of Garhwal giants.", altitude: "12,516 ft" },
      { day: 5, title: "Khullara to Dhak trek, drive to Joshimath", description: "Descent through scenic oak trails.", altitude: "6,150 ft" },
      { day: 6, title: "Joshimath to Rishikesh departure", description: "Early morning drive back to Rishikesh.", altitude: "1,120 ft" }
    ],
    inclusions: ["All meals on trek", "Tents and sleeping bags", "NIM-certified trek leader", "Forest permits and medical oxygen kit"],
    exclusions: ["Transit to/from Rishikesh", "Personal trekking gear", "Offloading backpacks"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9002,
    slug: "dayara-bugyal-trek",
    name: "Dayara Bugyal Trek",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Meadows", "Autumn Special"],
    location: "Raithal, Uttarakhand",
    region: "Uttarkashi, Uttarakhand",
    duration: "6 Days",
    altitude: "11,830 ft",
    difficulty: "Easy-Moderate",
    price: 8499,
    originalPrice: 10999,
    badge: "Family Friendly",
    rating: 4.9,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    tagline: "An ideal Himalayan trek for beginners and families",
    description: "Spread over 28 square kilometers of velvet alpine meadows, Dayara Bugyal is among India's most expansive and scenic high-altitude tablelands.",
    highlights: ["28 sq km rolling meadow walk", "Bandarpunch and Kala Nag views", "Ancient walnut and maple forests"],
    status: "Published",
    batches: dayaraBatches,
    itinerary: [
      { day: 1, title: "Dehradun to Raithal drive", description: "Scenic drive beside Bhagirathi river.", altitude: "7,400 ft" },
      { day: 2, title: "Raithal to Gui camp", description: "Gentle forest hike through oak trees.", altitude: "9,500 ft" },
      { day: 3, title: "Gui to Chilapada", description: "Trek to high camp at meadow edge.", altitude: "10,500 ft" },
      { day: 4, title: "Chilapada to Dayara Top and return", description: "Summit walk across vast grassy knolls.", altitude: "11,830 ft" },
      { day: 5, title: "Descent to Raithal", description: "Downhill stroll back to the village homestays.", altitude: "7,400 ft" },
      { day: 6, title: "Drive back to Dehradun", description: "Return journey.", altitude: "1,450 ft" }
    ],
    inclusions: ["All meals", "Quality alpine tents", "Certified leader", "Permits and first aid"],
    exclusions: ["Personal gear", "Dehradun travel"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9003,
    slug: "deoriatal-chandrashila",
    name: "Deoriatal Chandrashila",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Summit", "Autumn Special"],
    location: "Sari / Chopta, Uttarakhand",
    region: "Rudraprayag, Uttarakhand",
    duration: "6 Days",
    altitude: "12,083 ft",
    difficulty: "Moderate",
    price: 7999,
    originalPrice: 9999,
    badge: "360 Panoramic Summit",
    rating: 4.9,
    reviewCount: 450,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    tagline: "A summit climb to one of India's best panoramas",
    description: "From emerald Deoriatal lake reflecting the Chaukhamba massif to the 12,083 ft Chandrashila summit overlooking the Garhwal range, this is a timeless classic.",
    highlights: ["Reflection of Chaukhamba in Deoriatal Lake", "Highest Shiva temple in the world at Tungnath", "Summit sunrise panorama"],
    status: "Published",
    batches: deoriatalBatches,
    itinerary: [
      { day: 1, title: "Haridwar to Sari village", description: "Drive along the Alaknanda and Mandakini.", altitude: "6,600 ft" },
      { day: 2, title: "Sari to Deoriatal camp", description: "Short uphill walk to the alpine lake.", altitude: "7,840 ft" },
      { day: 3, title: "Deoriatal to Chopta through Rohini Bugyal", description: "Forest ridge trail through rhododendrons.", altitude: "8,800 ft" },
      { day: 4, title: "Chopta to Tungnath & Chandrashila Summit", description: "Climb to Tungnath temple and Chandrashila top.", altitude: "12,083 ft" },
      { day: 5, title: "Chopta to Sari descent", description: "Scenic trail return.", altitude: "6,600 ft" },
      { day: 6, title: "Return drive to Haridwar", description: "Safe return to railway station.", altitude: "1,000 ft" }
    ],
    inclusions: ["All meals", "Camps and homestays", "Permits", "Leader"],
    exclusions: ["Train travel", "Personal gear"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 9004,
    slug: "pench-tiger-trail",
    name: "Pench Tiger Trail",
    category: "Domestic",
    categories: ["Domestic", "Wildlife", "Trail", "Autumn Special"],
    location: "Pench National Park, MP",
    region: "Madhya Pradesh",
    duration: "4 Days",
    altitude: "2,004 ft",
    difficulty: "Easy",
    price: 6999,
    originalPrice: 8999,
    badge: "Jungle Expedition",
    rating: 4.8,
    reviewCount: 180,
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80"
    ],
    tagline: "Trek through the Jungles of Pench Tiger Reserve",
    description: "The inspiration for Rudyard Kipling's The Jungle Book. Explore buffer zone jungle trails, teak forests, and open safari tracks under expert naturalists.",
    highlights: ["Guided buffer-zone nature walks", "Open Jeep Tiger Safari", "Birdwatching over 250 species"],
    status: "Published",
    batches: penchBatches,
    itinerary: [
      { day: 1, title: "Arrival at Pench, briefing & evening nature walk", description: "Assembly at eco-lodge.", altitude: "1,800 ft" },
      { day: 2, title: "Morning Tiger Safari & afternoon forest walk", description: "Jeep safari in core park.", altitude: "2,004 ft" },
      { day: 3, title: "Totladoh reservoir trail & birdwatching", description: "Walk along reservoir banks.", altitude: "1,900 ft" },
      { day: 4, title: "Departure", description: "Transfer to Nagpur airport/railway.", altitude: "1,000 ft" }
    ],
    inclusions: ["All meals", "Eco-resort stay", "Jeep safari permits", "Naturalist guide"],
    exclusions: ["Airfare", "Personal expenses"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Add/update treks in store
newTreks.forEach((nt) => {
  const existingIndex = store.treks.findIndex((t) => t.slug === nt.slug);
  if (existingIndex >= 0) {
    store.treks[existingIndex] = { ...store.treks[existingIndex], ...nt };
    console.log("Updated existing trek:", nt.name);
  } else {
    store.treks.unshift(nt);
    console.log("Added new trek:", nt.name);
  }
});

fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
console.log("✅ Successfully seeded seasonal treks and batches into cms-store.json!");
