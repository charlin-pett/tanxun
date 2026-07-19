/**
 * Translate zodiac data from zh-CN to Korean using DeepSeek API
 * Usage: node --env-file=../.env.local translate-ko-zodiac.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) { console.error('Missing DEEPSEEK_API_KEY'); process.exit(1); }

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const cnData = JSON.parse(readFileSync('../src/data/zodiac/zh-CN.json', 'utf-8'));

async function callDeepSeek(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 4000 }),
  });
  const data = await res.json();
  if (!data.choices) { console.error('API error:', JSON.stringify(data).substring(0,200)); return null; }
  return data.choices[0].message.content.trim();
}

console.log('Translating 12 zodiac signs to Korean...');
const koData = {};

for (let i = 0; i < 12; i++) {
  const sign = cnData[String(i)];
  console.log(`  ${sign.englishName}...`);

  const prompt = `Translate this Western zodiac sign data from Chinese to Korean.
Keep ALL fields. englishName, date, element, ruler should remain in English/original.
Translate: name, keywords[], strengths[], weaknesses[], personality, love, career, fortune.
Output ONLY valid JSON for this single sign, no explanation:

${JSON.stringify(sign, null, 2)}`;

  const result = await callDeepSeek(prompt);
  if (result) {
    try {
      const cleaned = result.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
      koData[String(i)] = JSON.parse(cleaned);
      console.log(`  ✅ ${sign.englishName} done`);
    } catch (e) {
      console.error(`  ❌ Parse error for ${sign.englishName}:`, e.message);
      koData[String(i)] = sign;
    }
  } else {
    console.error(`  ❌ API error for ${sign.englishName}`);
    koData[String(i)] = sign;
  }
}

writeFileSync('../src/data/zodiac/ko.json', JSON.stringify(koData, null, 2), 'utf-8');
console.log(`✅ Done! ${Object.keys(koData).length}/12 zodiac signs translated`);
