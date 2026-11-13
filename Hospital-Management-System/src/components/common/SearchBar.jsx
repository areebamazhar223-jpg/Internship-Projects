import { useRef } from "react";
import { Search, X } from "lucide-react";

import "./SearchBar.css";

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="custom-search" onClick={focusInput}>
      <button
        type="button"
        className="search-icon-button"
        onClick={(e) => {
          e.stopPropagation();
          focusInput();
        }}
        aria-label={placeholder}
      >
        <Search size={18} className="search-icon" />
      </button>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
            focusInput();
          }}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
