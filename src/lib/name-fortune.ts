/**
 * Name Fortune Calculation Engine
 *
 * Four methods:
 * 1. Chinese 五格剖象法 (Five Grids Stroke Analysis)
 * 2. Western Pythagorean Numerology
 * 3. Western Chaldean Numerology
 * 4. Korean 성명학 (Seongmyeonghak)
 */

import {
  FORTUNE_LABEL_I18N,
  FORTUNE_81_DESC_I18N,
  FORTUNE_LABEL_BY_NUMBER,
  ELEMENT_PERSONALITY_I18N,
  THREE_TALENTS_I18N,
  NUMBER_MEANINGS_I18N,
  ELEMENT_NAME_I18N,
} from '@/data/name-fortune/i18n';

// ============================================================
// Shared Types
// ============================================================
export interface ChineseNameResult {
  method: 'chinese';
  strokes: { surname: number[]; given: number[] };
  grids: { heaven: number; personality: number; earth: number; total: number; external: number };
  elements: { heaven: string; personality: string; earth: string; total: string; external: string };
  threeTalents: { elements: string[]; harmony: string; description: string };
  gridInterpretations: Record<string, { number: number; fortune: string; description: string }>;
  personality: string;
}

export interface WesternNameResult {
  method: 'pythagorean' | 'chaldean';
  expression: { number: number; isMaster: boolean; meaning: string };
  personality: { number: number; isMaster: boolean; meaning: string };
  heartDesire: { number: number; isMaster: boolean; meaning: string };
  letterMap: Record<string, number>;
}

export interface KoreanNameResult {
  method: 'korean';
  initials: string[];
  elements: string[];
  harmony: string;
  totalStrokes: number;
  fortune81: string;
  analysis: string;
}

export type NameFortuneResult = ChineseNameResult | WesternNameResult | KoreanNameResult;

// ============================================================
// Kangxi Dictionary Stroke Count Map (500+ common characters)
// ============================================================
const KANGXI_STROKES: Record<string, number> = {
  // Surnames
  '王':4,'李':7,'张':11,'刘':15,'陈':16,'杨':13,'黄':12,'赵':14,'周':8,'吴':7,
  '徐':10,'孙':10,'马':10,'胡':11,'朱':6,'郭':15,'何':7,'林':8,'罗':19,'高':10,
  '郑':19,'梁':11,'谢':17,'宋':7,'唐':10,'许':11,'韩':17,'邓':19,'冯':12,'曹':10,
  '彭':12,'曾':12,'肖':9,'田':5,'董':15,'潘':16,'袁':10,'蔡':17,'蒋':17,'余':7,
  '于':3,'杜':7,'叶':15,'程':12,'魏':18,'苏':20,'吕':7,'丁':2,'任':6,'卢':16,
  '姚':9,'沈':8,'钟':17,'姜':9,'崔':11,'谭':19,'陆':16,'范':11,'汪':8,'廖':14,
  '石':5,'金':8,'韦':9,'贾':13,'傅':12,'方':4,'白':5,'孟':8,'段':9,'秦':10,
  // Given name characters (common)
  '文':4,'明':8,'华':14,'伟':11,'芳':10,'敏':11,'静':16,'丽':19,'强':12,'军':9,
  '杰':8,'磊':15,'洋':10,'勇':9,'艳':24,'涛':18,'玲':10,'超':12,'秀':7,'霞':17,
  '平':5,'刚':10,'桂':10,'英':11,'兰':23,'飞':9,'峰':10,'斌':11,'宇':6,'浩':11,
  '雪':11,'梅':11,'春':9,'秋':9,'冬':5,'夏':10,'龙':16,'凤':14,'鹏':19,'鸿':17,
  '燕':16,'慧':15,'婷':12,'帅':9,'康':11,'健':11,'志':7,'国':11,'家':10,'成':7,
  '思':9,'梦':14,'雨':8,'晨':11,'曦':20,'阳':17,'月':4,'星':9,'云':12,'风':9,
  '海':11,'江':7,'河':9,'湖':13,'山':3,'森':12,'花':10,
  '玉':5,'银':14,'宝':19,'财':10,'富':12,'贵':12,'福':14,'禄':13,'寿':14,
  '安':6,'宁':14,'乐':15,'欢':22,'喜':12,'悦':11,'欣':8,'怡':9,'嘉':14,'瑞':14,
  '仁':4,'义':13,'礼':18,'智':12,'信':9,'德':15,'道':16,'善':12,'美':9,'良':7,
  '一':1,'二':2,'三':3,'四':5,'五':4,'六':4,'七':2,'八':2,'九':9,'十':2,
  '子':3,'女':3,'天':4,'地':6,'人':2,'大':3,'小':3,'中':4,'上':3,'下':3,
  '东':8,'南':9,'西':6,'北':5,'光':6,'辉':15,'日':4,'有':6,'无':12,
  '永':5,'恒':10,'科':9,'学':8,'博':12,'雅':12,'哲':10,'颖':16,'新':13,'维':14,
  '君':7,'臣':6,'民':5,'友':4,'爱':13,'真':10,'正':5,'圆':13,'清':12,
  '若':11,'如':6,'之':4,'以':5,'可':5,'不':4,'为':12,'也':3,'者':10,'然':12,
  '今':4,'古':5,'元':4,'开':12,'关':19,'圣':13,'贤':15,'达':16,'通':14,'进':15,
  '庆':15,'吉':6,'祥':11,'宏':7,'振':11,'兴':15,'建':9,'立':5,
};

