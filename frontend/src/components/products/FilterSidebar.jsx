import React from 'react';

const FilterSidebar = ({ filters, onFilterChange }) => {
    return (
        <div className="filter-sidebar">
            <h3>Filters</h3>
            <div className="filter-section">
                <h4>Category</h4>
                <select onChange={(e) => onFilterChange('category', e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="livestock">Livestock</option>
                </select>
            </div>
            <div className="filter-section">
                <h4>Price Range</h4>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                />
            </div>
        </div>
    );
};

export default FilterSidebar;
