'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile } from '@/services/users.service';

export default function ProfilePage() {
  const { isAuthenticated, user, token, logout } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // 如果用户未认证，重定向到登录页面
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // 获取用户资料
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const userProfile = await getUserProfile(token!);
        setUsername(userProfile.username);
        setEmail(userProfile.email);
      } catch (err) {
        console.error('获取用户资料失败:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, router, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // 更新用户资料
      await updateUserProfile({ username, email }, token!);

      setSuccess('User profile updated successfully');

      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('更新用户资料失败:', err);
      setError('Failed to update user profile, please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navigation />

        <main className="flex-grow max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <Navigation currentPage="profile" />

      {/* 主要内容 */}
      <main className="flex-grow max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              User Profile
            </h1>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-3 bg-green-50 text-green-700 rounded dark:bg-green-900 dark:text-green-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 用户名 */}
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter username"
                />
              </div>

              {/* 邮箱 */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-between items-center">
                <div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}