const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const allPackagesPath = path.resolve(__dirname, '..', 'data', 'all-packages.json');
const cmsStorePath = path.resolve(__dirname, '..', 'data', 'cms-store.json');
const travelDataPath = path.resolve(__dirname, '..', 'src', 'lib', 'travel-data.ts');

const packages = JSON.parse(fs.readFileSync(allPackagesPath, 'utf8'));

// Detailed Travel Tips, Booking Policies, and Cost Factors for each package
const packageMeta = {
  "meghalaya-tour-package": {
    cleanLastDayDesc: `After breakfast, begin your return journey from Shillong towards Guwahati. Depending on your departure time, you can include a short stop en route by scenic Umiam Lake and roadside fruit orchards.

Arrive at Guwahati Airport or Railway Station for your onward journey. Your Meghalaya holiday ends with timeless memories of waterfalls, green hills and the quiet charm of Northeast India.

The itinerary can be modified according to hotel availability, weather, road conditions, attraction timings and your travel preferences.`,
    travelTips: [
      {
        title: "Carry Rain Protection",
        desc: "Even outside the peak monsoon period, weather can change quickly in the Khasi and Jaintia Hills. Always carry a lightweight rain jacket or umbrella."
      },
      {
        title: "Wear Practical Footwear",
        desc: "Waterfalls, caves, viewpoints and living root bridge paths involve wet, mossy, or uneven rocky surfaces. Sturdy grip walking shoes are essential."
      },
      {
        title: "Keep Your Itinerary Flexible",
        desc: "Rain and hill road conditions can affect travel times. Avoid scheduling every single attraction too tightly."
      },
      {
        title: "Carry Sufficient Cash",
        desc: "Cards and digital UPI payments may not work reliably in remote villages, river valleys, and rural roadside cafes."
      },
      {
        title: "Start Your Days Early",
        desc: "Long scenic road journeys are common across Meghalaya. Early starts leave more daylight for sightseeing and reduce pressure on your itinerary."
      },
      {
        title: "Respect Local Communities",
        desc: "Meghalaya has a rich matrilineal culture. Follow local guidelines, avoid littering in sacred groves, and always ask permission before photographing local people."
      },
      {
        title: "Check Activity Conditions",
        desc: "Umngot river boating at Dawki, spelunking in Mawsmai Cave, and root bridge treks depend on seasonal water levels and local operating conditions."
      }
    ],
    bookingPolicy: [
      "Availability is subject to confirmation at the time of booking.",
      "An advance payment is required to confirm boutique hotels and private vehicles.",
      "Remaining payment will be due according to the confirmed booking schedule.",
      "Changes to travel dates or vehicle upgrades may result in supplier fare adjustments.",
      "Supplier cancellation charges may apply according to hotel and transport policies.",
      "Weather-related disruptions will follow Meghalaya Tourism and local administration guidelines."
    ],
    costFactors: [
      "Travel dates and peak holiday seasonality (monsoon vs winter/spring)",
      "Hotel category (Standard / Deluxe / Boutique Resort)",
      "Number of travellers (couple / family / private small group)",
      "Dedicated private vehicle type (Sedan / SUV / Tempo Traveller)",
      "Additional destinations (Double Decker Root Bridge, Jowai, Mawsynram)",
      "Included meals and adventure activity arrangements"
    ]
  },
  "jaipur-tour-package": {
    cleanLastDayDesc: `Depending on your departure time, visit Jal Mahal, Albert Hall Museum or another attraction of your choice. You can also use the morning for shopping colourful textiles and handicrafts at traditional bazaars before your transfer to Jaipur Airport or railway station.

This itinerary can be customised according to hotel location, traffic, attraction timings and your travel requirements.`,
    travelTips: [
      {
        title: "Wear Comfortable Walking Shoes",
        desc: "Exploring historic hill forts like Amer, Jaigarh, and sprawling palace courtyards involves significant walking over stone ramps."
      },
      {
        title: "Dress Respectfully for Heritage Sights",
        desc: "When visiting active temples, royal cenotaphs, and religious monuments, choose attire covering shoulders and knees."
      },
      {
        title: "Stay Hydrated & Sun-Protected",
        desc: "Jaipur days can be warm and sunny. Keep drinking water, sunglasses, sunscreen, and a light cotton hat with you."
      },
      {
        title: "Plan Around Monument Timings",
        desc: "Major monuments like City Palace and Jantar Mantar have specific ticketing hours. Plan your visits early in the morning to beat crowds."
      },
      {
        title: "Shop Sensibly in Bazaars",
        desc: "For precious gemstones, handmade quilts, and blue pottery, insist on authentic vendor receipts and explore government-approved emporiums."
      },
      {
        title: "Keep Free Time in Your Schedule",
        desc: "Allow time to relax, savor authentic Rajasthani thalis and pyaaz kachoris at legendary local eateries without rushing."
      }
    ],
    bookingPolicy: [
      "Availability is subject to confirmation at the time of reservation.",
      "Advance deposit required to reserve heritage havelis, hotels, and AC private transport.",
      "Remaining payment to be cleared per booking voucher schedule.",
      "Cancellation charges apply according to hotel and vehicle supplier rules."
    ],
    costFactors: [
      "Travel dates (peak winter Oct-Mar vs summer season)",
      "Hotel category (Heritage Haveli / 3-Star / 4-Star / 5-Star Luxury)",
      "Private AC vehicle choice (Sedan / Innova / Tempo Traveller)",
      "Group size and customised sightseeing additions"
    ]
  },
  "goa-tour-package": {
    cleanLastDayDesc: `Enjoy a relaxed breakfast and check out from your hotel according to your flight or train schedule.

You will be transferred via private vehicle to Goa Airport (Dabolim or Mopa) or the railway station for your onward travel.

Take home sun-kissed beach memories, palm-fringed coastal sunsets, and rich Portuguese heritage experiences from your holiday with KRAD Global.`,
    travelTips: [
      {
        title: "Beach & Swim Safety",
        desc: "Always pay attention to lifeguard flags along the beaches. Avoid swimming in rough seas or during red-flag advisories."
      },
      {
        title: "Sun & Heat Protection",
        desc: "Carry high-SPF sunscreen, sunglasses, light breathable cotton wear, and stay hydrated throughout beach excursions."
      },
      {
        title: "Licensed Vehicle Rentals",
        desc: "When renting scooters or self-drive cars, always inspect vehicle condition, carry a valid driving license, and wear helmets at all times."
      },
      {
        title: "Respect Heritage Sanctuaries",
        desc: "When touring Old Goa churches like Basilica of Bom Jesus, follow the modest dress code and maintain quiet inside."
      },
      {
        title: "Explore Beyond the Beaches",
        desc: "Take time for spice plantation tours, Latin Quarter heritage walks in Fontainhas, and dolphin boat cruises along the Mandovi River."
      }
    ],
    bookingPolicy: [
      "Booking confirmation subject to resort room availability.",
      "Advance deposit required to confirm beachside resorts and airport transfers.",
      "Cancellation policies vary during peak festive seasons (Christmas / New Year).",
      "Valid government photo IDs required for all adult guests at hotel check-in."
    ],
    costFactors: [
      "Travel season (peak New Year/Christmas vs monsoon/summer specials)",
      "Accommodation tier (Boutique Villa / Beach Resort / 4-Star Luxury)",
      "Vehicle requirements (Self-drive / Dedicated AC private cab)",
      "Water sports and island boat cruise inclusions"
    ]
  },
  "hampta-pass": {
    cleanLastDayDesc: `Drive Distance: Approx. 60–70 km | Drive Duration: Approx. 4–6 hours | End Point: Manali

After breakfast at Chhatru campsite, begin the scenic drive back towards Manali through the Atal Tunnel and Rohtang corridor. The journey transitions dramatically from the barren, moonscape terrain of Lahaul into the lush pine-clad valleys of Kullu.

Your Hampta Pass Crossover Trek concludes upon reaching Manali. We recommend keeping onward bus or flight bookings flexible as mountain roads can experience traffic delays.`,
    travelTips: [
      {
        title: "Layered Alpine Clothing",
        desc: "Weather on high mountain passes changes rapidly. Dress in 3-4 breathable layers including a thermal base, fleece jacket, and windproof outer shell."
      },
      {
        title: "Sturdy Trekking Boots",
        desc: "Wear broken-in ankle-support trekking boots with deep grip soles. Avoid brand-new footwear to prevent trail blisters."
      },
      {
        title: "Hydration & Acclimatization",
        desc: "Drink 3–4 litres of fluids daily. Gradual pacing and deep breathing help prevent Acute Mountain Sickness (AMS)."
      },
      {
        title: "Follow River Crossing Protocols",
        desc: "Unclip backpack waist belts during stream crossings and strictly follow guide instructions and human-chain formations."
      },
      {
        title: "Leave No Trace Principles",
        desc: "The pristine high-altitude meadows of Balu Ka Ghera and Shea Goru are ecologically sensitive. Pack out all non-biodegradable waste."
      }
    ],
    bookingPolicy: [
      "Trek confirmation subject to fitness self-declaration and medical disclaimer.",
      "Advance booking deposit secures campsite inventory, high-altitude gear, and guide ratio.",
      "Cancellation charges apply based on notice period prior to trek batch start date.",
      "Route alterations may be made by the trek leader for trekker safety during adverse weather."
    ],
    costFactors: [
      "Trek batch departure date and group size",
      "Rental gear requirements (trekking poles, crampons, waterproof poncho)",
      "Offloading service for personal backpack on mules",
      "Chandratal Lake excursion vehicle upgrade"
    ]
  },
  "kheerganga-trek": {
    cleanDay1Desc: `Route: Barshaini → Nakthan → Rudranag → Kheerganga | Trek Time: Around 5–6 hours | Altitude: 9,700 Ft

Start early from Barshaini, the scenic roadhead and standard base for the Kheerganga trek. The trail meanders through apple orchards and rustic wooden Himachali homes in Nakthan village, overlooking the roaring Parvati River.

Pause at the sacred Rudranag waterfall for refreshing mountain water and local tea. Continue climbing through towering deodar, oak, and pine forests until you emerge into the panoramic alpine meadow of Kheerganga, renowned for its natural geothermal hot water springs with 360-degree valley views.`,
    cleanLastDayDesc: `Route: Kheerganga → Rudranag → Nakthan → Barshaini | Trek Time: Around 4–5 hours

Wake up to crisp Himalayan morning breezes and golden sunrise rays illuminating the snow-clad peaks. Enjoy a hearty breakfast at the campsite.

Begin the descent retracing the forest trail carefully down towards Barshaini. Step mindfully over rocky roots and downhill stone sections. Arrive at Barshaini by afternoon, where local buses and shared taxis connect to Kasol, Manikaran, and Bhuntar for your onward journey.`,
    travelTips: [
      {
        title: "Start Trail Early",
        desc: "Begin your hike from Barshaini by 8:00 AM to comfortably reach Kheerganga meadow well before sunset."
      },
      {
        title: "Trekker Footwear with Traction",
        desc: "Wet boulders near waterfalls and forest mud paths can be slippery. Wear sturdy trekking shoes with reliable rubber lugs."
      },
      {
        title: "Sanctuary Etiquette at Hot Springs",
        desc: "The natural geothermal sulphur bath is revered as a sacred site. Maintain sanctity, follow separate bathing sections, and avoid soap or chemical detergents."
      },
      {
        title: "Night Warmth & Lighting",
        desc: "Temperatures drop sharply after dark at 9,700 ft. Carry a reliable headlamp or torch and warm fleece/thermal wear."
      },
      {
        title: "Eco-Conscious Travel",
        desc: "Parvati Valley has strict anti-littering rules. Carry all plastic wrappers, bottles, and snack packs back down to Barshaini."
      }
    ],
    bookingPolicy: [
      "Campsite tent allotment is subject to local village authority regulations.",
      "Advance deposit confirms alpine tent accommodation, meals, and mountain guide.",
      "Transfers between Bhuntar/Kasol and Barshaini available on private cab request."
    ],
    costFactors: [
      "Weekend vs weekday departures",
      "Tent type (Alpine Dome Tent / Swiss Luxury Tent / Homestay)",
      "Meals plan (Breakfast & Dinner vs All Meals)",
      "Kasol to Barshaini pickup and drop options"
    ]
  },
  "nainital-tour-package": {
    cleanLastDayDesc: `Enjoy breakfast overlooking the mist-covered Kumaon hills and complete check-out. Depending on your departure schedule from Kathgodam Railway Station, Pantnagar Airport, or Delhi, spend a relaxed morning boating on Naini Lake or shopping for handcrafted candles and woolens along the Mall Road.

Transfer to your departure point according to your travel schedule. Your Nainital lake tour concludes with beautiful memories of emerald waters, colonial architecture, and Himalayan views.`,
    travelTips: [
      {
        title: "Light Woolens Year-Round",
        desc: "Even in peak summer, lake breezes and mountain evenings in Nainital can turn chilly. Always pack a light jacket or cardigan."
      },
      {
        title: "Comfortable Walking Shoes",
        desc: "Nainital's iconic Mall Road, Thandi Sadak, and Tiffin Top viewpoints are pedestrian-centric. Comfortable flat walking shoes are recommended."
      },
      {
        title: "Buffer Time for Hill Traffic",
        desc: "During summer weekends and holiday seasons, Kathgodam-Nainital ghat roads experience heavy traffic. Keep adequate airport/train buffer times."
      },
      {
        title: "Eco & Lake Regulations",
        desc: "Naini Lake is a protected biosphere. Single-use plastic bags are banned, and smoking or littering around the lake promenade attracts penalties."
      },
      {
        title: "Explore Greater Kumaon Lakes",
        desc: "Consider taking day trips to Bhimtal, Naukuchiatal, and Sattal for serene kayaking and quieter pine-fringed waters."
      }
    ],
    bookingPolicy: [
      "Room confirmations subject to hotel availability at the time of reservation.",
      "Advance deposit confirms lake-view hotel and private hill cab.",
      "Standard 12:00 noon checkout applies unless late checkout is pre-arranged."
    ],
    costFactors: [
      "Travel season (May-June peak summer vs autumn/winter snow season)",
      "Hotel category (Lake Facing / Hill View / Luxury Heritage)",
      "Transport options (Kathgodam transfer vs Delhi roundtrip cab)",
      "Sightseeing excursions (Mukteshwar, Ranikhet, or Corbett National Park)"
    ]
  },
  "jaisalmer-tour-package": {
    cleanLastDayDesc: `Enjoy breakfast at the luxury desert camp or city heritage hotel and complete checkout formalities. Depending on your train or flight schedule, enjoy free time exploring the narrow alleys inside the living Golden Fort or shopping for camel leather goods, block prints, and desert handicrafts.

Transfer to Jaisalmer Railway Station or Airport for your onward journey. Your desert adventure concludes with unforgettable memories of golden dunes, starlit skies, and royal Rajasthani hospitality.`,
    travelTips: [
      {
        title: "Desert Sun Protection",
        desc: "The Thar Desert receives intense sunlight throughout the year. Always carry broad-spectrum sunscreen (SPF 50), polarized sunglasses, and a lightweight scarf."
      },
      {
        title: "Warm Layers for Desert Nights",
        desc: "From October to March, while desert daytime temperatures are pleasant, temperatures plummet after sunset. Bring warm jackets, shawls, or thermals for the dunes."
      },
      {
        title: "Hydration on the Dunes",
        desc: "Dry desert air leads to fast dehydration. Keep a reusable water bottle handy during camel treks and 4x4 dune bashing."
      },
      {
        title: "Authentic Golden Fort Shopping",
        desc: "Sonamukhi yellow sandstone carvings, mirror-work textiles, and camel leather items are best purchased from local artisan cooperatives with itemized bills."
      },
      {
        title: "Responsible Dune Tourism",
        desc: "Do not leave plastic bottles or wrappers on the sand dunes. Protect the fragile Thar Desert ecosystem and respect local desert folk artists."
      }
    ],
    bookingPolicy: [
      "Camp bookings confirmed upon advance deposit clearance.",
      "Camp inclusions include evening folk music, cultural dance, and Rajasthani buffet dinner.",
      "Dune safari vehicle slots are pre-allocated according to sunset timings."
    ],
    costFactors: [
      "Seasonal demand (Desert Festival / New Year vs regular winter dates)",
      "Camp luxury level (Standard Swiss Tent vs Royal AC Jacuzzi Tent)",
      "Adventure activities (Parasailing / Quad Biking / Jeep Dune Bashing)",
      "Private vehicle type for Jodhpur-Jaisalmer highway transfers"
    ]
  },
  "chopta-tungnath-chandrashila": {
    travelTips: [
      {
        title: "Dress in Multi-Weather Layers",
        desc: "Chopta meadows experience cool breezes while Chandrashila summit at 13,100 ft can be very windy and cold. Carry thermals, fleece, and a windbreaker."
      },
      {
        title: "Sturdy Trekking Shoes with Grip",
        desc: "The paved path from Chopta to Tungnath has steep inclines, while the trail from Tungnath to Chandrashila is rocky. Deep-tread shoes are mandatory."
      },
      {
        title: "Pace Your Summit Ascent",
        desc: "Start early by 5:00 AM from Chopta to catch the golden sunrise over Nanda Devi, Chaukhamba, and Trishul from the Chandrashila peak."
      },
      {
        title: "Carry Reusable Hydration Flask",
        desc: "Plastic bottles are discouraged in the Kedarnath Wildlife Sanctuary. Carry a reusable thermos for warm drinking water."
      }
    ]
  },
  "kerala-tour-package": {
    travelTips: [
      {
        title: "Light Breathable Clothing",
        desc: "Kerala has a warm, tropical climate. Pack loose-fitting cotton clothing, sunglasses, and a lightweight umbrella for brief showers."
      },
      {
        title: "Warm Layer for Munnar Hills",
        desc: "Munnar's tea-clad hills sit at 5,200 ft where evening temperatures drop significantly. Bring a light pullover or jacket."
      },
      {
        title: "Houseboat Etiquette in Alleppey",
        desc: "Houseboats cruise during daylight hours and anchor by 5:30 PM per inland water authority safety regulations. Enjoy the sunset views over the paddy fields."
      },
      {
        title: "Temple & Cultural Dress Codes",
        desc: "Traditional attire is required at several ancient temples like Padmanabhaswamy. Check dress rules in advance."
      }
    ]
  },
  "maharashtra-tour-package": {
    travelTips: [
      {
        title: "Comfortable Footwear for Viewpoints",
        desc: "Visiting Arthur's Seat, Elephant's Head Point, and Table Land in Panchgani requires walking on uneven rocky surfaces."
      },
      {
        title: "Monsoon Preparedness (July - Sept)",
        desc: "The Western Ghats receive heavy rainfall. Carry sturdy umbrellas, waterproof phone pouches, and non-slip sandals or boots."
      },
      {
        title: "Farm-Fresh Strawberry Season",
        desc: "The peak strawberry harvesting season in Mahabaleshwar runs from December to March. Fresh farm tastings and Mapro Garden visits are a highlight."
      },
      {
        title: "Ghat Road Driving Caution",
        desc: "The ghat roads feature sharp hairpin turns. Drive carefully or hire experienced local cab drivers familiar with Sahyadri fog and mist."
      }
    ]
  },
  "leh-ladakh-tour-package": {
    travelTips: [
      {
        title: "Mandatory 48-Hour Acclimatization",
        desc: "Upon landing at Leh (11,500 ft), rest completely for the first 2 days. Avoid climbing stairs or exertion to prevent AMS."
      },
      {
        title: "Intense Hydration Routine",
        desc: "Drink 3–4 litres of water, herbal tea, or ORS daily in high-altitude desert air. Avoid alcohol and smoking during early days."
      },
      {
        title: "High UV & Solar Protection",
        desc: "The thin atmosphere causes high UV exposure. Apply SPF 50+ sunscreen, lip balm, and wear category-3 polarized sunglasses."
      },
      {
        title: "Inner Line Permits & IDs",
        desc: "Keep multiple printed copies of your Inner Line Permit and original government photo ID for military checkpoints across Khardung La and Chang La."
      },
      {
        title: "Extreme Sub-Zero Thermal Gear",
        desc: "High passes and Pangong Lake camps freeze at night. Carry heavy down jackets, woolen caps, thermal inners, and insulated gloves."
      }
    ]
  },
  "sikkim-tour-package": {
    travelTips: [
      {
        title: "Permit Documentation Ready",
        desc: "Nathula Pass, Tsomgo Lake, and North Sikkim require special permits. Carry 6-8 passport-size photos and original Govt photo IDs."
      },
      {
        title: "Heavy Woolens for North Sikkim",
        desc: "Yumthang Valley, Zero Point, and Gurudongmar Lake reach sub-zero temperatures even in spring. Heavy down parkas and gloves are essential."
      },
      {
        title: "Zero Single-Use Plastic Mandate",
        desc: "Single-use packaged water bottles are strictly prohibited in North Sikkim (Lachen & Lachung). Carry reusable metal water flasks."
      },
      {
        title: "Cash Reserves for Mountain Towns",
        desc: "Network connectivity is limited in remote Himalayan hamlets. Carry adequate cash for food, hot water, and local taxis."
      }
    ]
  },
  "assam-tour-package": {
    travelTips: [
      {
        title: "Safari Clothing in Neutral Tones",
        desc: "Wear earthy, muted colours (khaki, olive green, brown, beige) on Kaziranga jeep and elephant safaris to avoid startling wildlife."
      },
      {
        title: "Optics & Wildlife Photography",
        desc: "Bring good binoculars and a telephoto camera lens (200mm–600mm) for spot-on rhino, tiger, and migratory bird sightings."
      },
      {
        title: "Chilly Morning Safari Breeze",
        desc: "Early morning 6:00 AM safari slots inside the jungle can be cold in open jeeps. Carry a fleece jacket, scarf, and windcheater."
      },
      {
        title: "Respect Wildlife Regulations",
        desc: "Maintain strict silence inside national parks. Never step down from safari jeeps unless permitted at designated watchtowers."
      }
    ]
  }
};

