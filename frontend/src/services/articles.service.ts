// 文章相关的API服务
import { Article, Category, Tag } from '@/types';

const API_BASE_URL = '/api';

// 获取文章列表
export const getArticles = async (page: number = 1, limit: number = 10, status?: string): Promise<[Article[], number]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);

    if (!res.ok) {
      throw new Error('获取文章列表失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取文章列表错误:', error);
    throw error;
  }
};

// 获取文章详情
export const getArticleById = async (id: number): Promise<Article> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`);

    if (!res.ok) {
      throw new Error('获取文章详情失败');
    }

    const data = await res.json();
    console.log('Raw article data from API:', data);
    console.log('Raw article content type:', typeof data.content);
    console.log('Raw article content value:', data.content);

    // Check if content is an object
    if (typeof data.content === 'object' && data.content !== null) {
      console.log('Content is an object, converting to string');
      // Convert object to string
      data.content = JSON.stringify(data.content);
      console.log('After conversion - content type:', typeof data.content);
      console.log('After conversion - content value:', data.content);
    }

    return data;
  } catch (error) {
    console.error('获取文章详情错误:', error);
    throw error;
  }
};

// 创建文章
export const createArticle = async (articleData: Partial<Article>, token: string): Promise<Article> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '创建文章失败');
    }

    return res.json();
  } catch (error) {
    console.error('创建文章错误:', error);
    throw error;
  }
};

// 更新文章
export const updateArticle = async (id: number, articleData: Partial<Article>, token: string): Promise<Article> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '更新文章失败');
    }

    return res.json();
  } catch (error) {
    console.error('更新文章错误:', error);
    throw error;
  }
};

// 删除文章
export const deleteArticle = async (id: number, token: string): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '删除文章失败');
    }
  } catch (error) {
    console.error('删除文章错误:', error);
    throw error;
  }
};

// 发布文章
export const publishArticle = async (id: number, token: string): Promise<Article> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '发布文章失败');
    }

    return res.json();
  } catch (error) {
    console.error('发布文章错误:', error);
    throw error;
  }
};

// 取消发布文章
export const unpublishArticle = async (id: number, token: string): Promise<Article> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${id}/unpublish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '取消发布文章失败');
    }

    return res.json();
  } catch (error) {
    console.error('取消发布文章错误:', error);
    throw error;
  }
};

// 搜索文章
export const searchArticles = async (keyword: string, page: number = 1, limit: number = 10): Promise<[Article[], number]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/search/${keyword}?page=${page}&limit=${limit}`);

    if (!res.ok) {
      throw new Error('搜索文章失败');
    }

    return res.json();
  } catch (error) {
    console.error('搜索文章错误:', error);
    throw error;
  }
};

// 获取所有分类
export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);

    if (!res.ok) {
      throw new Error('获取分类列表失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取分类列表错误:', error);
    throw error;
  }
};

// 获取所有标签
export const getTags = async (): Promise<Tag[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/tags`);

    if (!res.ok) {
      throw new Error('获取标签列表失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取标签列表错误:', error);
    throw error;
  }
};