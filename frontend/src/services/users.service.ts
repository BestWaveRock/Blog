// 用户相关的API服务
const API_BASE_URL = '/api';

// 获取用户资料
export const getUserProfile = async (token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('获取用户资料失败');
    }

    return res.json();
  } catch (error) {
    console.error('获取用户资料错误:', error);
    throw error;
  }
};

// 更新用户资料
export const updateUserProfile = async (userData: { username: string; email: string }, token: string): Promise<any> => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '更新用户资料失败');
    }

    return res.json();
  } catch (error) {
    console.error('更新用户资料错误:', error);
    throw error;
  }
};