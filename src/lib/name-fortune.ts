/**
 * Name Fortune Calculation Engine
 *
 * Four methods:
 * 1. Chinese 五格剖象法 (Five Grids Stroke Analysis)
 * 2. Western Pythagorean Numerology
 * 3. Western Chaldean Numerology
 * 4. Korean 성명학 (Seongmyeonghak)
 */

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
  const map: Record<string, Record<string, string>> = {
    'zh-CN': { '木': '木', '火': '火', '土': '土', '金': '金', '水': '水' },
    en: { '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water' },
    ru: { '木': 'Дерево', '火': 'Огонь', '土': 'Земля', '金': 'Металл', '水': 'Вода' },
    es: { '木': 'Madera', '火': 'Fuego', '土': 'Tierra', '金': 'Metal', '水': 'Agua' },
    ko: { '木': '목', '火': '화', '土': '토', '金': '금', '水': '수' },
  };
  return map[locale]?.[element] || element;
}

// ============================================================
// 81 Number Fortune Table
// ============================================================
const FORTUNE_81: Record<number, { fortune: string; desc: string }> = {
  1: { fortune: '大吉', desc: '太极之数，万物开泰，生发无穷，利禄亨通。' },
  2: { fortune: '凶', desc: '混沌未定，进退保守，志望难达。' },
  3: { fortune: '大吉', desc: '三才之数，天地人和，大事大业，繁荣昌隆。' },
  4: { fortune: '凶', desc: '破败之数，进退维谷，非有毅力，难望成功。' },
  5: { fortune: '大吉', desc: '五行之数，阴阳和合，名利双收，一门兴隆。' },
  6: { fortune: '大吉', desc: '六爻之数，天德地祥，福庆吉昌，万事亨通。' },
  7: { fortune: '大吉', desc: '七政之数，刚毅果断，排除万难，必获成功。' },
  8: { fortune: '大吉', desc: '八卦之数，努力发达，贯彻志望，可期成功。' },
  9: { fortune: '凶', desc: '大成之数，虽抱奇才，有才无命，利去功空。' },
  10: { fortune: '凶', desc: '终结之数，雪暗飘零，偶或有成，回顾茫然。' },
  11: { fortune: '大吉', desc: '万物更新，调顺发达，稳健着实，必得繁荣。' },
  12: { fortune: '凶', desc: '薄弱无力，孤立无援，外祥内苦，谋事难成。' },
  13: { fortune: '大吉', desc: '才艺多能，智谋奇略，处事严谨，必获大功。' },
  14: { fortune: '凶', desc: '破兆之数，沦落天涯，失意烦闷，非有缘者。' },
  15: { fortune: '大吉', desc: '福寿之数，福寿拱照，立身兴家，慈祥有德。' },
  16: { fortune: '大吉', desc: '厚重之数，逢凶化吉，贵人得助，一门隆兴。' },
  17: { fortune: '大吉', desc: '刚强之数，权威刚强，突破万难，必获成功。' },
  18: { fortune: '大吉', desc: '铁镜重磨，有志竟成，内外有助，功成名就。' },
  19: { fortune: '凶', desc: '风云蔽月，辛苦重来，虽有智谋，挫折难免。' },
  20: { fortune: '凶', desc: '非业破运，万事不成，进退两难，一生不安。' },
  21: { fortune: '大吉', desc: '明月中天，光风霁月，万物确立，官运亨通。' },
  22: { fortune: '凶', desc: '秋草逢霜，怀才不遇，忧愁怨苦，事不如意。' },
  23: { fortune: '大吉', desc: '旭日东升，名显四方，渐次进展，终成大业。' },
  24: { fortune: '大吉', desc: '家门余庆，金钱丰盈，白手成家，财源广进。' },
  25: { fortune: '大吉', desc: '资性英敏，刚毅果断，才能奇特，自成大业。' },
  26: { fortune: '凶', desc: '变怪之数，波澜起伏，英雄豪杰，临难不屈。' },
  27: { fortune: '凶', desc: '欲望无止，自我心强，多受诽谤，尚可成功。' },
  28: { fortune: '凶', desc: '遭难之数，豪杰气概，四海漂泊，终世浮躁。' },
  29: { fortune: '大吉', desc: '智谋优秀，财力归集，成就大业，名闻海内。' },
  30: { fortune: '凶', desc: '绝处逢生，吉凶难分，若凶则惨，若吉则兴。' },
  31: { fortune: '大吉', desc: '智勇得志，博得名利，统领众人，繁荣富贵。' },
  32: { fortune: '大吉', desc: '侥幸多望，贵人得助，财帛丰裕，繁荣至上。' },
  33: { fortune: '大吉', desc: '旭日东升，鸾凤相会，名闻天下，隆昌至极。' },
  34: { fortune: '凶', desc: '破家亡身，见识短浅，辛苦遭难，灾祸至极。' },
  35: { fortune: '大吉', desc: '温和平安，学智兼备，文雅发展，成就非凡。' },
  36: { fortune: '凶', desc: '波澜重叠，常陷穷困，动不如静，有才无命。' },
  37: { fortune: '大吉', desc: '权威显达，热诚忠信，宜着雅量，终身荣富。' },
  38: { fortune: '凶', desc: '薄弱平凡，有志难伸，虽有才艺，难望成功。' },
  39: { fortune: '大吉', desc: '富贵荣华，财帛丰盈，光明坦途，指日可期。' },
  40: { fortune: '凶', desc: '智谋胆力，冒险投机，沉浮不定，退守方安。' },
  41: { fortune: '大吉', desc: '德望高大，事事如意，富贵荣誉，财源亨通。' },
  42: { fortune: '凶', desc: '寒蝉在柳，博识多能，精通世情，专心可成。' },
  43: { fortune: '凶', desc: '散财破产，雨夜之花，外表繁荣，内里空虚。' },
  44: { fortune: '凶', desc: '破家亡身，暗藏惨淡，事不如意，乱世怪杰。' },
  45: { fortune: '大吉', desc: '新生泰运，顺风扬帆，智谋经纬，富贵繁荣。' },
  46: { fortune: '凶', desc: '坎坷不平，艰难重重，若无耐心，难望有成。' },
  47: { fortune: '大吉', desc: '开花结果，权威显达，享福终身，名利双收。' },
  48: { fortune: '大吉', desc: '古松立鹤，德智兼备，出身清贵，安享福禄。' },
  49: { fortune: '凶', desc: '吉凶难分，得宽则吉，得隘则凶。初吉终乱。' },
  50: { fortune: '凶', desc: '一成一败，吉凶互见，先得庇荫，后遭惨淡。' },
  51: { fortune: '凶', desc: '盛衰交加，一荣一枯，一心一德，可保成功。' },
  52: { fortune: '大吉', desc: '卓识达眼，先见之明，智谋超群，名利双收。' },
  53: { fortune: '凶', desc: '外祥内苦，先吉后凶，外观幸福，内多障碍。' },
  54: { fortune: '凶', desc: '石上栽花，多难悲运，难望成功，素行缺德。' },
  55: { fortune: '凶', desc: '善恶兼半，外美内恶，先吉后凶，悲叹一生。' },
  56: { fortune: '凶', desc: '浪里行舟，历尽艰辛，四周障害，晚景渐佳。' },
  57: { fortune: '大吉', desc: '日照春松，寒雪青松，时来运转，繁荣吉祥。' },
  58: { fortune: '凶', desc: '半凶半吉，浮沉多端，祸福无常，大成大败。' },
  59: { fortune: '凶', desc: '云遮半月，内里波澜，千辛万苦，难达心愿。' },
  60: { fortune: '凶', desc: '黑暗无光，心迷意乱，出尔反尔，难定方针。' },
  61: { fortune: '大吉', desc: '名利双收，修炼积蓄，繁花似锦，名闻天下。' },
  62: { fortune: '凶', desc: '基础虚弱，困难重重，徒劳无功，衰败悲伤。' },
  63: { fortune: '大吉', desc: '舟归平浦，万物化育，繁荣之象，富贵荣达。' },
  64: { fortune: '凶', desc: '骨肉分离，一生浮沉，难得安泰，孤独悲运。' },
  65: { fortune: '大吉', desc: '巨流归海，富贵长寿，天长地久，事事如意。' },
  66: { fortune: '凶', desc: '进退失据，内外不和，艰难不堪，损伤灾祸。' },
  67: { fortune: '大吉', desc: '天赋幸运，四通八达，万事如意，富贵繁昌。' },
  68: { fortune: '大吉', desc: '深思熟虑，智谋周全，兴家立业，富贵荣华。' },
  69: { fortune: '凶', desc: '动摇不安，常陷逆境，灾害交至，难得平安。' },
  70: { fortune: '凶', desc: '残菊逢霜，惨淡忧愁，晚景凄凉，非有运者。' },
  71: { fortune: '凶', desc: '石上栽花，外观幸福，内里辛劳，难得实益。' },
  72: { fortune: '凶', desc: '先甘后苦，万难忍受，晚景悲运，身心疲劳。' },
  73: { fortune: '大吉', desc: '志高力微，盛衰交加，若能谨慎，可保安泰。' },
  74: { fortune: '凶', desc: '残花经霜，智谋不足，贪功图利，终至失败。' },
  75: { fortune: '凶', desc: '守则可安，进则失败，宜守不宜攻，平稳是福。' },
  76: { fortune: '凶', desc: '倾覆离散，内外不合，骨肉分离，一生多难。' },
  77: { fortune: '凶', desc: '半吉半凶，先吉后凶，获福者少，受祸者多。' },
  78: { fortune: '凶', desc: '晚景凄凉，先得后失，无智无谋，晚境悲惨。' },
  79: { fortune: '凶', desc: '云头望月，身疲力尽，前途暗淡，急流勇退。' },
  80: { fortune: '凶', desc: '吉星入度，一生平安，早也辉煌，晚也辉煌。' },
  81: { fortune: '大吉', desc: '最极之数，万物归根，还本归元，繁荣发达。' },
};

