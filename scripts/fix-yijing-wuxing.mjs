/**
 * Re-translate yijing and wuxing knowledge articles to Korean
 */
import { readFileSync, writeFileSync } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

async function callDeepSeek(prompt) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 4000 }),
  });
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function translateArticle(article) {
  const prompt = `Translate this Chinese metaphysics article to Korean. Keep structure: id, title, summary, content, tags. Use natural Korean. Keep 【】markers. Output ONLY valid JSON:\n\n${JSON.stringify(article, null, 2)}`;
  const result = await callDeepSeek(prompt);
  const cleaned = result.replace(/^```json\s*/i, '').replace(/\s*```\s*$/i, '');
  return JSON.parse(cleaned);
}

for (const cat of ['yijing', 'wuxing']) {
  const cnArticles = JSON.parse(readFileSync(`../src/data/knowledge/zh-CN/${cat}.json`, 'utf-8'));
  console.log(`Translating ${cat} (${cnArticles.length} articles)...`);
  const koArticles = [];
  for (let i = 0; i < cnArticles.length; i++) {
    console.log(`  ${cnArticles[i].title}...`);
    koArticles.push(await translateArticle(cnArticles[i]));
    console.log('  ✅');
  }
  writeFileSync(`../src/data/knowledge/ko/${cat}.json`, JSON.stringify(koArticles, null, 2), 'utf-8');
  console.log(`✅ ${cat}.json saved`);
}
console.log('Done!');
