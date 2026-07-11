import { getTranslations, setRequestLocale } from 'next-intl/server';
import ZodiacFortune from '@/components/ZodiacFortune';

interface PageProps { params: Promise<{ locale: string }> }

export default async function ZodiacPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'zodiac' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>
      <ZodiacFortune />
    </div>
  );
}
