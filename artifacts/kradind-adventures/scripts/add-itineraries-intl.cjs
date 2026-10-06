const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://leoandreson77_db_user:QviGuHX49u5WpE6R@cluster0.20c8rgm.mongodb.net/flight_search?retryWrites=true&w=majority';
const travelDataPath = path.join(__dirname, '..', 'src', 'lib', 'travel-data.ts');
const cmsStorePath = path.join(__dirname, '..', 'data', 'cms-store.json');

const defaultItineraries = {
  "bali-tour-package": [
    { day: 1, title: "Arrival in Bali & Ubud Transfer", description: "Arrive at Ngurah Rai International Airport. Transfer to Ubud boutique resort. Evening leisure at Ubud traditional art market.", stay: "Ubud 4-Star Resort", meal: "Dinner" },
    { day: 2, title: "Tegalalang Rice Terraces & Bali Swing", description: "Visit Sacred Monkey Forest and walk along UNESCO Tegalalang rice terraces. Enjoy iconic jungle swing and coffee plantation.", stay: "Ubud 4-Star Resort", meal: "Breakfast & Dinner" },
    { day: 3, title: "Kintamani Volcano & Tirta Empul Holy Springs", description: "Scenic drive to Mount Batur volcano viewpoint. Visit Tirta Empul holy spring temple and Tegenungan waterfall.", stay: "Ubud 4-Star Resort", meal: "Breakfast & Dinner" },
    { day: 4, title: "Nusa Penida Island Speedboat Day Tour", description: "Speedboat to Nusa Penida. Visit Kelingking T-Rex Beach cliff, Angel's Billabong, and Broken Beach.", stay: "Seminyak Beach Resort", meal: "Breakfast & Lunch" },
    { day: 5, title: "Tanjung Benoa Watersports & Uluwatu Sunset", description: "Banana boat and watersports at Tanjung Benoa. Sunset visit to 70m cliffside Uluwatu temple with Kecak fire dance.", stay: "Seminyak Beach Resort", meal: "Breakfast & Dinner" },
    { day: 6, title: "Tanah Lot Temple & Seminyak Leisure", description: "Visit iconic offshore rock temple Tanah Lot. Afternoon shopping in Seminyak boutiques and sunset beach club.", stay: "Seminyak Beach Resort", meal: "Breakfast & Dinner" },
    { day: 7, title: "Souvenir Shopping & Airport Departure", description: "Breakfast at resort, last-minute shopping at Krisna Oleh-Oleh, and transfer to Denpasar Airport.", stay: "Departure", meal: "Breakfast" }
  ],
  "thailand-tour-package": [
    { day: 1, title: "Bangkok Arrival & Chao Phraya Dinner Cruise", description: "Arrival at Suvarnabhumi Airport Bangkok. Hotel transfer and check-in. Evening luxury dinner cruise along Chao Phraya river.", stay: "Bangkok 4-Star Hotel", meal: "Dinner" },
    { day: 2, title: "Bangkok City & Temple Tour", description: "Visit the Grand Palace, Wat Phra Kaew (Emerald Buddha), and Wat Arun. Evening explore vibrant street food at Chinatown.", stay: "Bangkok 4-Star Hotel", meal: "Breakfast & Lunch" },
    { day: 3, title: "Bangkok to Phuket Flight & Patong Beach", description: "Short domestic flight to Phuket. Check in to beachfront resort in Patong. Evening sunset walk at Kata or Karon beach.", stay: "Phuket Beach Resort", meal: "Breakfast" },
    { day: 4, title: "Phi Phi Island Speedboat Day Cruise", description: "Full-day speedboat excursion to Phi Phi Don and Phi Phi Leh. Snorkeling at Maya Bay, Pileh Lagoon, and Viking Cave.", stay: "Phuket Beach Resort", meal: "Breakfast & Buffet Lunch" },
    { day: 5, title: "Phuket Big Buddha & Promthep Cape Sunset", description: "Visit the revered 45-meter Big Buddha and Wat Chalong. Watch golden sunset from Promthep Cape viewpoint.", stay: "Phuket Beach Resort", meal: "Breakfast & Dinner" },
    { day: 6, title: "Phuket Departure", description: "Breakfast at resort and transfer to Phuket International Airport for flight back home.", stay: "Departure", meal: "Breakfast" }
  ],
  "dubai-tour-package": [
    { day: 1, title: "Dubai Arrival & Marina Dhow Dinner Cruise", description: "Arrive at Dubai International Airport. Transfer to luxury 4-star hotel. Evening romantic Dhow cruise with international buffet at Dubai Marina.", stay: "Dubai 4-Star Hotel", meal: "Dinner" },
    { day: 2, title: "Dubai City Tour & Burj Khalifa Top Observatory", description: "Half-day city tour covering Dubai Frame, Palm Jumeirah photo stop, and Dubai Mall. Ascend to 124th/125th floor of Burj Khalifa for panoramic vistas.", stay: "Dubai 4-Star Hotel", meal: "Breakfast" },
    { day: 3, title: "Afternoon 4x4 Desert Safari & BBQ Dinner", description: "Thrilling dune bashing in Arabian desert, camel rides, sandboarding, and traditional BBQ dinner with Tanoura & fire dance.", stay: "Dubai 4-Star Hotel", meal: "Breakfast & BBQ Dinner" },
    { day: 4, title: "Miracle Garden & Global Village Excursion", description: "Visit Dubai Miracle Garden featuring 150 million blooming flowers, followed by multicultural pavilions and shopping at Global Village.", stay: "Dubai 4-Star Hotel", meal: "Breakfast" },
    { day: 5, title: "Gold Souk Shopping & Airport Departure", description: "Explore the bustling Gold & Spice Souks in Deira. Transfer to Dubai International Airport for your return flight.", stay: "Departure", meal: "Breakfast" }
  ],
  "vietnam-tour-package": [
    { day: 1, title: "Hanoi Arrival & Old Quarter Street Food", description: "Arrive at Noi Bai Airport in Hanoi. Transfer to boutique hotel. Evening street food and cyclo tour in Hanoi 36 Old Streets.", stay: "Hanoi Boutique Hotel", meal: "Dinner" },
    { day: 2, title: "Hanoi Historic Highlights Tour", description: "Visit Ho Chi Minh Mausoleum, One Pillar Pagoda, Temple of Literature, and tranquil Hoan Kiem Lake.", stay: "Hanoi Boutique Hotel", meal: "Breakfast & Lunch" },
    { day: 3, title: "Hanoi to Ha Long Bay Overnight Cruise", description: "Drive to Tuan Chau Harbour and board luxury cruise. Sail through emerald waters and thousands of towering limestone karsts.", stay: "Ha Long Bay Cruise", meal: "Breakfast, Lunch & Dinner" },
    { day: 4, title: "Ha Long Bay Kayaking & Cruise to Hanoi", description: "Morning Tai Chi on sundeck and kayak through Sung Sot (Surprise) Cave. Disembark and drive back to Hanoi.", stay: "Hanoi Boutique Hotel", meal: "Brunch & Dinner" },
    { day: 5, title: "Ninh Binh Day Excursion (Trang An & Tam Coc)", description: "Day trip to Trang An UNESCO landscape complex. Bamboo boat ride through river caves and hike to Hang Mua viewpoint.", stay: "Hanoi Boutique Hotel", meal: "Breakfast & Lunch" },
    { day: 6, title: "Hanoi Departure Drop", description: "Breakfast at hotel and transfer to Noi Bai Airport for departure.", stay: "Departure", meal: "Breakfast" }
  ],
  "singapore-tour-package": [
    { day: 1, title: "Singapore Arrival & Night Safari", description: "Arrive at Changi Airport. Transfer to city hotel. Evening tram ride and trail walk at the world-famous Singapore Night Safari.", stay: "Singapore 4-Star Hotel", meal: "Dinner" },
    { day: 2, title: "Gardens by the Bay & Marina Bay Sands", description: "Visit Gardens by the Bay: Flower Dome and Cloud Forest. Evening Spectra light and water fountain show at Marina Bay Sands.", stay: "Singapore 4-Star Hotel", meal: "Breakfast" },
    { day: 3, title: "Sentosa Island & Universal Studios Singapore", description: "Full day adrenaline and movie magic at Universal Studios Singapore. Sunset cable car ride and Wings of Time night show.", stay: "Singapore 4-Star Hotel", meal: "Breakfast" },
    { day: 4, title: "Singapore City Tour & Orchard Road Shopping", description: "Explore Merlion Park, Chinatown, Little India, and luxury shopping along Orchard Road.", stay: "Singapore 4-Star Hotel", meal: "Breakfast" },
    { day: 5, title: "Jewel Changi Rain Vortex & Departure", description: "Check out and visit the world's tallest indoor waterfall Rain Vortex at Jewel Changi before your departure flight.", stay: "Departure", meal: "Breakfast" }
  ],
  "maldives-tour-package": [
    { day: 1, title: "Male Arrival & Speedboat Transfer to Overwater Villa", description: "Arrive at Velana International Airport. Speedboat transfer to private luxury island resort. Settle into your Overwater Lagoon Villa.", stay: "Overwater Lagoon Villa", meal: "Dinner" },
    { day: 2, title: "Private Lagoon Snorkeling & Coral Reef Exploration", description: "Step down directly into turquoise waters from your private villa deck. Complimentary snorkeling gear to explore colorful marine life.", stay: "Overwater Lagoon Villa", meal: "Breakfast, Lunch & Dinner" },
    { day: 3, title: "Sunset Dolphin Cruise & Island Spa Leisure", description: "Indulge in resort wellness and non-motorized watersports (kayak, paddleboard). Evening sunset cruise watching wild spinner dolphins.", stay: "Overwater Lagoon Villa", meal: "Breakfast, Lunch & Dinner" },
    { day: 4, title: "Floating Breakfast & Speedboat Departure", description: "Enjoy a memorable floating breakfast in your private pool/lagoon. Speedboat transfer back to Male Airport for return flight.", stay: "Departure", meal: "Breakfast" }
  ],
  "nepal-tour-package": [
    { day: 1, title: "Kathmandu Arrival & Pashupatinath Temple Darshan", description: "Arrive at Tribhuvan International Airport in Kathmandu. Check in to hotel. Evening darshan and aarti at sacred Pashupatinath temple.", stay: "Kathmandu 3/4-Star Hotel", meal: "Dinner" },
    { day: 2, title: "Boudhanath Stupa & Kathmandu Durbar Square", description: "Visit the colossal Boudhanath Stupa, Swayambhunath (Monkey Temple), and ancient historic royal palaces in Kathmandu Durbar Square.", stay: "Kathmandu 3/4-Star Hotel", meal: "Breakfast & Dinner" },
    { day: 3, title: "Scenic Highway Drive to Pokhara Lake City", description: "Drive along the Trishuli River to the picturesque valley of Pokhara (6-7 hrs). Evening leisurely boat ride on Phewa Lake.", stay: "Pokhara Lakeside Hotel", meal: "Breakfast & Dinner" },
    { day: 4, title: "Sarangkot Sunrise & Pokhara Valley Sightseeing", description: "Early morning drive to Sarangkot for stunning sunrise over the Annapurna and Machapuchare range. Visit Davis Falls and Gupteshwor Cave.", stay: "Pokhara Lakeside Hotel", meal: "Breakfast & Dinner" },
    { day: 5, title: "Pokhara to Kathmandu Return Drive", description: "Scenic return drive to Kathmandu with stop at Manakamana cable car point. Evening souvenir shopping in Thamel market.", stay: "Kathmandu 3/4-Star Hotel", meal: "Breakfast & Traditional Nepali Dinner" },
    { day: 6, title: "Kathmandu Airport Departure", description: "Breakfast at hotel and transfer to Tribhuvan International Airport for your flight back home.", stay: "Departure", meal: "Breakfast" }
  ]
};