// Process each package in allPackages
packages.forEach(pkg => {
  const meta = packageMeta[pkg.slug];
  if (!meta) return;

  // 1. Clean last day description if provided
  if (meta.cleanLastDayDesc && pkg.itinerary && pkg.itinerary.length > 0) {
    pkg.itinerary[pkg.itinerary.length - 1].description = meta.cleanLastDayDesc;
  }

  // 2. Clean Day 1 description if provided (e.g. kheerganga)
  if (meta.cleanDay1Desc && pkg.itinerary && pkg.itinerary.length > 0) {
    pkg.itinerary[0].description = meta.cleanDay1Desc;
  }

  // 3. Attach structured travelTips
  if (meta.travelTips) {
    pkg.travelTips = meta.travelTips;
  }

  // 4. Attach bookingPolicy and costFactors
  if (meta.bookingPolicy) {
    pkg.bookingPolicy = meta.bookingPolicy;
  }
  if (meta.costFactors) {
    pkg.costFactors = meta.costFactors;
  }
});

// Write to data/all-packages.json
fs.writeFileSync(allPackagesPath, JSON.stringify(packages, null, 2), 'utf8');
console.log('Successfully cleaned and saved data/all-packages.json');

// Write to data/cms-store.json
if (fs.existsSync(cmsStorePath)) {
  const store = JSON.parse(fs.readFileSync(cmsStorePath, 'utf8'));
  store.treks = packages;
  fs.writeFileSync(cmsStorePath, JSON.stringify(store, null, 2), 'utf8');
  console.log('Successfully updated data/cms-store.json');
}

