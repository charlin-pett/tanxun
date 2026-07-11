/**
 * 十二生肖年度运势数据（中文）
 */
export interface ZodiacFortune {
  /** 总体运势描述 */
  overall: string;
  /** 幸运数字 */
  luckyNumbers: number[];
  /** 幸运颜色 */
  luckyColors: string[];
  /** 幸运方位 */
  luckyDirection: string;
  /** 每月运势（12个月） */
  months: { month: number; title: string; content: string }[];
}

/** 按年份获取生肖索引（0=鼠, 1=牛, ... 11=猪） */
export function getZodiacIndexByYear(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

export const ZODIAC_NAMES: Record<string, string[]> = {
  'zh-CN': ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'],
  en: ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'],
  ru: ['Крыса','Бык','Тигр','Кролик','Дракон','Змея','Лошадь','Коза','Обезьяна','Петух','Собака','Свинья'],
  es: ['Rata','Buey','Tigre','Conejo','Dragón','Serpiente','Caballo','Cabra','Mono','Gallo','Perro','Cerdo'],
};

/** 简版生肖分析（基于生肖基本性格特征，非年份专属） */
export function getZodiacOverview(index: number): ZodiacFortune {
  const data: ZodiacFortune[] = [
    { // 鼠
      overall: '鼠年出生的人聪明机敏，善于观察，有很强的适应能力和洞察力。他们勤奋努力，精打细算，在财务上往往有不错的表现。今年是调整和积累的好时机，适合稳扎稳打，不宜冒进。',
      luckyNumbers: [2, 3], luckyColors: ['蓝色', '金色'], luckyDirection: '东北',
      months: [
        { month: 1, title: '正月', content: '运势平稳，事事顺心。适合规划全年目标，做好财务安排。' },
        { month: 2, title: '二月', content: '人际关系活跃，适合社交和拓展人脉。注意控制开支。' },
        { month: 3, title: '三月', content: '事业运上升，工作上有新的机会出现。把握时机，展现能力。' },
        { month: 4, title: '四月', content: '财运不错，但需谨慎投资。感情运平稳，多花时间陪伴家人。' },
        { month: 5, title: '五月', content: '运势略显平淡，宜静不宜动。适合学习进修，提升自我。' },
        { month: 6, title: '六月', content: '工作上可能遇到挑战，保持耐心。健康方面注意肠胃。' },
        { month: 7, title: '七月', content: '转机出现，之前的努力开始见到成效。把握好运。' },
        { month: 8, title: '八月', content: '财运亨通，投资理财有好消息。但切忌贪心。' },
        { month: 9, title: '九月', content: '人际运上升，贵人相助。适合合作洽谈，有望达成心愿。' },
        { month: 10, title: '十月', content: '运势持续上升，事业有新突破。注意劳逸结合。' },
        { month: 11, title: '十一月', content: '略有波动，宜稳守为主。健康方面注意休息。' },
        { month: 12, title: '十二月', content: '收尾顺利，成果丰硕。适合总结回顾，规划来年。' },
      ],
    },
    { // 牛
      overall: '牛年出生的人勤劳踏实，一步一个脚印。他们性格坚毅，做事认真负责，事业上往往能取得长远的发展。今年宜稳中求进，保持耐心，厚积薄发。',
      luckyNumbers: [1, 9], luckyColors: ['黄色', '棕色'], luckyDirection: '西南',
      months: [
        { month: 1, title: '正月', content: '运势稳中有升，适合制定长期计划。工作上得到认可。' },
        { month: 2, title: '二月', content: '人际关系不错，但需防小人。保持低调，踏实做事。' },
        { month: 3, title: '三月', content: '事业运佳，有晋升或加薪机会。财运也随之上升。' },
        { month: 4, title: '四月', content: '健康运稍弱，注意劳逸结合。感情运平稳和谐。' },
        { month: 5, title: '五月', content: '工作压力增大，需调整心态。财运平平，不宜投资。' },
        { month: 6, title: '六月', content: '运势回升，顺利度过难关。适合外出或旅行。' },
        { month: 7, title: '七月', content: '财运不错，适合稳健投资。感情上可能有新的进展。' },
        { month: 8, title: '八月', content: '事业运极佳，表现突出。注意把握机会，勇往直前。' },
        { month: 9, title: '九月', content: '运势平稳，宜稳守。适合学习充电，提升竞争力。' },
        { month: 10, title: '十月', content: '人际关系活跃，贵人运强。适合合作。' },
        { month: 11, title: '十一月', content: '稍有波动，注意财务安排。健康方面注意保暖。' },
        { month: 12, title: '十二月', content: '年末运势上升，收获丰盛。适合总结。' },
      ],
    },
    { // 虎
      overall: '虎年出生的人勇敢自信，有领导才能和冒险精神。他们热情大方，喜欢挑战，不畏困难。今年适合大胆创新，开拓进取，但也要注意控制风险。',
      luckyNumbers: [3, 8], luckyColors: ['橙色', '白色'], luckyDirection: '东南',
      months: [
        { month: 1, title: '正月', content: '新年新气象，事业有好的开始。适合规划全年目标。' },
        { month: 2, title: '二月', content: '运势向上，工作上有新的突破。财运也随之提升。' },
        { month: 3, title: '三月', content: '人际关系需要留意，避免口舌是非。行事低调为宜。' },
        { month: 4, title: '四月', content: '健康运稍弱，注意休息。感情运较佳。' },
        { month: 5, title: '五月', content: '事业上面临挑战，需要耐心应对。财运平稳。' },
        { month: 6, title: '六月', content: '运势转好，困难开始化解。适合推进停滞的项目。' },
        { month: 7, title: '七月', content: '人际关系运佳，贵人相助。适合合作洽谈。' },
        { month: 8, title: '八月', content: '财运亨通，适合投资理财。但切忌贪心冒进。' },
        { month: 9, title: '九月', content: '事业上出现新的机会，值得把握。注意平衡工作与生活。' },
        { month: 10, title: '十月', content: '运势平稳上升。感情运不错，适合表白或约会。' },
        { month: 11, title: '十一月', content: '略有阻滞，宜稳守。健康方面注意呼吸道。' },
        { month: 12, title: '十二月', content: '年末运势不错，适合收获。做好来年规划。' },
      ],
    },
    { // 兔
      overall: '兔年出生的人温和文雅，心思细腻，善解人意。他们有很好的审美和艺术天赋，待人接物得体大方。今年宜发挥自身优势，在稳定中求发展。',
      luckyNumbers: [6, 9], luckyColors: ['粉色', '绿色'], luckyDirection: '正东',
      months: [
        { month: 1, title: '正月', content: '运势平稳，适合制定计划和目标。工作上稳步前进。' },
        { month: 2, title: '二月', content: '人际关系活跃，贵人运不错。适合社交。' },
        { month: 3, title: '三月', content: '事业出现好机会，值得好好把握。财运上升。' },
        { month: 4, title: '四月', content: '略有压力，需调整心态。适合学习进修。' },
        { month: 5, title: '五月', content: '财运不错，投资有机会。感情运持续向好。' },
        { month: 6, title: '六月', content: '工作轻松愉快，效率较高。适合推进项目。' },
        { month: 7, title: '七月', content: '运势旺，各方面都有进展。健康良好。' },
        { month: 8, title: '八月', content: '注意人际关系，避免争执。财运稳定。' },
        { month: 9, title: '九月', content: '事业运非常好，有望获得认可或晋升。' },
        { month: 10, title: '十月', content: '略有回落，宜静不宜动。适合修养调整。' },
        { month: 11, title: '十一月', content: '运势回升，好运到来。感情上可能有喜讯。' },
        { month: 12, title: '十二月', content: '年末运势不错，收获阶段。做好来年准备。' },
      ],
    },
    { // 龙
      overall: '龙年出生的人气势不凡，天生具有领袖气质。他们志向远大，才华横溢，做事有魄力。今年是施展才华的好时机，大胆追求目标，但也要注意脚踏实地。',
      luckyNumbers: [5, 7], luckyColors: ['金色', '红色'], luckyDirection: '正南',
      months: [
        { month: 1, title: '正月', content: '开年运势不错，事业有好开端。适合大胆规划。' },
        { month: 2, title: '二月', content: '人际关系活跃，贵人运强。适合合作和社交。' },
        { month: 3, title: '三月', content: '财运上升，有意外之喜。事业上展现才华。' },
        { month: 4, title: '四月', content: '健康运需留意，注意休息和饮食。感情运稳。' },
        { month: 5, title: '五月', content: '事业上面临挑战，需保持定力。财运尚可。' },
        { month: 6, title: '六月', content: '运势回升，困难迎刃而解。适合推进新项目。' },
        { month: 7, title: '七月', content: '人际运非常旺，适合拓展人脉。财源广进。' },
        { month: 8, title: '八月', content: '事业运极佳，有望获得重要突破。把握良机。' },
        { month: 9, title: '九月', content: '运势持续向好。感情运不错，适合增进关系。' },
        { month: 10, title: '十月', content: '稍有波动，注意财务风险。宜稳守。' },
        { month: 11, title: '十一月', content: '运势再次回升。工作上得心应手。' },
        { month: 12, title: '十二月', content: '年末收尾顺利，成果丰硕。展望来年。' },
      ],
    },
    { // 蛇
      overall: '蛇年出生的人智慧深邃，思考周密，做事有计划。他们冷静沉着，善于在复杂环境中找到解决办法。今年适合发挥智慧优势，精打细算，稳步前进。',
      luckyNumbers: [2, 8], luckyColors: ['紫色', '黑色'], luckyDirection: '西南',
      months: [
        { month: 1, title: '正月', content: '运势平稳，适合周密计划。工作上按部就班。' },
        { month: 2, title: '二月', content: '人际关系良好，适合社交。财运开始上升。' },
        { month: 3, title: '三月', content: '事业出现新的方向，值得探索。财运佳。' },
        { month: 4, title: '四月', content: '健康运需注意，避免过度劳累。感情运稳。' },
        { month: 5, title: '五月', content: '工作上有挑战，但能化险为夷。保持冷静。' },
        { month: 6, title: '六月', content: '运势转好，事务进展顺利。有利学习进修。' },
        { month: 7, title: '七月', content: '人际运不错，有机会结识贵人。合作顺利。' },
        { month: 8, title: '八月', content: '财运亨通，投资理财有收获。但勿贪心。' },
        { month: 9, title: '九月', content: '事业运佳，表现受认可。有望获得晋升。' },
        { month: 10, title: '十月', content: '略有波动，宜稳守。注意家庭关系。' },
        { month: 11, title: '十一月', content: '运势平稳，适合总结反思。健康良好。' },
        { month: 12, title: '十二月', content: '年末运势不错，顺利收尾。规划来年。' },
      ],
    },
    { // 马
      overall: '马年出生的人热情奔放，追求自由，行动力强。他们乐观积极，喜欢社交，做事效率高。今年适合发挥行动力，大胆追求目标，同时注意细节和耐心。',
      luckyNumbers: [3, 7], luckyColors: ['红色', '黄色'], luckyDirection: '正南',
      months: [
        { month: 1, title: '正月', content: '新年运势不错，精力充沛，适合规划全年。' },
        { month: 2, title: '二月', content: '人际关系活跃，适合社交和建立人脉。' },
        { month: 3, title: '三月', content: '事业上面临较多机会，值得把握。财运佳。' },
        { month: 4, title: '四月', content: '略有压力，需调整步伐。健康方面注意运动损伤。' },
        { month: 5, title: '五月', content: '财运上升，有不错的投资机会。感情运佳。' },
        { month: 6, title: '六月', content: '工作忙碌但收获颇丰。适合推进重大项目。' },
        { month: 7, title: '七月', content: '运势旺，各方面顺利。人际关系良好。' },
        { month: 8, title: '八月', content: '事业运极佳，有望取得突破性进展。' },
        { month: 9, title: '九月', content: '略有回落，宜静不宜动。适合学习和充电。' },
        { month: 10, title: '十月', content: '运势再次上升。工作上得心应手。' },
        { month: 11, title: '十一月', content: '财运不错，适合稳健投资。注意休息。' },
        { month: 12, title: '十二月', content: '年末收尾，运势平稳。做好来年规划。' },
      ],
    },
    { // 羊
      overall: '羊年出生的人温和善良，性格柔顺，有艺术天赋。他们善解人意，重视家庭和感情。今年宜发挥创造力和人际优势，在稳中求进，不宜冒进。',
      luckyNumbers: [4, 9], luckyColors: ['粉色', '绿色'], luckyDirection: '西南',
      months: [
        { month: 1, title: '正月', content: '运势平稳，适合制定目标和计划。事业有好的开始。' },
        { month: 2, title: '二月', content: '人际运不错，社交活动增多。有利合作。' },
        { month: 3, title: '三月', content: '事业上升期，机会增多。财运也随之提升。' },
        { month: 4, title: '四月', content: '健康运需注意，保证充足睡眠。感情运佳。' },
        { month: 5, title: '五月', content: '工作压力增大，需调节情绪。财运尚可。' },
        { month: 6, title: '六月', content: '运势回升，事业上有新的契机。适合把握。' },
        { month: 7, title: '七月', content: '人际运佳，贵人相助。适合合作和社交。' },
        { month: 8, title: '八月', content: '财运亨通，投资理财有好消息。' },
        { month: 9, title: '九月', content: '事业运极好，表现受到认可和赞赏。' },
        { month: 10, title: '十月', content: '略有波动，宜稳守。注意财务风险。' },
        { month: 11, title: '十一月', content: '运势平稳回升。适合学习新技能。' },
        { month: 12, title: '十二月', content: '年末顺利，收获颇丰。做好总结规划。' },
      ],
    },
    { // 猴
      overall: '猴年出生的人聪明灵活，多才多艺，反应敏捷。他们善于变通，适应能力强，富有创造力。今年适合发挥聪明才智，不断创新，但要注意专注和坚持。',
      luckyNumbers: [1, 8], luckyColors: ['白色', '金色'], luckyDirection: '西北',
      months: [
        { month: 1, title: '正月', content: '新年好开端，思维活跃。适合制定创新计划。' },
        { month: 2, title: '二月', content: '人际关系活跃，社交机会多。有利合作。' },
        { month: 3, title: '三月', content: '事业上面临挑战，但能发挥才智解决。' },
        { month: 4, title: '四月', content: '财运上升，有不错的收入。感情运平稳。' },
        { month: 5, title: '五月', content: '工作忙碌，但进展顺利。注意健康。' },
        { month: 6, title: '六月', content: '运势旺，各方面发展顺利。有利学习。' },
        { month: 7, title: '七月', content: '人际运极佳，贵人运强。合作项目顺利。' },
        { month: 8, title: '八月', content: '事业运达到高峰，有望获得重要成就。' },
        { month: 9, title: '九月', content: '稍有回落，适合调整和反思。财运尚可。' },
        { month: 10, title: '十月', content: '运势回升，工作上得心应手。' },
        { month: 11, title: '十一月', content: '稳定发展，适合长期规划。感情运佳。' },
        { month: 12, title: '十二月', content: '年末运势不错，顺利收尾。展望新年。' },
      ],
    },
    { // 鸡
      overall: '鸡年出生的人勤奋务实，做事有条理，注重细节。他们诚实守信，有责任感，在事业上稳扎稳打。今年宜发挥自己的组织和管理能力，在稳定中求进步。',
      luckyNumbers: [5, 7], luckyColors: ['金色', '棕色'], luckyDirection: '正西',
      months: [
        { month: 1, title: '正月', content: '新年新气象，事业有好的开端。适合全年规划。' },
        { month: 2, title: '二月', content: '人际关系需要用心维护。财运稳中有升。' },
        { month: 3, title: '三月', content: '事业运上升，工作上有展现能力的机会。' },
        { month: 4, title: '四月', content: '健康运需留意，注意饮食规律。感情运佳。' },
        { month: 5, title: '五月', content: '略有压力，保持定力。财运尚可。' },
        { month: 6, title: '六月', content: '运势转好，困难开始化解。适合推进项目。' },
        { month: 7, title: '七月', content: '人际运活跃，贵人运强。适合社交和合作。' },
        { month: 8, title: '八月', content: '事业运极佳，有重大突破的可能性。' },
        { month: 9, title: '九月', content: '财运亨通，投资理财有收获。但勿贪心。' },
        { month: 10, title: '十月', content: '略有波动，注意人际关系。宜稳守。' },
        { month: 11, title: '十一月', content: '运势平稳回升。适合学习和反思。' },
        { month: 12, title: '十二月', content: '年末运势不错，顺利收尾。规划来年。' },
      ],
    },
    { // 狗
      overall: '狗年出生的人忠诚可靠，正义感强，做事认真负责。他们重视承诺，是值得信赖的朋友和同事。今年宜稳扎稳打，发挥自己的责任心和执行力。',
      luckyNumbers: [3, 9], luckyColors: ['红色', '绿色'], luckyDirection: '正东',
      months: [
        { month: 1, title: '正月', content: '新年运势平稳，适合制定目标和计划。' },
        { month: 2, title: '二月', content: '人际关系不错，社交活跃。有利合作洽谈。' },
        { month: 3, title: '三月', content: '事业运上升，表现受到认可。财运渐佳。' },
        { month: 4, title: '四月', content: '健康运需关注，适当锻炼。感情运稳。' },
        { month: 5, title: '五月', content: '工作压力增大，需调整心态。财运尚可。' },
        { month: 6, title: '六月', content: '运势转好，事半功倍。适合推进重点项目。' },
        { month: 7, title: '七月', content: '人际运佳，贵人运强。适合合作。' },
        { month: 8, title: '八月', content: '财运不错，适合稳健投资。感情上可能有进展。' },
        { month: 9, title: '九月', content: '事业运极佳，有望获得晋升或荣誉。' },
        { month: 10, title: '十月', content: '略有波动，注意财务安排。宜稳守。' },
        { month: 11, title: '十一月', content: '运势回升，工作上得心应手。' },
        { month: 12, title: '十二月', content: '年末运势不错，成果丰硕。规划新年。' },
      ],
    },
    { // 猪
      overall: '猪年出生的人心地善良，性格温和，待人真诚。他们心态平和，懂得知足常乐，生活质量往往较高。今年宜保持良好心态，在稳定中寻求发展。',
      luckyNumbers: [2, 6], luckyColors: ['黄色', '蓝色'], luckyDirection: '正北',
      months: [
        { month: 1, title: '正月', content: '新年好开端，运势平稳。适合制定全年计划。' },
        { month: 2, title: '二月', content: '人际运佳，社交活动丰富。财运开始上升。' },
        { month: 3, title: '三月', content: '事业上出现好机会，值得把握。财运佳。' },
        { month: 4, title: '四月', content: '健康运需留意，注意饮食。感情运和谐。' },
        { month: 5, title: '五月', content: '工作顺利，效率较高。适合推进新项目。' },
        { month: 6, title: '六月', content: '运势最佳时期，各方面都很顺利。' },
        { month: 7, title: '七月', content: '财运亨通，投资理财有惊喜。有利合作。' },
        { month: 8, title: '八月', content: '事业运极佳，展现才华。人际运好。' },
        { month: 9, title: '九月', content: '略有回落，适合调整和反思。感情运好。' },
        { month: 10, title: '十月', content: '运势再次上升，工作上进展顺利。' },
        { month: 11, title: '十一月', content: '稳定发展，财运持续向好。注意休息。' },
        { month: 12, title: '十二月', content: '年末运势不错，收获满。展望来年。' },
      ],
    },
  ];
  return data[index] || data[0];
}
