'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="card-apple apple-scale-in">
      <div className="p-6">
        <Link href={`/articles/${article.id}`} className="block">
          <h2 className="typography-heading-3 text-foreground mb-3 hover:text-accent transition-colors">
            {article.title}
          </h2>
        </Link>

        {article.summary && (
          <p className="typography-body text-secondary mb-5 line-clamp-2">
            {article.summary}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-surface border border-border rounded-full w-10 h-10" />
            </div>
            <div className="ml-3">
              <p className="typography-body-small font-medium text-foreground">
                {article.author?.username || 'Anonymous User'}
              </p>
              <p className="typography-caption text-secondary">
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full typography-caption font-medium bg-surface text-foreground">
              {article.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;