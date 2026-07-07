/**
 * 玄学百科数据类型定义
 */

/** 单篇文章 */
export interface Article {
  /** 文章 ID（分类内唯一） */
  id: string;
  /** 文章标题 */
  title: string;
  /** 摘要/简介 */
  summary: string;
  /** 正文内容（支持多段落，用换行分隔） */
  content: string;
  /** 标签 */
  tags?: string[];
}

/** 百科分类 */
export interface KnowledgeCategory {
  /** 分类 ID，如 'yijing', 'wuxing' */
  id: string;
  /** 分类名称，如 '周易' */
  name: string;
  /** 分类图标 */
  icon: string;
  /** 分类简介 */
  description: string;
  /** 该分类下的文章 */
  articles: Article[];
}
