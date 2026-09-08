const fs = require('fs');
const path = require('path');

const replacements = [
  {
    find: 'Highlights of the Kheerganga Trek * Scenic views of the Parvati Valley * Trek through pine, deodar and mixed Himalayan forests * Traditional mountain settlements such as Nakthan and Kalga * Beautiful Rudranag Waterfall * Himalayan streams and wooden bridges * Panoramic mountain views from the upper trail * Visit to Parvati Kund / Kheerganga hot water spring * A spiritual connection with the legends surrounding Lord Shiva * Opportunity to explore Kasol, Manikaran, Tosh and nearby Parvati Valley villages The combination of forests, river landscapes, villages and the natural hot spring makes Kheerganga particularly attractive to first-time Himalayan trekkers.',
    replace: 'Kheerganga is more than just a walk to a hot spring. The trail gives you a compact introduction to the landscapes and culture of the Parvati Valley.\n\nHighlights of the Kheerganga Trek:\n• Scenic views of the Parvati Valley\n• Trek through pine, deodar and mixed Himalayan forests\n• Traditional mountain settlements such as Nakthan and Kalga\n• Beautiful Rudranag Waterfall\n• Himalayan streams and wooden bridges\n• Panoramic mountain views from the upper trail\n• Visit to Parvati Kund / Kheerganga hot water spring\n• A spiritual connection with the legends surrounding Lord Shiva\n• Opportunity to explore Kasol, Manikaran, Tosh and nearby Parvati Valley villages\n\nThe combination of forests, river landscapes, villages and the natural hot spring makes Kheerganga particularly attractive to first-time Himalayan trekkers.'
  },
  {
    find: 'Kheerganga is more than just a walk to a hot spring. The trail gives you a compact introduction to the landscapes and culture of the Parvati Valley. \n\nHighlights of the Kheerganga Trek:',
    replace: 'Kheerganga is more than just a walk to a hot spring. The trail gives you a compact introduction to the landscapes and culture of the Parvati Valley.\n\nHighlights of the Kheerganga Trek:'
  },
  {
    find: 'Breakfast, Lunch & Dinner*',
    replace: 'Breakfast, Lunch & Dinner'
  },
  {
    find: 'attractions such as: * Mattupetty Dam * Echo Point * Tea plantations * Eravikulam National Park, subject to season and operational timings * Kundala Lake * Rose Garden * Blossom Hydel Park',
    replace: 'attractions such as:\n• Mattupetty Dam\n• Echo Point\n• Tea plantations\n• Eravikulam National Park, subject to season and operational timings\n• Kundala Lake\n• Rose Garden\n• Blossom Hydel Park'
  },
  {
    find: 'places to visit include: * Fort Kochi * Chinese Fishing Nets * Mattancherry Palace (Dutch Palace) * Jewish Synagogue * St. Francis Church * Marine Drive',
    replace: 'places to visit include:\n• Fort Kochi\n• Chinese Fishing Nets\n• Mattancherry Palace (Dutch Palace)\n• Jewish Synagogue\n• St. Francis Church\n• Marine Drive'
  },
  {
    find: 'attractions such as: * Tiger\'s Point * Bhushi Dam * Khandala viewpoints * Rajmachi viewpoint * Karla Caves * Bhaja Caves * Local market',
    replace: 'attractions such as:\n• Tiger\'s Point\n• Bhushi Dam\n• Khandala viewpoints\n• Rajmachi viewpoint\n• Karla Caves\n• Bhaja Caves\n• Local market'
  },
  {
    find: 'you can explore: * Table Land * Sydney Point * Parsi Point * Mapro Garden * Strawberry farms * Local viewpoints * Devrai Art Village, subject to itinerary',
    replace: 'you can explore:\n• Table Land\n• Sydney Point\n• Parsi Point\n• Mapro Garden\n• Strawberry farms\n• Local viewpoints\n• Devrai Art Village, subject to itinerary'
  },
  {
    find: 'which may include: * Fort Aguada * Sinquerim Beach * Candolim Beach * Calangute Beach * Baga Beach * Anjuna Beach * Vagator Beach * Chapora Fort',
    replace: 'which may include:\n• Fort Aguada\n• Sinquerim Beach\n• Candolim Beach\n• Calangute Beach\n• Baga Beach\n• Anjuna Beach\n• Vagator Beach\n• Chapora Fort'
  },
  {
    find: 'places such as: * Basilica of Bom Jesus * Se Cathedral * Panaji * Dona Paula * Miramar Beach * Colva Beach * Benaulim Beach * Cavelossim Beach',
    replace: 'places such as:\n• Basilica of Bom Jesus\n• Se Cathedral\n• Panaji\n• Dona Paula\n• Miramar Beach\n• Colva Beach\n• Benaulim Beach\n• Cavelossim Beach'
  },
  {
    find: 'activities may include: * Water sports * Boat trips * Dolphin spotting * Spice plantation tour * Local culinary exploration',
    replace: 'activities may include:\n• Water sports\n• Boat trips\n• Dolphin spotting\n• Spice plantation tour\n• Local culinary exploration'
  },
  {
    find: 'attractions such as: * Mattupetty Dam * Echo Point * Tea plantations * Tea Museum * Photo Point * Kundala Lake * Local markets * Scenic viewpoints Spend some time',
    replace: 'attractions such as:\n• Mattupetty Dam\n• Echo Point\n• Tea plantations\n• Tea Museum\n• Photo Point\n• Kundala Lake\n• Local markets\n• Scenic viewpoints\n\nSpend some time'
  },
  {
    find: 'Possible places to visit include: * Fort Kochi * Chinese Fishing Nets * Mattancherry * Jew Town * St. Francis Church * Local markets and heritage streets Kochi offers',
    replace: 'Possible places to visit include:\n• Fort Kochi\n• Chinese Fishing Nets\n• Mattancherry\n• Jew Town\n• St. Francis Church\n• Local markets and heritage streets\n\nKochi offers'
  },
  {
    find: 'activities may include: * Water sports * Boat trips * Dolphin spotting * Sunset cruises * Scuba diving * Kayaking * Spice plantation visits * Adventure activities Optional activities',
    replace: 'activities may include:\n• Water sports\n• Boat trips\n• Dolphin spotting\n• Sunset cruises\n• Scuba diving\n• Kayaking\n• Spice plantation visits\n• Adventure activities\n\nOptional activities'
  },
  {
    find: 'Possible visits include: * Shanti Stupa * Leh Palace * Leh Market * Hall of Fame * Shey Palace * Thiksey Monastery',
    replace: 'Possible visits include:\n• Shanti Stupa\n• Leh Palace\n• Leh Market\n• Hall of Fame\n• Shey Palace\n• Thiksey Monastery'
  },
  {
    find: 'Suggested sightseeing: * Naina Devi Temple * Naini Lake * Snow View Point * Eco Cave Gardens * Tiffin Top, subject to accessibility * Mall Road',
    replace: 'Suggested sightseeing:\n• Naina Devi Temple\n• Naini Lake\n• Snow View Point\n• Eco Cave Gardens\n• Tiffin Top, subject to accessibility\n• Mall Road'
  },
  {
    find: 'Possible stops: * Bhimtal * Sattal * Naukuchiatal',
    replace: 'Possible stops:\n• Bhimtal\n• Sattal\n• Naukuchiatal'
  },
  {
    find: 'Evening: * Camel safari * Sunset over the dunes * Desert camp check-in * Rajasthani folk music * Traditional dinner',
    replace: 'Evening activities:\n• Camel safari\n• Sunset over the dunes\n• Desert camp check-in\n• Rajasthani folk music\n• Traditional dinner'
  },
  {
    find: 'Explore: * Jaisalmer Fort * Jain Temples * Patwon Ki Haveli * Nathmal Ki Haveli * Salim Singh Ki Haveli',
    replace: 'Explore:\n• Jaisalmer Fort\n• Jain Temples\n• Patwon Ki Haveli\n• Nathmal Ki Haveli\n• Salim Singh Ki Haveli'
  },
  {
    find: 'Suggested stops: * Bada Bagh * Kuldhara * Jaisalmer War Museum, subject to route * Gadisar Lake',
    replace: 'Suggested stops:\n• Bada Bagh\n• Kuldhara\n• Jaisalmer War Museum, subject to route\n• Gadisar Lake'
  }
];

