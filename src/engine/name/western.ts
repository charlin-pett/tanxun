/**
 * 西方生命灵数计算引擎
 *
 * 基于毕达哥拉斯体系：
 * - 表达数（Expression Number）：全名数字总和
 * - 灵魂数（Soul Urge Number）：元音字母数字总和
 * - 个性数（Personality Number）：辅音字母数字总和
 */

const LETTER_MAP: Record<string, number> = {
  'a':1,'b':2,'c':3,'d':4,'e':5,'f':6,'g':7,'h':8,'i':9,
  'j':1,'k':2,'l':3,'m':4,'n':5,'o':6,'p':7,'q':8,'r':9,
  's':1,'t':2,'u':3,'v':4,'w':5,'x':6,'y':7,'z':8
};

const VOWELS = new Set(['a','e','i','o','u']);

function reduceToRoot(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n; // 主数不简化
  while (n > 9) { n = n.toString().split('').reduce((s, d) => s + parseInt(d), 0); }
  return n;
}

export interface WesternNumerologyResult {
  expression: number;  // 表达数
  soul: number;        // 灵魂数
  personality: number; // 个性数
  numbers: { num: number; name: string; meaning_en: string; meaning_cn: string }[];
}

const NUMBER_MEANINGS: Record<number, { name_en: string; name_cn: string; meaning_en: string; meaning_cn: string }> = {
  1: { name_en: 'The Pioneer', name_cn: '开创者', meaning_en: 'Independent, creative, original, ambitious, determined.', meaning_cn: '独立、创造、原创、雄心勃勃、意志坚定。' },
  2: { name_en: 'The Peacemaker', name_cn: '和平者', meaning_en: 'Cooperative, diplomatic, sensitive, intuitive, supportive.', meaning_cn: '合作、外交、敏感、直觉、善于支持他人。' },
  3: { name_en: 'The Communicator', name_cn: '沟通者', meaning_en: 'Expressive, optimistic, creative, social, charismatic.', meaning_cn: '善于表达、乐观、有创造力、社交能力强、有魅力。' },
  4: { name_en: 'The Builder', name_cn: '建设者', meaning_en: 'Practical, disciplined, reliable, hardworking, honest.', meaning_cn: '务实、自律、可靠、勤奋、诚实。' },
  5: { name_en: 'The Traveler', name_cn: '探索者', meaning_en: 'Adventurous, freedom-loving, versatile, progressive.', meaning_cn: '冒险、热爱自由、多才多艺、进步。' },
  6: { name_en: 'The Nurturer', name_cn: '滋养者', meaning_en: 'Responsible, caring, protective, harmonious, compassionate.', meaning_cn: '负责、关爱、保护、和谐、有同情心。' },
  7: { name_en: 'The Seeker', name_cn: '求道者', meaning_en: 'Analytical, introspective, spiritual, wise, thoughtful.', meaning_cn: '善于分析、内省、灵性、智慧、深思熟虑。' },
  8: { name_en: 'The Executive', name_cn: '执行者', meaning_en: 'Ambitious, authoritative, practical, success-oriented.', meaning_cn: '雄心勃勃、有权威、务实、以成功为导向。' },
  9: { name_en: 'The Humanitarian', name_cn: '博爱者', meaning_en: 'Compassionate, generous, idealistic, artistic, wise.', meaning_cn: '富有同情心、慷慨、理想主义、有艺术气质、智慧。' },
  11: { name_en: 'The Intuitive', name_cn: '直觉者', meaning_en: 'Inspirational, intuitive, enlightened, idealistic.', meaning_cn: '有启发力、直觉敏锐、觉悟、理想主义。' },
  22: { name_en: 'The Master Builder', name_cn: '大师建造者', meaning_en: 'Visionary, practical, powerful, capable of great achievements.', meaning_cn: '有远见、务实、强大、能够成就大业。' },
  33: { name_en: 'The Master Teacher', name_cn: '大师导师', meaning_en: 'Compassionate, inspiring, selfless, healing presence.', meaning_cn: '富有同情心、激励他人、无私奉献。' },
};

function calcSum(name: string, filter?: (c: string) => boolean): number {
  let sum = 0;
  for (const ch of name.toLowerCase()) {
    if (filter && !filter(ch)) continue;
    sum += LETTER_MAP[ch] || 0;
  }
  return sum;
}

export function analyzeWesternName(fullName: string): WesternNumerologyResult {
  // 去除空格
  const clean = fullName.replace(/[^a-zA-Z]/g, '');
  const expression = reduceToRoot(calcSum(clean));
  const soul = reduceToRoot(calcSum(clean, c => VOWELS.has(c)));
  const personality = reduceToRoot(calcSum(clean, c => !VOWELS.has(c) && /[a-z]/.test(c)));

  const nums = [expression, soul, personality];
  const seen = new Set<number>();
  const numbers = nums.filter(n => { if (seen.has(n)) return false; seen.add(n); return true; }).map(n => ({
    num: n,
    name: (NUMBER_MEANINGS[n] || NUMBER_MEANINGS[n <= 9 ? n : ((n % 9) || 9)]).name_en,
    meaning_en: (NUMBER_MEANINGS[n] || NUMBER_MEANINGS[n <= 9 ? n : ((n % 9) || 9)]).meaning_en,
    meaning_cn: (NUMBER_MEANINGS[n] || NUMBER_MEANINGS[n <= 9 ? n : ((n % 9) || 9)]).meaning_cn,
  }));

  return { expression, soul, personality, numbers };
}
