import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/products/ProductCard';
import SearchBar from '../components/common/SearchBar';
import FilterSidebar from '../components/products/FilterSidebar';
import './ProductsPage.css';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest'
    });

    const categories = ['vegetables', 'fruits', 'grains', 'livestock', 'dairy', 'other'];

    useEffect(() => {
        // Fetch products with filters
        // dispatch(fetchProducts(filters));
    }, [filters, dispatch]);

    const handleFilterChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(key => {
            if (newFilters[key]) params.set(key, newFilters[key]);
        });
        setSearchParams(params);
    };

    return (
        <div className="products-page">
            {/* Hero Banner */}
            <div className="products-hero">
                <div className="container">
                    <h1>Fresh Agricultural Produce</h1>
                    <p>Connect with local farmers and get the best quality products</p>
                    <SearchBar
                        value={filters.search}
                        onChange={(value) => handleFilterChange('search', value)}
                        placeholder="Search for products (e.g., tomatoes, milk...)"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="products-container container">
                {/* Filters Sidebar */}
                <aside className="filters-sidebar">
                    <h3>Filters</h3>

                    <div className="filter-group">
                        <h4>Category</h4>
                        {categories.map(cat => (
                            <label key={cat} className="filter-checkbox">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={filters.category === cat}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                />
                                <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                            </label>
                        ))}
                        {filters.category && (
                            <button
                                className="clear-filter"
                                onClick={() => handleFilterChange('category', '')}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div className="filter-group">
                        <h4>Price Range (KES)</h4>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="form-control"
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <h4>Sort By</h4>
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="form-control"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="products-main">
                    <div className="products-header">
                        <h2>All Products</h2>
                        <span className="products-count">{products?.length || 0} products found</span>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <i className="fas fa-exclamation-circle"></i>
                            <p>{error}</p>
                        </div>
                    ) : products && products.length > 0 ? (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-search"></i>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