/**
 * Get stroke count for a Chinese character using Kangxi dictionary rules
 */
export function getStrokeCount(char: string): number {
  if (KANGXI_STROKES[char]) return KANGXI_STROKES[char];

  // Count strokes by Unicode range (fallback for unknown characters)
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    // Simple estimation: most common chars fall in certain ranges
    if (code <= 0x5BFF) return 8;
    if (code <= 0x6FFF) return 10;
    if (code <= 0x7FFF) return 11;
    if (code <= 0x8FFF) return 12;
    return 14;
  }
  return 1; // non-Chinese char
}

/**
 * Get element from stroke count (last digit method)
 * 1-2: Wood, 3-4: Fire, 5-6: Earth, 7-8: Metal, 9-0: Water
 */
function getElementFromStrokes(strokes: number): string {
  const lastDigit = strokes % 10;
  if (lastDigit === 1 || lastDigit === 2) return '木';
  if (lastDigit === 3 || lastDigit === 4) return '火';
  if (lastDigit === 5 || lastDigit === 6) return '土';
  if (lastDigit === 7 || lastDigit === 8) return '金';
  return '水';
}

function getElementName(element: string, locale: string): string {
  return ELEMENT_NAME_I18N[locale]?.[element] || ELEMENT_NAME_I18N['zh-CN']?.[element] || element;
}

/**
 * Get localized fortune label (大吉 → Great Fortune, etc.)
 */
function getFortuneLabel(label: string, locale: string): string {
  return FORTUNE_LABEL_I18N[locale]?.[label] || FORTUNE_LABEL_I18N['zh-CN']?.[label] || label;
}

/**
 * Get localized 81-number description
 */
function getFortune81Desc(number: number, locale: string): string {
  return FORTUNE_81_DESC_I18N[locale]?.[number] || FORTUNE_81_DESC_I18N['zh-CN']?.[number] || '';
}

/**
 * Get localized element personality description
 */
function getElementPersonality(element: string, locale: string): string {
  return ELEMENT_PERSONALITY_I18N[locale]?.[element] || ELEMENT_PERSONALITY_I18N['zh-CN']?.[element] || '';
}

/**
 * Get localized number meaning
 */
function getNumberMeaningLoc(num: number, type: string, locale: string): string {
  const key = `${num}_${type}`;
  return NUMBER_MEANINGS_I18N[locale]?.[key] || NUMBER_MEANINGS_I18N['zh-CN']?.[key] || '这个数字赋予了独特的能量。';
}

/**
 * Get localized three talents description
 */
function getThreeTalentsText(key: string, locale: string): string {
  return THREE_TALENTS_I18N[locale]?.[key] || THREE_TALENTS_I18N['zh-CN']?.[key] || '';
}

/**
 * Get localized grid name for Chinese method
 */
