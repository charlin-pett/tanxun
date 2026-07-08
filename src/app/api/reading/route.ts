import { NextRequest, NextResponse } from 'next/server';

interface ReadingRequest {
  birthInfo: { year: number; month: number; day: number; hour: number; minute: number; gender: string };
  zodiac: { name: string; element: string };
  fourPillars: { year: string; month: string; day: string; hour: string };
  dayMaster: string; wuxingSummary: string; daYun: string; liuNian: string;
  preferredModel?: string; locale?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReadingRequest = await request.json();
    if (!body.fourPillars || !body.zodiac) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const claudeKey = process.env.CLAUDE_API_KEY;
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
      reading, model,
      hint: model === 'mock' ? 'Configure DEEPSEEK_API_KEY or CLAUDE_API_KEY for AI generation.' : undefined,
    });
  } catch (error) {
    console.error('Reading API error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

function selectModel(preferred: string, hasDS: boolean, hasCl: boolean): string {
  if (preferred === 'deepseek' && hasDS) return 'deepseek';
  if (preferred === 'claude' && hasCl) return 'claude';
  if (hasDS) return 'deepseek';
  if (hasCl) return 'claude';
  return 'mock';
}

function getSystemPrompt(locale: string): string {
  const m: Record<string, string> = {
    'zh-CN': 'You are a master of Chinese Ba Zi and Five Elements. Write a complete destiny analysis report with sections: Zodiac Character, Ba Zi Destiny, Five Elements, Character Summary, Fortune Forecast, Life Advice. Write in Chinese, 400-600 characters. End with cultural reference disclaimer.',
    'en': 'You are a master of Chinese Ba Zi astrology and the Five Elements theory. Write a complete personal destiny analysis report in English. Sections: Zodiac Character, Ba Zi Destiny, Five Elements Analysis, Character Summary, Fortune Forecast, Life Advice. 400-600 words. End with: "This is for cultural reference only."',
    'ru': 'You are a master of Chinese Ba Zi astrology and Five Elements theory. Write a complete destiny analysis report in Russian. Sections: Zodiac Character, Ba Zi Destiny, Five Elements, Character Summary, Fortune Forecast, Life Advice. 300-500 words. End with cultural disclaimer in Russian.',
    'es': 'You are a master of Chinese Ba Zi astrology and Five Elements theory. Write a complete destiny analysis report in Spanish. Sections: Zodiac Character, Ba Zi Destiny, Five Elements, Character Summary, Fortune Forecast, Life Advice. 400-600 words. End with cultural disclaimer in Spanish.',
  };
  return m[locale] || m['zh-CN'];
}

function buildPrompt(body: ReadingRequest): string {
  const { birthInfo, zodiac, fourPillars, dayMaster, wuxingSummary, daYun, liuNian } = body;
  return [
    'User Info:',
    'Birth: ' + birthInfo.year + '-' + birthInfo.month + '-' + birthInfo.day + ' at ' + birthInfo.hour + ':' + String(birthInfo.minute).padStart(2, '0'),
    'Gender: ' + birthInfo.gender,
    'Zodiac: ' + zodiac.name + ' (' + zodiac.element + ')',
    '',
    'Ba Zi Four Pillars:',
    'Year: ' + fourPillars.year,
    'Month: ' + fourPillars.month,
    'Day: ' + fourPillars.day + ' (Day Master: ' + dayMaster + ')',
    'Hour: ' + fourPillars.hour,
    'Five Elements: ' + wuxingSummary,
    'Decade Luck: ' + daYun,
    'Current Year: ' + liuNian,
    '',
    'Please write the analysis report in the requested language with the specified structure.',
  ].join('\n');
}

async function callDeepSeek(body: ReadingRequest, apiKey: string): Promise<string> {
  const sp = getSystemPrompt(body.locale || 'zh-CN');
  const prompt = buildPrompt(body);

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: sp }, { role: 'user', content: prompt }],
      temperature: 0.8, max_tokens: 1500,
    }),
  });

  if (!res.ok) throw new Error('DeepSeek error: ' + res.status);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'Unable to generate report.';
}

async function callClaude(body: ReadingRequest, apiKey: string): Promise<string> {
  const sp = getSystemPrompt(body.locale || 'zh-CN');
  const prompt = buildPrompt(body);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500, temperature: 0.8,
      system: sp,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error('Claude error: ' + res.status);
  const data = await res.json();
  return data.content?.[0]?.text || 'Unable to generate report.';
}

