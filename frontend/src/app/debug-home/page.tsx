'use client';

import { useState, useEffect } from 'react';
import ArticleList from '@/components/articles/ArticleList';
import { getArticles } from '@/services/articles.service';
import { Article } from '@/types';

export default function DebugHomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('useEffect triggered');
    const fetchArticles = async () => {
      try {
        addLog('Starting to fetch articles');
        setLoading(true);
        setError(false);

        const [articlesData, totalCount] = await getArticles(1, 10, 'published');

        addLog(`Fetched ${articlesData.length} articles, total count: ${totalCount}`);
        addLog(`First article title: ${articlesData[0]?.title || 'None'}`);

        setArticles(articlesData);
        setError(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        addLog(`Failed to fetch articles: ${errorMessage}`);
        console.error('Failed to fetch articles:', err);
        setError(true);
      } finally {
        addLog('Setting loading to false');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Log state changes
  useEffect(() => {
    addLog(`Articles state updated: ${articles.length} items`);
  }, [articles]);

  useEffect(() => {
    addLog(`Loading state updated: ${loading}`);
  }, [loading]);

  useEffect(() => {
    addLog(`Error state updated: ${error}`);
  }, [error]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Debug Home Page</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>State:</h2>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error.toString()}</p>
        <p>Articles count: {articles.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Articles Data:</h2>
        {articles.length > 0 ? (
          <div>
            {articles.map((article, index) => (
              <div key={article.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <h3>Article {index + 1}: {article.title}</h3>
                <p>Summary: {article.summary}</p>
                <p>Status: {article.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No articles to display</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>ArticleList Component:</h2>
        <ArticleList articles={articles} isLoading={loading} isError={error} />
      </div>

      <div>
        <h2>Debug Logs:</h2>
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}