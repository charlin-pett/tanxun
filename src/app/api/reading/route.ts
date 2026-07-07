/**
 * 命理报告生成 API
 *
 * 接收八字排盘结果 + 星座信息，调用 AI 模型生成完整的个人命理分析报告。
 *
 * 双模型策略：
 *   DEEPSEEK_API_KEY → 调用 DeepSeek（国内用户优先）
 *   CLAUDE_API_KEY  → 调用 Claude（海外用户）
 *   都没有 → 返回模拟数据（开发测试用）
 *
 * 部署后需要在环境变量中配置 API Key：
 *   DEEPSEEK_API_KEY=sk-xxx
 *   CLAUDE_API_KEY=sk-ant-xxx
 */

import { NextRequest, NextResponse } from 'next/server';

// ===== 请求体类型 =====
interface ReadingRequest {
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: string;
  };
  zodiac: { name: string; element: string };
  fourPillars: { year: string; month: string; day: string; hour: string };
  dayMaster: string;
  wuxingSummary: string;
  daYun: string;
  liuNian: string;
  /** 用户偏好的模型（'auto' | 'deepseek' | 'claude'） */
  preferredModel?: string;
}

// ===== 命理报告生成函数 =====
export async function POST(request: NextRequest) {
  try {
    const body: ReadingRequest = await request.json();

    // 验证必要字段
    if (!body.fourPillars || !body.zodiac) {
      return NextResponse.json(
        { error: '缺少必要的排盘数据' },
        { status: 400 }
      );
    }

    // 检测可用模型
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;

    // 根据配置和用户偏好选择模型
    const model = selectModel(body.preferredModel || 'auto', !!deepseekKey, !!claudeKey);

    let reading: string;

    switch (model) {
      case 'deepseek':
        reading = await callDeepSeek(body, deepseekKey!);
        break;
      case 'claude':
        reading = await callClaude(body, claudeKey!);
        break;
      default:
        reading = getMockReading(body);
        break;
    }

    return NextResponse.json({
      reading,
      model,
      // mock 模式下提示用户配置 API Key
      hint: model === 'mock'
        ? '当前使用模拟数据。配置 DEEPSEEK_API_KEY 或 CLAUDE_API_KEY 环境变量可启用 AI 生成。'
        : undefined,
    });
  } catch (error) {
    console.error('命理报告生成失败:', error);
    return NextResponse.json(
      { error: '报告生成失败，请稍后再试' },
      { status: 500 }
    );
  }
}

// ===== 模型选择 =====
function selectModel(
  preferred: string,
  hasDeepSeek: boolean,
  hasClaude: boolean
): 'deepseek' | 'claude' | 'mock' {
  if (preferred === 'deepseek' && hasDeepSeek) return 'deepseek';
  if (preferred === 'claude' && hasClaude) return 'claude';

  if (hasDeepSeek) return 'deepseek';
  if (hasClaude) return 'claude';

  return 'mock';
}

