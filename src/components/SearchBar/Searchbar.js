import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Searchbar.css";
import destinations from "./kpdestination.json";

export default function Searchbar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);



  // Filter destinations safely
  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = destinations.filter((dest) => {
      const name = dest?.name?.toLowerCase() || "";
      const region = dest?.region?.toLowerCase() || "";
      const district = dest?.district?.toLowerCase() || "";

      return (
        name.includes(lowerQuery) ||
        region.includes(lowerQuery) ||
        district.includes(lowerQuery)
      );
    });

    setSuggestions(filtered.slice(0, 5)); // show top 5
  }, [query]);

  //Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const destination = destinations.find(
        (dest) =>
          (dest?.name?.toLowerCase() || "") === query.toLowerCase().trim()
      );

      if (destination) {
        navigate(`/destination/${destination.id}`);
      } else if (suggestions.length > 0) {
        navigate(`/destination/${suggestions[0].id}`);
      }

      setShowSuggestions(false);
    }
  };

  //When user clicks a suggestion
  const handleSuggestionClick = (destination) => {
    setQuery(destination.name);
    navigate(`/destination/${destination.id}`);
    setShowSuggestions(false);
  };

  return (
    <div id="search-section" className="search-bar-container" ref={searchRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search Destinations (Kalam, Naran, etc.)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((dest) => (
                <div
                  key={dest.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(dest)}
                >
                  <span className="suggestion-name">{dest.name}</span>
                  <span className="suggestion-region">{dest.region}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit">Search</button>
      </form>
    </div>
  );
}