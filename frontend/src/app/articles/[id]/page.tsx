'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Rating from '@/components/social/Rating';
import Bookmark from '@/components/social/Bookmark';
import Reaction from '@/components/social/Reaction';
import CommentList from '@/components/social/CommentList';
import { useRouter } from 'next/navigation';
import { getArticleById } from '@/services/articles.service';
import { Article } from '@/types';

import EditorJSRenderer from '@/components/articles/EditorJSRenderer';

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    // 解析params Promise
    params.then(resolved => {
      setResolvedParams(resolved);
    }).catch(err => {
      console.error('Failed to resolve params:', err);
      setError(true);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      console.log('fetchArticle called with resolvedParams:', resolvedParams);
      if (!resolvedParams?.id) {
        console.log('No resolvedParams.id, returning early');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching article with ID:', Number(resolvedParams.id));
        const articleData = await getArticleById(Number(resolvedParams.id));
        console.log('Article data received:', articleData);
        console.log('Article content type:', typeof articleData.content);
        console.log('Article content value:', articleData.content);

        // 确保 content 字段是字符串
        if (typeof articleData.content === 'object' && articleData.content !== null) {
          console.log('Content is an object, converting to string');
          // Convert object to string
          articleData.content = JSON.stringify(articleData.content);
          console.log('After conversion - content type:', typeof articleData.content);
          console.log('After conversion - content value:', articleData.content);
        } else if (typeof articleData.content === 'string') {
          console.log('Content is already a string');
        } else {
          console.log('Content is of type:', typeof articleData.content);
          articleData.content = String(articleData.content);
          console.log('After conversion to string - content type:', typeof articleData.content);
          console.log('After conversion to string - content value:', articleData.content);
        }

        // 再次确认 content 类型
        console.log('Final content type before setting state:', typeof articleData.content);
        setArticle(articleData);
        setError(false);
      } catch (err) {
        console.error('获取文章失败:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-grow max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />

        <main className="flex-grow max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="card-apple p-6 text-center">
            <p className="typography-body text-error">Error loading article. Please try again later.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 btn-apple-primary"
            >
              Go Back
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 导航栏 */}
      <Navigation />

      {/* 主要内容 */}
      <main className="flex-grow max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <article className="card-apple overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="typography-heading-1 text-foreground mb-6">
              {article.title}
            </h1>

            <div className="flex items-center mb-8">
              <div className="flex-shrink-0">
                <div className="bg-surface border border-border rounded-full w-12 h-12" />
              </div>
              <div className="ml-4">
                <p className="typography-body font-medium text-foreground">
                  {article.author?.username || 'Anonymous User'}
                </p>
                <div className="flex typography-caption text-secondary">
                  <time dateTime={article.createdAt}>
                    {new Date(article.createdAt).toLocaleString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }).replace(/\//g, '/')}
                  </time>
                  <span className="mx-2">·</span>
                  <span>{typeof article.content === 'string' ? Math.ceil(article.content.length / 500) : typeof article.content === 'object' ? Math.ceil(JSON.stringify(article.content).length / 500) : 0} min read</span>
                </div>
              </div>
            </div>

            {article.summary && (
              <div className="mb-8 p-6 bg-surface rounded-2xl">
                <p className="typography-body text-secondary">
                  {article.summary}
                </p>
              </div>
            )}

            <div className="mt-8">
              {article.content ? (
                <EditorJSRenderer content={typeof article.content === 'object' ? JSON.stringify(article.content) : article.content} />
              ) : (
                <div>Content not available</div>
              )}
            </div>
          </div>
        </article>

        {/* 社交互动功能区域 */}
        <div className="mt-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Rating articleId={article.id} />
            <Bookmark articleId={article.id} />
            <Reaction articleId={article.id} />
          </div>

          <CommentList articleId={article.id} />
        </div>
      </main>

      {/* 页脚 */}
      <Footer />
    </div>
  );
}