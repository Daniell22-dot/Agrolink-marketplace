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
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="search-input"
            />
            <button type="submit" className="search-button">
                <i className="fas fa-search"></i> Search
            </button>
        </form>
    );
};

export default SearchBar;
