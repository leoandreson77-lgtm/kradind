const fs = require('fs');
const path = require('path');

const gdocsDir = path.resolve(__dirname, '..', '..', '..', 'scratch', 'gdocs');

// Curated high quality imagery for each destination
const IMAGES = {
  chopta: {
    hero: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  hampta: {
    hero: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  kheerganga: {
    hero: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  kerala: {
    hero: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  maharashtra: {
    hero: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  goa: {
    hero: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  jaipur: {
    hero: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  meghalaya: {
    hero: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  ladakh: {
    hero: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  sikkim: {
    hero: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  assam: {
    hero: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  nainital: {
    hero: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  jaisalmer: {
    hero: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
    ]
  }
};

function readDoc(filename) {
  const filePath = path.join(gdocsDir, filename);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
}

function parseDoc(filename, meta) {
  const text = readDoc(filename);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract Days Itinerary
  const itinerary = [];
  let currentDay = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dayMatch = line.match(/^Day\s+([0-9]+)\s*[:–-]\s*(.+)/i);
    if (dayMatch) {
      if (currentDay) itinerary.push(currentDay);
      currentDay = {
        day: parseInt(dayMatch[1], 10),
        title: dayMatch[2].trim(),
        description: '',
        altitude: meta.altitude || 'Himalayan Altitude',
        meal: 'Breakfast & Dinner',
        stay: meta.stay || 'Hotel / Resort / Campsite'
      };
    } else if (currentDay) {
      if (line.startsWith('Meals:') || line.startsWith('Meal:')) {
        currentDay.meal = line.replace(/^Meals?:\s*/i, '');
      } else if (line.startsWith('Stay:') || line.startsWith('Accommodation:')) {
        currentDay.stay = line.replace(/^(Stay|Accommodation):\s*/i, '');
      } else if (line.startsWith('Trek Distance:') || line.startsWith('Distance:')) {
        currentDay.distance = line.replace(/^(Trek Distance|Distance):\s*/i, '');
      } else if (line.startsWith('Day ') || line.includes('Package Inclusions') || line.includes('Inclusions') || line.startsWith('Things to Carry')) {
        // Next section
        if (line.match(/^Day\s+[0-9]+/i)) {
          // let loop continue to catch it
        } else {
          itinerary.push(currentDay);
          currentDay = null;
        }
      } else {
        if (!line.startsWith('__') && !line.startsWith('Detailed Itinerary')) {
          currentDay.description = (currentDay.description + ' ' + line).trim();
        }
      }
    }
  }
  if (currentDay) itinerary.push(currentDay);

  // Extract Highlights
  const highlights = [];
  let inHighlights = false;
  for (const line of lines) {
    if (line.toLowerCase().includes('highlights') && !line.includes('*')) {
      inHighlights = true;
      continue;
    }
    if (inHighlights) {
      if (line.startsWith('*') || line.startsWith('•') || line.startsWith('-')) {
        highlights.push(line.replace(/^[*•-]\s*/, '').trim());
      } else if (line.includes('Itinerary') || line.startsWith('Day 1') || line.includes('Inclusions') || line.length === 0) {
        inHighlights = false;
      }
    }
  }

  // Extract Inclusions
  const inclusions = [];
  let inInclusions = false;
  for (const line of lines) {
    if ((line.toLowerCase().includes('inclusions') || line.toLowerCase().includes('package includes')) && !line.includes('*')) {
      inInclusions = true;
      continue;
    }
    if (inInclusions) {
      if (line.startsWith('*') || line.startsWith('•') || line.startsWith('-')) {
        inclusions.push(line.replace(/^[*•-]\s*/, '').trim());
      } else if (line.toLowerCase().includes('exclusions') || line.toLowerCase().includes('things to carry') || line.startsWith('__')) {
        inInclusions = false;
      }
    }
  }

  // Extract Exclusions
  const exclusions = [];
  let inExclusions = false;
  for (const line of lines) {
    if ((line.toLowerCase().includes('exclusions') || line.toLowerCase().includes('package excludes')) && !line.includes('*')) {
      inExclusions = true;
      continue;
    }
    if (inExclusions) {
      if (line.startsWith('*') || line.startsWith('•') || line.startsWith('-')) {
        exclusions.push(line.replace(/^[*•-]\s*/, '').trim());
      } else if (line.toLowerCase().includes('things to carry') || line.toLowerCase().includes('faqs') || line.startsWith('__')) {
        inExclusions = false;
      }
    }
  }

  // Extract FAQs
  const faqs = [];
  let currentQ = null;
  let inFaqs = false;
  for (const line of lines) {
    if (line.toLowerCase().includes('frequently asked questions') || line.toLowerCase().includes('faqs')) {
      inFaqs = true;
      continue;
    }
    if (inFaqs) {
      if (line.match(/^Q[0-9]*[:.]/i) || line.endsWith('?') || line.match(/^[0-9]+\.\s+.*\?/)) {
        if (currentQ) faqs.push(currentQ);
        currentQ = {
          question: line.replace(/^Q[0-9]*[:.]\s*/i, '').trim(),
          answer: ''
        };
      } else if (currentQ) {
        if (line.startsWith('__') || line.includes('Why Choose KradInd') || line.includes('CTA:')) {
          faqs.push(currentQ);
          currentQ = null;
          inFaqs = false;
        } else {
          currentQ.answer = (currentQ.answer + ' ' + line.replace(/^A[0-9]*[:.]\s*/i, '')).trim();
        }
      }
    }
  }
  if (currentQ) faqs.push(currentQ);

  // Overview
  let overview = meta.defaultOverview || '';
  let inOverview = false;
  let overviewLines = [];
  for (const line of lines) {
    if (line.toLowerCase() === 'overview' || line.toLowerCase().includes('package overview') || line.toLowerCase().includes('trek overview')) {
      inOverview = true;
      continue;
    }
    if (inOverview) {
      if (line.includes('Highlights') || line.includes('Itinerary') || line.startsWith('Day 1') || line.startsWith('*') || line.startsWith('__')) {
        inOverview = false;
      } else {
        overviewLines.push(line);
      }
    }
  }
  if (overviewLines.length > 0) {
    overview = overviewLines.join('\n\n');
  }

  return {
    ...meta,
    highlights: highlights.length > 0 ? highlights : meta.defaultHighlights,
    itinerary: itinerary.length > 0 ? itinerary : meta.defaultItinerary,
    inclusions: inclusions.length > 0 ? inclusions : [
      "Comfortable stay as per selected itinerary (Hotels / Camps / Houseboat)",
      "Meals as specified (Breakfast & Dinners)",
      "Dedicated trip coordinator / mountain guide",
      "Permits, entry passes and ground assistance",
      "Private transfers as per package route"
    ],
    exclusions: exclusions.length > 0 ? exclusions : [
      "Personal expenses (laundry, beverages, tips)",
      "Airfare or train fare to arrival hub",
      "Travel insurance and medical emergency coverage",
      "Anything not mentioned in the inclusions list"
    ],
    faqs: faqs.length > 0 ? faqs : meta.defaultFaqs || [
      {
        question: "How can I book this trip with KRADIND?",
        answer: "You can book directly using the Book Now button, reach out via WhatsApp at +91 7500222141, or submit an inquiry on the Contact page."
      },
      {
        question: "Is this package suitable for families and beginners?",
        answer: "Yes, our itineraries are thoughtfully paced with comfortable stays and experienced tour guides."
      }
    ],
    overview: overview || meta.tagline
  };
}

const PACKAGES_CONFIG = [
  {
    id: 1,
    slug: "chopta-tungnath-chandrashila",
    name: "Chopta Tungnath Chandrashila Trek",
    file: "doc_1_1PEEEp0FsslyonEIreUtqTAgQvlC8rpsLsuF3hSshc3A.txt",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "Weekend", "Summit"],
    location: "Rudraprayag, Uttarakhand",
    region: "Garhwal Himalayas",
    duration: "3 Days / 2 Nights",
    altitude: "13,000 Ft",
    difficulty: "Easy to Moderate",
    price: 5499,
    originalPrice: 7499,
    badge: "Most Popular",
    rating: 4.9,
    reviewCount: 320,
    image: IMAGES.chopta.hero,
    gallery: IMAGES.chopta.gallery,
    tagline: "Alpine meadows of Chopta, the highest Shiva temple at Tungnath, and panoramic 360° summit views.",
    defaultHighlights: [
      "Trek to sacred Tungnath Temple, the highest Shiva shrine in the world.",
      "Reach the Chandrashila Summit (13,000 ft) for 360° views of Nanda Devi, Trishul, and Chaukhamba.",
      "Camp amidst the pristine rhododendron forests and alpine meadows of Chopta.",
      "Beginner-friendly trail ideal for first-time Himalayan trekkers."
    ]
  },
  {
    id: 2,
    slug: "hampta-pass",
    name: "Hampta Pass Crossover Trek",
    file: "doc_2_1AB7hyt6O2r0WinqZSGTsULtkuJd3tYHb1pJuXgPXPXY.txt",
    category: "Himalayas",
    categories: ["Himalayas", "Trek", "High Pass"],
    location: "Manali to Lahaul, Himachal Pradesh",
    region: "Pir Panjal & Zanskar",
    duration: "5 Days / 4 Nights",
    altitude: "14,000 Ft",
    difficulty: "Moderate",
    price: 9999,
    originalPrice: 12999,
    badge: "High Pass Epic",
    rating: 4.9,
    reviewCount: 245,
    image: IMAGES.hampta.hero,
    gallery: IMAGES.hampta.gallery,
    tagline: "Cross from the lush green pine valleys of Kullu into the dramatic, barren moonscape of Spiti and Lahaul.",
    defaultHighlights: [
      "Dramatic landscape change from emerald pine glades into barren high-altitude desert.",
      "Stand atop Hampta Pass at 14,000 ft overlooking towering Himalayan glaciers.",
      "Camp at Shea Goru along crystalline glacial streams.",
      "Special excursion to the mystical turquoise crescent of Chandratal Lake."
    ]
  },
  {
    id: 3,
    slug: "kheerganga-trek",
    name: "Kheerganga Hot Spring Trek",
    file: "doc_3_1k1FMZd43IHiim0Sspx9j6NtiMND0eM_ST7FF1LxNxHQ.txt",
    category: "Weekend",
    categories: ["Weekend", "Trek", "Hot Springs", "Himachal"],
    location: "Parvati Valley, Kasol, Himachal Pradesh",
    region: "Parvati Valley",
    duration: "2 Days / 1 Night",
    altitude: "9,700 Ft",
    difficulty: "Easy to Moderate",
    price: 2499,
    originalPrice: 3499,
    badge: "Bestseller Weekend",
    rating: 4.8,
    reviewCount: 190,
    image: IMAGES.kheerganga.hero,
    gallery: IMAGES.kheerganga.gallery,
    tagline: "Natural hot sulphur springs nestled high amidst pine-covered peaks of Parvati Valley.",
    defaultHighlights: [
      "Natural thermal hot water spring bath overlooking snow-dusted Himalayan peaks.",
      "Trek through ancient village of Nakthan and the roaring Rudranag waterfall.",
      "Stargazing around campfire in the magical heights of Parvati Valley.",
      "Perfect weekend rejuvenation getaway starting from Kasol / Barshaini."
    ]
  },
  {
    id: 4,
    slug: "kerala-tour-package",
    name: "Kerala Backwaters & Hills Tour",
    file: "doc_4_1wb9w7USkShKXZOAv8Mv7SkIwn1hsytHaHXRBmwyR7aY.txt",
    category: "Domestic",
    categories: ["Domestic", "Holiday Package", "South India", "Honeymoon"],
    location: "Munnar, Thekkady, Alleppey & Kochi, Kerala",
    region: "God's Own Country",
    duration: "6 Days / 5 Nights",
    altitude: "Sea Level to 5,200 Ft",
    difficulty: "Leisure / Sightseeing",
    price: 18499,
    originalPrice: 23999,
    badge: "Family & Couples Choice",
    rating: 4.9,
    reviewCount: 310,
    image: IMAGES.kerala.hero,
    gallery: IMAGES.kerala.gallery,
    tagline: "Rolling tea gardens of Munnar, wildlife spice hills of Thekkady, and peaceful houseboat cruises in Alleppey.",
    defaultHighlights: [
      "Private traditional houseboat cruise through the palm-fringed backwaters of Alleppey.",
      "Endless green tea plantations and mist-covered viewpoints of Munnar.",
      "Spice plantation walk and Periyar Tiger Reserve wildlife boat safari in Thekkady.",
      "Historic Fort Kochi with Chinese fishing nets and Portuguese heritage."
    ]
  },
  {
    id: 5,
    slug: "maharashtra-tour-package",
    name: "Maharashtra Hills & Ghats Tour",
    file: "doc_5_1RaBfxW17UrMU6v-Psth8qXBd68i9lRUsRedcRaNCARc.txt",
    category: "Domestic",
    categories: ["Domestic", "Weekend", "Western Ghats"],
    location: "Mumbai, Lonavala, Mahabaleshwar, Panchgani",
    region: "Western Ghats, Maharashtra",
    duration: "5 Days / 4 Nights",
    altitude: "Up to 4,700 Ft",
    difficulty: "Leisure / Scenic",
    price: 14999,
    originalPrice: 18499,
    badge: "Trending Getaway",
    rating: 4.8,
    reviewCount: 165,
    image: IMAGES.maharashtra.hero,
    gallery: IMAGES.maharashtra.gallery,
    tagline: "Waterfalls of Lonavala, strawberry farms of Mahabaleshwar, and panoramic viewpoints over the Sahyadri range.",
    defaultHighlights: [
      "Scenic drives along the lush misty cliffs of the Western Ghats.",
      "Lonavala & Khandala viewpoints, Tiger's Leap and Bhushi Dam.",
      "Mahabaleshwar Venna Lake boating and fresh strawberry plantation tours.",
      "Table Land and scenic mountain vistas of Panchgani."
    ]
  },
  {
    id: 6,
    slug: "goa-tour-package",
    name: "Goa Beach & Heritage Tour",
    file: "doc_6_1iosvpaHclHRApMiTOmQfYjzjv6ILB57kGoyODcwcgtA.txt",
    category: "Domestic",
    categories: ["Domestic", "Beach", "Holiday Package"],
    location: "North & South Goa",
    region: "Konkan Coast",
    duration: "4 Days / 3 Nights",
    altitude: "Sea Level",
    difficulty: "Leisure / Beach Holiday",
    price: 11999,
    originalPrice: 15499,
    badge: "Beach Vacation",
    rating: 4.8,
    reviewCount: 280,
    image: IMAGES.goa.hero,
    gallery: IMAGES.goa.gallery,
    tagline: "Sun-drenched beaches, Portuguese colonial architecture, sunset cruises and vibrant Goan dining.",
    defaultHighlights: [
      "Explore historic Fort Aguada, Chapora Fort and UNESCO Basilica of Bom Jesus.",
      "Relax on golden sands of Baga, Calangute, and serene South Goa beaches.",
      "Evening Mandovi River sunset cruise with live cultural Goan dance.",
      "Authentic coastal seafood dining and water sports adventures."
    ]
  },
  {
    id: 7,
    slug: "jaipur-tour-package",
    name: "Jaipur Royal Heritage Tour",
    file: "doc_7_1mzIJrvjuf2QQu1kCoH1t-tgF_hJbbRwAdHw9cKxcY8o.txt",
    category: "Domestic",
    categories: ["Domestic", "Heritage", "Weekend"],
    location: "Jaipur, Rajasthan",
    region: "Royal Rajasthan",
    duration: "3 Days / 2 Nights",
    altitude: "1,400 Ft",
    difficulty: "Cultural / Sightseeing",
    price: 8499,
    originalPrice: 11999,
    badge: "Heritage Classic",
    rating: 4.9,
    reviewCount: 220,
    image: IMAGES.jaipur.hero,
    gallery: IMAGES.jaipur.gallery,
    tagline: "Majestic forts of Amber, royal palaces of City Palace & Hawa Mahal, and colourful Johari bazaars.",
    defaultHighlights: [
      "Guided tour of grand hilltop Amber Fort and Sheesh Mahal (Mirror Palace).",
      "Iconic photo-stops at Hawa Mahal (Palace of Winds) and Jal Mahal.",
      "Explore the royal residence of City Palace and UNESCO Jantar Mantar.",
      "Traditional Rajasthani dinner at Chokhi Dhani with folk music and dance."
    ]
  },
  {
    id: 8,
    slug: "meghalaya-tour-package",
    name: "Meghalaya Abode of Clouds Tour",
    file: "doc_8_14Iqa_LkzvhCbfQeApA4_0hN9is9LyvvgmcZWdHba80w.txt",
    category: "Domestic",
    categories: ["Domestic", "Northeast", "Nature"],
    location: "Shillong, Cherrapunji, Dawki, Mawlynnong",
    region: "Northeast India",
    duration: "5 Days / 4 Nights",
    altitude: "4,900 Ft",
    difficulty: "Nature / Mild Adventure",
    price: 16999,
    originalPrice: 21499,
    badge: "Northeast Gem",
    rating: 4.9,
    reviewCount: 195,
    image: IMAGES.meghalaya.hero,
    gallery: IMAGES.meghalaya.gallery,
    tagline: "Living root bridges, roaring waterfalls of Cherrapunji, and crystal-clear boat rides on Dawki River.",
    defaultHighlights: [
      "Walk across the centuries-old bio-engineered Living Root Bridges.",
      "Witness Nohkalikai and Seven Sisters Falls cascading into deep rainforest canyons.",
      "Boat ride on the crystal-clear glass waters of Umngot River in Dawki.",
      "Visit Mawlynnong, celebrated as the cleanest village in Asia."
    ]
  },
  {
    id: 9,
    slug: "leh-ladakh-tour-package",
    name: "Leh Ladakh High Passes Expedition",
    file: "doc_9_1v7caUYi87dHaTibZRwl1SVzKqaairXdpOu8xB0Nf_yk.txt",
    category: "Himalayas",
    categories: ["Himalayas", "Domestic", "Adventure", "High Passes"],
    location: "Leh, Nubra Valley, Pangong Tso, Ladakh",
    region: "Trans-Himalayas",
    duration: "6 Days / 5 Nights",
    altitude: "17,590 Ft (Khardung La)",
    difficulty: "High Altitude Road Trip",
    price: 22499,
    originalPrice: 28999,
    badge: "Bucket List Epic",
    rating: 5.0,
    reviewCount: 340,
    image: IMAGES.ladakh.hero,
    gallery: IMAGES.ladakh.gallery,
    tagline: "Drive across Khardung La, ride double-humped camels in Nubra desert, and camp along turquoise Pangong Lake.",
    defaultHighlights: [
      "Cross Khardung La, one of the world's highest motorable mountain passes at 17,590 ft.",
      "Camp under million-star night skies beside the ever-shifting turquoise waters of Pangong Tso.",
      "Ride double-humped Bactrian camels amidst the cold white sand dunes of Hunder in Nubra Valley.",
      "Visit ancient clifftop Buddhist monasteries of Thiksey and Hemis."
    ]
  },
  {
    id: 10,
    slug: "sikkim-tour-package",
    name: "Sikkim Gangtok & North Sikkim Tour",
    file: "doc_10_1bAeaRzq6P3PrLx-ebmxzAiOyKRch3JCzNoYp8iKlbNY.txt",
    category: "Domestic",
    categories: ["Domestic", "Himalayas", "Northeast"],
    location: "Gangtok, Lachung, Yumthang Valley, North Sikkim",
    region: "Eastern Himalayas",
    duration: "6 Days / 5 Nights",
    altitude: "12,000 Ft",
    difficulty: "Mountain Touring",
    price: 17999,
    originalPrice: 22999,
    badge: "Himalayan Bloom",
    rating: 4.9,
    reviewCount: 210,
    image: IMAGES.sikkim.hero,
    gallery: IMAGES.sikkim.gallery,
    tagline: "Majestic views of Mt. Kanchenjunga, sacred Tsomgo Lake, and rhododendron meadows of Yumthang Valley.",
    defaultHighlights: [
      "Sacred glacial Tsomgo Lake and optional Indo-China border excursion to Nathula Pass.",
      "Dramatic waterfalls and hot springs in the pristine alpine valley of Yumthang.",
      "Panoramic views of Mt. Kanchenjunga from Gangtok's viewpoints.",
      "Peaceful Buddhist monastic culture at Rumtek and Enchey monasteries."
    ]
  },
  {
    id: 11,
    slug: "assam-tour-package",
    name: "Assam Wildlife & Heritage Tour",
    file: "doc_11_1JPUCBzfQJsDypgsLpVMos3zTE6IOvgq6eY0ZiCwyGIE.txt",
    category: "Domestic",
    categories: ["Domestic", "Wildlife", "Northeast"],
    location: "Kaziranga, Majuli, Guwahati, Assam",
    region: "Brahmaputra Valley",
    duration: "5 Days / 4 Nights",
    altitude: "River Valley",
    difficulty: "Wildlife & Culture",
    price: 15499,
    originalPrice: 19999,
    badge: "Wildlife Safari",
    rating: 4.8,
    reviewCount: 140,
    image: IMAGES.assam.hero,
    gallery: IMAGES.assam.gallery,
    tagline: "One-horned rhinos of Kaziranga National Park, the spiritual satras of Majuli island, and tea gardens.",
    defaultHighlights: [
      "Jeep and elephant safari tracking the endangered Great One-Horned Rhinoceros in Kaziranga.",
      "Ferry cruise across the mighty Brahmaputra River to Majuli, the world's largest river island.",
      "Visit neo-Vaishnavite Satras and witness traditional mask-making in Majuli.",
      "Scenic tea garden walks and holy Kamakhya Temple blessing in Guwahati."
    ]
  },
  {
    id: 12,
    slug: "nainital-tour-package",
    name: "Nainital Lake District Tour",
    file: "doc_12_1sa5ndInl08UDRCUExAgy8kPffNmKAdef4ydmEiKBD6E.txt",
    category: "Weekend",
    categories: ["Weekend", "Domestic", "Hill Station"],
    location: "Nainital, Bhimtal, Pangot, Uttarakhand",
    region: "Kumaon Hills",
    duration: "3 Days / 2 Nights",
    altitude: "6,837 Ft",
    difficulty: "Relaxed Hill Station",
    price: 7999,
    originalPrice: 10499,
    badge: "Quick Hill Getaway",
    rating: 4.8,
    reviewCount: 230,
    image: IMAGES.nainital.hero,
    gallery: IMAGES.nainital.gallery,
    tagline: "Emerald lake boating, scenic Kumaon ridge viewpoints, Mall Road strolls, and peaceful pine forests.",
    defaultHighlights: [
      "Yachting and paddle boating on the crescent-shaped emerald waters of Naini Lake.",
      "Ropeway cable car ride up to Snow View Point for Himalayan vista views.",
      "Excursion to surrounding tranquil lakes: Bhimtal, Sattal and Naukuchiatal.",
      "Colonial hill charm, candle shopping, and evening walks along Mall Road."
    ]
  },
  {
    id: 13,
    slug: "jaisalmer-tour-package",
    name: "Jaisalmer Golden City & Desert Safari",
    file: "doc_13_1d-q5lbu6az4BKfk7h2z2SxqZb0DySDuGo9RvI6_mbuU.txt",
    category: "Domestic",
    categories: ["Domestic", "Desert", "Heritage"],
    location: "Jaisalmer Fort & Sam Dunes, Rajasthan",
    region: "Thar Desert",
    duration: "3 Days / 2 Nights",
    altitude: "Desert Terrain",
    difficulty: "Desert Safari & Culture",
    price: 8999,
    originalPrice: 11999,
    badge: "Desert Safari Special",
    rating: 4.9,
    reviewCount: 260,
    image: IMAGES.jaisalmer.hero,
    gallery: IMAGES.jaisalmer.gallery,
    tagline: "Golden sandstone living fort, thrilling 4x4 desert dune bashing, camel safaris, and folk nights under the stars.",
    defaultHighlights: [
      "Explore Jaisalmer Fort (Sonar Qila), the only living golden fort in India.",
      "Thrilling camel safari and 4x4 Jeep dune bashing across the shifting Sam Sand Dunes.",
      "Overnight luxury Swiss desert camp with Kalbeliya folk dance and Rajasthani feast.",
      "Visit haunted mystery village of Kuldhara and the royal cenotaphs at Bada Bagh."
    ]
  }
];

const parsedPackages = PACKAGES_CONFIG.map(pkg => parseDoc(pkg.file, pkg));

// Add standard batches
parsedPackages.forEach(p => {
  p.batches = [
    { id: p.id * 10 + 1, startDate: "Upcoming Weekend", endDate: "Confirming Batch", slotsLeft: 6, price: p.price },
    { id: p.id * 10 + 2, startDate: "Next Week", endDate: "Open Batch", slotsLeft: 10, price: p.price },
    { id: p.id * 10 + 3, startDate: "Following Weekend", endDate: "Filling Fast", slotsLeft: 4, price: p.price }
  ];
  p.status = "Published";
});

const outPath = path.resolve(__dirname, '..', 'data', 'all-packages.json');
const outDir2 = path.dirname(outPath);
if (!fs.existsSync(outDir2)) fs.mkdirSync(outDir2, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(parsedPackages, null, 2), 'utf8');
console.log('Saved to ' + outPath);
