'use client';

import { useState } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';

export default function TestArticleCard() {
  const [showCard, setShowCard] = useState(false);

  const testArticle = {
    id: 1,
    title: 'Test Article',
    summary: 'This is a test article summary',
    content: 'This is the content of the test article.',
    status: 'published',
    createdAt: '2026-04-02T10:00:00.000Z',
    updatedAt: '2026-04-02T10:00:00.000Z',
    author: {
      username: 'Test User'
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Article Card</h1>

      <button
        onClick={() => setShowCard(!showCard)}
        style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {showCard ? 'Hide' : 'Show'} Article Card
      </button>

      {showCard && (
        <div style={{ marginTop: '20px' }}>
          <ArticleCard article={testArticle} />
        </div>
      )}
    </div>
  );
}