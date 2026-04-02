'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import ArticleListWithStatus from '@/components/articles/ArticleListWithStatus';
import { getArticles } from '@/services/articles.service';
import { Article } from '@/types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(false);
        const [articlesData, totalCount] = await getArticles(page, 10, 'published');
        setArticles(articlesData);
        setTotalPages(Math.ceil(totalCount / 10));
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleRetry = () => {
    // 重新获取当前页的文章
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(false);
        const [articlesData, totalCount] = await getArticles(page, 10, 'published');
        setArticles(articlesData);
        setTotalPages(Math.ceil(totalCount / 10));
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <Navigation currentPage="articles" />

      {/* 主要内容 */}
      <main>
        <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-16 text-center">
              <h1 className="typography-heading-1 text-foreground mb-4 apple-fade-in">All Articles</h1>
              <p className="typography-body-large text-secondary max-w-2xl mx-auto apple-fade-in">
                Browse all blog articles
              </p>
            </div>

            <ArticleListWithStatus
              articles={articles}
              loading={loading}
              error={error}
              errorMessage="Error loading articles. Please try again."
              onRetry={handleRetry}
            />

            {/* 分页控件 */}
            {!loading && !error && articles.length > 0 && (
              <div className="mt-16 flex items-center justify-between border-t border-border px-4 py-6 sm:px-0">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="typography-body text-secondary">
                      Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-2xl shadow-sm" aria-label="Pagination">
                      <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className={`relative inline-flex items-center rounded-l-2xl px-4 py-2 typography-body font-medium ring-1 ring-inset ring-border hover:bg-surface focus:z-20 focus:outline-offset-0 ${
                          page === 1 ? 'cursor-not-allowed opacity-50 text-secondary' : 'text-foreground hover:text-accent'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        Previous
                      </button>

                      {/* 页码按钮 */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 typography-body font-medium ring-1 ring-inset ring-border focus:z-20 focus:outline-offset-0 ${
                              pageNum === page
                                ? 'z-10 bg-accent text-white'
                                : 'text-foreground hover:bg-surface'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`relative inline-flex items-center rounded-r-2xl px-4 py-2 typography-body font-medium ring-1 ring-inset ring-border hover:bg-surface focus:z-20 focus:outline-offset-0 ${
                          page === totalPages ? 'cursor-not-allowed opacity-50 text-secondary' : 'text-foreground hover:text-accent'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}