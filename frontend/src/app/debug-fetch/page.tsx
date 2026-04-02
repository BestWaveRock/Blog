'use client';

import { useState, useEffect } from 'react';

export default function DebugFetchPage() {
  const [debugInfo, setDebugInfo] = useState({
    loading: false,
    error: null,
    data: null,
    logs: []
  });

  const addLog = (message) => {
    setDebugInfo(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toISOString()}: ${message}`]
    }));
  };

  const testFetch = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true, error: null, data: null, logs: [] }));

    try {
      addLog('Starting fetch request');
      addLog('Fetching from: /api/articles?page=1&limit=10&status=published');

      const response = await fetch('/api/articles?page=1&limit=10&status=published');

      addLog(`Response status: ${response.status}`);
      addLog(`Response OK: ${response.ok}`);
      addLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Error response body: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      addLog(`Content-Type: ${contentType}`);

      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        addLog(`Successfully parsed JSON data. Type: ${Array.isArray(data) ? 'array' : typeof data}`);
        if (Array.isArray(data)) {
          addLog(`Array length: ${data.length}`);
          if (data.length > 0) {
            addLog(`First element type: ${Array.isArray(data[0]) ? 'array' : typeof data[0]}`);
            if (Array.isArray(data[0])) {
              addLog(`First sub-array length: ${data[0].length}`);
            }
          }
        }
      } else {
        const text = await response.text();
        data = text;
        addLog(`Received text data (length: ${text.length})`);
      }

      setDebugInfo(prev => ({ ...prev, loading: false, data, error: null }));
      addLog('Fetch completed successfully');
    } catch (error) {
      addLog(`Fetch failed: ${error.message}`);
      setDebugInfo(prev => ({ ...prev, loading: false, error: error.message, data: null }));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Debug Fetch Test</h1>

      <button
        onClick={testFetch}
        disabled={debugInfo.loading}
        style={{ padding: '10px 20px', margin: '10px 0', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: debugInfo.loading ? 'not-allowed' : 'pointer' }}
      >
        {debugInfo.loading ? 'Loading...' : 'Test API Fetch'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>Debug Information:</h2>

        {debugInfo.error && (
          <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}

        {debugInfo.data && (
          <div style={{ backgroundColor: '#efe', border: '1px solid #cfc', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
            <strong>Data:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(debugInfo.data, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ backgroundColor: '#f5f5f5', border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <strong>Logs:</strong>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
            {debugInfo.logs.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', fontFamily: 'monospace', marginBottom: '2px' }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}