'use client';

import { useState, useEffect } from 'react';

interface RawDataStructure {
  isArray: boolean;
  length: number | string;
  firstElement: string;
  secondElement: string;
}

interface ArticlesArrayStructure {
  isArray: boolean;
  length: number | string;
  sampleItemKeys: string[] | string;
}

interface TestResult {
  rawDataStructure?: RawDataStructure;
  articlesArray?: ArticlesArrayStructure;
  totalCount?: number;
  error?: string;
}

export default function TestArticleStructure() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);

  const testStructure = async () => {
    setLoading(true);
    try {
      // Fetch raw data
      const response = await fetch('/api/articles?page=1&limit=10&status=published');
      const rawData = await response.json();

      // Check structure
      const articlesArray = rawData[0];
      const totalCount = rawData[1];

      setResult({
        rawDataStructure: {
          isArray: Array.isArray(rawData),
          length: Array.isArray(rawData) ? rawData.length : 'N/A',
          firstElement: Array.isArray(rawData) ?
            (Array.isArray(rawData[0]) ? 'Array' : typeof rawData[0]) : 'N/A',
          secondElement: Array.isArray(rawData) && rawData.length > 1 ?
            typeof rawData[1] : 'N/A'
        },
        articlesArray: {
          isArray: Array.isArray(articlesArray),
          length: Array.isArray(articlesArray) ? articlesArray.length : 'N/A',
          sampleItemKeys: Array.isArray(articlesArray) && articlesArray.length > 0 ?
            Object.keys(articlesArray[0]) : 'N/A'
        },
        totalCount: totalCount
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Test Article Data Structure</h1>

      <button
        onClick={testStructure}
        disabled={loading}
        style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Loading...' : 'Test Structure'}
      </button>

      {result && (
        <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <strong>Result:</strong>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}