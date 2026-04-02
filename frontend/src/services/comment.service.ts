// 评论相关的API服务
const API_BASE_URL = '/api';

// 创建评论
export const createComment = async (articleId: number, content: string, parentId: number | null, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ articleId, content, parentId }),
    });

    if (!res.ok) {
      const errorData = await res?.json();
      throw new Error(errorData?.message || '创建评论失败');
    }

    return res.json();
  } catch (error) {
    console.error('创建评论错误:', error);
    throw error;
  }
};

// 获取文章的所有顶级评论
export const getArticleComments = async (articleId: number, token?: string): Promise<any[]> => {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/comments/article/${articleId}`, {
      headers,
    });

    if (!res.ok) {
      throw new Error('获取评论失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取评论错误:', error);
    throw error;
  }
};

// 获取评论的回复
export const getCommentReplies = async (commentId: number): Promise<any[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/comments/replies/${commentId}`);

    if (!res.ok) {
      throw new Error('获取回复失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取回复错误:', error);
    throw error;
  }
};

// 更新评论
export const updateComment = async (commentId: number, content: string, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '更新评论失败');
    }

    return res.json();
  } catch (error) {
    console.error('更新评论错误:', error);
    throw error;
  }
};

// 删除评论
export const deleteComment = async (commentId: number, token: string): Promise<void> => {
  try {
    const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '删除评论失败');
    }
  } catch (error) {
    console.error('删除评论错误:', error);
    throw error;
  }
};