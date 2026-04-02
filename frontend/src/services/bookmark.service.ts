// 收藏相关的API服务
const API_BASE_URL = '/api';

// 创建收藏
export const createBookmark = async (articleId: number, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ articleId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '收藏失败');
    }

    return res.json();
  } catch (error) {
    console.error('收藏错误:', error);
    throw error;
  }
};

// 取消收藏
export const removeBookmark = async (articleId: number, token: string): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/bookmarks/${articleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '取消收藏失败');
    }
  } catch (error) {
    console.error('取消收藏错误:', error);
    throw error;
  }
};

// 检查文章是否已收藏
export const isArticleBookmarked = async (articleId: number, token: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/bookmarks/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      // 如果没有找到收藏，返回false
      if (res.status === 404) {
        return false;
      }
      const errorData = await res.json();
      throw new Error(errorData.message || '检查收藏状态失败');
    }

    const data = await res.json();
    return data === true;
  } catch (error) {
    console.error('检查收藏状态错误:', error);
    throw error;
  }
};