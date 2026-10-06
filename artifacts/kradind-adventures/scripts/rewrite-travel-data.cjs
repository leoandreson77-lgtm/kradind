const fs = require('fs');
const path = require('path');

const tdPath = path.join(__dirname, '..', 'src', 'lib', 'travel-data.ts');
let td = fs.readFileSync(tdPath, 'utf8');

const marker = 'rajasthan-tour-package-6-days';
const mIdx = td.indexOf(marker);
if (mIdx === -1) {
  console.error('Marker not found!');
  process.exit(1);
}

const afterMarker = td.indexOf('"status": "Published"', mIdx);
const closeBrace = td.indexOf('}', afterMarker);

const baseContent = td.slice(0, closeBrace + 1);

const cmsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'cms-store.json'), 'utf8'));
const intlTreks = cmsData.treks.filter(t => t.category === 'International');

console.log('International treks to append:', intlTreks.length);
intlTreks.forEach(t => console.log(' -', t.slug, 'has itinerary:', Array.isArray(t.itinerary), 'count:', t.itinerary ? t.itinerary.length : 0));

const newContent = baseContent + ',\n' + intlTreks.map(t => JSON.stringify(t, null, 2)).join(',\n') + '\n];\n';
fs.writeFileSync(tdPath, newContent, 'utf8');
console.log('travel-data.ts cleanly rewritten with itineraries!');
