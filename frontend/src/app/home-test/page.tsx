'use client';

import { useState, useEffect } from 'react';

export default function HomePageTest() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const logEntry = `${new Date().toISOString()}: ${message}`;
    setLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  useEffect(() => {
    addLog('useEffect triggered');
    const fetchArticles = async () => {
      try {
        addLog('Starting to fetch articles');
        setLoading(true);
        setError(false);

        // Direct fetch to API
        addLog('Making direct fetch to /api/articles');
        const response = await fetch('/api/articles?page=1&limit=10&status=published');
        addLog(`Response status: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        addLog(`Data received: ${Array.isArray(data) ? data.length : typeof data} items`);

        if (Array.isArray(data) && data.length > 0) {
          addLog(`First element: ${Array.isArray(data[0]) ? data[0].length : 'not array'} items`);
          setArticles(data[0]); // Assuming the first element is the articles array
        }

        setError(false);
      } catch (err) {
        addLog(`Failed to fetch articles: ${err.message}`);
        console.error('Failed to fetch articles:', err);
        setError(true);
      } finally {
        addLog('Setting loading to false');
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Home Page Test</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Status:</h2>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error.toString()}</p>
        <p>Articles count: {articles.length}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Articles:</h2>
        {loading ? (
          <p>Loading articles...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Error loading articles</p>
        ) : articles.length > 0 ? (
          <div>
            {articles.map((article) => (
              <div key={article.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No articles found</p>
        )}
      </div>

      <div>
        <h2>Logs:</h2>
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}