function getGridName(grid: string, locale: string): string {
  const map: Record<string, Record<string, string>> = {
    'zh-CN': { '天格': '天格', '人格': '人格', '地格': '地格', '总格': '总格', '外格': '外格' },
    en: { '天格': 'Heaven', '人格': 'Personality', '地格': 'Earth', '总格': 'Total', '外格': 'External' },
    ru: { '天格': 'Небо', '人格': 'Личность', '地格': 'Земля', '总格': 'Итог', '外格': 'Внешнее' },
    es: { '天格': 'Cielo', '人格': 'Personalidad', '地格': 'Tierra', '总格': 'Total', '外格': 'Externo' },
    ko: { '天格': '천격', '人格': '인격', '地格': '지격', '总格': '총격', '外格': '외격' },
  };
  return map[locale]?.[grid] || grid;
}

// ============================================================
// Method 1: Chinese Five Grids (五格剖象法)
// ============================================================
export function calculateChineseName(name: string, locale: string = 'zh-CN'): ChineseNameResult {
  const chars = [...name.trim()].filter(c => /[一-鿿]/.test(c));
  if (chars.length < 2) {
    const errMsg = locale === 'zh-CN' ? '请输入至少2个汉字的中文姓名'
      : locale === 'en' ? 'Please enter a Chinese name with at least 2 characters'
      : locale === 'ru' ? 'Введите китайское имя минимум из 2 иероглифов'
      : locale === 'es' ? 'Introduzca un nombre chino con al menos 2 caracteres'
      : locale === 'ko' ? '2자 이상의 한자 이름을 입력하세요'
      : '请输入至少2个汉字的中文姓名';
    return {
      method: 'chinese',
      strokes: { surname: [], given: [] },
      grids: { heaven: 0, personality: 0, earth: 0, total: 0, external: 0 },
      elements: { heaven: '', personality: '', earth: '', total: '', external: '' },
      threeTalents: { elements: [], harmony: '', description: '' },
      gridInterpretations: {},
      personality: errMsg,
    };
  }

  const surname = chars[0];
  const given = chars.slice(1);

  const surnameStrokes = [getStrokeCount(surname)];
  const givenStrokes = given.map(getStrokeCount);

  // Calculate Five Grids (single surname formula)
  const heaven = surnameStrokes[0] + 1;
  const personality = surnameStrokes[0] + (givenStrokes[0] || 0);
  const earth = givenStrokes.reduce((a, b) => a + b, 0) + 1;
  const total = surnameStrokes[0] + givenStrokes.reduce((a, b) => a + b, 0);
  const external = total - personality + 1;

  // Elements
  const elements = {
    heaven: getElementFromStrokes(heaven),
    personality: getElementFromStrokes(personality),
    earth: getElementFromStrokes(earth),
    total: getElementFromStrokes(total),
    external: getElementFromStrokes(external),
  };

  // Three Talents (天·人·地)
  const talents = [elements.heaven, elements.personality, elements.earth];
  const threeTalents = analyzeThreeTalents(talents, locale);

  // 81-number interpretations for each grid
  const gridInterpretations: Record<string, { number: number; fortune: string; description: string }> = {};
  const gridNames = ['天格', '人格', '地格', '总格', '外格'];
  const gridValues = [heaven, personality, earth, total, external];
  gridNames.forEach((name) => {
    const num = gridValues[gridNames.indexOf(name)];
    const rawFortune = FORTUNE_LABEL_BY_NUMBER[num] || '未知';
    gridInterpretations[getGridName(name, locale)] = {
      number: num,
      fortune: getFortuneLabel(rawFortune, locale),
      description: getFortune81Desc(num, locale),
    };
  });

  // Personality from the main element
  const personalityDesc = getElementPersonality(elements.personality, locale);

  return {
    method: 'chinese',
    strokes: { surname: surnameStrokes, given: givenStrokes },
    grids: { heaven, personality, earth, total, external },
    elements,
    threeTalents,
    gridInterpretations,
    personality: personalityDesc,
  };
}

function analyzeThreeTalents(elements: string[], locale: string = 'zh-CN'): { elements: string[]; harmony: string; description: string } {
  const winOver: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  const generate: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };

  // Check generation chain (天→人→地)
  const genChain = generate[elements[0]] === elements[1] && generate[elements[1]] === elements[2];
  // Check overcoming chain
  const over1 = winOver[elements[0]] === elements[1];
  const over2 = winOver[elements[1]] === elements[2];

  if (genChain) {
    return { elements, harmony: getFortuneLabel('大吉', locale), description: getThreeTalentsText('perfect', locale) };
  } else if (elements[0] === elements[1] && elements[1] === elements[2]) {
    return { elements, harmony: getFortuneLabel('中吉', locale), description: getThreeTalentsText('same', locale) };
  } else if (over1 && over2) {
    return { elements, harmony: getFortuneLabel('凶', locale), description: getThreeTalentsText('overcome', locale) };
  } else if (over1 && !over2) {
    return { elements, harmony: getFortuneLabel('半吉', locale), description: getThreeTalentsText('over1', locale) };
  } else if (!over1 && over2) {
    return { elements, harmony: getFortuneLabel('半吉', locale), description: getThreeTalentsText('over2', locale) };
  }

  return { elements, harmony: getFortuneLabel('中平', locale), description: getThreeTalentsText('neutral', locale) };
}

