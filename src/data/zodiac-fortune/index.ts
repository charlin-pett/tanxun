export interface ZodiacFortune {
  overall: string;
  luckyNumbers: number[];
  luckyColors: string[];
  luckyDirection: string;
  months: { month: number; title: string; content: string }[];
}

export function getZodiacIndexByYear(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

export const ZODIAC_NAMES: Record<string, string[]> = {
  'zh-CN': ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'],
  en: ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'],
  ru: ['Крыса','Бык','Тигр','Кролик','Дракон','Змея','Лошадь','Коза','Обезьяна','Петух','Собака','Свинья'],
  es: ['Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo'],
};

const DATA: Record<string, ZodiacFortune[]> = {
  'zh-CN': getCN(),
  en: getEN(),
};

function getCN(): ZodiacFortune[] {
  return [
    { overall: '鼠年出生的人聪明机敏，善于观察。今年是调整和积累的好时机，适合稳扎稳打。', luckyNumbers: [2,3], luckyColors: ['蓝色','金色'], luckyDirection: '东北', months: genCN('鼠',['运势平稳','人际关系活跃','事业运上升','财运不错','运势平淡','挑战出现','转机出现','财运亨通','人际运上升','运势上升','略有波动','收尾顺利']) },
    { overall: '牛年出生的人勤劳踏实。今年宜稳中求进，保持耐心，厚积薄发。', luckyNumbers: [1,9], luckyColors: ['黄色','棕色'], luckyDirection: '西南', months: genCN('牛',['运势稳中有升','人际关系不错','事业运佳','健康稍弱','压力增大','运势回升','财运不错','事业极佳','运势平稳','人际活跃','稍有波动','运势上升']) },
    { overall: '虎年出生的人勇敢自信。今年适合大胆创新，开拓进取。', luckyNumbers: [3,8], luckyColors: ['橙色','白色'], luckyDirection: '东南', months: genCN('虎',['新年新气象','运势向上','留意人际关系','健康稍弱','面对挑战','运势转好','贵人相助','财运亨通','新机会','运势上升','略有阻滞','年末不错']) },
    { overall: '兔年出生的人温和文雅。今年宜发挥自身优势，在稳定中求发展。', luckyNumbers: [6,9], luckyColors: ['粉色','绿色'], luckyDirection: '正东', months: genCN('兔',['运势平稳','人际活跃','事业机会','略有压力','财运不错','工作愉快','运势旺','注意人际','事业非常好','略有回落','运势回升','年末不错']) },
    { overall: '龙年出生的人气势不凡。今年是施展才华的好时机，大胆追求目标。', luckyNumbers: [5,7], luckyColors: ['金色','红色'], luckyDirection: '正南', months: genCN('龙',['开年不错','人际活跃','财运上升','健康留意','面对挑战','运势回升','人际旺','事业极佳','运势持续','稍有波动','运势回升','收尾顺利']) },
    { overall: '蛇年出生的人智慧深邃。今年适合发挥智慧优势，精打细算。', luckyNumbers: [2,8], luckyColors: ['紫色','黑色'], luckyDirection: '西南', months: genCN('蛇',['运势平稳','人际良好','新方向','健康注意','化险为夷','运势转好','贵人运','财运亨通','事业佳','略有波动','运势平稳','年末不错']) },
    { overall: '马年出生的人热情奔放。今年适合发挥行动力，大胆追求目标。', luckyNumbers: [3,7], luckyColors: ['红色','黄色'], luckyDirection: '正南', months: genCN('马',['精力充沛','人际活跃','机会多','调整步伐','财运上升','忙碌收获','运势旺','事业突破','略有回落','运势上升','财运不错','收尾平稳']) },
    { overall: '羊年出生的人温和善良。今年宜发挥创造力和人际优势。', luckyNumbers: [4,9], luckyColors: ['粉色','绿色'], luckyDirection: '西南', months: genCN('羊',['运势平稳','人际不错','事业上升','健康注意','压力增大','运势回升','贵人相助','财运亨通','事业极好','略有波动','平稳回升','年末顺利']) },
    { overall: '猴年出生的人聪明灵活。今年适合发挥聪明才智，不断创新。', luckyNumbers: [1,8], luckyColors: ['白色','金色'], luckyDirection: '西北', months: genCN('猴',['新年好','人际活跃','展现才智','财运上升','忙碌顺利','运势旺','贵人运','事业高峰','回落调整','运势回升','稳定发展','年末不错']) },
    { overall: '鸡年出生的人勤奋务实。今年宜稳扎稳打，发挥组织和执行力。', luckyNumbers: [5,7], luckyColors: ['金色','棕色'], luckyDirection: '正西', months: genCN('鸡',['新年气象','维护人际','事业上升','健康注意','保持定力','运势转好','贵人运','事业突破','财运亨通','略有波动','平稳回升','年末不错']) },
    { overall: '狗年出生的人忠诚可靠。今年宜发挥责任心和执行力。', luckyNumbers: [3,9], luckyColors: ['红色','绿色'], luckyDirection: '正东', months: genCN('狗',['运势平稳','人际不错','事业上升','健康关注','调整心态','事半功倍','贵人运','财运不错','事业极佳','略有波动','运势回升','年末不错']) },
    { overall: '猪年出生的人心地善良。今年宜保持良好心态，在稳定中求发展。', luckyNumbers: [2,6], luckyColors: ['黄色','蓝色'], luckyDirection: '正北', months: genCN('猪',['新年好','人际佳','事业机会','健康注意','工作顺利','运势最佳','财运亨通','事业极佳','略有回落','运势上升','稳定发展','年末不错']) },
  ];
}

function genCN(zodiac: string, m: string[]): any {
  return m.map((c, i) => ({ month: i + 1, title: ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'][i], content: `${zodiac}${c}。` }));
}

function getEN(): ZodiacFortune[] {
  return [
    { overall: 'Those born in the Year of the Rat are intelligent and observant. This year favors steady accumulation.', luckyNumbers: [2,3], luckyColors: ['Blue','Gold'], luckyDirection: 'Northeast', months: genEN(['Smooth start', 'Social connections', 'Career opportunities', 'Good finances', 'Steady period', 'Work challenges', 'Turning point', 'Financial luck peaks', 'Helpful people', 'Steady rise', 'Minor fluctuations', 'Strong finish']) },
    { overall: 'Those born in the Year of the Ox are diligent and steady. Patience and persistence will be rewarded.', luckyNumbers: [1,9], luckyColors: ['Yellow','Brown'], luckyDirection: 'Southwest', months: genEN(['Stable start', 'Good relationships', 'Career rising', 'Health needs attention', 'Work pressure', 'Fortune returns', 'Good finances', 'Excellent career', 'Stable period', 'Active social', 'Slight fluctuations', 'Year-end rise']) },
    { overall: 'Those born in the Year of the Tiger are brave and confident. Bold innovation brings rewards.', luckyNumbers: [3,8], luckyColors: ['Orange','White'], luckyDirection: 'Southeast', months: genEN(['Fresh start', 'Fortune rising', 'Watch relationships', 'Rest well', 'Career challenges', 'Fortune turns', 'Great social luck', 'Financial luck peaks', 'New opportunities', 'Steady rise', 'Slight obstacles', 'Good year-end']) },
    { overall: 'Those born in the Year of the Rabbit are gentle and refined. Play to your strengths.', luckyNumbers: [6,9], luckyColors: ['Pink','Green'], luckyDirection: 'East', months: genEN(['Stable start', 'Active social', 'Career opportunities', 'Slight pressure', 'Good finances', 'Work pleasant', 'Prosperous period', 'Watch relationships', 'Excellent career', 'Slight decline', 'Fortune returns', 'Good year-end']) },
    { overall: 'Those born in the Year of the Dragon are natural leaders. This year is your time to shine.', luckyNumbers: [5,7], luckyColors: ['Gold','Red'], luckyDirection: 'South', months: genEN(['Good start', 'Strong benefactors', 'Finances rise', 'Watch health', 'Career challenges', 'Obstacles clear', 'Excellent networking', 'Peak career', 'Continued fortune', 'Slight fluctuations', 'Fortune rises', 'Strong finish']) },
    { overall: 'Those born in the Year of the Snake are wise thinkers. Careful planning brings progress.', luckyNumbers: [2,8], luckyColors: ['Purple','Black'], luckyDirection: 'Southwest', months: genEN(['Stable planning', 'Good relationships', 'New directions', 'Avoid overwork', 'Manageable challenges', 'Fortune improves', 'Benefactors appear', 'Financial peaks', 'Career recognition', 'Slight fluctuations', 'Stable reflection', 'Good year-end']) },
    { overall: 'Those born in the Year of the Horse are passionate and free. Bold action brings success.', luckyNumbers: [3,7], luckyColors: ['Red','Yellow'], luckyDirection: 'South', months: genEN(['Good start', 'Socially active', 'Many opportunities', 'Pace yourself', 'Finance rises', 'Busy rewarding', 'Prosperous', 'Excellent career', 'Slight decline', 'Fortune rises', 'Good finances', 'Year-end stable']) },
    { overall: 'Those born in the Year of the Goat are gentle and creative. Nurture your talents.', luckyNumbers: [4,9], luckyColors: ['Pink','Green'], luckyDirection: 'Southwest', months: genEN(['Stable start', 'Good social', 'Career rising', 'Sleep well', 'Manage emotions', 'Fortune returns', 'Great social luck', 'Financial luck', 'Excellent career', 'Slight fluctuations', 'Steady rise', 'Good year-end']) },
    { overall: 'Those born in the Year of the Monkey are intelligent and versatile. Innovate boldly.', luckyNumbers: [1,8], luckyColors: ['White','Gold'], luckyDirection: 'Northwest', months: genEN(['Active mind', 'Collaborate', 'Use your wit', 'Finance up', 'Busy progress', 'Prosperous', 'Excellent social', 'Career peaks', 'Reflect', 'Fortune rises', 'Stable development', 'Good year-end']) },
    { overall: 'Those born in the Year of the Rooster are diligent organizers. Steady progress pays off.', luckyNumbers: [5,7], luckyColors: ['Gold','Brown'], luckyDirection: 'West', months: genEN(['Fresh start', 'Nurture relationships', 'Show abilities', 'Watch diet', 'Stay steady', 'Difficulties ease', 'Active network', 'Major breakthroughs', 'Investment returns', 'Watch relationships', 'Steady rise', 'Good year-end']) },
    { overall: 'Those born in the Year of the Dog are loyal and responsible. Reliability brings lasting results.', luckyNumbers: [3,9], luckyColors: ['Red','Green'], luckyDirection: 'East', months: genEN(['Stable start', 'Good relationships', 'Career rising', 'Exercise', 'Work pressure', 'Greater efficiency', 'Good social', 'Conservative investments', 'Excellent career', 'Slight fluctuations', 'Fortune rises', 'Good year-end']) },
    { overall: 'Those born in the Year of the Pig are kind-hearted. A positive mindset brings happiness.', luckyNumbers: [2,6], luckyColors: ['Yellow','Blue'], luckyDirection: 'North', months: genEN(['Good start', 'Good social', 'Opportunities', 'Watch diet', 'Work smooth', 'Best period', 'Investment surprises', 'Excellent career', 'Reflect', 'Fortune rises', 'Steady development', 'Good year-end']) },
  ];
}

function genEN(m: string[]): any {
  return m.map((c, i) => ({ month: i + 1, title: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], content: c + '.' }));
}

export function getZodiacFortune(index: number, locale: string = 'zh-CN'): ZodiacFortune {
  const data = DATA[locale] || DATA['zh-CN'];
  return data[index] || data[0];
}
