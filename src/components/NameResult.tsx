'use client';

import type { NameFortuneResult, ChineseNameResult, WesternNameResult, KoreanNameResult } from '@/lib/name-fortune';

const TXT: Record<string, any> = {
  'zh-CN': {
    strokes: '笔画', surname: '姓氏', given: '名字',
    grid: '五格分析', heaven: '天格', personality: '人格', earth: '地格', total: '总格', external: '外格',
    element: '五行', threeTalents: '三才配置', harmony: '格局',
    personalityLabel: '人格特质', fortune81: '81数理解释',
    expression: 'Expression（表达数）', heartDesire: "Heart's Desire（心灵渴望）", persNum: 'Personality（人格数）',
    masterNum: '主数字', number: '数',
    koreanInit: '初声五行', totalStroke: '总笔画', koreanAnalysis: '姓名分析',
    share: '分享结果',
  },
  en: {
    strokes: 'Strokes', surname: 'Surname', given: 'Given',
    grid: 'Five Grids', heaven: 'Heaven', personality: 'Personality', earth: 'Earth', total: 'Total', external: 'External',
    element: 'Element', threeTalents: 'Three Talents', harmony: 'Harmony',
    personalityLabel: 'Personality Traits', fortune81: '81 Number Meaning',
    expression: 'Expression Number', heartDesire: "Heart's Desire", persNum: 'Personality Number',
    masterNum: 'Master Number', number: 'Number',
    koreanInit: 'Initial Elements', totalStroke: 'Total Strokes', koreanAnalysis: 'Name Analysis',
    share: 'Share',
  },
  ru: {
    strokes: 'Черты', surname: 'Фамилия', given: 'Имя',
    grid: 'Пять Сеток', heaven: 'Небо', personality: 'Личность', earth: 'Земля', total: 'Итог', external: 'Внешнее',
    element: 'Элемент', threeTalents: 'Три Таланта', harmony: 'Гармония',
    personalityLabel: 'Черты', fortune81: '81 Число',
    expression: 'Число Выражения', heartDesire: 'Желание Сердца', persNum: 'Число Личности',
    masterNum: 'Мастер-Число', number: 'Число',
    koreanInit: 'Элементы', totalStroke: 'Всего черт', koreanAnalysis: 'Анализ имени',
    share: 'Поделиться',
  },
  es: {
    strokes: 'Trazos', surname: 'Apellido', given: 'Nombre',
    grid: 'Cinco Rejillas', heaven: 'Cielo', personality: 'Personalidad', earth: 'Tierra', total: 'Total', external: 'Externo',
    element: 'Elemento', threeTalents: 'Tres Talentos', harmony: 'Armonía',
    personalityLabel: 'Rasgos', fortune81: '81 Números',
    expression: 'Número de Expresión', heartDesire: 'Deseo del Corazón', persNum: 'Número de Personalidad',
    masterNum: 'Número Maestro', number: 'Número',
    koreanInit: 'Elementos', totalStroke: 'Total Trazos', koreanAnalysis: 'Análisis del Nombre',
    share: 'Compartir',
  },
  ko: {
    strokes: '획수', surname: '성', given: '이름',
    grid: '오격 분석', heaven: '천격', personality: '인격', earth: '지격', total: '총격', external: '외격',
    element: '오행', threeTalents: '삼재 배치', harmony: '격국',
    personalityLabel: '인격 특성', fortune81: '81수리 해석',
    expression: '표현 수', heartDesire: '내면의 소망', persNum: '성격 수',
    masterNum: '마스터 넘버', number: '수',
    koreanInit: '초성 오행', totalStroke: '총획수', koreanAnalysis: '이름 분석',
    share: '공유하기',
  },
};

