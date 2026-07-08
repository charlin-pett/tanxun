/**
 * 解梦 API
 *
 * 接收用户输入的梦境文本，调用 AI 模型生成解梦分析。
 *
 * 双模型策略（与 /api/reading 一致）：
 *   DEEPSEEK_API_KEY → DeepSeek（国内）
 *   CLAUDE_API_KEY  → Claude（海外）
 *   都没有 → Mock 数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDreamSystemPrompt, getDreamUserPrompt } from '@/prompts/dream/prompts';

// ===== 请求体类型 =====
interface DreamRequest {
  dreamText: string;
  categories: string[];
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DreamRequest = await request.json();

    if (!body.dreamText || body.dreamText.trim().length < 2) {
      return NextResponse.json({ error: '请输入梦境内容' }, { status: 400 });
    }

    // 限制梦境长度
    const dreamText = body.dreamText.slice(0, 2000);
    const categories = body.categories || [];
    const locale = body.locale || 'zh-CN';

    // 检测可用模型
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;

    let interpretation: string;
    let model: string;

    if (deepseekKey) {
      interpretation = await callDeepSeek(dreamText, categories, locale, deepseekKey);
      model = 'deepseek';
    } else if (claudeKey) {
      interpretation = await callClaude(dreamText, categories, locale, claudeKey);
      model = 'claude';
    } else {
      interpretation = getMockInterpretation(dreamText, categories, locale);
      model = 'mock';
    }

    return NextResponse.json({
      interpretation,
      model,
      categories,
      hint: !deepseekKey && !claudeKey
        ? '当前使用模拟数据。配置 DEEPSEEK_API_KEY 或 CLAUDE_API_KEY 环境变量可启用 AI 生成。'
        : undefined,
    });
  } catch (error) {
    console.error('解梦失败:', error);
    return NextResponse.json(
      { error: '解梦失败，请稍后再试' },
      { status: 500 }
    );
  }
}

// ===== DeepSeek 调用 =====
async function callDeepSeek(
  dreamText: string,
  categories: string[],
  locale: string,
  apiKey: string
): Promise<string> {
  const systemPrompt = getDreamSystemPrompt(locale);
  const userPrompt = getDreamUserPrompt(dreamText, categories, locale);

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '抱歉，解梦生成失败，请稍后再试。';
}

// ===== Claude 调用 =====
async function callClaude(
  dreamText: string,
  categories: string[],
  locale: string,
  apiKey: string
): Promise<string> {
  const systemPrompt = getDreamSystemPrompt(locale);
  const userPrompt = getDreamUserPrompt(dreamText, categories, locale);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      temperature: 0.8,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '抱歉，解梦生成失败，请稍后再试。';
}

// ===== Mock 解梦 =====
function getMockInterpretation(
  dreamText: string,
  categories: string[],
  locale: string
): string {
  const lang = locale || 'zh-CN';

  // 中文 mock
  if (lang === 'zh-CN') {
    const hasWater = dreamText.includes('水') || dreamText.includes('河') || dreamText.includes('海') || dreamText.includes('雨');
    const hasFire = dreamText.includes('火') || dreamText.includes('烧') || dreamText.includes('焰');
    const hasFly = dreamText.includes('飞') || dreamText.includes('飞翔');
    const hasFall = dreamText.includes('坠落') || dreamText.includes('掉') || dreamText.includes('跌');
    const hasAnimal = categories.includes('animals');

    let ancient = '根据《周公解梦》记载，此梦象主阴阳调和之象。';
    if (hasWater) ancient = '《周公解梦》云：「梦水者，主财运将至。」水在梦中多象征财富与情感的流动。';
    if (hasFire) ancient = '《周公解梦》云：「梦见火者，主名声显赫。」火在梦中象征激情、能量与转变。';
    if (hasFly) ancient = '《周公解梦》云：「梦飞翔者，主志气高昂。」梦见飞翔多表示内心对自由和超越的渴望。';
    if (hasFall) ancient = '《周公解梦》云：「梦坠落者，主根基动摇。」坠落之梦往往反映了现实中的不安定感。';
    if (hasAnimal) ancient = '《周公解梦》云：「梦见禽兽者，主心有所动。」梦中动物往往代表着内心的本能和潜意识。';

    const categoriesText = categories.length > 0
      ? `梦境中出现了${categories.join('、')}等元素，这些都是值得关注的信号。`
      : '梦境内容丰富，值得深入分析。';

    return `【古籍解读】
${ancient}

【心理分析】
从现代心理学角度来看，梦境是潜意识的表达。${categoriesText}
${hasFly ? '飞翔的梦境往往反映了您内心对自由和突破现状的渴望，可能最近在现实生活中感到了一些束缚或压力。' : ''}
${hasFall ? '坠落之梦在心理学上通常与失控感和焦虑有关，可能反映您在现实生活中对某些事情感到把握不足。' : ''}
${hasWater ? '水在心理分析中常代表无意识和情感，梦见水可能意味着您内心深处有未被充分觉察的情感正在涌动。' : ''}
${hasFire ? '火象征内心的激情和能量，梦见火可能表示您充满了动力和创造力，但也要注意控制情绪的烈度。' : ''}

【五行关联】
梦境元素的五行属性分析：
${hasWater ? '- 水元素偏旺，提示需注意肾脏和泌尿系统健康，宜多食黑色食物（黑豆、黑芝麻）以补肾。' : ''}
${hasFire ? '- 火元素显现，对应心脏和小肠，建议保持心情平和，避免过度激动。' : ''}
${!hasWater && !hasFire ? '- 综合来看，梦境五行较为平衡，预示着近期的生活状态相对稳定。' : ''}

【综合建议】
梦是心灵的信使，它用象征的语言向我们传递潜意识的信息。建议您在近期多关注自己的内心感受，保持规律作息，白天经历的事情也会影响夜间梦境的内容。如果同一个梦境反复出现，不妨记录下来，它可能携带着重要的心灵信息。

以上内容仅供文化参考，请理性看待。`;
  }

  // English mock
  if (lang === 'en') {
    return `【Ancient Wisdom】
According to traditional Chinese dream interpretation, this dream reflects the interaction of yin and yang energies within your life. Dreams are considered a bridge between the conscious and subconscious, revealing truths that waking life often obscures.

【Psychological Insight】
From a psychological perspective, this dream speaks to your inner emotional landscape. The elements present in your dream are symbolic representations of your current mental state and life circumstances. Pay attention to the emotions you felt during the dream — they often hold the key to understanding its message.

【Five Elements Connection】
The imagery in your dream resonates with the Five Elements theory. The balance or imbalance of elements in your dream may reflect corresponding aspects of your health and emotional wellbeing.

【Life Guidance】
Dreams are the soul's way of communicating with us. Consider keeping a dream journal and reflecting on how the themes in this dream relate to your waking life. Recurring dreams especially deserve your attention, as they often carry important messages from your deeper self.

This is for cultural reference only. View it with a rational mind.`;
  }

  // Russian mock
  if (lang === 'ru') {
    return `【Древняя мудрость】
Согласно традиционному китайскому соннику Чжоу Гуна, этот сон отражает взаимодействие энергий Инь и Ян в вашей жизни. Сны считаются мостом между сознательным и подсознательным.

【Психологический анализ】
С психологической точки зрения, этот сон говорит о вашем внутреннем эмоциональном состоянии. Обратите внимание на чувства, которые вы испытывали во сне — они часто являются ключом к пониманию его послания.

【Связь с пятью элементами】
Образы вашего сна связаны с теорией Пяти Элементов. Баланс или дисбаланс элементов во сне может отражать соответствующие аспекты вашего здоровья.

【Жизненные советы】
Сны — это способ общения души с нами. Ведите дневник снов и размышляйте о том, как темы ваших снов связаны с реальной жизнью.

Это только для культурного ознакомления. Относитесь рационально.`;
  }

  // Spanish mock
  return `【Sabiduría Antigua】
Según la interpretación tradicional china de los sueños de Zhou Gong, este sueño refleja la interacción de las energías Yin y Yang en tu vida. Los sueños son considerados un puente entre la mente consciente y la subconsciente.

【Perspectiva Psicológica】
Desde una perspectiva psicológica, este sueño habla de tu paisaje emocional interior. Presta atención a las emociones que sentiste durante el sueño — a menudo son la clave para entender su mensaje.

【Conexión con los Elementos】
Las imágenes de tu sueño resuenan con la teoría de los Cinco Elementos. El equilibrio o desequilibrio de elementos puede reflejar aspectos correspondientes de tu salud.

【Consejos de Vida】
Los sueños son la forma en que el alma se comunica con nosotros. Lleva un diario de sueños y reflexiona sobre cómo los temas de este sueño se relacionan con tu vida diaria.

Esto es solo como referencia cultural. Míralo con una mente racional.`;
}
