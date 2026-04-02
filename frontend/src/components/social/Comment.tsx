'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCommentReplies } from '@/services/comment.service';
import { Comment as CommentType } from '@/types';

interface CommentProps {
  comment: CommentType;
  onReplySubmit?: (parentId: number, content: string) => void;
  onCommentUpdate?: (commentId: number, content: string) => void;
  onCommentDelete?: (commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, onReplySubmit, onCommentUpdate, onCommentDelete }) => {
  const { isAuthenticated, user, token } = useAuth();
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取回复
  const fetchReplies = async () => {
    try {
      setLoadingReplies(true);
      const repliesData = await getCommentReplies(comment.id);
      setReplies(repliesData);
    } catch (err) {
      console.error('获取回复失败:', err);
      setError('回复加载失败');
    } finally {
      setLoadingReplies(false);
    }
  };

  // 切换回复显示
  const toggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  // 处理回复提交
  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      setError('请登录后回复');
      return;
    }

    if (!replyContent.trim()) {
      setError('请输入回复内容');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (onReplySubmit) {
        onReplySubmit(comment.id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);

        // 重新获取回复
        await fetchReplies();
      }
    } catch (err) {
      console.error('回复提交失败:', err);
      setError('回复提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理评论更新
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editContent.trim()) {
      setError('请输入评论内容');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (onCommentUpdate) {
        onCommentUpdate(comment.id, editContent);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('评论更新失败:', err);
      setError('评论更新失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理评论删除
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onCommentDelete) {
        onCommentDelete(comment.id);
      }
    }
  };

  // 检查是否是评论作者
  const isAuthor = isAuthenticated && user && comment.author && typeof comment.author === 'object' && user.id === comment.author.id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
      {/* 评论头部 */}
      <div className="flex items-center mb-2">
        <div className="flex-shrink-0">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {comment.author?.username || '未知用户'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* 评论内容 */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <div className="mt-2 flex space-x-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {submitting ? '更新中...' : '更新'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
          {comment.content}
        </p>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleReplies}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
        >
          {showReplies ? '隐藏回复' : `查看回复 (${replies.length})`}
        </button>

        {isAuthenticated && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            回复
          </button>
        )}

        {isAuthor && !isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              编辑
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-700 focus:outline-none"
            >
              删除
            </button>
          </>
        )}
      </div>

      {/* 回复表单 */}
      {showReplyForm && isAuthenticated && (
        <form onSubmit={handleReplySubmit} className="mt-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="请输入您的回复..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            rows={2}
          />
          <div className="mt-2 flex space-x-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {submitting ? '提交中...' : '提交'}
            </button>
            <button
              type="button"
              onClick={() => setShowReplyForm(false)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 回复列表 */}
      {showReplies && (
        <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
          {loadingReplies ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-600"></div>
              <span className="text-gray-500 dark:text-gray-400">Loading replies...</span>
            </div>
          ) : replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  onReplySubmit={onReplySubmit}
                  onCommentUpdate={onCommentUpdate}
                  onCommentDelete={onCommentDelete}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">暂无回复</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;