/**
 * Translate 64 hexagrams from zh-CN to Korean using DeepSeek API
 * Smaller batch size to avoid token truncation
 * Usage: node --env-file=../.env.local translate-ko-hexa.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) { console.error('Missing DEEPSEEK_API_KEY'); process.exit(1); }

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const cnData = JSON.parse(readFileSync('../src/data/hexagrams/zh-CN.json', 'utf-8'));

async function callDeepSeek(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 8000 }),
  });
  const data = await res.json();
  if (!data.choices) { console.error('API error:', JSON.stringify(data).substring(0, 200)); return null; }
  return data.choices[0].message.content.trim();
}

const numbers = Object.keys(cnData).sort((a, b) => Number(a) - Number(b));
const BATCH_SIZE = 2;
const batches = [];
for (let i = 0; i < numbers.length; i += BATCH_SIZE) {
  batches.push(numbers.slice(i, i + BATCH_SIZE));
}

console.log(`Translating 64 hexagrams in ${batches.length} batches (${BATCH_SIZE}/batch)...`);
const koData = {};

for (let bi = 0; bi < batches.length; bi++) {
  const batch = batches[bi];
  const batchData = {};
  for (const num of batch) batchData[num] = cnData[num];

  const prompt = `Translate these I-Ching hexagrams from Chinese to Korean. Return ONLY valid JSON with the exact same structure. Translate: name, fullName, judgment, xiang, meaning, and all lines[].text and lines[].meaning. Keep symbol, number, upperTrigram, lowerTrigram, lines[].position unchanged. Use Korean I-Ching (주역) terminology:

${JSON.stringify(batchData, null, 2)}`;

  console.log(`  Batch ${bi + 1}/${batches.length} (${batch.join(',')})...`);
  const result = await callDeepSeek(prompt);
  if (result) {
    try {
      const cleaned = result.replace(/^```json\s*/, '').replace(/\s*```\s*$/, '');
      const parsed = JSON.parse(cleaned);
      Object.assign(koData, parsed);
      console.log(`  ✅ OK`);
    } catch (e) {
      console.error(`  ❌ Parse error: ${e.message}`);
      // Save raw to file for debugging
      writeFileSync(`../scripts/debug_batch_${bi + 1}.txt`, result, 'utf-8');
    }
  } else {
    console.error(`  ❌ API error`);
  }
}

writeFileSync('../src/data/hexagrams/ko.json', JSON.stringify(koData, null, 2), 'utf-8');
console.log(`✅ Done! ${Object.keys(koData).length}/64 translated`);
