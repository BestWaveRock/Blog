'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { userApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 页面加载时检查本地存储中的token
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // 获取用户信息
      fetchCurrentUser(storedToken);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const userData = await userApi.getCurrentUser(authToken);
      setUser(userData);
    } catch (error) {
      // 如果获取用户信息失败，清除token
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    // 获取用户信息
    fetchCurrentUser(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}