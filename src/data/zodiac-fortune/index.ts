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
  ko: ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'],
};

const DATA: Record<string, ZodiacFortune[]> = {
  'zh-CN': getCN(),
  en: getEN(),
  ko: getKO(),
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

function getKO(): ZodiacFortune[] {
  const koMonths = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  function genKO(m: string[]): any {
    return m.map((c, i) => ({ month: i + 1, title: koMonths[i], content: c + '.' }));
  }
  return [
    { overall: '쥐띠 해에 태어난 사람은 영리하고 관찰력이 뛰어납니다. 올해는 조정과 축적에 좋은 시기입니다.', luckyNumbers: [2,3], luckyColors: ['파란색','금색'], luckyDirection: '북동', months: genKO(['순조로운 시작','활발한 인간관계','직업운 상승','재물운 좋음','평온한 시기','도전 과제','전환점','재운 절정','인간관계 상승','꾸준한 상승','약간의 변동','순조로운 마무리']) },
    { overall: '소띠 해에 태어난 사람은 성실하고 끈기 있습니다. 인내심을 갖고 꾸준히 나아가면 결실을 맺을 것입니다.', luckyNumbers: [1,9], luckyColors: ['노란색','갈색'], luckyDirection: '남서', months: genKO(['안정적 상승','원만한 인간관계','직업운 좋음','건강 관리 필요','압박 증가','운세 회복','재물운 좋음','직업운 최고','평온한 시기','활발한 교류','약간의 변동','상승세']) },
    { overall: '호랑이띠 해에 태어난 사람은 용감하고 자신감이 넘칩니다. 올해는 과감한 혁신이 보상을 가져옵니다.', luckyNumbers: [3,8], luckyColors: ['주황색','흰색'], luckyDirection: '남동', months: genKO(['새로운 시작','상승세','인간관계 주의','건강 관리','도전 직면','운세 호전','귀인 도움','재운 절정','새로운 기회','꾸준한 상승','약간의 장애','좋은 마무리']) },
    { overall: '토끼띠 해에 태어난 사람은 온화하고 우아합니다. 자신의 강점을 살려 안정 속에서 발전을 추구하세요.', luckyNumbers: [6,9], luckyColors: ['분홍색','초록색'], luckyDirection: '동', months: genKO(['평온한 시작','활발한 교류','직업 기회','약간의 압박','재물운 좋음','즐거운 업무','번영의 시기','인간관계 주의','직업운 최고','약간의 하락','운세 회복','좋은 마무리']) },
    { overall: '용띠 해에 태어난 사람은 타고난 리더입니다. 올해는 당신의 재능을 발휘할 때입니다.', luckyNumbers: [5,7], luckyColors: ['금색','빨간색'], luckyDirection: '남', months: genKO(['좋은 시작','귀인 도움','재운 상승','건강 관리','직업 도전','장애 해소','뛰어난 교류','직업 정점','지속적 행운','약간의 변동','운세 상승','순조로운 마무리']) },
    { overall: '뱀띠 해에 태어난 사람은 지혜로운 사색가입니다. 신중한 계획이 진전을 가져옵니다.', luckyNumbers: [2,8], luckyColors: ['보라색','검은색'], luckyDirection: '남서', months: genKO(['안정적 계획','원만한 관계','새로운 방향','과로 주의','극복 가능한 도전','운세 개선','귀인 출현','재운 정점','직업 인정','약간의 변동','안정적 반성','좋은 마무리']) },
    { overall: '말띠 해에 태어난 사람은 열정적이고 자유롭습니다. 대담한 행동이 성공을 가져옵니다.', luckyNumbers: [3,7], luckyColors: ['빨간색','노란색'], luckyDirection: '남', months: genKO(['좋은 시작','활발한 교류','많은 기회','속도 조절','재운 상승','바쁘지만 보람','번영','직업 최고','약간의 하락','운세 상승','재물운 좋음','안정적 마무리']) },
    { overall: '양띠 해에 태어난 사람은 온화하고 창의적입니다. 당신의 재능을 키우세요.', luckyNumbers: [4,9], luckyColors: ['분홍색','초록색'], luckyDirection: '남서', months: genKO(['평온한 시작','원만한 교류','직업 상승','건강 관리','감정 조절','운세 회복','좋은 교류','재운','직업 최고','약간의 변동','꾸준한 상승','좋은 마무리']) },
    { overall: '원숭이띠 해에 태어난 사람은 총명하고 다재다능합니다. 대담하게 혁신하세요.', luckyNumbers: [1,8], luckyColors: ['흰색','금색'], luckyDirection: '북서', months: genKO(['활발한 두뇌','협력','재치 발휘','재운 상승','바쁜 진전','번영','뛰어난 교류','직업 정점','반성','운세 상승','안정적 발전','좋은 마무리']) },
    { overall: '닭띠 해에 태어난 사람은 부지런한 조직가입니다. 꾸준한 진전이 결실을 맺습니다.', luckyNumbers: [5,7], luckyColors: ['금색','갈색'], luckyDirection: '서', months: genKO(['새로운 시작','관계 유지','능력 발휘','식단 관리','꾸준함 유지','어려움 완화','활발한 네트워크','큰 성과','투자 수익','관계 주의','꾸준한 상승','좋은 마무리']) },
    { overall: '개띠 해에 태어난 사람은 충성스럽고 책임감이 강합니다. 신뢰성이 지속적인 결과를 가져옵니다.', luckyNumbers: [3,9], luckyColors: ['빨간색','초록색'], luckyDirection: '동', months: genKO(['평온한 시작','원만한 관계','직업 상승','운동 필요','업무 압박','효율 향상','좋은 교류','보수적 투자','직업 최고','약간의 변동','운세 상승','좋은 마무리']) },
    { overall: '돼지띠 해에 태어난 사람은 마음이 따뜻합니다. 긍정적인 마음가짐이 행복을 가져옵니다.', luckyNumbers: [2,6], luckyColors: ['노란색','파란색'], luckyDirection: '북', months: genKO(['좋은 시작','좋은 교류','기회','식단 관리','순조로운 업무','최고의 시기','투자 놀라움','직업 최고','반성','운세 상승','안정적 발전','좋은 마무리']) },
  ];
}

export function getZodiacFortune(index: number, locale: string = 'zh-CN'): ZodiacFortune {
  const data = DATA[locale] || DATA['zh-CN'];
  return data[index] || data[0];
}
