import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllHexagrams, getHexagramByNumber } from '@/lib/hexagram';
import { Link } from '@/i18n/navigation';
import type { HexagramLine } from '@/types/hexagram';

// 定义 props 类型（Next.js 15+ 使用 Promise params）
interface HexagramDetailProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function HexagramDetailPage({
  params,
}: HexagramDetailProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const hexNumber = parseInt(id, 10);
  if (isNaN(hexNumber) || hexNumber < 1 || hexNumber > 64) {
    notFound();
  }

  const hexagram = await getHexagramByNumber(hexNumber);
  if (!hexagram) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'hexagram' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 页面导航 */}
      <Link
        href="/hexagram"
        className="inline-flex items-center text-sm text-gray-500 hover:text-amber-700 mb-8 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t('title')}
      </Link>

      {/* ===== 卦象头部 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <div className="flex items-center gap-6 mb-6">
          {/* 卦符 */}
          <div className="w-20 h-20 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200">
            <span className="text-4xl">{hexagram.symbol}</span>
          </div>

          {/* 卦名信息 */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {hexagram.name}
              </h1>
              <span className="text-base font-classic text-amber-700">
                {hexagram.fullName}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t('lines')}
              {hexagram.upperTrigram} · {hexagram.lowerTrigram}
              <span className="mx-2">|</span>
              {locale === 'zh-CN' ? `第${hexagram.number}卦` : locale === 'en' ? `Hexagram ${hexagram.number}` : locale === 'ru' ? `Гексаграмма ${hexagram.number}` : locale === 'es' ? `Hexagrama ${hexagram.number}` : `#${hexagram.number}`}
            </p>
          </div>
        </div>

        {/* 卦辞 */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t('judgment')}
          </h2>
          <p className="text-xl font-classic text-gray-900 leading-relaxed">
            {hexagram.judgment}
          </p>
        </div>

        {/* 象传 */}
        {hexagram.xiang && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              象传
            </h2>
            <p className="text-base font-classic text-gray-700 leading-relaxed italic">
              {hexagram.xiang}
            </p>
          </div>
        )}
      </div>

      {/* ===== 爻辞 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {t('lines')}
        </h2>
        <div className="space-y-4">
          {hexagram.lines.map((line: HexagramLine, index: number) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-lg hover:bg-amber-50 transition-colors"
            >
              {/* 爻位 */}
              <div className="w-14 flex-shrink-0">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    line.position.includes('九')
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {line.position}
                </span>
              </div>
              {/* 爻辞内容 */}
              <div className="flex-1">
                <p className="text-base font-classic text-gray-900 mb-1">
                  {line.text}
                </p>
                <p className="text-sm text-gray-500">{line.meaning}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 现代释义 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('meaning')}
        </h2>
        <p className="text-gray-700 leading-relaxed">{hexagram.meaning}</p>
      </div>

      {/* ===== 前后卦导航 ===== */}
      <div className="flex justify-between items-center">
        {hexagram.number > 1 ? (
          <Link
            href={`/hexagram/${hexagram.number - 1}`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                       bg-white rounded-lg border border-gray-200 hover:border-amber-300
                       hover:text-amber-700 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('prev')}
          </Link>
        ) : (
          <div />
        )}

        {hexagram.number < 64 ? (
          <Link
            href={`/hexagram/${hexagram.number + 1}`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                       bg-white rounded-lg border border-gray-200 hover:border-amber-300
                       hover:text-amber-700 transition-all"
          >
            {t('next')}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
