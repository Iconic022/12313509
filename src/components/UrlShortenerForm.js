import React, { useState } from 'react';
import axios from 'axios';

const MAX_URLS = 5;

const initialRows = Array.from({ length: MAX_URLS }, () => ({
  url: '',
  validity: '',
  shortcode: '',
  error: ''
}));

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function UrlShortenerForm({ setResults }) {
  const [rows, setRows] = useState(initialRows);
  const [loading, setLoading] = useState(false);

  const handleChange = (idx, field, value) => {
    const updated = rows.map((row, i) =>
      i === idx ? { ...row, [field]: value, error: '' } : row
    );
    setRows(updated);
  };

  const validate = () => {
    let valid = true;
    const updated = rows.map(row => {
      let error = '';
      if (row.url.trim()) {
        if (!isValidUrl(row.url.trim())) {
          error = 'Invalid URL format.';
          valid = false;
        } else if (row.validity && (!/^\d+$/.test(row.validity) || parseInt(row.validity) <= 0)) {
          error = 'Validity must be a positive integer (minutes).';
          valid = false;
        } else if (row.shortcode && !/^[a-zA-Z0-9-_]{3,20}$/.test(row.shortcode)) {
          error = 'Shortcode must be 3-20 chars, alphanumeric, dash or underscore.';
          valid = false;
        }
      }
      return { ...row, error };
    });
    setRows(updated);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setResults([]);
    const requests = rows
      .filter(row => row.url.trim())
      .map(row =>
        axios
          .post('http://localhost:5000/shorten', {
            url: row.url,
            validity: row.validity,
            shortcode: row.shortcode
          })
          .then(res => ({
            original: row.url,
            short: res.data.short,
            expiry: res.data.expiry,
            shortcode: res.data.shortcode
          }))
          .catch(err => {
            let apiError = 'Failed to shorten URL';
            if (err.response && err.response.data && err.response.data.error) {
              apiError = err.response.data.error;
            }
            return {
              original: row.url,
              short: null,
              expiry: row.validity ? `${row.validity} min` : '∞',
              shortcode: row.shortcode || 'N/A',
              error: apiError
            };
          })
      );

    const results = await Promise.all(requests);
    setResults(results);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {rows.map((row, idx) => (
        <div className="form-row" key={idx}>
          <input
            type="text"
            placeholder="Enter long URL"
            value={row.url}
            onChange={e => handleChange(idx, 'url', e.target.value)}
            style={{ flex: 2 }}
          />
          <input
            type="text"
            placeholder="Validity (min, optional)"
            value={row.validity}
            onChange={e => handleChange(idx, 'validity', e.target.value)}
            style={{ flex: 1 }}
          />
          <input
            type="text"
            placeholder="Preferred shortcode (optional)"
            value={row.shortcode}
            onChange={e => handleChange(idx, 'shortcode', e.target.value)}
            style={{ flex: 1 }}
          />
          {row.error && <div className="error">{row.error}</div>}
        </div>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? 'Shortening...' : 'Shorten URLs'}
      </button>
    </form>
  );
}

export default UrlShortenerForm;