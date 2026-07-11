/**
 * 81 数理吉凶表（姓名学）
 * 索引 1-81，每个条目：{ 吉凶: '吉'|'凶'|'半吉', 含义: string }
 * 语言无关，返回索引
 */
export interface NumberMeaning {
  luck: 'great' | 'good' | 'semi' | 'bad' | 'very_bad';
  meaningCn: string;
  meaningEn: string;
}

export const NUM81: Record<number, NumberMeaning> = {
  1:  { luck: 'great', meaningCn: '天地开泰，万物创始', meaningEn: 'Great beginning, all things start anew' },
  2:  { luck: 'bad', meaningCn: '混沌未定，进退两难', meaningEn: 'Unsettled chaos, difficulty advancing' },
  3:  { luck: 'great', meaningCn: '蒸蒸日上，百事顺遂', meaningEn: 'Rising fortune, all things go smoothly' },
  4:  { luck: 'bad', meaningCn: '坎坷多难，安分守己', meaningEn: 'Many obstacles, stay grounded' },
  5:  { luck: 'great', meaningCn: '福寿双全，名利双收', meaningEn: 'Blessings and longevity, fame and wealth' },
  6:  { luck: 'great', meaningCn: '安稳安定，万事如意', meaningEn: 'Stable and peaceful, all wishes fulfilled' },
  7:  { luck: 'great', meaningCn: '刚毅果断，勇往直前', meaningEn: 'Resolute and decisive, forging ahead' },
  8:  { luck: 'great', meaningCn: '意志坚定，努力发达', meaningEn: 'Strong will, diligent success' },
  9:  { luck: 'bad', meaningCn: '虽抱奇才，有才无命', meaningEn: 'Talented but luckless' },
  10: { luck: 'very_bad', meaningCn: '暗淡无光，空费心力', meaningEn: 'Dim prospects, wasted effort' },
  11: { luck: 'great', meaningCn: '草木逢春，稳健隆昌', meaningEn: 'Spring returns, steady prosperity' },
  12: { luck: 'bad', meaningCn: '薄弱无力，孤立无援', meaningEn: 'Weak and isolated' },
  13: { luck: 'great', meaningCn: '天赋吉运，能得人望', meaningEn: 'Gifted fortune, popular esteem' },
  14: { luck: 'bad', meaningCn: '忍得苦难，必有后福', meaningEn: 'Endure hardship, later blessings' },
  15: { luck: 'great', meaningCn: '谦恭做事，必得人和', meaningEn: 'Humble work gains harmony' },
  16: { luck: 'great', meaningCn: '能获众望，成就大业', meaningEn: 'Popular support, great achievement' },
  17: { luck: 'good', meaningCn: '排除万难，有贵人助', meaningEn: 'Overcome all obstacles, help from above' },
  18: { luck: 'great', meaningCn: '经商做事，顺利昌隆', meaningEn: 'Business prospers smoothly' },
  19: { luck: 'semi', meaningCn: '虽有大才，百事阻滞', meaningEn: 'Great talent but many obstacles' },
  20: { luck: 'bad', meaningCn: '历尽艰难，焦心忧劳', meaningEn: 'Hardship and worry throughout' },
  21: { luck: 'great', meaningCn: '明月光照，独立权威', meaningEn: 'Bright moonlight, independent authority' },
  22: { luck: 'bad', meaningCn: '秋草逢霜，怀才不遇', meaningEn: 'Frost on autumn grass, unrecognized talent' },
  23: { luck: 'great', meaningCn: '旭日东升，名显四方', meaningEn: 'Rising sun, fame spreads far' },
  24: { luck: 'great', meaningCn: '锦绣前程，须靠自力', meaningEn: 'Splendid future, self-reliance' },
  25: { luck: 'good', meaningCn: '天时地利，再得人和', meaningEn: 'Right time and place, with harmony' },
  26: { luck: 'semi', meaningCn: '波澜起伏，千变万化', meaningEn: 'Waves of change, ever-changing' },
  27: { luck: 'semi', meaningCn: '一成一败，一盛一衰', meaningEn: 'One success one failure' },
  28: { luck: 'bad', meaningCn: '鱼临旱地，难逃厄运', meaningEn: 'Fish on dry land, hard to escape fate' },
  29: { luck: 'good', meaningCn: '青云直上，智谋卓著', meaningEn: 'Soaring high, outstanding wisdom' },
  30: { luck: 'semi', meaningCn: '吉凶参半，得失相伴', meaningEn: 'Mixed fortune, gains and losses' },
  31: { luck: 'great', meaningCn: '智勇兼备，可享清福', meaningEn: 'Wisdom and courage, peaceful life' },
  32: { luck: 'good', meaningCn: '幸运多望，贵人相助', meaningEn: 'Fortunate, help from benefactors' },
  33: { luck: 'great', meaningCn: '意气用事，必成大器', meaningEn: 'Driven by spirit, destined for greatness' },
  34: { luck: 'bad', meaningCn: '破家之象，难望成功', meaningEn: 'Family breaking, difficult success' },
  35: { luck: 'great', meaningCn: '温和平静，智达通畅', meaningEn: 'Gentle and calm, wisdom flows' },
  36: { luck: 'semi', meaningCn: '波澜重叠，常陷困境', meaningEn: 'Waves overlap, often in difficulty' },
  37: { luck: 'great', meaningCn: '逢凶化吉，风调雨顺', meaningEn: 'Bad luck turns good, smooth sailing' },
  38: { luck: 'semi', meaningCn: '虽可得利，难以持久', meaningEn: 'Can gain profit but hard to sustain' },
  39: { luck: 'great', meaningCn: '云开见月，光明坦途', meaningEn: 'Clouds part to reveal the moon' },
  40: { luck: 'semi', meaningCn: '一盛一衰，浮沉不定', meaningEn: 'Rise and fall, uncertain fate' },
  41: { luck: 'great', meaningCn: '德才兼备，名利双收', meaningEn: 'Virtue and talent, both fame and fortune' },
  42: { luck: 'semi', meaningCn: '专心努力，终有成就', meaningEn: 'Focus and effort will bring results' },
  43: { luck: 'semi', meaningCn: '雨夜之花，外祥内苦', meaningEn: 'Flower in rain, outward beauty inside pain' },
  44: { luck: 'bad', meaningCn: '虽有才智，难成大业', meaningEn: 'Though talented, hard to achieve greatly' },
  45: { luck: 'great', meaningCn: '顺风扬帆，万事如意', meaningEn: 'Full sails in fair wind, all goes well' },
  46: { luck: 'bad', meaningCn: '坎坷不平，艰难重重', meaningEn: 'Uneven road, many hardships' },
  47: { luck: 'great', meaningCn: '有贵人助，可成大业', meaningEn: 'Help from benefactors, can achieve greatly' },
  48: { luck: 'great', meaningCn: '德智兼备，必出人头地', meaningEn: 'Virtue and wisdom, destined to excel' },
  49: { luck: 'semi', meaningCn: '吉凶难分，一成一败', meaningEn: 'Fortune unclear, mixed success' },
  50: { luck: 'bad', meaningCn: '一盛一衰，浮沉不定', meaningEn: 'Rise and fall constantly' },
  51: { luck: 'semi', meaningCn: '盛衰交加，先吉后凶', meaningEn: 'Fortune mixed, first good then bad' },
  52: { luck: 'great', meaningCn: '草木逢春，雨过天晴', meaningEn: 'Spring returns, sun after rain' },
  53: { luck: 'semi', meaningCn: '盛衰参半，先吉后凶', meaningEn: 'Half success half failure' },
  54: { luck: 'bad', meaningCn: '虽倾全力，难望成功', meaningEn: 'Full effort but hard to succeed' },
  55: { luck: 'semi', meaningCn: '外观昌隆，内隐祸患', meaningEn: 'Outward success, hidden danger' },
  56: { luck: 'bad', meaningCn: '事与愿违，终难成功', meaningEn: 'Things go against wishes, hard to succeed' },
  57: { luck: 'good', meaningCn: '虽有困难，时来运转', meaningEn: 'Though difficulties, fortune turns' },
  58: { luck: 'semi', meaningCn: '半凶半吉，浮沉不定', meaningEn: 'Half bad half good, unsettled' },
  59: { luck: 'bad', meaningCn: '犹豫不决，难望成功', meaningEn: 'Hesitant, hard to succeed' },
  60: { luck: 'bad', meaningCn: '黑暗无光，心神不宁', meaningEn: 'Dark with no light, restless heart' },
  61: { luck: 'great', meaningCn: '云开见月，光明坦途', meaningEn: 'Clouds part, bright path ahead' },
  62: { luck: 'bad', meaningCn: '虽有努力，难望成功', meaningEn: 'Though effort made, hard to succeed' },
  63: { luck: 'great', meaningCn: '万物化育，繁荣之象', meaningEn: 'All things flourish, prosperity' },
  64: { luck: 'bad', meaningCn: '徒劳无功，有始无终', meaningEn: 'Futile effort, start without finish' },
  65: { luck: 'great', meaningCn: '光明之路，万事如意', meaningEn: 'Bright path, all goes well' },
  66: { luck: 'bad', meaningCn: '黑暗漫长，进退维谷', meaningEn: 'Long darkness, trapped' },
  67: { luck: 'great', meaningCn: '顺利通达，受人大助', meaningEn: 'Smooth progress, great help' },
  68: { luck: 'great', meaningCn: '思虑周详，计划成功', meaningEn: 'Careful planning brings success' },
  69: { luck: 'semi', meaningCn: '动摇不安，常陷逆境', meaningEn: 'Unsettled, often in adversity' },
  70: { luck: 'bad', meaningCn: '惨淡经营，难免贫困', meaningEn: 'Struggling business, likely poverty' },
  71: { luck: 'semi', meaningCn: '吉凶参半，顺逆并存', meaningEn: 'Mixed fortune, good and bad' },
  72: { luck: 'semi', meaningCn: '先苦后甜，安享晚年', meaningEn: 'First bitter then sweet, peaceful old age' },
  73: { luck: 'good', meaningCn: '虽有困难，终得安乐', meaningEn: 'Though difficulties, finally peaceful' },
  74: { luck: 'bad', meaningCn: '多灾多难，进退两难', meaningEn: 'Many disasters, trapped' },
  75: { luck: 'semi', meaningCn: '守本分者，可保平安', meaningEn: 'Stay in place, can keep peace' },
  76: { luck: 'bad', meaningCn: '倾覆离散，骨肉分离', meaningEn: 'Overturned and scattered, family separates' },
  77: { luck: 'semi', meaningCn: '先苦后甘，先失后得', meaningEn: 'First bitter then sweet, first lose then gain' },
  78: { luck: 'semi', meaningCn: '前运辛苦，晚年幸福', meaningEn: 'Hard early years, happy later' },
  79: { luck: 'bad', meaningCn: '虽有才智，无运可乘', meaningEn: 'Though talented, no luck' },
  80: { luck: 'semi', meaningCn: '辛苦一生，晚景凄凉', meaningEn: 'Hard life, bleak old age' },
  81: { luck: 'great', meaningCn: '万物回春，还原复始', meaningEn: 'Spring returns to all, cycle restarts' },
};

/** 获取数理吉凶等级(0-100) */
export function getNumberScore(n: number): number {
  const m = NUM81[((n - 1) % 81) + 1];
  if (!m) return 50;
  const scores: Record<string, number> = { great: 90, good: 75, semi: 55, bad: 35, very_bad: 20 };
  return scores[m.luck] || 50;
}
