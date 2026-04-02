// 评分相关的API服务
const API_BASE_URL = '/api';

// 创建或更新评分
export const createOrUpdateRating = async (articleId: number, score: number, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ articleId, score }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '评分失败');
    }

    return res.json();
  } catch (error) {
    console.error('评分错误:', error);
    throw error;
  }
};

// 获取文章的平均评分
export const getArticleAverageRating = async (articleId: number, token?: string): Promise<number> => {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/ratings/article/${articleId}`, {
      headers,
    });

    if (!res.ok) {
      throw new Error('获取评分失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取评分错误:', error);
    throw error;
  }
};

// 获取用户对特定文章的评分
export const getUserRatingForArticle = async (articleId: number, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/ratings/user/article/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // 如果没有找到评分，返回null
      if (res.status === 404) {
        return null;
      }
      const errorData = await res.json();
      throw new Error(errorData.message || '获取用户评分失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取用户评分错误:', error);
    throw error;
  }
};