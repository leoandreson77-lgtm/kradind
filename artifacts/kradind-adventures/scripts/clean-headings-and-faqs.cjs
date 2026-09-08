const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'data', 'cms-store.json'),
  path.join(__dirname, '..', 'src', 'lib', 'travel-data.ts'),
  path.join(__dirname, '..', 'data', 'all-packages.json')
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log('Processing:', filePath);
  
  const isTs = filePath.endsWith('.ts');
  let rawContent = fs.readFileSync(filePath, 'utf8');
  let data;
  
  if (isTs) {
    // Extract JSON part from export const treks = [...]
    const match = rawContent.match(/export const treks = (\[[\s\S]*\]);?/);
    if (!match) {
      console.error('Could not match treks in travel-data.ts');
      return;
    }
    data = { treks: JSON.parse(match[1]) };
  } else {
    data = JSON.parse(rawContent);
  }

  const treksList = data.treks || data;

  treksList.forEach(trek => {
    // 1. Clean Hampta Pass junk TOC FAQs
    if (trek.slug === 'hampta-pass' && Array.isArray(trek.faqs)) {
      trek.faqs = trek.faqs.filter(f => {
        const q = f.question || '';
        const a = f.answer || '';
        if (q.startsWith('2. Why Choose') || q.startsWith('3. What Makes') || q.startsWith('7. Who Can Do') || q.startsWith('23. Why Trek')) {
          return false;
        }
        if (a.length < 5 || a.includes('Book Your Hampta Pass') || a.includes('Itinerary 5.')) {
          return false;
        }
        return true;
      });
    }

    // 2. Clean Kheerganga - Move "Why Should You Do..." into Overview and Highlights, clean FAQs
    if (trek.slug === 'kheerganga-trek') {
      trek.overview = "Kheerganga is more than just a walk to a hot spring. The trail gives you a compact introduction to the majestic alpine landscapes and vibrant culture of the Parvati Valley.\n\nNestled high amidst the pine and deodar covered slopes of Himachal Pradesh at 9,700 Ft, Kheerganga is renowned for its mystical hot water springs at Parvati Kund, sweeping views of snow-dusted Himalayan ridges, and serene mountain campsites.\n\nThe trail winds past the roaring suspension bridges of Barshaini, authentic wooden hamlets like Nakthan and Kalga, and the sacred waters of Rudranag. The combination of ancient deodar forests, alpine streams, warm mountain hospitality, and therapeutic hot springs makes Kheerganga an unmissable Himalayan adventure.";
      
      // Filter out the section heading that got saved as FAQ[0]
      if (Array.isArray(trek.faqs)) {
        trek.faqs = trek.faqs.filter(f => !f.question.includes('Why Should You Do the Kheerganga'));
        
        // Ensure comprehensive, high-value FAQs
        trek.faqs = [
          {
            question: "Is the Kheerganga trek suitable for complete beginners?",
            answer: "Yes. The Kheerganga Trek is an easy-to-moderate trail and is one of the most accessible Himalayan weekend treks for beginners. The distance is approximately 12 km one-way from Barshaini with gradual climbing. Basic physical fitness and comfortable trekking shoes are recommended."
          },
          {
            question: "What is the best time to visit Kheerganga?",
            answer: "April to June and September to November offer pleasant weather, clear skies, and spectacular valley vistas. The trek also operates during winter (December to February) for snow lovers, though temperatures drop below freezing at the summit."
          },
          {
            question: "Are the Parvati Kund hot springs open for bathing?",
            answer: "Yes, the natural sulphur hot springs at Parvati Kund are accessible year-round and are famous for their rejuvenating warmth and panoramic Himalayan snow-peak views."
          },
          {
            question: "Is mobile network available during the trek?",
            answer: "Mobile connectivity (primarily BSNL, Jio, and Airtel) is generally available up to Barshaini and Nakthan village, but becomes intermittent or unavailable at the Kheerganga top camp."
          },
          {
            question: "What type of stay is provided at Kheerganga?",
            answer: "Comfortable alpine dome tents with warm fleece sleeping bags, insulated ground mats, and shared camp washroom facilities are provided at the meadow campsites."
          }
        ];
      }
    }

    // 3. Clean leading numbers from all FAQ questions (e.g. "1. How many..." -> "How many...")
    if (Array.isArray(trek.faqs)) {
      trek.faqs.forEach(f => {
        if (f.question) {
          f.question = f.question.replace(/^[0-9]+\.\s*/, '').trim();
        }
      });
    }
  });

  // Write back
  if (isTs) {
    const updatedTs = `import { TrekData } from "./cms-store";\n\nexport const treks: TrekData[] = ${JSON.stringify(treksList, null, 2)};\n`;
    fs.writeFileSync(filePath, updatedTs, 'utf8');
  } else {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
  console.log('Successfully updated', path.basename(filePath));
});
