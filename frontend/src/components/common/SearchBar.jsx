import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search products..." }) => {
    const [query, setQuery] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <div className="search-input-wrapper">
                <i className="fas fa-search search-icon-inside"></i>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="search-input"
                />
            </div>
            <button type="submit" className="search-button">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
