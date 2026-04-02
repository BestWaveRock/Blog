'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import ArticleList from '@/components/articles/ArticleList';
import { getArticles } from '@/services/articles.service';
import { Article } from '@/types';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const [articlesData, totalCount] = await getArticles(1, 10, 'published');
        setArticles(articlesData);
        setError(false);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <Navigation currentPage="home" />

      {/* 主要内容 */}
      <main>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-16 text-center">
              <h1 className="typography-hero mb-6 apple-fade-in">Welcome to Our Blog</h1>
              <p className="typography-body-large text-secondary max-w-2xl mx-auto apple-fade-in">
                Discover insightful articles, tutorials, and stories from our community of writers and experts.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="typography-heading-2 mb-6 text-center">Latest Articles</h2>
              <ArticleList articles={articles} isLoading={loading} isError={error} />
            </div>

            <div className="mt-16 text-center apple-fade-in">
              <Link href="/articles" className="btn-apple-primary">
                View All Articles
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}