const ELEMENT_COLORS: Record<string, string> = {
  '木': 'text-green-700 bg-green-50', '火': 'text-red-700 bg-red-50', '土': 'text-amber-700 bg-amber-50',
  '金': 'text-yellow-700 bg-yellow-50', '水': 'text-blue-700 bg-blue-50',
  'Wood': 'text-green-700 bg-green-50', 'Fire': 'text-red-700 bg-red-50', 'Earth': 'text-amber-700 bg-amber-50',
  'Metal': 'text-yellow-700 bg-yellow-50', 'Water': 'text-blue-700 bg-blue-50',
  'Madera': 'text-green-700 bg-green-50', 'Fuego': 'text-red-700 bg-red-50', 'Tierra': 'text-amber-700 bg-amber-50',
  'Agua': 'text-blue-700 bg-blue-50',
  'Дерево': 'text-green-700 bg-green-50', 'Огонь': 'text-red-700 bg-red-50', 'Земля': 'text-amber-700 bg-amber-50',
  'Металл': 'text-yellow-700 bg-yellow-50', 'Вода': 'text-blue-700 bg-blue-50',
  '목': 'text-green-700 bg-green-50', '화': 'text-red-700 bg-red-50', '토': 'text-amber-700 bg-amber-50',
  '금': 'text-yellow-700 bg-yellow-50', '수': 'text-blue-700 bg-blue-50',
  '대길': 'text-green-700 bg-green-50', '길': 'text-green-600 bg-green-50', '중길': 'text-blue-600 bg-blue-50',
  '반길': 'text-amber-600 bg-amber-50', '중평': 'text-gray-600 bg-gray-50',
  '흉': 'text-red-600 bg-red-50', '대흉': 'text-red-700 bg-red-100',
  'Great Fortune': 'text-green-700 bg-green-50', 'Fortune': 'text-green-600 bg-green-50', 'Moderate Fortune': 'text-blue-600 bg-blue-50',
  'Half Fortune': 'text-amber-600 bg-amber-50', 'Neutral': 'text-gray-600 bg-gray-50',
  'Misfortune': 'text-red-600 bg-red-50', 'Great Misfortune': 'text-red-700 bg-red-100',
  'Gran Fortuna': 'text-green-700 bg-green-50', 'Fortuna': 'text-green-600 bg-green-50', 'Fortuna Media': 'text-blue-600 bg-blue-50',
  'Media Fortuna': 'text-amber-600 bg-amber-50', 'Desgracia': 'text-red-600 bg-red-50', 'Gran Desgracia': 'text-red-700 bg-red-100',
  'Великая Удача': 'text-green-700 bg-green-50', 'Удача': 'text-green-600 bg-green-50', 'Средняя Удача': 'text-blue-600 bg-blue-50',
  'Полу-Удача': 'text-amber-600 bg-amber-50', 'Нейтрально': 'text-gray-600 bg-gray-50',
  'Неудача': 'text-red-600 bg-red-50', 'Большая Неудача': 'text-red-700 bg-red-100',
  '大吉': 'text-green-700 bg-green-50', '吉': 'text-green-600 bg-green-50', '中吉': 'text-blue-600 bg-blue-50',
  '半吉': 'text-amber-600 bg-amber-50', '中平': 'text-gray-600 bg-gray-50',
  '凶': 'text-red-600 bg-red-50', '大凶': 'text-red-700 bg-red-100',
};

const ELEMENT_DISPLAY: Record<string, Record<string, string>> = {
  'zh-CN': { '木':'木', '火':'火', '土':'土', '金':'金', '水':'水' },
  en: { '木':'Wood', '火':'Fire', '土':'Earth', '金':'Metal', '水':'Water' },
  ru: { '木':'Дерево', '火':'Огонь', '土':'Земля', '金':'Металл', '水':'Вода' },
  es: { '木':'Madera', '火':'Fuego', '土':'Tierra', '金':'Metal', '水':'Agua' },
  ko: { '木':'목', '火':'화', '土':'토', '金':'금', '水':'수' },
};

function getElemDisplay(elem: string, locale: string): string {
  return ELEMENT_DISPLAY[locale]?.[elem] || ELEMENT_DISPLAY['zh-CN']?.[elem] || elem;
}

interface Props {
  result: NameFortuneResult;
  locale: string;
  method: string;
}

export default function NameResult({ result, locale, method }: Props) {
  const t = TXT[locale] || TXT['zh-CN'];

  return (
    <div className="space-y-4">
      {method === 'chinese' && <ChineseResultBox result={result as ChineseNameResult} t={t} locale={locale} />}
      {(method === 'pythagorean' || method === 'chaldean') && (
        <WesternResultBox result={result as WesternNameResult} t={t} method={method} />
      )}
      {method === 'korean' && <KoreanResultBox result={result as KoreanNameResult} t={t} />}
    </div>
  );
}

