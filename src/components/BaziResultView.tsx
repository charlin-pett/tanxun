'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { BaZiInput } from '@/engine/types';
import { calcBaZi } from '@/engine/bazi';
import AdSenseAd from '@/components/AdSenseAd';
import {
  getGanText,
  getZhiText,
  getGanzhiText,
  getWuxingText,
  getShishenText,
  getShiChenText,
} from '@/engine/labels';
import ZodiacCard from './ZodiacCard';
import AiReading from './AiReading';

/**
 * 八字排盘结果展示组件
 *
 * 整合显示：
 * - 星座卡片（根据出生月日）
 * - 四柱八字命盘
 * - 五行分布统计
 * - 大运 + 流年
 * - AI命理报告（含星座+八字综合分析）
 */
interface BaziResultViewProps {
  input: BaZiInput;
  /** 是否自动触发 AI 报告生成（过渡动画结束后设为 true） */
  autoFetchReading?: boolean;
}

export default function BaziResultView({ input, autoFetchReading = false }: BaziResultViewProps) {
  const locale = useLocale();
  // ===== 多语言文本映射 =====
  const T = (locale === 'zh-CN' ? { pillars: '四柱八字', wx: '五行分布', dayun: '大运', liunian: '当前流年', dayunDir: (s: boolean) => s ? '顺排' : '逆排', startAge: (n: number) => `${n}岁起运`, yearLabel: '流年干支' }
    : locale === 'en' ? { pillars: 'Four Pillars', wx: 'Five Elements', dayun: 'Decade Luck', liunian: 'Current Year', dayunDir: (s: boolean) => s ? 'Forward' : 'Reverse', startAge: (n: number) => `${n}yo start`, yearLabel: 'Year Pillar' }
    : locale === 'ru' ? { pillars: 'Четыре Столпа', wx: 'Пять Элементов', dayun: 'Десятилетие', liunian: 'Текущий год', dayunDir: (s: boolean) => s ? 'Прямой' : 'Обратный', startAge: (n: number) => `${n} лет`, yearLabel: 'Столп года' }
    : locale === 'es' ? { pillars: 'Cuatro Pilares', wx: 'Cinco Elementos', dayun: 'Década de Suerte', liunian: 'Año Actual', dayunDir: (s: boolean) => s ? 'Directo' : 'Inverso', startAge: (n: number) => `${n} años`, yearLabel: 'Pilar del Año' }
    : locale === 'ko' ? { pillars: '사주팔자', wx: '오행 분포', dayun: '대운', liunian: '현재 세운', dayunDir: (s: boolean) => s ? '순행' : '역행', startAge: (n: number) => `${n}세에 시작`, yearLabel: '세운 간지' }
    : { pillars: '四柱八字', wx: '五行分布', dayun: '大运', liunian: '当前流年', dayunDir: (s: boolean) => s ? '顺排' : '逆排', startAge: (n: number) => `${n}岁起运`, yearLabel: '流年干支' }
  );

  // 计算命盘
  const result = useMemo(() => calcBaZi(input), [input]);

  const fp = result.fourPillars;
  const pillars = [fp.year, fp.month, fp.day, fp.hour];
  const pillarNames = locale === 'zh-CN' ? ['年柱', '月柱', '日柱', '时柱']
    : locale === 'en' ? ['Year', 'Month', 'Day', 'Hour']
    : locale === 'ru' ? ['Год', 'Месяц', 'День', 'Час']
    : locale === 'es' ? ['Año', 'Mes', 'Día', 'Hora']
    : locale === 'ko' ? ['년주', '월주', '일주', '시주']
    : ['年柱', '月柱', '日柱', '时柱'];

  // 格式化出生信息
  const hourText = getShiChenText(input.hour, input.minute, locale);
  const genderText = input.gender === 0
    ? (locale === 'zh-CN' ? '男' : locale === 'en' ? 'Male' : locale === 'ru' ? 'Муж' : locale === 'es' ? 'Masculino' : locale === 'ko' ? '남' : '男')
    : (locale === 'zh-CN' ? '女' : locale === 'en' ? 'Female' : locale === 'ru' ? 'Жен' : locale === 'es' ? 'Femenino' : locale === 'ko' ? '여' : '女');

  // 五行颜色
  const wxColors = ['bg-green-500', 'bg-red-500', 'bg-yellow-600', 'bg-gray-400', 'bg-blue-500'];

  // ===== 构建 AI 命理报告的入参 =====
  const readingParams = useMemo(() => {
    // 星座名称+元素
    const zodiacNames = ['白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座','水瓶座','双鱼座'];
    const zodiacElements = ['火','土','风','水','火','土','风','水','火','土','风','水'];

    // 根据月日算星座索引（简化）
    const getZodiacIdx = (m: number, d: number): number => {
      const bounds = [
        {m:3,d:21,i:0},{m:4,d:20,i:1},{m:5,d:21,i:2},{m:6,d:22,i:3},
        {m:7,d:23,i:4},{m:8,d:23,i:5},{m:9,d:23,i:6},{m:10,d:24,i:7},
        {m:11,d:23,i:8},{m:12,d:22,i:9},{m:1,d:20,i:10},{m:2,d:19,i:11},
      ];
      for (const b of bounds) {
        if ((m === b.m && d >= b.d) || (m > b.m && m < 1)) return b.i;
        if (m === 1 && b.i === 10 && d >= b.d) return b.i;
        if (m === 2 && b.i === 10 && d <= b.d) return 11;
      }
      if (m === 1 && d <= 19) return 9;
      return -1;
    };

    const zIdx = getZodiacIdx(input.month, input.day);
    const zodiacName = zIdx >= 0 ? zodiacNames[zIdx] : '未知星座';
    const zodiacElem = zIdx >= 0 ? zodiacElements[zIdx] : '未知';

    // 五行分布文本
    const wxText = result.wuXingCount
      .map((c, i) => `${getWuxingText(i, locale)}:${c}`)
      .join('，');

    // 大运文本
    const dyText = result.daYun.pillars
      .slice(0, 6)
      .map((p) => getGanzhiText(p.ganIndex, p.zhiIndex))
      .join('、');

    // 八字四柱文本
    const getPillarText = (p: typeof fp.year) => getGanzhiText(p.ganIndex, p.zhiIndex);

    return {
      birthInfo: {
        year: input.year,
        month: input.month,
        day: input.day,
        hour: input.hour,
        minute: input.minute,
        gender: genderText,
      },
      zodiac: { name: zodiacName, element: zodiacElem },
      fourPillars: {
        year: getPillarText(fp.year),
        month: getPillarText(fp.month),
        day: getPillarText(fp.day),
        hour: getPillarText(fp.hour),
      },
      dayMaster: getGanText(result.dayMaster, locale),
      wuxingSummary: wxText,
      locale,
      daYun: `${result.daYun.isShun
        ? (locale === 'zh-CN' ? '顺排' : locale === 'en' ? 'Forward' : locale === 'ru' ? 'Прямой' : locale === 'ko' ? '순행' : 'Directo')
        : (locale === 'zh-CN' ? '逆排' : locale === 'en' ? 'Reverse' : locale === 'ru' ? 'Обратный' : locale === 'ko' ? '역행' : 'Inverso')}
 ${result.daYun.startAge}${locale === 'zh-CN' ? '岁起运' : locale === 'en' ? 'yo start' : locale === 'ru' ? ' лет' : locale === 'ko' ? '세에 시작' : ' años'}：${dyText}`,
      liuNian: result.liuNian
        ? `${result.liuNian.year}${locale === 'zh-CN' ? '年' : ''} · ${getGanzhiText(result.liuNian.pillar.ganIndex, result.liuNian.pillar.zhiIndex)}`
        : '未知',
    };
  }, [result, input, genderText]);

  return (
    <div className="space-y-6">
      {/* ===== 出生信息摘要 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
        <p className="text-sm text-gray-500">
          {input.year}{locale === 'zh-CN' ? '年' : ''}{input.month}{locale === 'zh-CN' ? '月' : '/'}{input.day}{locale === 'zh-CN' ? '日' : ''} · {hourText} · {genderText}
        </p>
      </div>

      {/* ===== 星座卡片 ===== */}
      <ZodiacCard month={input.month} day={input.day} />

      {/* ===== 四柱八字（核心） ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <h2 className="text-lg font-bold text-gray-900 text-center">{T.pillars}</h2>
        </div>

        {/* 四柱表格 */}
        <div className="grid grid-cols-4 divide-x divide-gray-200">
          {/* 表头：柱名 */}
          {pillarNames.map((name, i) => (
            <div key={`head-${i}`} className="p-2 text-center bg-amber-50">
              <span className="text-sm font-semibold text-amber-800">{name}</span>
            </div>
          ))}

          {/* 天干行 */}
          {pillars.map((p, i) => (
            <div key={`gan-${i}`} className="p-3 text-center">
              <span className="text-2xl font-bold text-gray-900">
                {getGanText(p.ganIndex, locale)}
              </span>
              {i === 2 && (
                <span className="block text-xs text-amber-600 mt-0.5">
                  {locale === 'zh-CN' ? '日主' : locale === 'en' ? 'Master' : locale === 'ru' ? 'Хозяин' : locale === 'ko' ? '일주' : 'Maestro'}
                </span>
              )}
            </div>
          ))}

          {/* 十神行 */}
          {result.shiShen.map((ss, i) => (
            <div key={`ss-${i}`} className="p-1 text-center">
              {i !== 2 ? (
                <span className="text-xs text-gray-500">
                  {getShishenText(ss, locale)}
                </span>
              ) : (
                <span className="text-xs text-amber-600 font-medium">日元</span>
              )}
            </div>
          ))}

          {/* 分隔线 */}
          <div className="col-span-4 border-t border-gray-100" />

          {/* 地支行 */}
          {pillars.map((p, i) => (
            <div key={`zhi-${i}`} className="p-3 text-center">
              <span className="text-2xl font-bold text-gray-900">
                {getZhiText(p.zhiIndex, locale)}
              </span>
            </div>
          ))}

          {/* 藏干行 */}
          {pillars.map((p, i) => (
            <div key={`cg-${i}`} className="p-2 text-center">
              <span className="text-xs text-gray-400">
                {p.cangGan?.map((g) => getGanText(g)).join(' ') ?? ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 五行统计 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">{T.wx}</h3>
        <div className="space-y-2">
          {result.wuXingCount.map((count, i) => {
            const maxCount = Math.max(...result.wuXingCount, 1);
            const pct = (count / maxCount) * 100;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-8 text-sm font-medium text-gray-700 text-right">
                  {getWuxingText(i, locale)}
                </span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${wxColors[i]}`}
                    style={{ width: `${pct}%`, opacity: count > 0 ? 0.8 : 0.3 }}
                  />
                </div>
                <span className="w-6 text-sm text-gray-500 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== 大运 ===== */}
      <DaYunDisplay daYun={result.daYun} locale={locale} />

      {/* ===== 当前流年 ===== */}
      <LiuNianDisplay liuNian={result.liuNian} currentYear={new Date().getFullYear()} locale={locale} />

      {/* ===== AI 命理报告 ===== */}
      <AiReading params={readingParams} autoFetch={autoFetchReading} />

      {/* 广告 — 八字结果底部 */}
      <div className="mt-6">
        <AdSenseAd slot="4589145526" />
      </div>
    </div>
  );
}

/**
 * 大运展示组件
 */
function DaYunDisplay({
  daYun, locale = 'zh-CN'
}: {
  daYun: ReturnType<typeof calcBaZi>['daYun']; locale?: string
}) {
  const T = locale === 'zh-CN' ? { title: '大运', dir: (s: boolean) => s ? '顺排' : '逆排', start: (n: number) => `${n}岁起运` }
    : locale === 'en' ? { title: 'Decade Luck', dir: (s: boolean) => s ? 'Forward' : 'Reverse', start: (n: number) => `${n}yo start` }
    : locale === 'ru' ? { title: 'Десятилетие', dir: (s: boolean) => s ? 'Прямой' : 'Обратный', start: (n: number) => `${n} лет` }
    : locale === 'es' ? { title: 'Década de Suerte', dir: (s: boolean) => s ? 'Directo' : 'Inverso', start: (n: number) => `${n} años` }
    : locale === 'ko' ? { title: '대운', dir: (s: boolean) => s ? '순행' : '역행', start: (n: number) => `${n}세에 시작` }
    : { title: '大运', dir: (s: boolean) => s ? '顺排' : '逆排', start: (n: number) => `${n}岁起运` };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">{T.title}</h3>
      <p className="text-xs text-gray-500 mb-3">
        {T.dir(daYun.isShun)} · {T.start(daYun.startAge)}
      </p>
      <div className="flex flex-wrap gap-2">
        {daYun.pillars.map((p, i) => {
          const startAge = daYun.startAge + i * 10;
          const endAge = startAge + 9;
          return (
            <div
              key={i}
              className="flex-shrink-0 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-center"
            >
              <span className="block text-base font-bold text-gray-800">
                {getGanzhiText(p.ganIndex, p.zhiIndex)}
              </span>
              <span className="block text-xs text-gray-400 mt-0.5">
                {startAge}-{endAge}岁
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 流年展示组件
 */
function LiuNianDisplay({
  liuNian, currentYear, locale = 'zh-CN'
}: {
  liuNian?: { year: number; pillar: { ganIndex: number; zhiIndex: number } };
  currentYear: number; locale?: string
}) {
  const T = locale === 'zh-CN' ? { title: '当前流年', label: '流年干支' }
    : locale === 'en' ? { title: 'Current Year', label: 'Year Pillar' }
    : locale === 'ru' ? { title: 'Текущий год', label: 'Столп года' }
    : locale === 'es' ? { title: 'Año Actual', label: 'Pilar del Año' }
    : locale === 'ko' ? { title: '현재 세운', label: '세운 간지' }
    : { title: '当前流年', label: '流年干支' };
  if (!liuNian) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-4">{T.title}</h3>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
          <span className="text-xl font-bold text-amber-800">
            {getGanzhiText(liuNian.pillar.ganIndex, liuNian.pillar.zhiIndex)}
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{liuNian.year}年</p>
          <p className="text-sm text-gray-500">
            {T.label}：{getGanText(liuNian.pillar.ganIndex, locale)}
            {getZhiText(liuNian.pillar.zhiIndex, locale)}
          </p>
        </div>
      </div>
    </div>
  );
}
