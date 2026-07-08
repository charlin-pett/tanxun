import { getTranslations, setRequestLocale } from 'next-intl/server';
import BaziForm from '@/components/BaziForm';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function BaziPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'bazi' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t('title')}</h1>
        <p className="text-lg text-gray-600">{t('subtitle')}</p>
      </div>
      <BaziForm />
    </div>
  );
}
