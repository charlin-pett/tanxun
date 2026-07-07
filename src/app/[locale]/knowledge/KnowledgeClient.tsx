'use client';

import { Link } from '@/i18n/navigation';
import type { KnowledgeCategory } from '@/types/knowledge';

/**
 * 玄学百科分类列表客户端组件
 */
interface KnowledgeClientProps {
  categories: KnowledgeCategory[];
}

/** 分类配色映射 */
const CATEGORY_COLORS: Record<string, string> = {
  yijing: 'bg-red-50 text-red-700 border-red-200',
  wuxing: 'bg-amber-50 text-amber-700 border-amber-200',
  ganzhi: 'bg-blue-50 text-blue-700 border-blue-200',
  qimen: 'bg-purple-50 text-purple-700 border-purple-200',
  fengshui: 'bg-green-50 text-green-700 border-green-200',
  face: 'bg-pink-50 text-pink-700 border-pink-200',
};

export default function KnowledgeClient({ categories }: KnowledgeClientProps) {
  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const colorClass = CATEGORY_COLORS[category.id] || 'bg-gray-50 text-gray-700 border-gray-200';

        return (
          <section
            key={category.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            {/* 分类头部 */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center text-lg font-bold`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            </div>

            {/* 文章列表 */}
            <div className="divide-y divide-gray-100">
              {category.articles.length === 0 ? (
                <p className="p-6 text-sm text-gray-400 text-center">内容筹备中</p>
              ) : (
                category.articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/knowledge/${category.id}/${article.id}`}
                    className="block p-5 hover:bg-amber-50/50 transition-colors group"
                  >
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-700 transition-colors mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {article.summary}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
