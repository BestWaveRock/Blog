'use client';

import { useState, useEffect } from 'react';
import ArticleList from '@/components/articles/ArticleList';

export default function FinalTestPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(false);

        // Direct API call to test
        const response = await fetch('/api/articles?page=1&limit=10&status=published');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const [articlesData, totalCount] = await response.json();
        console.log('Articles data:', articlesData);
        console.log('Total count:', totalCount);

        setArticles(articlesData);
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Final Test Page</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Status</h2>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error.toString()}</p>
        <p>Articles count: {articles.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>ArticleList Component</h2>
        <ArticleList articles={articles} isLoading={loading} isError={error} />
      </div>

      <div>
        <h2>Raw Data</h2>
        <pre>{JSON.stringify(articles, null, 2)}</pre>
      </div>
    </div>
  );
}