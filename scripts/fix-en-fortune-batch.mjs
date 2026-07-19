import { readFileSync, writeFileSync } from 'fs';

const API_KEY = process.env.DEEPSEEK_API_KEY;

const idx60to79 = [
  '名利双收，修炼积蓄，繁花似锦，名闻天下。',
  '基础虚弱，困难重重，徒劳无功，衰败悲伤。',
  '舟归平浦，万物化育，繁荣之象，富贵荣达。',
  '骨肉分离，一生浮沉，难得安泰，孤独悲运。',
  '巨流归海，富贵长寿，天长地久，事事如意。',
  '进退失据，内外不和，艰难不堪，损伤灾祸。',
  '天赋幸运，四通八达，万事如意，富贵繁昌。',
  '深思熟虑，智谋周全，兴家立业，富贵荣华。',
  '动摇不安，常陷逆境，灾害交至，难得平安。',
  '残菊逢霜，惨淡忧愁，晚景凄凉，非有运者。',
  '石上栽花，外观幸福，内里辛劳，难得实益。',
  '先甘后苦，万难忍受，晚景悲运，身心疲劳。',
  '志高力微，盛衰交加，若能谨慎，可保安泰。',
  '残花经霜，智谋不足，贪功图利，终至失败。',
  '守则可安，进则失败，宜守不宜攻，平稳是福。',
  '倾覆离散，内外不合，骨肉分离，一生多难。',
  '半吉半凶，先吉后凶，获福者少，受祸者多。',
  '晚景凄凉，先得后失，无智无谋，晚境悲惨。',
  '云头望月，身疲力尽，前途暗淡，急流勇退。',
  '吉星入度，一生平安，早也辉煌，晚也辉煌。',
];

const items = idx60to79.map((t, i) => `[${i}] ${t}`).join('\n\n');
const prompt = `Translate these Chinese fortune-telling / numerology texts into English. Each entry is marked with [index]. Return ONLY a JSON object mapping index strings to translated English strings. Use these fortune labels: 大吉=Great Fortune, 吉=Fortune, 凶=Misfortune. No other text.`;

const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'You are a professional translator of Chinese metaphysics and numerology texts.' },
      { role: 'user', content: prompt + '\n\n' + items }
    ],
    max_tokens: 8000,
    temperature: 0.3,
  })
});

const json = await res.json();
const content = json.choices[0].message.content.trim();
const m = content.match(/\{[\s\S]*\}/);

if (m) {
  const parsed = JSON.parse(m[0]);
  const data = JSON.parse(readFileSync('D:\\探寻\\scripts\\name-fortune-translations.json', 'utf-8'));
  for (let i = 0; i < 20; i++) {
    if (parsed[String(i)]) data.en.fortune81desc[60 + i] = parsed[String(i)];
  }
  writeFileSync('D:\\探寻\\scripts\\name-fortune-translations.json', JSON.stringify(data, null, 2));
  console.log('Fixed entries 60-79.');
  console.log('[60]:', data.en.fortune81desc[60]);
  console.log('[65]:', data.en.fortune81desc[65]);
  console.log('[70]:', data.en.fortune81desc[70]);
  console.log('[75]:', data.en.fortune81desc[75]);
  console.log('[79]:', data.en.fortune81desc[79]);
} else {
  console.log('FAILED. Raw:', content.slice(0, 2000));
}
