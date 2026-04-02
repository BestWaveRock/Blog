// API服务层
const API_BASE_URL = '/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// 认证相关的API
export const authApi = {
  // 用户登录
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error('登录失败');
    }

    return res.json();
  },

  // 用户注册
  async register(userData: RegisterRequest): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '注册失败');
    }

    return res.json();
  },
};

// 用户相关的API
export const userApi = {
  // 获取当前用户信息
  async getCurrentUser(token: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error('获取用户信息失败');
    }

    return res.json();
  },
};

// 默认导出API基础URL
export default API_BASE_URL;