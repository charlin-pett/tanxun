import { getTranslations } from 'next-intl/server';
import { KNOWLEDGE_CATEGORIES, getArticlesByCategory } from '@/lib/knowledge';
import type { KnowledgeCategory } from '@/types/knowledge';
import KnowledgeClient from './KnowledgeClient';

/**
 * 玄学百科首页（服务端）
 *
 * 预加载所有分类的文章数据，交给客户端组件渲染。
 */
export default async function KnowledgePage() {
  const t = await getTranslations('knowledge');

  // 预加载所有分类的文章
  const categoriesWithArticles: KnowledgeCategory[] = await Promise.all(
    KNOWLEDGE_CATEGORIES.map(async (meta) => {
      const articles = await getArticlesByCategory(meta.id);
      return { ...meta, articles };
    })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>

      {/* 分类列表 */}
      <KnowledgeClient categories={categoriesWithArticles} />
    </div>
  );
}
