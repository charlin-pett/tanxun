/**
 * 玄学百科数据加载工具
 *
 * 使用静态导入替代动态 import()，避免 Turbopack 打包问题。
 * 所有 JSON 文件在编译时即被导入。
 */
import type { KnowledgeCategory, Article } from '@/types/knowledge';

// ===== 静态导入所有 JSON 数据 =====
import yijingData from '@/data/knowledge/zh-CN/yijing.json';
import wuxingData from '@/data/knowledge/zh-CN/wuxing.json';
import ganzhiData from '@/data/knowledge/zh-CN/ganzhi.json';
import qimenData from '@/data/knowledge/zh-CN/qimen.json';
import fengshuiData from '@/data/knowledge/zh-CN/fengshui.json';
import faceData from '@/data/knowledge/zh-CN/face.json';

/** 分类 ID 到数据的静态映射 */
const DATA_MAP: Record<string, Article[]> = {
  yijing: yijingData as Article[],
  wuxing: wuxingData as Article[],
  ganzhi: ganzhiData as Article[],
  qimen: qimenData as Article[],
  fengshui: fengshuiData as Article[],
  face: faceData as Article[],
};

/** 知识库分类元信息 */
export const KNOWLEDGE_CATEGORIES: Omit<KnowledgeCategory, 'articles'>[] = [
  { id: 'yijing', name: '周易', icon: '䷀', description: '群经之首，大道之源——易经的智慧' },
  { id: 'wuxing', name: '五行', icon: '♨', description: '金木水火土——宇宙的五种基本元素' },
  { id: 'ganzhi', name: '天干地支', icon: '干支', description: '十天干与十二地支——古老的时间坐标' },
  { id: 'qimen', name: '奇门遁甲', icon: '九宫', description: '帝王之学——最高深的预测术' },
  { id: 'fengshui', name: '风水', icon: '山水', description: '人与环境的和谐之道' },
  { id: 'face', name: '面相手相', icon: '面相', description: '掌中乾坤，面中命运' },
];

/**
 * 获取所有分类（含文章）
 */
export async function getAllCategories(
  _locale?: string
): Promise<KnowledgeCategory[]> {
  return KNOWLEDGE_CATEGORIES.map((meta) => ({
    ...meta,
    articles: DATA_MAP[meta.id] || [],
  }));
}

/**
 * 根据分类 ID 获取该分类下的文章
 */
export async function getArticlesByCategory(
  categoryId: string,
  _locale?: string
): Promise<Article[]> {
  return DATA_MAP[categoryId] || [];
}

/**
 * 根据分类 ID 和文章 ID 获取单篇文章
 */
export async function getArticle(
  categoryId: string,
  articleId: string,
  _locale?: string
): Promise<{ article: Article; category: Omit<KnowledgeCategory, 'articles'> } | null> {
  const articles = DATA_MAP[categoryId];
  if (!articles) return null;

  const article = articles.find((a) => a.id === articleId);
  if (!article) return null;

  const category = KNOWLEDGE_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return null;

  return { article, category };
}
