/**
 * 中文命理报告 AI 提示词模板
 *
 * 引擎将命盘数据 + 星座数据填入模板，发给 AI 生成完整的个人命理分析报告。
 * 提示词风格：中国传统命理师口吻，半古半白。
 */

export interface ReadingInput {
  /** 出生信息 */
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: string;
  };
  /** 星座 */
  zodiac: {
    name: string;
    element: string;
  };
  /** 四柱八字 */
  fourPillars: {
    year: string;  // 如"庚子"
    month: string;
    day: string;
    hour: string;
  };
  /** 日主 */
  dayMaster: string;
  /** 五行统计（文字描述） */
  wuxingSummary: string;
  /** 大运 */
  daYun: string;
  /** 当前流年 */
  liuNian: string;
}

/**
 * 生成发送给 AI 的 system prompt
 */
export function getSystemPrompt(): string {
  return `你是一位精通中国传统命理学的大师，擅长八字命理、五行生克和星座分析。
你的任务是根据用户提供的出生信息和八字排盘结果，为用户撰写一份完整的个人命理分析报告。

写作要求：
1. 语言风格：用中文写作，半文半白，带一点古风但不晦涩，让人读得懂且觉得有深度
2. 结构清晰：按以下板块组织内容
3. 内容：既要专业准确，又要通俗易懂
4. 免责：每个回答末尾加上"以上内容仅供文化参考，请理性看待"
5. 篇幅：保持在400-600字之间，不要太长也不要太短

请严格按照以下模板结构输出，使用纯文本格式（不要用Markdown表格或复杂格式）。`;
}

/**
 * 根据排盘数据生成 user prompt
 */
export function getUserPrompt(input: ReadingInput): string {
  const { birthInfo, zodiac, fourPillars, dayMaster, wuxingSummary, daYun, liuNian } = input;

  return `请为以下用户撰写命理分析报告：

【基本信息】
出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}时${birthInfo.minute}分
性别：${birthInfo.gender}
星座：${zodiac.name}（${zodiac.element}象星座）

【八字排盘】
年柱：${fourPillars.year}
月柱：${fourPillars.month}
日柱：${fourPillars.day}（日主：${dayMaster}）
时柱：${fourPillars.hour}
五行分布：${wuxingSummary}
大运：${daYun}
当前流年：${liuNian}

请按以下结构撰写报告：

【星座性格】基于星座分析用户性格特点
【八字命格】基于八字分析命局特点
【五行分析】分析五行旺衰及其对性格的影响
【性格总论】综合星座和八字，总结用户性格
【运势提示】根据大运流年给出近期建议
【发展建议】针对性格特点给出人生建议`;
}

/**
 * 生成英文 prompt（用于 Claude 的备用版本）
 * 实际使用前可翻译成英文
 */
export function getEnglishPrompt(input: ReadingInput): string {
  return `You are a master of traditional Chinese metaphysics (八字 Bazi, 五行 Five Elements). Write a personality and destiny analysis report for a user.

User Info:
Born: ${input.birthInfo.year}-${input.birthInfo.month}-${input.birthInfo.day} at ${input.birthInfo.hour}:${String(input.birthInfo.minute).padStart(2, '0')}
Gender: ${input.birthInfo.gender}
Zodiac: ${input.zodiac.name}

Bazi Four Pillars:
Year: ${input.fourPillars.year}
Month: ${input.fourPillars.month}
Day: ${input.fourPillars.day} (Day Master: ${input.dayMaster})
Hour: ${input.fourPillars.hour}
Five Elements: ${input.wuxingSummary}
Current Decade Luck: ${input.daYun}
Current Year: ${input.liuNian}

Write a 400-600 word analysis covering: personality from zodiac, destiny from Bazi, five elements analysis, overall character, recent fortune tips, and life advice.

End with: "This is for cultural reference only."`;
}
