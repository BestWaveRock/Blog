'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Comment from './Comment';
import { getArticleComments, createComment } from '@/services/comment.service';
import { Comment as CommentType } from '@/types';

interface CommentListProps {
  articleId: number;
}

const CommentList: React.FC<CommentListProps> = ({ articleId }) => {
  const { isAuthenticated, token } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 获取评论
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const commentsData = await getArticleComments(articleId, token || undefined);
        setComments(commentsData);
      } catch (err) {
        console.error('获取评论失败:', err);
        setError('评论加载失败');
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchComments();
    }
  }, [articleId, token]);

  // 处理新评论提交
  const handleNewCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      setError('请登录后评论');
      return;
    }

    if (!newComment.trim()) {
      setError('请输入评论内容');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const commentData = await createComment(articleId, newComment, null, token);
      setComments([commentData, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('评论提交失败:', err);
      setError('评论提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理回复提交
  const handleReplySubmit = async (parentId: number, content: string) => {
    if (!isAuthenticated || !token) {
      setError('Please log in to reply');
      return;
    }

    if (!content.trim()) {
      setError('Please enter reply content');
      return;
    }

    try {
      const commentData = await createComment(articleId, content, parentId, token);
      // 这里我们简单地重新获取所有评论来更新UI
      const commentsData = await getArticleComments(articleId, token || undefined);
      setComments(commentsData);
    } catch (err) {
      console.error('回复提交失败:', err);
      setError('Reply submission failed, please try again');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Comments</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* 新评论表单 */}
      {isAuthenticated ? (
        <form onSubmit={handleNewCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="分享您的评论..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <div className="mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {submitting ? '提交中...' : '发表评论'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md text-center">
          <p className="text-gray-700 dark:text-gray-300">
            请登录后评论
          </p>
        </div>
      )}

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReplySubmit={handleReplySubmit}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">暂无评论，快来发表第一条评论吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;