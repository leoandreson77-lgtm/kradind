const fs = require('fs');
const all = JSON.parse(fs.readFileSync('data/all-packages.json', 'utf8'));
const culprits = [
  'hampta-pass',
  'kheerganga-trek',
  'maharashtra-tour-package',
  'goa-tour-package',
  'jaipur-tour-package',
  'meghalaya-tour-package',
  'nainital-tour-package',
  'jaisalmer-tour-package'
];

culprits.forEach(slug => {
  const p = all.find(x => x.slug === slug);
  if (!p) return;
  console.log('\n========================================');
  console.log('PACKAGE: ' + slug + ' (' + p.name + ')');
  console.log('========================================');
  p.itinerary.forEach(i => {
    if (i.description && i.description.length > 500) {
      console.log('\n--- Day ' + i.day + ': ' + i.title + ' (length: ' + i.description.length + ') ---');
      const leakKeywords = [
        "What's Included",
        "What's Not Included",
        "Travel Tips",
        "Tour Package Cost",
        "Booking & Cancellation",
        "Frequently Asked Questions",
        "Recommended SEO Metadata",
        "Things to Carry",
        "How to Reach"
      ];
      leakKeywords.forEach(kw => {
        const idx = i.description.indexOf(kw);
        if (idx !== -1) {
          console.log(`Found leak keyword "${kw}" at index ${idx}`);
          console.log('Snippet before: ' + JSON.stringify(i.description.substring(Math.max(0, idx - 100), idx)));
          console.log('Snippet after: ' + JSON.stringify(i.description.substring(idx, idx + 100)));
        }
      });
    }
  });
});
