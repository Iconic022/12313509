import React from 'react';

function UrlResultList({ results }) {
  if (!results.length) return null;

  return (
    <div className="result-list">
      <h2>Shortened URLs</h2>
      {results.map((res, idx) => (
        <div className="result-card" key={idx}>
          <div>
            <strong>Original:</strong> <a href={res.original} target="_blank" rel="noopener noreferrer">{res.original}</a>
          </div>
          <div>
            <strong>Shortened:</strong>{' '}
            {res.short ? (
              <a href={res.short} target="_blank" rel="noopener noreferrer">{res.short}</a>
            ) : (
              <span style={{ color: '#d63031' }}>Error: {res.error}</span>
            )}
          </div>
          <div>
            <strong>Expiry:</strong> {res.expiry}
          </div>
          <div>
            <strong>Shortcode:</strong> {res.shortcode}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UrlResultList;