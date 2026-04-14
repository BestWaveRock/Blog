// 反应相关的API服务
const API_BASE_URL = '/api';

// 创建或更新反应
export const createOrUpdateReaction = async (articleId: number, type: 'like' | 'dislike', token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ articleId, type }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '反应操作失败');
    }

    return res.json();
  } catch (error) {
    console.error('反应操作错误:', error);
    throw error;
  }
};

// 删除反应
export const removeReaction = async (articleId: number, token: string): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reactions/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '删除反应失败');
    }
  } catch (error) {
    console.error('删除反应错误:', error);
    throw error;
  }
};

// 获取文章的反应统计
export const getArticleReactions = async (articleId: number, token?: string): Promise<{ likes: number; dislikes: number }> => {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/reactions/article/${articleId}`, {
      headers,
    });

    if (!res.ok) {
      throw new Error('获取反应统计失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取反应统计错误:', error);
    // 如果发生错误，返回默认值
    return { likes: 0, dislikes: 0 };
  }
};

// 获取用户对文章的反应
export const getUserReaction = async (articleId: number, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reactions/user/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // 如果没有找到反应，返回null
      if (res.status === 404) {
        return null;
      }
      const errorData = await res.json();
      throw new Error(errorData.message || '获取用户反应失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取用户反应错误:', error);
    throw error;
  }
};

// 切换反应
export const toggleReaction = async (articleId: number, type: 'like' | 'dislike', token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reactions/toggle/${articleId}/${type}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '切换反应失败');
    }

    return res.json();
  } catch (error) {
    console.error('切换反应错误:', error);
    throw error;
  }
};