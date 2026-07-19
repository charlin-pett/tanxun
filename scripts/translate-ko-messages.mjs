/**
 * Translate messages/zh-CN.json → messages/ko.json using DeepSeek API
 * Usage: node --env-file=../.env.local translate-ko-messages.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) { console.error('Missing DEEPSEEK_API_KEY'); process.exit(1); }

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const cnMessages = JSON.parse(readFileSync('../messages/zh-CN.json', 'utf-8'));

async function callDeepSeek(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 500 }),
  });
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function translateValue(value) {
  if (typeof value === 'string') {
    return await callDeepSeek(`Translate this Chinese UI text to natural Korean. Output ONLY the Korean translation, no explanation:\n\n"${value}"`);
  }
  if (typeof value === 'object' && value !== null) {
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      result[k] = await translateValue(v);
    }
    return result;
  }
  return value;
}

console.log('Translating messages to Korean...');
const koMessages = {};
const namespaces = Object.keys(cnMessages).filter(k => k !== '$schema' && k !== 'description');
let done = 0;
for (const ns of namespaces) {
  console.log(`  Translating: ${ns}...`);
  koMessages[ns] = await translateValue(cnMessages[ns]);
  done++;
  console.log(`  ✅ ${ns} (${done}/${namespaces.length})`);
}

writeFileSync('../messages/ko.json', JSON.stringify(koMessages, null, 2), 'utf-8');
console.log('✅ Done! messages/ko.json created');
