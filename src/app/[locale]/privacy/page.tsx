import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

interface PageProps { params: Promise<{ locale: string }> }

const CONTENT: Record<string, { title: string; content: string[] }> = {
  'zh-CN': {
    title: '隐私政策',
    content: [
      '最后更新：2026年7月8日',
      '欢迎使用「探寻」（tanxun.vercel.app）。我们重视您的隐私，并致力于保护您的个人信息。',
      '【信息收集】',
      '当您使用本网站时，我们可能会收集以下信息：',
      '- 您主动输入的信息：如出生日期、梦境描述等（仅用于命理分析，不存储在服务器）',
      '- 浏览数据：通过 Google AdSense 等第三方服务收集的匿名浏览数据',
      '- Cookie：用于改善用户体验和展示相关广告',
      '',
      '【信息使用】',
      '我们收集的信息仅用于：',
      '- 提供八字排盘、解梦等核心功能',
      '- 展示个性化广告（通过 Google AdSense）',
      '- 改善网站内容和用户体验',
      '',
      '【第三方服务】',
      '本网站使用以下第三方服务：',
      '- Google AdSense：用于展示广告，可能使用 Cookie 和网络信标',
      '- DeepSeek / Claude API：用于 AI 命理分析和解梦生成（您输入的文本会被发送到 AI 服务处理）',
      '- Vercel：网站托管服务',
      '',
      '【数据安全】',
      '我们采取合理的安全措施保护您的信息。但请注意，互联网传输不能保证 100% 安全。',
      '',
      '【联系我们】',
      '如果您对本隐私政策有任何疑问，请通过 GitHub Issues 联系我们。',
    ],
  },
  en: {
    title: 'Privacy Policy',
    content: [
      'Last updated: July 8, 2026',
      'Welcome to TanXun (tanxun.vercel.app). We value your privacy and are committed to protecting your personal information.',
      '',
      '【Information We Collect】',
      'When you use our website, we may collect:',
      '- Information you voluntarily provide: birth date, dream descriptions (used only for analysis, not stored on servers)',
      '- Browsing data: anonymous browsing data collected via third-party services like Google AdSense',
      '- Cookies: used to improve user experience and display relevant advertisements',
      '',
      '【How We Use Information】',
      'The information we collect is used only for:',
      '- Providing Ba Zi reading, dream interpretation, and other core features',
      '- Displaying personalized advertisements (via Google AdSense)',
      '- Improving website content and user experience',
      '',
      '【Third-Party Services】',
      'This website uses the following third-party services:',
      '- Google AdSense: for displaying advertisements, may use cookies and web beacons',
      '- DeepSeek / Claude API: for AI-powered fortune telling and dream interpretation',
      '- Vercel: website hosting platform',
      '',
      '【Data Security】',
      'We take reasonable security measures to protect your information. However, internet transmission cannot be guaranteed 100% secure.',
      '',
      '【Contact Us】',
      'If you have any questions about this Privacy Policy, please contact us via GitHub Issues.',
    ],
  },
  ru: {
    title: 'Конфиденциальность',
    content: [
      'Последнее обновление: 8 июля 2026 г.',
      'Добро пожаловать на TanXun (tanxun.vercel.app). Мы уважаем вашу конфиденциальность.',
      '',
      '【Собираемая информация】',
      'При использовании сайта мы можем собирать: информацию, которую вы добровольно предоставляете (дата рождения, описание снов); данные просмотра через Google AdSense; файлы cookie.',
      '',
      '【Использование информации】',
      'Собранная информация используется только для предоставления услуг гадания Ба Цзы и толкования снов; показа рекламы; улучшения сайта.',
      '',
      '【Сторонние сервисы】',
      'Google AdSense, DeepSeek/Claude API, Vercel.',
    ],
  },
  es: {
    title: 'Política de Privacidad',
    content: [
      'Última actualización: 8 de julio de 2026',
      'Bienvenido a TanXun (tanxun.vercel.app). Valoramos su privacidad.',
      '',
      '【Información que recopilamos】',
      'Cuando utiliza nuestro sitio web, podemos recopilar: información que usted proporciona voluntariamente (fecha de nacimiento, descripciones de sueños); datos de navegación a través de Google AdSense; cookies.',
      '',
      '【Uso de la información】',
      'La información recopilada se utiliza solo para: proporcionar lecturas de Ba Zi e interpretación de sueños; mostrar anuncios; mejorar el sitio web.',
      '',
      '【Servicios de terceros】',
      'Google AdSense, DeepSeek/Claude API, Vercel.',
    ],
  },
};

export default async function PrivacyPage({ params }: PageProps) {
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
            if (para.startsWith('【')) {
              return <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2">{para}</h2>;
            }
            if (para.startsWith('- ')) {
              return <li key={i} className="ml-4 text-gray-600">{para.slice(2)}</li>;
            }
            if (para === '') return <br key={i} />;
            return <p key={i}>{para}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
