/**
 * Remove Chinese characters from Korean hexagram translated fields.
 * Keeps Chinese in upperTrigram, lowerTrigram, symbol (structural fields).
 */
import { readFileSync, writeFileSync } from 'fs';

const data = JSON.parse(readFileSync('../src/data/hexagrams/ko.json', 'utf-8'));

// Fields that should be translated (no Chinese)
const TRANS_FIELDS = ['name', 'fullName', 'judgment', 'meaning', 'xiang'];

// Remove Chinese chars within parentheses: e.g., "사(師)" → "사"
function cleanParenthesizedChinese(text) {
  return text.replace(/\([一-鿿]+\)/g, '');
}

// Remove standalone Chinese chars
function removeChinese(text) {
  return text.replace(/[一-鿿]/g, '');
}

let count = 0;
for (const [num, hex] of Object.entries(data)) {
  for (const field of TRANS_FIELDS) {
    if (hex[field] && /[一-鿿]/.test(hex[field])) {
      hex[field] = cleanParenthesizedChinese(hex[field]);
      if (/[一-鿿]/.test(hex[field])) {
        hex[field] = removeChinese(hex[field]);
      }
      count++;
    }
  }
  if (hex.lines) {
    for (const line of hex.lines) {
      for (const f of ['text', 'meaning']) {
        if (line[f] && /[一-鿿]/.test(line[f])) {
          line[f] = cleanParenthesizedChinese(line[f]);
          if (/[一-鿿]/.test(line[f])) {
            line[f] = removeChinese(line[f]);
          }
          count++;
        }
      }
    }
  }
}

writeFileSync('../src/data/hexagrams/ko.json', JSON.stringify(data, null, 2), 'utf-8');
console.log(`Cleaned ${count} fields with Chinese characters`);
