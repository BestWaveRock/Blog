'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createOrUpdateRating, getUserRatingForArticle, getArticleAverageRating } from '@/services/rating.service';

interface RatingProps {
  articleId: number;
}

const Rating: React.FC<RatingProps> = ({ articleId }) => {
  const { isAuthenticated, token } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取评分数据
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        setError(null);

        // 获取文章平均评分，传递认证令牌（如果有的话）
        const avgRating = await getArticleAverageRating(articleId, token || undefined);
        setAverageRating(avgRating);

        // 如果用户已认证，获取用户评分
        if (isAuthenticated && token) {
          const userRatingData = await getUserRatingForArticle(articleId, token);
          if (userRatingData) {
            setUserRating(userRatingData.score);
          }
        }
      } catch (err) {
        console.error('获取评分数据失败:', err);
        setError('评分数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchRatings();
    }
  }, [articleId, isAuthenticated, token]);

  // 处理评分提交
  const handleRatingSubmit = async (score: number) => {
    if (!isAuthenticated || !token) {
      setError('请登录后评分');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // 提交评分
      await createOrUpdateRating(articleId, score, token);

      // 更新用户评分
      setUserRating(score);

      // 重新获取平均评分
      const avgRating = await getArticleAverageRating(articleId, token || undefined);
      setAverageRating(avgRating);
    } catch (err) {
      console.error('评分提交失败:', err);
      setError('评分提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="text-gray-500 dark:text-gray-400">正在加载评分...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Rating</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingSubmit(star)}
              disabled={!isAuthenticated || submitting}
              className={`text-2xl focus:outline-none ${
                star <= (userRating || 0)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } ${(!isAuthenticated || submitting) ? 'cursor-not-allowed' : 'cursor-pointer hover:text-yellow-300'}`}
              aria-label={`Rate ${star} stars`}
            >
              {star <= (userRating || 0) ? '★' : '☆'}
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <span className="text-gray-900 dark:text-white font-medium">
            {averageRating !== null ? averageRating.toFixed(1) : '-'}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-1">
            ({userRating !== null ? `您的评分: ${userRating}` : '尚未评分'})
          </span>
        </div>
      </div>

      {!isAuthenticated && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          请登录后评分
        </p>
      )}
    </div>
  );
};

export default Rating;