/**
 * Translate knowledge articles from zh-CN to Korean using DeepSeek API
 * Usage: node --env-file=../.env.local translate-ko-knowledge.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;
if (!API_KEY) { console.error('Missing DEEPSEEK_API_KEY'); process.exit(1); }

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const CATEGORIES = ['yijing', 'wuxing', 'ganzhi', 'qimen', 'fengshui', 'face'];
const OUT_DIR = '../src/data/knowledge/ko';

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

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

async function translateArticle(article) {
  const prompt = `Translate this Chinese metaphysics knowledge article to Korean.
Keep the structure: id, title, summary, content, tags.
Use natural Korean academic writing style. Keep the 【】section markers in content.
Output ONLY valid JSON for this single article, no explanation:

${JSON.stringify(article, null, 2)}`;

  const result = await callDeepSeek(prompt);
  if (!result) return null;
  try {
    const cleaned = result.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('  Parse error:', e.message, '| Raw:', result.substring(0, 100));
    return null;
  }
}

console.log('Translating knowledge articles to Korean...');

for (const cat of CATEGORIES) {
  const cnArticles = JSON.parse(readFileSync(`../src/data/knowledge/zh-CN/${cat}.json`, 'utf-8'));
  console.log(`\n  Category: ${cat} (${cnArticles.length} articles)`);

  const koArticles = [];
  for (let i = 0; i < cnArticles.length; i++) {
    console.log(`    Article ${i + 1}/${cnArticles.length}: "${cnArticles[i].title}"...`);
    const translated = await translateArticle(cnArticles[i]);
    if (translated) {
      koArticles.push(translated);
      console.log(`    ✅ Done`);
    } else {
      console.log(`    ❌ Failed, using CN as fallback`);
      koArticles.push(cnArticles[i]); // fallback to Chinese
    }
  }

  writeFileSync(`${OUT_DIR}/${cat}.json`, JSON.stringify(koArticles, null, 2), 'utf-8');
  console.log(`  ✅ ${cat}.json saved (${koArticles.length} articles)`);
}

console.log('\n✅ All knowledge articles translated to Korean!');