// Generate src/lib/travel-data.ts
const tsContent = `// Autogenerated from official tour packages data
export interface TrekItineraryDay {
  day: number;
  title: string;
  description: string;
  altitude?: string;
  meal?: string;
  stay?: string;
  distance?: string;
  duration?: string;
}

export interface TrekBatch {
  id: number;
  startDate: string;
  endDate: string;
  slotsLeft: number;
  price: number;
}

export interface TrekFAQ {
  question: string;
  answer: string;
}

export interface TravelTip {
  title: string;
  desc: string;
}

export interface TrekData {
  id: number;
  slug: string;
  name: string;
  category: string;
  categories: string[];
  location: string;
  region: string;
  duration: string;
  altitude: string;
  difficulty: string;
  price: number;
  originalPrice: number;
  badge: string;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  tagline: string;
  defaultHighlights: string[];
  highlights: string[];
  itinerary: TrekItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  faqs?: TrekFAQ[];
  batches?: TrekBatch[];
  overview?: string;
  travelTips?: TravelTip[];
  bookingPolicy?: string[];
  costFactors?: string[];
  file?: string;
  status?: string;
}

export const treks: TrekData[] = ${JSON.stringify(packages, null, 2)};
`;

fs.writeFileSync(travelDataPath, tsContent, 'utf8');
console.log('Successfully regenerated src/lib/travel-data.ts');

// Sync to MongoDB Atlas
const uri = process.env.MONGODB_URI || 'mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority';

async function syncMongo() {
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    const db = client.db('flight_search');
    const col = db.collection('kradind_treks');
    await col.deleteMany({});
    await col.insertMany(packages);
    console.log('Successfully synced ' + packages.length + ' clean treks to MongoDB Atlas (kradind_treks)');
    await client.close();
  } catch (err) {
    console.warn('MongoDB Atlas sync note (will use local fallback if offline):', err.message);
  }
}

syncMongo();

