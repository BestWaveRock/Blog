'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createBookmark, removeBookmark, isArticleBookmarked } from '@/services/bookmark.service';

interface BookmarkProps {
  articleId: number;
}

const Bookmark: React.FC<BookmarkProps> = ({ articleId }) => {
  const { isAuthenticated, token } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取收藏状态
  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isAuthenticated && token) {
          const bookmarked = await isArticleBookmarked(articleId, token);
          setIsBookmarked(bookmarked);
        }
      } catch (err) {
        console.error('获取收藏状态失败:', err);
        setError('收藏状态加载失败');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchBookmarkStatus();
    }
  }, [articleId, isAuthenticated, token]);

  // 处理收藏切换
  const handleToggleBookmark = async () => {
    if (!isAuthenticated || !token) {
      setError('请登录后收藏');
      return;
    }

    try {
      setToggling(true);
      setError(null);

      if (isBookmarked) {
        // 取消收藏
        await removeBookmark(articleId, token);
        setIsBookmarked(false);
      } else {
        // 添加收藏
        await createBookmark(articleId, token);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('收藏操作失败:', err);
      setError('收藏操作失败，请重试');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="text-gray-500 dark:text-gray-400">正在加载收藏状态...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Bookmark</h3>

      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleToggleBookmark}
        disabled={!isAuthenticated || toggling}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isBookmarked
            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 focus:ring-indigo-500 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        } ${(!isAuthenticated || toggling) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {toggling ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></div>
            <span>处理中...</span>
          </>
        ) : (
          <>
            <svg
              className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`}
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
            <span>{isBookmarked ? '已收藏' : '收藏'}</span>
          </>
        )}
      </button>

      {!isAuthenticated && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          请登录后收藏
        </p>
      )}
    </div>
  );
};

export default Bookmark;