const targetFiles = [
  path.join(__dirname, '..', 'data', 'cms-store.json'),
  path.join(__dirname, '..', 'src', 'lib', 'travel-data.ts'),
  path.join(__dirname, '..', 'data', 'all-packages.json')
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log('Processing:', filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = 0;

  // Also handle the Kheerganga full answer match if it includes the intro sentence
  const kheergangaFullRaw = "Kheerganga is more than just a walk to a hot spring. The trail gives you a compact introduction to the landscapes and culture of the Parvati Valley. Highlights of the Kheerganga Trek * Scenic views of the Parvati Valley * Trek through pine, deodar and mixed Himalayan forests * Traditional mountain settlements such as Nakthan and Kalga * Beautiful Rudranag Waterfall * Himalayan streams and wooden bridges * Panoramic mountain views from the upper trail * Visit to Parvati Kund / Kheerganga hot water spring * A spiritual connection with the legends surrounding Lord Shiva * Opportunity to explore Kasol, Manikaran, Tosh and nearby Parvati Valley villages The combination of forests, river landscapes, villages and the natural hot spring makes Kheerganga particularly attractive to first-time Himalayan trekkers.";
  const kheergangaFullClean = "Kheerganga is more than just a walk to a hot spring. The trail gives you a compact introduction to the landscapes and culture of the Parvati Valley.\\n\\nHighlights of the Kheerganga Trek:\\n• Scenic views of the Parvati Valley\\n• Trek through pine, deodar and mixed Himalayan forests\\n• Traditional mountain settlements such as Nakthan and Kalga\\n• Beautiful Rudranag Waterfall\\n• Himalayan streams and wooden bridges\\n• Panoramic mountain views from the upper trail\\n• Visit to Parvati Kund / Kheerganga hot water spring\\n• A spiritual connection with the legends surrounding Lord Shiva\\n• Opportunity to explore Kasol, Manikaran, Tosh and nearby Parvati Valley villages\\n\\nThe combination of forests, river landscapes, villages and the natural hot spring makes Kheerganga particularly attractive to first-time Himalayan trekkers.";

  if (content.includes(kheergangaFullRaw)) {
    content = content.replace(kheergangaFullRaw, kheergangaFullClean);
    changed++;
  }

  replacements.forEach(r => {
    // In JSON strings, newlines must be escaped as \n
    const jsonFormattedReplace = r.replace.replace(/\n/g, '\\n');
    if (content.includes(r.find)) {
      content = content.replaceAll(r.find, jsonFormattedReplace);
      changed++;
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Applied', changed, 'cleanups to', path.basename(filePath));
});