// ===== DeepSeek 调用 =====
async function callDeepSeek(body: ReadingRequest, apiKey: string): Promise<string> {
  const prompt = buildPrompt(body);

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位精通中国传统命理学的大师，擅长八字命理、五行生克和星座分析。
请根据用户信息撰写一份完整的个人命理分析报告，按以下结构：

【星座性格】分析星座性格特点
【八字命格】分析八字命局
【五行分析】五行旺衰对性格的影响
【性格总论】综合得出性格总结
【运势提示】近期运势建议
【发展建议】人生发展建议

要求：400-600字，半文半白，通俗易懂。末尾加"以上内容仅供文化参考，请理性看待"。`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '抱歉，AI 命理分析生成失败，请稍后再试。';
}

// ===== Claude API 调用 =====
async function callClaude(body: ReadingRequest, apiKey: string): Promise<string> {
  const prompt = buildPrompt(body);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      temperature: 0.8,
      system: `你是一位精通中国传统命理学的大师，擅长八字命理、五行生克和星座分析。
请根据用户信息撰写一份完整的个人命理分析报告，按以下结构：

【星座性格】分析星座性格特点
【八字命格】分析八字命局
【五行分析】五行旺衰对性格的影响
【性格总论】综合得出性格总结
【运势提示】近期运势建议
【发展建议】人生发展建议

要求：400-600字，半文半白，通俗易懂。末尾加"以上内容仅供文化参考，请理性看待"。`,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '抱歉，AI 命理分析生成失败，请稍后再试。';
}

// ===== 构建 Prompt =====
function buildPrompt(body: ReadingRequest): string {
  const { birthInfo, zodiac, fourPillars, dayMaster, wuxingSummary, daYun, liuNian } = body;

  return `【用户信息】
出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日
时辰：${birthInfo.hour}时${birthInfo.minute}分
性别：${birthInfo.gender}
星座：${zodiac.name}（${zodiac.element}象星座）

【八字排盘结果】
年柱：${fourPillars.year}
月柱：${fourPillars.month}
日柱：${fourPillars.day}（日主：${dayMaster}）
时柱：${fourPillars.hour}
五行分布：${wuxingSummary}
大运：${daYun}
当前流年：${liuNian}

请根据以上信息撰写命理分析报告。`;
}

// ===== Mock 数据（无 API Key 时使用） =====
function getMockReading(body: ReadingRequest): string {
  const { zodiac, dayMaster, wuxingSummary } = body;
  const zodiacName = zodiac.name || '未知星座';

  // 根据日主五行生成不同的性格描述
  const dayMasterPersonality: Record<string, string> = {
    '甲': '甲木为阳木，如参天大树。您天生具有领导气质和开拓精神，性格正直坦率，不屈不挠。有强烈的上进心和责任感，但也容易因为过于刚直而不善变通。',
    '乙': '乙木为阴木，如藤蔓花草。您性格柔韧，善于适应环境，具有极强的韧性和生命力。心思细腻，善解人意，但也容易优柔寡断。',
    '丙': '丙火为阳火，如太阳当空。您热情开朗，阳光积极，有很强的感染力和影响力。慷慨大方，乐于助人，但有时过于急躁。',
    '丁': '丁火为阴火，如灯烛之光。您温和内敛，心思缜密，有着敏锐的洞察力。待人温和有礼，但也容易多愁善感。',
    '戊': '戊土为阳土，如巍峨高山。您稳重可靠，敦厚诚实，有着极强的包容心和责任感。做事脚踏实地，但也略显固执。',
    '己': '己土为阴土，如田园沃土。您谦逊温和，善于滋养他人。性格内敛含蓄，做事细致周到，但也容易缺乏主见。',
    '庚': '庚金为阳金，如刀剑之锋。您果断刚毅，雷厉风行，有着极强的执行力和决断力。意志坚定，但也容易锋芒过露。',
    '辛': '辛金为阴金，如珠宝首饰。您精致内秀，追求完美，有着极高的审美品位。做事精益求精，但也容易挑剔苛求。',
    '壬': '壬水为阳水，如江河奔流。您智慧通达，心胸开阔，有着非凡的远见和谋略。善于变通，但也容易缺乏持久性。',
    '癸': '癸水为阴水，如雨露甘霖。您聪慧敏感，直觉力极强，善于感知他人情绪。性格柔和但不失韧性，但也容易思虑过多。',
  };

  const personality = dayMasterPersonality[dayMaster] || '日主为' + dayMaster + '，综合看命局平衡，性格多元而丰富。';

  return `【星座性格】
${zodiacName}的您，性格特点鲜明。${zodiacName}的人在人群中往往有着独特的气质，行事风格也带着鲜明的星座印记。结合您的八字来看，星座的外在表现与命局的内在特质相互呼应，形成了您独一无二的个性。

【八字命格】
八字排盘中，日主为${dayMaster}。${personality}

【五行分析】
从五行分布来看：${wuxingSummary}。
五行平衡是一个人气运顺遂的基础。您命中五行各有分布，性格中的各个方面也因此而丰富多彩。

【性格总论】
综合星座与八字来看，您是一个性格丰富、层次分明的人。外在表现和内在特质可能不尽相同，但这正是您魅力的来源。您在人际交往中有着自己的独特风格，既能保持自我，又能与他人和谐相处。在人生的不同阶段，您的性格也会有不同的侧重点和表现方式。

【运势提示】
命理有云：一命二运三风水。当前流年对您而言是一个重要的节点，运势处于动态变化之中。在重要的决策面前，建议沉着冷静，顺势而为。大运流转如同四季更替，每一段运程都有其独特的机遇和挑战。

【发展建议】
每个人的人生道路都是独一无二的。命理分析的意义不在于预测宿命，而在于帮助您更好地了解自己，扬长避短。建议您在生活和工作中充分发挥自己的优势，同时有意识地培养和弥补自己的不足。所谓知命，不是认命，而是更好地运命。

以上内容仅供文化参考，请理性看待。`;
}
