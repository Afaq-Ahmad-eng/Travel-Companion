import React from 'react';
import './Searchbar.css';

export default function Searchbar() {
  return (
    <div className="search-bar-container">
      <form className="search-bar">
        <input
          type="text"
          placeholder="Search Destinations"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
