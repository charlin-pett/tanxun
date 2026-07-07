import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

/**
 * 玄学百科页面（占位）
 *
 * TODO Phase 3: 实现完整的百科系统
 * - 分类导航（周易、五行、干支、奇门等）
 * - 文章列表/详情
 * - 搜索功能
 */
export default async function KnowledgePage() {
  const t = await getTranslations('knowledge');

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* 分类卡片（占位） */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {Object.entries(t.raw('categories')).map(([key, value]) => (
          <div
            key={key}
            className="p-6 bg-white rounded-xl border border-gray-200 text-center
                       hover:border-amber-300 transition-colors cursor-default"
          >
            <p className="text-gray-900 font-medium">{value as string}</p>
          </div>
        ))}
      </div>

      {/* 占位提示 */}
      <p className="mt-12 text-sm text-gray-400 text-center italic">
        —— 内容筹备中，敬请期待 ——
      </p>
    </div>
  );
}
