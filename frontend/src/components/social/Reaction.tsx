'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createOrUpdateReaction, removeReaction, getArticleReactions, getUserReaction } from '@/services/reaction.service';

interface ReactionProps {
  articleId: number;
}

const Reaction: React.FC<ReactionProps> = ({ articleId }) => {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [reactions, setReactions] = useState<{ likes: number; dislikes: number }>({ likes: 0, dislikes: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取反应数据
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取文章反应统计，传递认证令牌（如果有的话）
        const reactionsData = await getArticleReactions(articleId, token || undefined);
        setReactions(reactionsData);

        // 如果用户已认证，获取用户反应
        if (isAuthenticated && token) {
          const userReactionData = await getUserReaction(articleId, token);
          if (userReactionData) {
            setUserReaction(userReactionData.type);
          }
        }
      } catch (err) {
        console.error('获取反应数据失败:', err);
        setError('反应数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchReactions();
    }
  }, [articleId, isAuthenticated, token]);

  // 处理点赞
  const handleLike = async () => {
    if (!isAuthenticated || !token) {
      // 跳转到登录页面
      router.push('/auth/login');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      // 如果用户已经点赞，则取消点赞
      if (userReaction === 'like') {
        await removeReaction(articleId, token);
        setUserReaction(null);
        setReactions(prev => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        // 如果用户已经点踩，则先取消点踩再点赞
        if (userReaction === 'dislike') {
          setReactions(prev => ({ ...prev, dislikes: prev.dislikes - 1 }));
        }
        await createOrUpdateReaction(articleId, 'like', token);
        setUserReaction('like');
        setReactions(prev => ({ ...prev, likes: prev.likes + 1 }));
      }
    } catch (err) {
      console.error('点赞操作失败:', err);
      setError('点赞操作失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  // 处理点踩
  const handleDislike = async () => {
    if (!isAuthenticated || !token) {
      // 跳转到登录页面
      router.push('/auth/login');
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      // 如果用户已经点踩，则取消点踩
      if (userReaction === 'dislike') {
        await removeReaction(articleId, token);
        setUserReaction(null);
        setReactions(prev => ({ ...prev, dislikes: prev.dislikes - 1 }));
      } else {
        // 如果用户已经点赞，则先取消点赞再点踩
        if (userReaction === 'like') {
          setReactions(prev => ({ ...prev, likes: prev.likes - 1 }));
        }
        await createOrUpdateReaction(articleId, 'dislike', token);
        setUserReaction('dislike');
        setReactions(prev => ({ ...prev, dislikes: prev.dislikes + 1 }));
      }
    } catch (err) {
      console.error('点踩操作失败:', err);
      setError('点踩操作失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="text-gray-500 dark:text-gray-400">正在加载反应数据...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Reactions</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || updating}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            userReaction === 'like'
              ? 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } ${(!isAuthenticated || updating) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg
            className={`h-5 w-5 ${userReaction === 'like' ? 'fill-current' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2c-1.716 0-3.408.115-5.07.33C3.207 2.55 1.907 3.977 1.907 5.74v.567c0 1.713.76 3.366 2.097 4.517C5.406 12.027 7.6 13 10 13s4.594-.973 5.997-2.176A6.507 6.507 0 0018 6.307v-.567c0-1.763-1.3-3.19-3.023-3.41-.162-.02-.326-.03-.49-.03zM4.907 7.5V6.307c0-.512.348-.975.87-1.14.162-.05.326-.09.49-.117.704-.114 1.41-.17 2.116-.17s1.412.056 2.116.17c.164.026.328.066.49.117.522.165.87.628.87 1.14V7.5c0 .512-.348.975-.87 1.14-.162.05-.326.09-.49.117-.704.114-1.41.17-2.116.17s-1.412-.056-2.116-.17c-.164-.026-.328-.066-.49-.117-.522-.165-.87-.628-.87-1.14z"
              clipRule="evenodd"
            />
          </svg>
          <span>{reactions.likes}</span>
        </button>

        <button
          onClick={handleDislike}
          disabled={!isAuthenticated || updating}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            userReaction === 'dislike'
              ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          } ${(!isAuthenticated || updating) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg
            className={`h-5 w-5 ${userReaction === 'dislike' ? 'fill-current' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18c1.716 0 3.408-.115 5.07-.33 1.723-.22 3.023-1.647 3.023-3.41v-.567c0-1.713-.76-3.366-2.097-4.517C14.594 7.973 12.4 7 10 7s-4.594.973-5.997 2.176A6.507 6.507 0 002 13.693v.567c0 1.763 1.3 3.19 3.023 3.41.162.02.326.03.49.03z"
              clipRule="evenodd"
            />
          </svg>
          <span>{reactions.dislikes}</span>
        </button>
      </div>

      {!isAuthenticated && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          请 <button onClick={() => router.push('/auth/login')} className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer">登录</button> 后进行反应操作
        </p>
      )}
    </div>
  );
};

export default Reaction;