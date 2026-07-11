import { Link } from '@/i18n/navigation';

/**
 * 功能卡片组件
 *
 * 首页展示四大核心功能的入口卡片：
 * - 解梦 / 八字 / 卦象 / 百科
 *
 * 每个卡片包含图标、标题、描述，点击跳转到对应功能页。
 *
 * props:
 *   title       - 卡片标题
 *   description - 卡片描述
 *   href        - 点击跳转链接
 *   icon        - 图标标识（决定显示的 SVG 图标）
 */
interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: 'dream' | 'bazi' | 'hexagram' | 'knowledge' | 'name';
}

export default function FeatureCard({
  title,
  description,
  href,
  icon,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200"
    >
      {/* 图标区 */}
      <div className="mb-4">
        <Icon name={icon} />
      </div>

      {/* 标题 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
        {title}
      </h3>

      {/* 描述 */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </Link>
  );
}

/**
 * 图标子组件
 *
 * 根据 icon 名称渲染对应的 SVG 图标
 * 所有图标为 40x40，使用国风配色
 */
function Icon({ name }: { name: FeatureCardProps['icon'] }) {
  const iconSize = 40;
  const color = '#92400e'; // amber-800

  switch (name) {
    case 'dream':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 月亮 + 星星 = 梦境图标 */}
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          <circle cx="17" cy="7" r="1" fill={color} />
          <circle cx="19" cy="10" r="0.5" fill={color} />
        </svg>
      );
    case 'bazi':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 八卦符号 */}
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="6.34" y2="17.66" />
          {/* 阴阳点 */}
          <circle cx="12" cy="8" r="2" fill={color} />
          <circle cx="12" cy="16" r="2" fill="white" stroke={color} />
        </svg>
      );
    case 'hexagram':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* 三条横线 = 乾卦符号 */}
          <line x1="4" y1="4" x2="20" y2="4" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="20" x2="20" y2="20" />
        </svg>
      );
    case 'knowledge':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="7" x2="16" y2="7" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      );
    case 'name':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="M15 5l4 4" />
          <path d="M7.5 12.5l4 4" />
        </svg>
      );
    default:
      return null;
  }
}
