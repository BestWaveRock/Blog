'use client';

import React from 'react';
import ArticleList from './ArticleList';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import { Article } from '@/types';

interface ArticleListWithStatusProps {
  articles: Article[];
  loading: boolean;
  error: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

const ArticleListWithStatus: React.FC<ArticleListWithStatusProps> = ({
  articles,
  loading,
  error,
  errorMessage = 'Error loading articles',
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <ArticleList articles={articles} />
  );
};

export default ArticleListWithStatus;