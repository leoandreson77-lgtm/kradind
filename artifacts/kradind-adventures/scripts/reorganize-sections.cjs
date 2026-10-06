const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority';
const cmsStorePath = path.join(__dirname, '..', 'data', 'cms-store.json');

const autumnPackages = [
  {
    id: 9001,
    slug: "kuari-pass-trek",
    name: "Kuari Pass Trek",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Fixed Departure", "Summit"],
    location: "Joshimath, Uttarakhand",
    region: "Garhwal Himalayas",
    duration: "6 Days / 5 Nights",
    altitude: "12,516 Ft",
    difficulty: "Moderate",
    price: 9499,
    originalPrice: 12999,
    badge: "Lord Curzon Trail",
    rating: 4.9,
    reviewCount: 180,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    tagline: "Spectacular close-up views of Mt. Nanda Devi, Dronagiri, and Kamet across alpine oak forests.",
    highlights: ["Unobstructed views of Mt. Nanda Devi", "Gorson Bugyal high meadows", "Ancient oak and rhododendron forest walk"],
    defaultHighlights: ["Mt Nanda Devi views", "Gorson Bugyal ridge walk", "Joshimath basecamp"],
    inclusions: ["All meals during trek", "Tented accommodation", "Certified trek leader", "Forest permits"],
    exclusions: ["Transport to basecamp", "Backpack offloading", "Personal gear"],
    batches: [
      { id: 1, startDate: "10 Oct 2026", endDate: "15 Oct 2026", slotsLeft: 8, price: 9499, status: "AVBL" },
      { id: 2, startDate: "24 Oct 2026", endDate: "29 Oct 2026", slotsLeft: 6, price: 9499, status: "AVBL" }
    ],
    status: "Published"
  },
  {
    id: 9002,
    slug: "dayara-bugyal-trek",
    name: "Dayara Bugyal Trek",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Fixed Departure", "Meadows"],
    location: "Raithal, Uttarakhand",
    region: "Garhwal Himalayas",
    duration: "5 Days / 4 Nights",
    altitude: "11,830 Ft",
    difficulty: "Easy to Moderate",
    price: 8499,
    originalPrice: 10999,
    badge: "High Alpine Meadows",
    rating: 4.8,
    reviewCount: 210,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    tagline: "India's most pristine rolling velvet alpine meadow with panoramic views of the Gangotri massif.",
    highlights: ["Endless rolling green bugyals", "Panoramic Gangotri I, II, III views", "Barnala lake campsite"],
    defaultHighlights: ["Vast meadows", "Mt Bandarpoonch view", "Homestay at Raithal village"],
    inclusions: ["All meals", "Tents & sleeping bags", "Trek leader", "Permits"],
    exclusions: ["Transport to Raithal", "Personal expenses"],
    batches: [
      { id: 1, startDate: "12 Oct 2026", endDate: "16 Oct 2026", slotsLeft: 10, price: 8499, status: "AVBL" }
    ],
    status: "Published"
  },
  {
    id: 9003,
    slug: "deoriatal-chandrashila",
    name: "Deoriatal Chandrashila Trek",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Weekend", "Fixed Departure", "Summit"],
    location: "Sari / Chopta, Uttarakhand",
    region: "Garhwal Himalayas",
    duration: "4 Days / 3 Nights",
    altitude: "13,123 Ft",
    difficulty: "Easy to Moderate",
    price: 6999,
    originalPrice: 8999,
    badge: "Lake & Summit",
    rating: 4.9,
    reviewCount: 340,
    image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
    tagline: "Sacred emerald lake reflecting Chaukhamba peaks, ancient Tungnath temple, and Chandrashila 360° summit.",
    highlights: ["Reflection of Chaukhamba in Deoria Tal", "Highest Shiva temple Tungnath", "Chandrashila 360° summit view"],
    defaultHighlights: ["Deoria Tal lake camp", "Tungnath temple", "Chandrashila summit"],
    inclusions: ["All meals during trek", "Alpine camping", "Trek guide", "Permits"],
    exclusions: ["Transport to Sari", "Personal gear"],
    batches: [
      { id: 1, startDate: "15 Oct 2026", endDate: "18 Oct 2026", slotsLeft: 12, price: 6999, status: "AVBL" }
    ],
    status: "Published"
  },
  {
    id: 9004,
    slug: "pench-tiger-trail",
    name: "Pench Tiger Trail",
    category: "Domestic",
    categories: ["Domestic", "Weekend", "Fixed Departure", "Wildlife"],
    location: "Pench National Park, MP",
    region: "Central India",
    duration: "3 Days / 2 Nights",
    altitude: "1,100 Ft",
    difficulty: "Easy",
    price: 13999,
    originalPrice: 16999,
    badge: "Tiger Safari Special",
    rating: 4.9,
    reviewCount: 95,
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",
    tagline: "The original Jungle Book forest: thrilling open-top 4x4 safaris seeking Bengal tigers, leopards & wild dogs.",
    highlights: ["2 exclusive open-jeep tiger safaris", "Verified wildlife jungle resort stay", "Expert naturalist guides"],
    defaultHighlights: ["Open 4x4 jeep safaris", "Naturalist guided tours", "Resort stay & meals"],
    inclusions: ["2 jungle safaris with gypsy & permits", "Resort stay with all meals", "Nagpur transfers"],
    exclusions: ["Camera fees", "Personal expenses"],
    batches: [
      { id: 1, startDate: "20 Oct 2026", endDate: "22 Oct 2026", slotsLeft: 4, price: 13999, status: "AVBL" }
    ],
    status: "Published"
  }
];

