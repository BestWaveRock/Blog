'use client';

import { useState, useEffect } from 'react';
import { getArticles } from '@/services/articles.service';

interface TestResult {
  type: string;
  data: {
    isArray: boolean;
    length: number | string;
    firstElement: any;
    secondElement: any;
  };
}

export default function TestGetArticles() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFunction = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Calling getArticles function...');
      const data = await getArticles(1, 10, 'published');
      console.log('getArticles returned:', data);

      setResult({
        type: 'success',
        data: {
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'N/A',
          firstElement: Array.isArray(data) ? data[0] : 'N/A',
          secondElement: Array.isArray(data) && data.length > 1 ? data[1] : 'N/A'
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('getArticles error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Test getArticles Function</h1>

      <button
        onClick={testFunction}
        disabled={loading}
        style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Loading...' : 'Test getArticles'}
      </button>

      {error && (
        <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ backgroundColor: '#efe', border: '1px solid #cfc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <strong>Result:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}