import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getArticle, getArticlesByCategory } from '@/lib/knowledge';

interface ArticleDetailProps {
  params: Promise<{ locale: string; categoryId: string; articleId: string }>;
}

/** 分类配色 */
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  yijing: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  wuxing: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  ganzhi: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  qimen: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  fengshui: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  face: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
  const { locale, categoryId, articleId } = await params;

  const result = await getArticle(categoryId, articleId, locale);
  if (!result) {
    notFound();
  }

  const { article, category } = result;
  const colors = CATEGORY_COLORS[categoryId] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };

  // 获取同分类的其他文章（用于侧栏导航）
  const siblingArticles = await getArticlesByCategory(categoryId, locale);
  const currentIdx = siblingArticles.findIndex((a) => a.id === articleId);
  const prevArticle = currentIdx > 0 ? siblingArticles[currentIdx - 1] : null;
  const nextArticle = currentIdx < siblingArticles.length - 1 ? siblingArticles[currentIdx + 1] : null;

  // 将正文按换行符分割为段落
  const paragraphs = article.content.split('\n\n');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/knowledge" className="hover:text-amber-700 transition-colors">
          {locale === 'zh-CN' ? '玄学百科' : locale === 'en' ? 'Library' : locale === 'ru' ? 'Библиотека' : locale === 'es' ? 'Biblioteca' : 'Back'}
        </Link>
        <span>/</span>
        <span className={`${colors.text}`}>{category.name}</span>
        <span>/</span>
        <span className="text-gray-600">{locale === 'zh-CN' ? '正文' : locale === 'en' ? 'Article' : locale === 'ru' ? 'Статья' : locale === 'es' ? 'Artículo' : ''}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：文章列表（桌面端） */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className={`sticky top-24 p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
            <h3 className={`text-sm font-semibold ${colors.text} mb-3`}>
              {category.name} · {locale === 'zh-CN' ? '目录' : locale === 'en' ? 'Contents' : locale === 'ru' ? 'Содержание' : locale === 'es' ? 'Contenido' : ''}
            </h3>
            <ul className="space-y-1">
              {siblingArticles.map((a, i) => (
                <li key={a.id}>
                  <Link
                    href={`/knowledge/${categoryId}/${a.id}`}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      a.id === articleId
                        ? 'bg-white font-semibold text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                    }`}
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 右侧：正文 */}
        <article className="lg:col-span-3">
          {/* 文章头部 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <div className="p-8">
              {/* 分类标签 */}
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-4`}>
                {category.name}
              </span>

              {/* 标题 */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* 摘要 */}
              <p className="text-base text-gray-500 leading-relaxed border-l-4 border-amber-300 pl-4 italic">
                {article.summary}
              </p>

              {/* 标签 */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {article.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 正文 */}
            <div className="px-8 pb-8">
              <div className="prose prose-gray max-w-none">
                {paragraphs.map((para, i) => {
                  // 判断是否为小标题（以【开头）
                  if (para.startsWith('【') && para.includes('】')) {
                    const titleEnd = para.indexOf('】') + 1;
                    return (
                      <h2 key={i} className="text-lg font-bold text-gray-900 mt-8 mb-3 flex items-center gap-2">
                        <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
                        {para}
                      </h2>
                    );
                  }
                  // 判断是否为子标题（以——开头或包含破折号强调）
                  if (para.startsWith('- ')) {
                    return (
                      <p key={i} className="text-sm font-semibold text-amber-700 mt-4 mb-1">
                        {para.replace('- ', '')}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className="text-gray-700 leading-relaxed mb-4">
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 上下篇导航 */}
          <div className="flex justify-between items-center">
            {prevArticle ? (
              <Link
                href={`/knowledge/${categoryId}/${prevArticle.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                           bg-white rounded-lg border border-gray-200 hover:border-amber-300
                           hover:text-amber-700 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {locale === 'zh-CN' ? '上一篇' : locale === 'en' ? 'Previous' : locale === 'ru' ? 'Назад' : locale === 'es' ? 'Anterior' : 'Back'}
              </Link>
            ) : (
              <div />
            )}

            {nextArticle ? (
              <Link
                href={`/knowledge/${categoryId}/${nextArticle.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600
                           bg-white rounded-lg border border-gray-200 hover:border-amber-300
                           hover:text-amber-700 transition-all"
              >
                {locale === 'zh-CN' ? '下一篇' : locale === 'en' ? 'Next' : locale === 'ru' ? 'Вперёд' : locale === 'es' ? 'Siguiente' : 'Next'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
