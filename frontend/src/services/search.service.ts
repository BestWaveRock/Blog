// 搜索相关的API服务
import { Article } from '@/types';
import { searchArticles as searchArticlesAPI } from './articles.service';

// 搜索文章
export const searchArticles = async (keyword: string, page: number = 1, limit: number = 10): Promise<[Article[], number]> => {
  try {
    // 如果关键词为空，返回空结果
    if (!keyword.trim()) {
      return [[], 0];
    }

    return await searchArticlesAPI(keyword, page, limit);
  } catch (error) {
    console.error('搜索文章错误:', error);
    throw error;
  }
};