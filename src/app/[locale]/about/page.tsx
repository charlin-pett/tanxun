import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

interface PageProps { params: Promise<{ locale: string }> }

const CONTENT: Record<string, { title: string; content: string[] }> = {
  'zh-CN': {
    title: '关于我们',
    content: [
      '「探寻」是一个致力于传播中华传统玄学文化的在线平台。',
      '我们相信，古老的智慧可以为现代生活提供独特的视角和启发。',
      '',
      '【我们的使命】',
      '让更多人了解和接触中国传统玄学文化——包括周易、五行、八字命理、解梦等。我们致力于用现代技术呈现古老的智慧，让传统文化在数字时代焕发新的生命力。',
      '',
      '【功能特色】',
      '- ☯ 六十四卦：完整收录周易六十四卦，提供卦辞、爻辞和现代释义',
      '- 📊 八字排盘：基于传统算法自动排四柱、推大运、断流年',
      '- 🔮 AI 解梦：结合《周公解梦》与现代心理学，AI 辅助解读梦境',
      '- 📖 玄学百科：涵盖五行、天干地支、奇门遁甲等传统文化知识',
      '- 🌐 多语言：支持中文、English、Русский、Español',
      '',
      '【免责声明】',
      '本网站所有内容仅供传统文化研究参考，并非科学验证的结果。算命、解梦等内容应理性看待，切勿沉迷。网站不承担因使用本服务而产生的任何直接或间接责任。',
      '',
      '【联系我们】',
      '如有任何问题或建议，请通过 GitHub Issues 联系我们。',
    ],
  },
  en: {
    title: 'About Us',
    content: [
      'TanXun is an online platform dedicated to sharing traditional Chinese metaphysical culture.',
      'We believe ancient wisdom can offer unique perspectives and inspiration for modern life.',
      '',
      '【Our Mission】',
      'To make traditional Chinese metaphysical culture accessible to a global audience — including I-Ching, Five Elements, Ba Zi astrology, dream interpretation, and more.',
      '',
      '【Features】',
      '- ☯ 64 Hexagrams: Complete I-Ching with judgments, line texts, and modern interpretations',
      '- 📊 Ba Zi Reading: Automatic Four Pillars calculation based on traditional algorithms',
      '- 🔮 AI Dream Interpretation: Combining Zhou Gong with modern psychology',
      '- 📖 Knowledge Library: Five Elements, Heavenly Stems, Qi Men Dun Jia, and more',
      '- 🌐 Multi-language: 中文, English, Русский, Español',
      '',
      '【Disclaimer】',
      'All content is for traditional cultural research reference only. It is not scientifically validated. Please maintain a rational perspective.',
      '',
      '【Contact】',
      'For any questions, please reach out via GitHub Issues.',
    ],
  },
  ru: {
    title: 'О нас',
    content: [
      'TanXun — онлайн-платформа, посвящённая традиционной китайской метафизике.',
      '',
      '【Наша миссия】',
      'Сделать традиционную китайскую метафизику доступной для мировой аудитории.',
      '',
      '【Функции】',
      '- 64 гексаграммы И-Цзин, Ба Цзы, толкование снов, библиотека знаний.',
      '- Поддержка 4 языков.',
      '',
      '【Отказ от ответственности】',
      'Весь контент предназначен только для культурного ознакомления.',
    ],
  },
  es: {
    title: 'Sobre Nosotros',
    content: [
      'TanXun es una plataforma en línea dedicada a compartir la cultura metafísica tradicional china.',
      '',
      '【Nuestra misión】',
      'Hacer accesible la metafísica tradicional china a una audiencia global.',
      '',
      '【Características】',
      '- 64 hexagramas del I-Ching, lectura de Ba Zi, interpretación de sueños con IA, biblioteca.',
      '- Soporte para 4 idiomas.',
      '',
      '【Aviso legal】',
      'Todo el contenido es solo como referencia cultural.',
    ],
  },
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = CONTENT[locale] || CONTENT['zh-CN'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-block">← {locale === 'zh-CN' ? '返回首页' : locale === 'en' ? 'Back to Home' : locale === 'ru' ? 'На главную' : 'Volver al inicio'}</Link>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{c.title}</h1>
        <div className="text-gray-700 leading-relaxed space-y-4">
          {c.content.map((para, i) => {
            if (para.startsWith('【')) return <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{para}</h2>;
            if (para === '') return <br key={i} />;
            return <p key={i}>{para}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