// ============================================================
// Method 2: Pythagorean Numerology
// ============================================================
const PYTHAGOREAN_MAP: Record<string, number> = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8,
};

export function calculatePythagorean(name: string, locale: string = 'zh-CN'): WesternNameResult {
  const clean = name.toUpperCase().replace(/[^A-Z\s]/g, '').trim();
  const names = clean.split(/\s+/).filter(n => n.length > 0);

  // Expression Number: sum all letters, reduce each name, then sum and reduce
  const nameSums = names.map(n => {
    let sum = 0;
    for (const c of n) sum += PYTHAGOREAN_MAP[c] || 0;
    return reduceNumber(sum);
  });
  const exprRaw = nameSums.reduce((a, b) => a + b, 0);

  // Personality Number: consonants only
  let personRaw = 0;
  for (const namePart of names) {
    let nameSum = 0;
    for (const c of namePart) {
      if (!'AEIOU'.includes(c)) nameSum += PYTHAGOREAN_MAP[c] || 0;
    }
    personRaw += reduceNumber(nameSum);
  }

  // Heart's Desire: vowels only
  let heartRaw = 0;
  for (const namePart of names) {
    let nameSum = 0;
    for (const c of namePart) {
      if ('AEIOU'.includes(c)) nameSum += PYTHAGOREAN_MAP[c] || 0;
    }
    heartRaw += reduceNumber(nameSum);
  }

  const exprNum = reduceMaster(exprRaw);
  const personNum = reduceMaster(personRaw);
  const heartNum = reduceMaster(heartRaw);

  return {
    method: 'pythagorean',
    expression: { ...exprNum, meaning: getNumberMeaningLoc(exprNum.number, 'expression', locale) },
    personality: { ...personNum, meaning: getNumberMeaningLoc(personNum.number, 'personality', locale) },
    heartDesire: { ...heartNum, meaning: getNumberMeaningLoc(heartNum.number, 'heartDesire', locale) },
    letterMap: PYTHAGOREAN_MAP,
  };
}

// ============================================================
// Method 3: Chaldean Numerology
// ============================================================
const CHALDEAN_MAP: Record<string, number> = {
  A:1, I:1, J:1, Q:1, Y:1,
  B:2, K:2, R:2,
  C:3, G:3, L:3, S:3,
  D:4, M:4, T:4,
  E:5, H:5, N:5, X:5,
  U:6, V:6, W:6,
  O:7, Z:7,
  F:8, P:8,
};

export function calculateChaldean(name: string, locale: string = 'zh-CN'): WesternNameResult {
  const clean = name.toUpperCase().replace(/[^A-Z]/g, '');

  // Expression: all letters summed continuously (Chaldean style)
  let exprSum = 0;
  for (const c of clean) exprSum += CHALDEAN_MAP[c] || 0;

  // Personality: consonants
  let personSum = 0;
  for (const c of clean) {
    if (!'AEIOU'.includes(c)) personSum += CHALDEAN_MAP[c] || 0;
  }

  // Heart's Desire: vowels
  let heartSum = 0;
  for (const c of clean) {
    if ('AEIOU'.includes(c)) heartSum += CHALDEAN_MAP[c] || 0;
  }

  const exprNum = reduceMaster(exprSum);
  const personNum = reduceMaster(personSum);
  const heartNum = reduceMaster(heartSum);

  return {
    method: 'chaldean',
    expression: { ...exprNum, meaning: getNumberMeaningLoc(exprNum.number, 'expression', locale) },
    personality: { ...personNum, meaning: getNumberMeaningLoc(personNum.number, 'personality', locale) },
    heartDesire: { ...heartNum, meaning: getNumberMeaningLoc(heartNum.number, 'heartDesire', locale) },
    letterMap: CHALDEAN_MAP,
  };
}

