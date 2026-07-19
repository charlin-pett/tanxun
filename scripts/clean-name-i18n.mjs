import { readFileSync, writeFileSync } from 'fs';

const d = JSON.parse(readFileSync('D:\\探寻\\scripts\\name-fortune-translations.json', 'utf-8'));

for (const lang of ['en', 'ru', 'es', 'ko']) {
  for (const [k, v] of Object.entries(d[lang].numberMeanings)) {
    // Strip [N-type] prefix like "[1-expression] " or "[11-personality] "
    d[lang].numberMeanings[k] = v.replace(/^\[\d+-(?:expression|personality|heartDesire)\]\s*/, '');
  }
}

writeFileSync('D:\\探寻\\scripts\\name-fortune-translations.json', JSON.stringify(d, null, 2), 'utf-8');
console.log('Cleaned prefixes from all number meanings');

// Verify
for (const lang of ['en', 'ru', 'es', 'ko']) {
  let issues = 0;
  for (const [k, v] of Object.entries(d[lang].numberMeanings)) {
    if (v.match(/^\[\d/)) issues++;
  }
  console.log(lang + ': ' + issues + ' remaining prefixes');
}

// Also check fortune81desc for similar prefix contamination
for (const lang of ['en', 'ru', 'es', 'ko']) {
  let issues = 0;
  for (const desc of d[lang].fortune81desc) {
    if (/^\[\d+\]/.test(desc)) issues++;
  }
  console.log(lang + ' fortune81desc: ' + issues + ' with prefix');
}
