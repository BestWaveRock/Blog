'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting fetch request to /api/articles');

      // First try direct fetch
      const response = await fetch('http://localhost:3000/api/articles');
      console.log('Direct fetch response:', response.status, response.headers);

      if (!response.ok) {
        throw new Error(`Direct fetch failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Direct fetch data:', data);
      setResult({ type: 'direct', data });
    } catch (err) {
      console.error('Direct fetch error:', err);
      setError(`Direct fetch error: ${err.message}`);

      try {
        // Try relative path
        console.log('Trying relative path fetch');
        const response2 = await fetch('/api/articles');
        console.log('Relative fetch response:', response2.status, response2.headers);

        if (!response2.ok) {
          throw new Error(`Relative fetch failed: ${response2.status}`);
        }

        const data2 = await response2.json();
        console.log('Relative fetch data:', data2);
        setResult({ type: 'relative', data: data2 });
      } catch (err2) {
        console.error('Relative fetch error:', err2);
        setError(prev => `${prev} | Relative fetch error: ${err2.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug API Fetch</h1>

      <button
        onClick={testFetch}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Loading...' : 'Test API Fetch'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Success:</strong>
          <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}