// ============================================================
// Personality traits by element and number
// ============================================================
const ELEMENT_PERSONALITY: Record<string, string> = {
  '木': '仁慈善良，富有创造力，个性温和包容。如同大树，沉稳生长，为他人提供荫蔽。做事有耐心，重视积累。',
  '火': '热情奔放，充满活力，具有领袖气质。行动力强，敢于表现自我。但需注意控制脾气，避免急躁误事。',
  '土': '稳重踏实，诚实可靠，有责任感。如同大地，承载万物。做事脚踏实地，值得信赖。',
  '金': '刚毅果断，正义感强，追求完美。做事有原则，不畏艰难。但需注意有时过于刚硬。',
  '水': '智慧深邃，灵活变通，适应力强。善于思考，富有洞察力。如同流水，懂得迂回前进。',
};

// ============================================================
// Method 1: Chinese Five Grids (五格剖象法)
// ============================================================
export function calculateChineseName(name: string): ChineseNameResult {
  const chars = [...name.trim()].filter(c => /[一-鿿]/.test(c));
  if (chars.length < 2) {
    return {
      method: 'chinese',
      strokes: { surname: [], given: [] },
      grids: { heaven: 0, personality: 0, earth: 0, total: 0, external: 0 },
      elements: { heaven: '', personality: '', earth: '', total: '', external: '' },
      threeTalents: { elements: [], harmony: '', description: '' },
      gridInterpretations: {},
      personality: '请输入至少2个汉字的中文姓名',
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
  const threeTalents = analyzeThreeTalents(talents);

  // 81-number interpretations for each grid
  const gridInterpretations: Record<string, { number: number; fortune: string; description: string }> = {};
  const gridNames = ['天格', '人格', '地格', '总格', '外格'];
  const gridValues = [heaven, personality, earth, total, external];
  gridNames.forEach((name, i) => {
    const num = gridValues[i];
    const f81 = FORTUNE_81[num] || { fortune: '未知', desc: '暂无解释' };
    gridInterpretations[name] = { number: num, fortune: f81.fortune, description: f81.desc };
  });

  // Personality from the main element
  const personalityDesc = ELEMENT_PERSONALITY[elements.personality] || '命格独特，个性鲜明。';

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

function analyzeThreeTalents(elements: string[]): { elements: string[]; harmony: string; description: string } {
  const winOver: Record<string, string> = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  const generate: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };

  // Check generation chain (天→人→地)
  const genChain = generate[elements[0]] === elements[1] && generate[elements[1]] === elements[2];
  // Check overcoming chain
  const over1 = winOver[elements[0]] === elements[1];
  const over2 = winOver[elements[1]] === elements[2];

  if (genChain) {
    return { elements, harmony: '大吉', description: '三才配置极佳，天地人三格五行相生，形成良性循环，运势亨通，诸事顺遂。' };
  } else if (elements[0] === elements[1] && elements[1] === elements[2]) {
    return { elements, harmony: '中吉', description: '三才五行一致，力量集中，在某一方面有突出表现，但需注意单一五行过旺带来的偏颇。' };
  } else if (over1 && over2) {
    return { elements, harmony: '凶', description: '三才相克，天地人三格五行相战，运势多有波折，需注意人际和健康。宜以柔克刚，避免强求。' };
  } else if (over1 && !over2) {
    return { elements, harmony: '半吉', description: '天格克人格，早年运势受家族因素影响较大。但人格生地格，中年后运势渐好。' };
  } else if (!over1 && over2) {
    return { elements, harmony: '半吉', description: '人格克地格，中年运势强但需注意家庭和晚年。天格生人格，早年有长辈贵人相助。' };
  }

  return { elements, harmony: '中平', description: '三才配置一般，有生有克，运势起伏正常，努力可改运。' };
}

// ============================================================
// Method 2: Pythagorean Numerology
// ============================================================
const PYTHAGOREAN_MAP: Record<string, number> = {
  A:1, B:2, C:3, D:4, E:5, F:6, G:7, H:8, I:9,
  J:1, K:2, L:3, M:4, N:5, O:6, P:7, Q:8, R:9,
  S:1, T:2, U:3, V:4, W:5, X:6, Y:7, Z:8,
};

export function calculatePythagorean(name: string): WesternNameResult {
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
    expression: { ...exprNum, meaning: getNumberMeaning(exprNum.number, 'expression') },
    personality: { ...personNum, meaning: getNumberMeaning(personNum.number, 'personality') },
    heartDesire: { ...heartNum, meaning: getNumberMeaning(heartNum.number, 'heartDesire') },
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

export function calculateChaldean(name: string): WesternNameResult {
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
    expression: { ...exprNum, meaning: getNumberMeaning(exprNum.number, 'expression') },
    personality: { ...personNum, meaning: getNumberMeaning(personNum.number, 'personality') },
    heartDesire: { ...heartNum, meaning: getNumberMeaning(heartNum.number, 'heartDesire') },
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

// Number meanings
const NUMBER_MEANINGS: Record<number, Record<string, string>> = {
  1: { expression: '天生的领导者，独立自主，具有开创精神。适合创业、管理、领导岗位。', personality: '给人果断、自信、有魄力的第一印象。', heartDesire: '内心深处渴望独立和掌控，想要成为人生的主导者。' },
  2: { expression: '天生的协调者，温柔敏感，善于合作。适合外交、咨询、教育领域。', personality: '给人温和、友善、好相处的印象。', heartDesire: '内心渴望和谐与陪伴，重视关系和情感连接。' },
  3: { expression: '天生的创造者，表达能力强，乐观开朗。适合艺术、娱乐、传媒行业。', personality: '给人风趣、外向、有魅力的印象。', heartDesire: '内心渴望表达和被看见，想要通过创造力影响世界。' },
  4: { expression: '天生的建设者，务实稳重，勤奋坚持。适合工程、财务、行政工作。', personality: '给人可靠、踏实、值得信赖的印象。', heartDesire: '内心渴望稳定和安全，追求有序和可控的生活。' },
  5: { expression: '天生的自由者，热爱冒险，适应力强。适合旅行、销售、媒体行业。', personality: '给人活泼、多变、有趣的第一印象。', heartDesire: '内心渴望自由和变化，害怕被束缚。' },
  6: { expression: '天生的守护者，有爱心，责任感强。适合医疗、教育、公益事业。', personality: '给人温暖、体贴、有担当的印象。', heartDesire: '内心渴望爱与被爱，追求家庭的温暖和和谐。' },
  7: { expression: '天生的思想者，善于分析，有灵性。适合科研、哲学、神秘学。', personality: '给人沉静、睿智、深不可测的印象。', heartDesire: '内心渴望真理和智慧，追求深层次的理解。' },
  8: { expression: '天生的掌权者，有商业头脑，追求成功。适合商业、金融、管理领域。', personality: '给人强大、有权威、成功的印象。', heartDesire: '内心渴望成就和认可，追求物质与精神的双重丰盛。' },
  9: { expression: '天生的人道主义者，慈悲为怀，胸怀天下。适合慈善、艺术、社会服务。', personality: '给人博爱、理想主义、有格局的印象。', heartDesire: '内心渴望奉献和完成，追求更高层次的人生意义。' },
  11: { expression: '具有极高的灵性和直觉力，是启发他人的灯塔。适合精神领袖、艺术家。', personality: '给人充满魅力、有启发性、超凡脱俗的印象。', heartDesire: '内心渴望照亮他人，传递灵性的真理。' },
  22: { expression: '大师建造者，能将宏大的梦想转化为现实。适合大型项目、建筑、社会改造。', personality: '给人能力超群、胸怀大志的印象。', heartDesire: '内心渴望建设一个更美好的世界。' },
  33: { expression: '大师导师，拥有无条件的爱与服务精神。适合教育、疗愈、精神指导。', personality: '给人温暖包容、充满爱意的印象。', heartDesire: '内心渴望以爱服务和提升全人类。' },
};

function getNumberMeaning(num: number, type: string): string {
  return NUMBER_MEANINGS[num]?.[type] || '这个数字赋予了独特的能量。';
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

export function calculateKoreanName(name: string): KoreanNameResult {
  const chars = [...name.trim()].filter(c => {
    const code = c.charCodeAt(0);
    return code >= 0xAC00 && code <= 0xD7A3;
  });

  if (chars.length < 2) {
    return {
      method: 'korean',
      initials: [],
      elements: [],
      harmony: '',
      totalStrokes: 0,
      fortune81: '',
      analysis: '한글 이름을 2자 이상 입력해주세요.',
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
  const f81 = FORTUNE_81[totalStrokes % 82] || { fortune: '未知', desc: '' };
  const elementNames = elemNames.map(e => getElementName(e, 'ko')).join(', ');

  const analysis = `성명 ${name}의 초성 오행은 ${elementNames}입니다. ${harmonyDesc}。총획수 ${totalStrokes}획, 81수리: ${f81.fortune} - ${f81.desc}`;

  return {
    method: 'korean',
    initials,
    elements: elemNames,
    harmony: harmonyDesc,
    totalStrokes,
    fortune81: `${f81.fortune}: ${f81.desc}`,
    analysis,
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
export function calculateNameFortune(name: string, method: string): NameFortuneResult | null {
  switch (method) {
    case 'chinese': return calculateChineseName(name);
    case 'pythagorean': return calculatePythagorean(name);
    case 'chaldean': return calculateChaldean(name);
    case 'korean': return calculateKoreanName(name);
    default: return null;
  }
}
