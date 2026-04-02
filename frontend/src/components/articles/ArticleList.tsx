'use client';

import React from 'react';
import ArticleCard from './ArticleCard';
import { Article } from '@/types';

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
  isError?: boolean;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, isLoading = false, isError = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card-apple p-8 text-center">
        <p className="typography-body text-error">Error loading articles. Please try again later.</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="card-apple p-16 text-center">
        <p className="typography-body text-secondary">No articles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;