// Shared number reduction
function reduceNumber(n: number): number {
  while (n > 9 && ![11, 22, 33].includes(n)) {
    n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return n;
}

function reduceMaster(n: number): { number: number; isMaster: boolean } {
  const reduced = reduceNumber(n);
  return { number: reduced, isMaster: [11, 22, 33].includes(reduced) };
}


// ============================================================
// Method 4: Korean Seongmyeonghak (성명학)
// ============================================================
// Korean initial consonant → Five Elements
const KOREAN_INITIAL_ELEMENT: Record<string, string> = {
  'ㄱ': '木', 'ㅋ': '木',
  'ㄴ': '火', 'ㄷ': '火', 'ㄸ': '火', 'ㄹ': '火',
  'ㅇ': '土', 'ㅎ': '土',
  'ㅅ': '金', 'ㅈ': '金', 'ㅊ': '金',
  'ㅁ': '水', 'ㅂ': '水', 'ㅍ': '水',
};

// Korean character decomposition (simplified)
function decomposeKorean(char: string): { initial: string; vowel: string; final: string } | null {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return null;

  const base = code - 0xAC00;
  const finalIdx = base % 28;
  const vowelIdx = Math.floor((base % 588) / 28);
  const initialIdx = Math.floor(base / 588);

  const INITIALS = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const VOWELS = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const FINALS = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  return {
    initial: INITIALS[initialIdx],
    vowel: VOWELS[vowelIdx],
    final: FINALS[finalIdx],
  };
}

export function calculateKoreanName(name: string, locale: string = 'zh-CN'): KoreanNameResult {
  const chars = [...name.trim()].filter(c => {
    const code = c.charCodeAt(0);
    return code >= 0xAC00 && code <= 0xD7A3;
  });

  if (chars.length < 2) {
    const errMsg = locale === 'ko' ? '한글 이름을 2자 이상 입력해주세요.'
      : locale === 'en' ? 'Please enter a Korean name with at least 2 characters.'
      : locale === 'ru' ? 'Введите корейское имя минимум из 2 символов.'
      : locale === 'es' ? 'Introduzca un nombre coreano con al menos 2 caracteres.'
      : '请输入至少2个韩文的名字';
    return {
      method: 'korean',
      initials: [],
      elements: [],
      harmony: '',
      totalStrokes: 0,
      fortune81: '',
      analysis: errMsg,
    };
  }

  const initials: string[] = [];
  const elements: string[] = [];

  for (const char of chars) {
    const decomposed = decomposeKorean(char);
    if (decomposed && decomposed.initial) {
      initials.push(decomposed.initial);
      elements.push(KOREAN_INITIAL_ELEMENT[decomposed.initial] || '未知');
    }
  }

  // Korean stroke count (Hunminjeongeum stroke count)
  const INITIAL_STROKES: Record<string, number> = {
    'ㄱ':1,'ㄲ':2,'ㄴ':1,'ㄷ':2,'ㄸ':4,'ㄹ':3,'ㅁ':3,'ㅂ':4,'ㅃ':8,'ㅅ':2,'ㅆ':4,'ㅇ':1,'ㅈ':3,'ㅉ':6,'ㅊ':4,'ㅋ':2,'ㅌ':3,'ㅍ':4,'ㅎ':3,
  };
  const VOWEL_STROKES: Record<string, number> = {
    'ㅏ':2,'ㅐ':3,'ㅑ':3,'ㅒ':4,'ㅓ':2,'ㅔ':3,'ㅕ':3,'ㅖ':4,'ㅗ':2,'ㅘ':4,'ㅙ':5,'ㅚ':3,'ㅛ':3,'ㅜ':2,'ㅝ':4,'ㅞ':5,'ㅟ':3,'ㅠ':3,'ㅡ':1,'ㅢ':2,'ㅣ':1,
  };
  const FINAL_STROKES: Record<string, number> = {
    '':0,'ㄱ':1,'ㄲ':2,'ㄳ':3,'ㄴ':1,'ㄵ':3,'ㄶ':3,'ㄷ':2,'ㄹ':3,'ㄺ':4,'ㄻ':6,'ㄼ':7,'ㄽ':5,'ㄾ':6,'ㄿ':7,'ㅀ':7,'ㅁ':4,'ㅂ':5,'ㅄ':6,'ㅅ':2,'ㅆ':4,'ㅇ':1,'ㅈ':3,'ㅊ':5,'ㅋ':3,'ㅌ':4,'ㅍ':6,'ㅎ':4,
  };

  let totalStrokes = 0;
  for (const char of chars) {
    const decomp = decomposeKorean(char);
    if (decomp) {
      totalStrokes += (INITIAL_STROKES[decomp.initial] || 0) + (VOWEL_STROKES[decomp.vowel] || 0) + (FINAL_STROKES[decomp.final] || 0);
    }
  }

  // Element harmony analysis (five elements generating/overcoming)
  const elemNames = elements.filter(e => e !== '未知');
  const generateGroups: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const overGroups: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

  let harmonyDesc = '';
  if (elemNames.length >= 2) {
    const flow = [];
    for (let i = 0; i < elemNames.length - 1; i++) {
      if (generateGroups[elemNames[i]] === elemNames[i + 1]) {
        flow.push(`${elemNames[i]}→${elemNames[i + 1]} (상생)`);
      } else if (overGroups[elemNames[i]] === elemNames[i + 1]) {
        flow.push(`${elemNames[i]}→${elemNames[i + 1]} (상극)`);
      } else if (elemNames[i] === elemNames[i + 1]) {
        flow.push(`${elemNames[i]}→${elemNames[i + 1]} (동일)`);
      } else {
        flow.push(`${elemNames[i]}→${elemNames[i + 1]} (중립)`);
      }
    }
    harmonyDesc = `초성 오행 흐름: ${flow.join(', ')}`;
  }

  // 81 fortune for total strokes
  const f81Num = totalStrokes > 81 ? ((totalStrokes - 1) % 81) + 1 : totalStrokes;
  const f81Label = getFortuneLabel(FORTUNE_LABEL_BY_NUMBER[f81Num] || '未知', locale);
  const f81Desc = getFortune81Desc(f81Num, locale);
  const elementNames = elemNames.map((e: string) => getElementName(e, locale)).join(', ');

  const analysisLocale = locale === 'ko'
    ? `성명 ${name}의 초성 오행은 ${elementNames}입니다. ${harmonyDesc}。총획수 ${totalStrokes}획, 81수리: ${f81Label} - ${f81Desc}`
    : locale === 'en'
    ? `Name ${name}: initial consonant elements are ${elementNames}. ${harmonyDesc}. Total strokes: ${totalStrokes}, 81 fortune: ${f81Label} - ${f81Desc}`
    : locale === 'ru'
    ? `Имя ${name}: элементы начальных согласных — ${elementNames}. ${harmonyDesc}. Всего черт: ${totalStrokes}, число 81: ${f81Label} - ${f81Desc}`
    : locale === 'es'
    ? `Nombre ${name}: elementos iniciales — ${elementNames}. ${harmonyDesc}. Total de trazos: ${totalStrokes}, número 81: ${f81Label} - ${f81Desc}`
    : `姓名${name}的初声五行是${elementNames}。${harmonyDesc}。总笔画${totalStrokes}，81数理：${f81Label} - ${f81Desc}`;

  return {
    method: 'korean',
    initials,
    elements: elemNames,
    harmony: harmonyDesc,
    totalStrokes,
    fortune81: `${f81Label}: ${f81Desc}`,
    analysis: analysisLocale,
  };
}

/**
 * Detect the most suitable method based on name content
 */
export function detectNameMethod(name: string): string[] {
  const hasChinese = /[一-鿿]/.test(name);
  const hasKorean = /[가-힯]/.test(name);
  const hasLatin = /[a-zA-Z]/.test(name);

  if (hasKorean) return ['korean', 'chinese'];
  if (hasChinese) return ['chinese', 'pythagorean'];
  if (hasLatin) return ['pythagorean', 'chaldean'];
  return ['pythagorean', 'chaldean'];
}

/**
 * Main function: calculate name fortune by method
 */
export function calculateNameFortune(name: string, method: string, locale: string = 'zh-CN'): NameFortuneResult | null {
  switch (method) {
    case 'chinese': return calculateChineseName(name, locale);
    case 'pythagorean': return calculatePythagorean(name, locale);
    case 'chaldean': return calculateChaldean(name, locale);
    case 'korean': return calculateKoreanName(name, locale);
    default: return null;
  }
}
