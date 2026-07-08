import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getKnowledgeCategories, getArticlesByCategory } from '@/lib/knowledge';
import type { KnowledgeCategory } from '@/types/knowledge';
import KnowledgeClient from './KnowledgeClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function KnowledgePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'knowledge' });

  const categoriesWithArticles: KnowledgeCategory[] = await Promise.all(
    getKnowledgeCategories(locale).map(async (meta) => {
      const articles = await getArticlesByCategory(meta.id, locale);
      return { ...meta, articles };
    })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>
      <KnowledgeClient categories={categoriesWithArticles} />
    </div>
  );
}