function Badge({ label, value, colorClass }: { label: string; value: string | number; colorClass?: string }) {
  return (
    <div className={`px-3 py-2 rounded-lg text-center ${colorClass || 'bg-gray-50'}`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-bold text-gray-900">{value}</div>
    </div>
  );
}

function ChineseResultBox({ result, t, locale }: { result: ChineseNameResult; t: any; locale: string }) {
  const { grids, elements, threeTalents, gridInterpretations, personality } = result;
  // Element colors: look up by both Chinese key and localized display name
  const eClass = (e: string, raw: string) => ELEMENT_COLORS[e] || ELEMENT_COLORS[raw] || '';

  return (
    <div className="space-y-4">
      {/* Five Grids */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">{t.grid}</h3>
        <div className="grid grid-cols-5 gap-2 mb-4">
          <Badge label={t.heaven} value={grids.heaven} colorClass={eClass(getElemDisplay(elements.heaven, locale), elements.heaven)} />
          <Badge label={t.personality} value={grids.personality} colorClass={eClass(getElemDisplay(elements.personality, locale), elements.personality)} />
          <Badge label={t.earth} value={grids.earth} colorClass={eClass(getElemDisplay(elements.earth, locale), elements.earth)} />
          <Badge label={t.total} value={grids.total} colorClass={eClass(getElemDisplay(elements.total, locale), elements.total)} />
          <Badge label={t.external} value={grids.external} colorClass={eClass(getElemDisplay(elements.external, locale), elements.external)} />
        </div>

        {/* Three Talents */}
        <div className="p-4 bg-amber-50/50 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">{t.threeTalents}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ELEMENT_COLORS[threeTalents.harmony] || ''}`}>
              {threeTalents.harmony}
            </span>
          </div>
          <div className="flex gap-2 mb-2">
            {threeTalents.elements.map((e, i) => (
              <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium ${eClass(getElemDisplay(e, locale), e)}`}>{getElemDisplay(e, locale)}</span>
            ))}
          </div>
          <p className="text-xs text-gray-600">{threeTalents.description}</p>
        </div>

        {/* 81 Number Details */}
        <details className="group">
          <summary className="text-sm font-medium text-gray-700 cursor-pointer hover:text-amber-700">
            {t.fortune81} ▸
          </summary>
          <div className="mt-3 space-y-2">
            {Object.entries(gridInterpretations).map(([name, info]) => (
              <div key={name} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <span className="text-xs font-medium text-gray-500 w-10">{name}</span>
                <span className="text-xs font-bold text-gray-800 w-8">{info.number}</span>
                <span className={`text-xs px-1.5 rounded ${ELEMENT_COLORS[info.fortune] || ''}`}>{info.fortune}</span>
                <span className="text-xs text-gray-600 flex-1">{info.description}</span>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Personality */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">{t.personalityLabel}</h3>
        <p className="text-gray-700 leading-relaxed text-sm">{personality}</p>
      </div>
    </div>
  );
}

function WesternResultBox({ result, t, method }: { result: WesternNameResult; t: any; method: string }) {
  const { expression, personality, heartDesire } = result;

  const NumberCard = ({ label, data }: { label: string; data: { number: number; isMaster: boolean; meaning: string } }) => (
    <div className="p-5 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {data.isMaster && (
          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold">{t.masterNum}</span>
        )}
      </div>
      <div className="text-3xl font-bold text-amber-700 mb-2">{data.number}</div>
      <p className="text-sm text-gray-600 leading-relaxed">{data.meaning}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {method === 'pythagorean' ? 'Pythagorean' : 'Chaldean'} {t.number}
        </h3>
        <div className="space-y-3">
          <NumberCard label={t.expression} data={expression} />
          <NumberCard label={t.persNum} data={personality} />
          <NumberCard label={t.heartDesire} data={heartDesire} />
        </div>
      </div>
    </div>
  );
}

function KoreanResultBox({ result, t }: { result: KoreanNameResult; t: any }) {
  const { initials, elements, harmony, totalStrokes, fortune81, analysis } = result;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">{t.koreanInit}</h3>

        {/* Initial consonants & elements */}
        <div className="flex flex-wrap gap-2 mb-4">
          {initials.map((initial, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg font-bold text-amber-800">
                {initial}
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${ELEMENT_COLORS[elements[i]] || 'bg-gray-50'}`}>
                {elements[i]}
              </span>
            </div>
          ))}
        </div>

        {/* Harmony */}
        {harmony && (
          <div className="p-3 bg-blue-50/50 rounded-lg mb-3">
            <p className="text-xs text-blue-700">{harmony}</p>
          </div>
        )}

        {/* Total strokes & 81 fortune */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 p-3 bg-amber-50/50 rounded-lg text-center">
            <div className="text-xs text-gray-500">{t.totalStroke}</div>
            <div className="text-xl font-bold text-amber-700">{totalStrokes}</div>
          </div>
          <div className="flex-1 p-3 bg-amber-50/50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">81{t.number}</div>
            <div className="text-xs text-gray-700">{fortune81}</div>
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">{t.koreanAnalysis}</h3>
        <p className="text-gray-700 leading-relaxed text-sm">{analysis}</p>
      </div>
    </div>
  );
}
