/**
 * 玄学百科数据加载工具
 *
 * 多语言支持：优先加载对应语言的数据，回退中文。
 * 所有数据文件在构建时静态导入。
 */
import type { KnowledgeCategory, Article } from '@/types/knowledge';

import yijingCN from '@/data/knowledge/zh-CN/yijing.json';
import wuxingCN from '@/data/knowledge/zh-CN/wuxing.json';
import ganzhiCN from '@/data/knowledge/zh-CN/ganzhi.json';
import qimenCN from '@/data/knowledge/zh-CN/qimen.json';
import fengshuiCN from '@/data/knowledge/zh-CN/fengshui.json';
import faceCN from '@/data/knowledge/zh-CN/face.json';

import yijingEN from '@/data/knowledge/en/yijing.json';
import wuxingEN from '@/data/knowledge/en/wuxing.json';
import ganzhiEN from '@/data/knowledge/en/ganzhi.json';
import qimenEN from '@/data/knowledge/en/qimen.json';
import fengshuiEN from '@/data/knowledge/en/fengshui.json';
import faceEN from '@/data/knowledge/en/face.json';

import yijingRU from '@/data/knowledge/ru/yijing.json';
import wuxingRU from '@/data/knowledge/ru/wuxing.json';
import ganzhiRU from '@/data/knowledge/ru/ganzhi.json';
import qimenRU from '@/data/knowledge/ru/qimen.json';
import fengshuiRU from '@/data/knowledge/ru/fengshui.json';
import faceRU from '@/data/knowledge/ru/face.json';

import yijingES from '@/data/knowledge/es/yijing.json';
import wuxingES from '@/data/knowledge/es/wuxing.json';
import ganzhiES from '@/data/knowledge/es/ganzhi.json';
import qimenES from '@/data/knowledge/es/qimen.json';
import fengshuiES from '@/data/knowledge/es/fengshui.json';
import faceES from '@/data/knowledge/es/face.json';

type DataMap = Record<string, Article[]>;

const DATA: Record<string, DataMap> = {
  'zh-CN': { yijing: yijingCN as Article[], wuxing: wuxingCN as Article[], ganzhi: ganzhiCN as Article[], qimen: qimenCN as Article[], fengshui: fengshuiCN as Article[], face: faceCN as Article[] },
  en: { yijing: yijingEN as Article[], wuxing: wuxingEN as Article[], ganzhi: ganzhiEN as Article[], qimen: qimenEN as Article[], fengshui: fengshuiEN as Article[], face: faceEN as Article[] },
  ru: { yijing: yijingRU as Article[], wuxing: wuxingRU as Article[], ganzhi: ganzhiRU as Article[], qimen: qimenRU as Article[], fengshui: fengshuiRU as Article[], face: faceRU as Article[] },
  es: { yijing: yijingES as Article[], wuxing: wuxingES as Article[], ganzhi: ganzhiES as Article[], qimen: qimenES as Article[], fengshui: fengshuiES as Article[], face: faceES as Article[] },
};

export const KNOWLEDGE_CATEGORIES = [
  { id: 'yijing', name: '周易', icon: '䷀', description: '群经之首，大道之源——易经的智慧' },
  { id: 'wuxing', name: '五行', icon: '♨', description: '金木水火土——宇宙的五种基本元素' },
  { id: 'ganzhi', name: '天干地支', icon: '干支', description: '十天干与十二地支——古老的时间坐标' },
  { id: 'qimen', name: '奇门遁甲', icon: '九宫', description: '帝王之学——最高深的预测术' },
  { id: 'fengshui', name: '风水', icon: '山水', description: '人与环境的和谐之道' },
  { id: 'face', name: '面相手相', icon: '面相', description: '掌中乾坤，面中命运' },
];

function getData(locale: string = 'zh-CN'): DataMap {
  return DATA[locale] || DATA['zh-CN'];
}

export async function getAllCategories(locale: string = 'zh-CN'): Promise<KnowledgeCategory[]> {
  const data = getData(locale);
  return KNOWLEDGE_CATEGORIES.map(m => ({ ...m, articles: data[m.id] || [] }));
}

export async function getArticlesByCategory(categoryId: string, locale: string = 'zh-CN'): Promise<Article[]> {
  return getData(locale)[categoryId] || [];
}

export async function getArticle(categoryId: string, articleId: string, locale: string = 'zh-CN') {
  const articles = getData(locale)[categoryId] || [];
  const article = articles.find(a => a.id === articleId);
  if (!article) return null;
  const category = KNOWLEDGE_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return null;
  return { article, category };
}
