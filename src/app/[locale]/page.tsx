import { getTranslations, setRequestLocale } from 'next-intl/server';
import FeatureCard from '@/components/FeatureCard';
import DailyFortune from '@/components/DailyFortune';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">{t('hero.title')}</h1>
          <p className="text-xl md:text-2xl text-amber-700 font-serif mb-4">{t('hero.subtitle')}</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('hero.description')}</p>
        </div>
      </section>

      {/* 每日一签 */}
      <DailyFortune />

      <section className="w-full max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard title={t('features.dream.title')} description={t('features.dream.description')} href="/dream" icon="dream" />
          <FeatureCard title={t('features.bazi.title')} description={t('features.bazi.description')} href="/bazi" icon="bazi" />
          <FeatureCard title={t('features.zodiac.title')} description={t('features.zodiac.description')} href="/zodiac" icon="zodiac" />
          <FeatureCard title={t('features.hexagram.title')} description={t('features.hexagram.description')} href="/hexagram" icon="hexagram" />
          <FeatureCard title={t('features.knowledge.title')} description={t('features.knowledge.description')} href="/knowledge" icon="knowledge" />
          <FeatureCard title={t('features.name.title')} description={t('features.name.description')} href="/name" icon="name" />
        </div>
      </section>
    </div>
  );
}
