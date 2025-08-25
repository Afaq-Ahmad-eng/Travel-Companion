import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import phrases from './phrases';
import './Phrasebook.css';

export default function Phrasebook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const navigate = useNavigate();

  const fuse = new Fuse(phrases, {
    keys: ['english', 'urdu', 'pashto', 'pronunciation'],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  });

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setSearchResults([]);
      setFilteredSuggestions([]);
    } else {
      const results = fuse.search(term);
      setSearchResults(results.map(result => result.item));

      const suggestions = phrases
        .filter(p => p.english.toLowerCase().startsWith(term.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(suggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    const results = fuse.search(suggestion);
    setSearchResults(results.map(result => result.item));
    setFilteredSuggestions([]);
  };

  const speak = (text, lang = 'ur-PK') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="translator-bg"
      style={{
        backgroundImage: 'url("/translator-bg.jpg")', // 👈 Your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <div className="phrasebook-container">
        <div className="phrasebook-header">
          <h2 className="phrasebook-title">🗣️ Urdu & Pashto Phrasebook for Tourists</h2>
        </div>

        <div className="search-row">
          <div className="input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Type in English (e.g., 'Hello')"
              value={searchTerm}
              onChange={handleSearch}
            />
            {filteredSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {filteredSuggestions.map((s, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick(s.english)}>
                    {s.english}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="phrasebook-return-btn" onClick={() => navigate('/services')}>
            ← Back
          </button>
        </div>

        <div className="translate-box">
          <div className="output-box">
            {searchTerm && searchResults.length === 0 ? (
              <p className="no-result">No matches found for "{searchTerm}"</p>
            ) : (
              searchResults.length > 0 && (
                <>
                  <p>
                    <strong>Urdu:</strong>{' '}
                    <span className="urdu-text">{searchResults[0].urdu}</span>
                    <button className="speak-btn" onClick={() => speak(searchResults[0].urdu, 'ur-PK')}>🔊</button>
                  </p>
                  <p>
                    <strong>Pashto:</strong>{' '}
                    <span className="pashto-text">{searchResults[0].pashto}</span>
                    <button className="speak-btn" onClick={() => speak(searchResults[0].pashto, 'ps-AF')}>🔊</button>
                  </p>
                  <p>
                    <strong>Pronunciation:</strong> <em>{searchResults[0].pronunciation}</em>
                    <button className="speak-btn" onClick={() => speak(searchResults[0].pronunciation, 'en-US')}>🔊</button>
                  </p>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