async function fixAll() {
  console.log('Updating cms-store.json with complete itineraries for international packages...');
  const cmsData = JSON.parse(fs.readFileSync(cmsStorePath, 'utf8'));
  const treks = cmsData.treks || [];

  for (const t of treks) {
    if (defaultItineraries[t.slug]) {
      t.itinerary = defaultItineraries[t.slug];
    }
  }

  fs.writeFileSync(cmsStorePath, JSON.stringify(cmsData, null, 2), 'utf8');
  console.log('Updated cms-store.json successfully.');

  // Update MongoDB Atlas
  console.log('Updating MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('flight_search');
  const treksCol = db.collection('kradind_treks');

  for (const [slug, itinerary] of Object.entries(defaultItineraries)) {
    await treksCol.updateOne({ slug }, { $set: { itinerary } });
    console.log(`Updated MongoDB itinerary for ${slug}`);
  }
  await client.close();

  // Now rewrite the end of src/lib/travel-data.ts properly
  console.log('Fixing src/lib/travel-data.ts...');
  let tdContent = fs.readFileSync(travelDataPath, 'utf8');

  // Find the start of the international additions
  const idx = tdContent.indexOf('"slug": "bali-tour-package"');
  if (idx !== -1) {
    // Cut back to the last valid trek before bali
    const lastValidTrekEnd = tdContent.lastIndexOf('},\n{', idx);
    if (lastValidTrekEnd !== -1) {
      tdContent = tdContent.slice(0, lastValidTrekEnd + 1); // keep closing brace of last trek
    }
  }

  // Get international packages from cms-store
  const intlTreks = cmsData.treks.filter(t => t.category === 'International');
  const formattedIntl = intlTreks.map(t => JSON.stringify(t, null, 2)).join(',\n');

  tdContent = tdContent.trim();
  if (tdContent.endsWith('];')) {
    tdContent = tdContent.slice(0, -2).trim();
  } else if (tdContent.endsWith(']')) {
    tdContent = tdContent.slice(0, -1).trim();
  }

  tdContent += ',\n' + formattedIntl + '\n];\n';
  fs.writeFileSync(travelDataPath, tdContent, 'utf8');
  console.log('src/lib/travel-data.ts successfully updated with full itineraries!');
}

fixAll().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