function getDayMasterDesc(dm: string, locale: string): string {
  const descs: Record<string, Record<string, string>> = {
    zh: { Jia: 'Jia Wood is like a towering tree. You have natural leadership qualities.', Yi: 'Yi Wood is like climbing vines. You are adaptable and resilient.', Bing: 'Bing Fire is like the sun. You are warm and influential.', Ding: 'Ding Fire is like a candle. You are gentle and perceptive.', Wu: 'Wu Earth is like a mountain. You are stable and reliable.', Ji: 'Ji Earth is like fertile soil. You are nurturing and detail-oriented.', Geng: 'Geng Metal is like a blade. You are decisive and strong-willed.', Xin: 'Xin Metal is like jewelry. You are refined and perfectionistic.', Ren: 'Ren Water is like a river. You are wise and strategic.', Gui: 'Gui Water is like rain. You are intuitive and sensitive.' },
    en: { Jia: 'Jia Wood is like a towering tree. You have natural leadership qualities.', Yi: 'Yi Wood is like climbing vines. You are adaptable and resilient.', Bing: 'Bing Fire is like the sun. You are warm and influential.', Ding: 'Ding Fire is like a candle. You are gentle and perceptive.', Wu: 'Wu Earth is like a mountain. You are stable and reliable.', Ji: 'Ji Earth is like fertile soil. You are nurturing and detail-oriented.', Geng: 'Geng Metal is like a blade. You are decisive and strong-willed.', Xin: 'Xin Metal is like jewelry. You are refined and perfectionistic.', Ren: 'Ren Water is like a river. You are wise and strategic.', Gui: 'Gui Water is like rain. You are intuitive and sensitive.' },
  };
  const lang = locale === 'zh-CN' ? 'zh' : 'en';
  const d = descs[lang];
  return d[dm] || 'Your Day Master ' + dm + ' reveals a balanced and multifaceted personality.';
}

function getMockReading(body: ReadingRequest): string {
  const { zodiac, dayMaster, wuxingSummary, locale, fourPillars, birthInfo } = body;
  const L = locale || 'zh-CN';

  const personality = getDayMasterDesc(dayMaster, L === 'zh-CN' ? 'zh' : 'en');

  if (L === 'zh-CN') {
    return [
      '【星座性格】',
      zodiac.name + '的您，性格特点鲜明，结合八字来看内外呼应，形成了您独一无二的个性。',
      '',
      '【八字命格】',
      '排盘中日主为' + dayMaster + '。' + personality,
      '',
      '【五行分析】',
      '五行分布：' + wuxingSummary + '。五行平衡是气运顺遂的基础。',
      '',
      '【性格总论】',
      '您是一个性格丰富、层次分明的人，外在表现和内在特质相辅相成。',
      '',
      '【运势提示】',
      '流年运势处于动态变化之中，沉着冷静，顺势而为。',
      '',
      '【发展建议】',
      '知命不是认命，而是更好地运命。扬长避短，完善自我。',
      '',
      '以上内容仅供文化参考，请理性看待。',
    ].join('\n');
  }

  if (L === 'en') {
    return [
      '【Zodiac Character】',
      'Born under ' + zodiac.name + ', you possess the distinctive qualities of this ' + zodiac.element + ' sign.',
      '',
      '【Ba Zi Destiny】',
      'Your Day Master is ' + dayMaster + '. ' + personality,
      '',
      '【Five Elements】',
      'Element distribution: ' + wuxingSummary + '. Balance is key to harmony.',
      '',
      '【Character Summary】',
      'You are a person of rich inner depth, navigating life with unique self-awareness.',
      '',
      '【Fortune Forecast】',
      'The current year brings significant energy. Be patient with major decisions.',
      '',
      '【Life Advice】',
      'True wisdom lies in understanding yourself deeply enough to make better choices.',
      '',
      'This is for cultural reference only. View it with a rational mind.',
    ].join('\n');
  }

  if (L === 'ru') {
    return [
      '【Zodiac Character】',
      zodiac.name + ' наделяет вас уникальными качествами.',
      '',
      '【Ba Zi Destiny】',
      'Ваш Хозяин Дня — ' + dayMaster + '. ' + personality,
      '',
      '【Five Elements】',
      'Распределение: ' + wuxingSummary + '.',
      '',
      '【Character Summary】',
      'Вы — личность с богатым внутренним миром.',
      '',
      '【Fortune Forecast】',
      'Текущий год приносит значительную энергию.',
      '',
      '【Life Advice】',
      'Истинная мудрость — в глубоком понимании себя.',
      '',
      'Это только для культурного ознакомления. Относитесь рационально.',
    ].join('\n');
  }

  return [
    '【Zodiac Character】',
    'Nacido bajo ' + zodiac.name + ', posees cualidades distintivas.',
    '',
    '【Ba Zi Destiny】',
    'Tu Maestro del Día es ' + dayMaster + '. ' + personality,
    '',
    '【Five Elements】',
    'Distribución: ' + wuxingSummary + '.',
    '',
    '【Character Summary】',
    'Eres una persona de rica profundidad interior.',
    '',
    '【Fortune Forecast】',
    'El año actual trae energía significativa.',
    '',
    '【Life Advice】',
    'La verdadera sabiduría está en comprenderse profundamente a uno mismo.',
    '',
    'Esto es solo como referencia cultural. Míralo con una mente racional.',
  ].join('\n');
}
