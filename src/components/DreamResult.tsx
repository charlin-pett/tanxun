'use client';

import { Link } from '@/i18n/navigation';
import { CATEGORY_LABELS_CN } from '@/engine/dream/categories';

/**
 * 解梦结果展示组件
 *
 * 展示 AI 生成的完整解梦报告，并关联相关卦象推荐。
 */
interface DreamResultProps {
  dreamText: string;
  interpretation: string;
  categories: string[];
}

/** 梦境元素 → 推荐卦象映射 */
const DREAM_HEXAGRAM_MAP: Record<string, { num: number; name: string }[]> = {
  water: [
    { num: 29, name: '坎为水' },
    { num: 39, name: '水山蹇' },
    { num: 5, name: '水天需' },
  ],
  fire: [
    { num: 30, name: '离为火' },
    { num: 49, name: '泽火革' },
    { num: 38, name: '火泽睽' },
  ],
  fly: [
    { num: 1, name: '乾为天' },
    { num: 46, name: '地风升' },
    { num: 53, name: '风山渐' },
  ],
  fall: [
    { num: 23, name: '山地剥' },
    { num: 47, name: '泽水困' },
    { num: 39, name: '水山蹇' },
  ],
  animal: [
    { num: 1, name: '乾为天' },
    { num: 3, name: '水雷屯' },
    { num: 24, name: '地雷复' },
  ],
  default: [
    { num: 1, name: '乾为天' },
    { num: 2, name: '坤为地' },
    { num: 11, name: '地天泰' },
  ],
};

/** 根据梦境内容推荐相关卦象 */
function getRecommendedHexagrams(text: string, categories: string[]) {
  if (text.includes('水') || text.includes('河') || text.includes('海') || text.includes('雨'))
    return DREAM_HEXAGRAM_MAP.water;
  if (text.includes('火') || text.includes('烧'))
    return DREAM_HEXAGRAM_MAP.fire;
  if (text.includes('飞'))
    return DREAM_HEXAGRAM_MAP.fly;
  if (text.includes('坠落') || text.includes('掉') || text.includes('跌'))
    return DREAM_HEXAGRAM_MAP.fall;
  if (categories.includes('animals'))
    return DREAM_HEXAGRAM_MAP.animal;
  return DREAM_HEXAGRAM_MAP.default;
}

export default function DreamResult({
  dreamText,
  interpretation,
  categories,
}: DreamResultProps) {
  const hexagrams = getRecommendedHexagrams(dreamText, categories);

  // 将解梦文本按段落分割
  const sections = interpretation.split('\n\n');

  return (
    <div className="space-y-6">
      {/* ===== 梦境摘要 ===== */}
      <div className="bg-gradient-to-r from-amber-50 to-white rounded-xl border border-amber-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-amber-700 mb-2">梦境内容</h3>
        <p className="text-gray-700 font-classic leading-relaxed">
          {dreamText}
        </p>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 bg-amber-100 text-amber-600 text-xs rounded-full"
              >
                {CATEGORY_LABELS_CN[cat] || cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ===== 解梦正文 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-amber-700 to-amber-600 text-white">
          <h3 className="text-lg font-bold">解梦分析</h3>
        </div>
        <div className="p-6">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.map((section, i) => {
              // 标题行（以【开头）
              if (section.startsWith('【')) {
                const titleEnd = section.indexOf('】');
                if (titleEnd > 0) {
                  const title = section.slice(0, titleEnd + 1);
                  const body = section.slice(titleEnd + 1);
                  return (
                    <div key={i} className="mb-4">
                      <h4 className="text-base font-bold text-amber-800 mb-2">
                        {title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {body}
                      </p>
                    </div>
                  );
                }
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                  {section}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== 相关卦象推荐 ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          相关卦象参考
        </h3>
        <div className="flex flex-wrap gap-3">
          {hexagrams.map((h) => (
            <Link
              key={h.num}
              href={`/hexagram/${h.num}`}
              className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg
                         hover:bg-amber-100 transition-colors group"
            >
              <span className="text-sm font-medium text-amber-800 group-hover:text-amber-900">
                第{h.num}卦 · {h.name}
              </span>
              <span className="text-xs text-amber-500 ml-1">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