const updates = [
  // Domestic
  {
    slug: "rajasthan-tour-package-6-days",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Heritage", "Road Trip"],
      badge: "Royal Circuit",
      status: "Published"
    }
  },
  {
    slug: "jaipur-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Weekend", "Fixed Departure", "Heritage"],
      status: "Published"
    }
  },
  {
    slug: "jaisalmer-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Desert", "Heritage"],
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      status: "Published"
    }
  },
  {
    slug: "kerala-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Holiday Package", "South India"],
      status: "Published"
    }
  },
  {
    slug: "kashmir-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Holiday Package", "Kashmir"],
      status: "Published"
    }
  },
  {
    slug: "goa-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Beach", "Holiday Package"],
      status: "Published"
    }
  },
  {
    slug: "maharashtra-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Weekend", "Fixed Departure", "Western Ghats"],
      status: "Published"
    }
  },
  {
    slug: "meghalaya-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Northeast", "Nature"],
      status: "Published"
    }
  },
  {
    slug: "assam-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Wildlife", "Northeast"],
      status: "Published"
    }
  },
  {
    slug: "sikkim-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Himalayas", "Northeast"],
      status: "Published"
    }
  },
  {
    slug: "leh-ladakh-tour-package",
    set: {
      category: "Domestic",
      categories: ["Domestic", "Fixed Departure", "Himalayas", "Adventure"],
      status: "Published"
    }
  },
  {
    slug: "nainital-tour-package",
    set: {
      category: "Weekend",
      categories: ["Weekend", "Domestic", "Fixed Departure", "Hill Station"],
      status: "Published"
    }
  },
  {
    slug: "nainital-tour-package-3-nights-4-days",
    set: {
      category: "Weekend",
      categories: ["Weekend", "Domestic", "Fixed Departure", "Hill Station"],
      status: "Published"
    }
  },
  // Treks
  {
    slug: "chopta-tungnath-chandrashila",
    set: {
      category: "Himalayas",
      categories: ["Himalayas", "Trek", "Weekend", "Fixed Departure", "Summit"],
      status: "Published"
    }
  },
  {
    slug: "hampta-pass",
    set: {
      category: "Himalayas",
      categories: ["Himalayas", "Trek", "Fixed Departure", "High Pass"],
      status: "Published"
    }
  },
  {
    slug: "kheerganga-trek",
    set: {
      category: "Weekend",
      categories: ["Weekend", "Trek", "Fixed Departure", "Hot Springs"],
      status: "Published"
    }
  }
];

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('flight_search');
  const treksCol = db.collection('kradind_treks');

  for (const item of updates) {
    const res = await treksCol.updateOne(
      { slug: item.slug },
      { $set: item.set }
    );
    console.log(`Updated ${item.slug}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }

  for (const autumn of autumnPackages) {
    const res = await treksCol.updateOne(
      { slug: autumn.slug },
      { $set: autumn },
      { upsert: true }
    );
    console.log(`Upserted autumn ${autumn.slug}: matched=${res.matchedCount}, upserted=${res.upsertedCount}`);
  }

  const allFromDb = await treksCol.find({}).toArray();
  console.log(`Total treks in MongoDB: ${allFromDb.length}`);

  let cmsData = {};
  if (fs.existsSync(cmsStorePath)) {
    try {
      cmsData = JSON.parse(fs.readFileSync(cmsStorePath, 'utf8'));
    } catch (e) {
      cmsData = {};
    }
  }

  cmsData.treks = allFromDb.map(t => {
    const { _id, ...rest } = t;
    return rest;
  });

  fs.writeFileSync(cmsStorePath, JSON.stringify(cmsData, null, 2), 'utf8');
  console.log(`Updated ${cmsStorePath} with ${cmsData.treks.length} treks.`);

  await client.close();
  console.log('All updates applied successfully!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
