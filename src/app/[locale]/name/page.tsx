import { getTranslations, setRequestLocale } from 'next-intl/server';
import NameInput from '@/components/NameInput';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NamePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">姓名预测</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            融合中国传统姓名学（五格剖象法）、西方灵数学（Pythagorean & Chaldean）与韩国姓名学（성명학），全方位解读你名字中蕴藏的命运密码
          </p>
        </div>
      </section>

      <section className="w-full max-w-2xl mx-auto px-4 py-8 pb-16">
        <NameInput />
      </section>
    </div>
  );
}
