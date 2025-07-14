import React, { useState } from 'react';
import UrlShortenerForm from './components/UrlShortenerForm';
import UrlResultList from './components/UrlResultList';

function App() {
  const [results, setResults] = useState([]);

  return (
    <div className="container">
      <h1>React URL Shortener</h1>
      <UrlShortenerForm setResults={setResults} />
      <UrlResultList results={results} />
    </div>
  );
}

export default App;