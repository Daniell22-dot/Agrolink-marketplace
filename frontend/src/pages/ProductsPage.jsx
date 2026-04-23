import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import SearchBar from '../components/common/SearchBar';
import FilterSidebar from '../components/products/FilterSidebar';
import './ProductsPage.css';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const filters = React.useMemo(() => ({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest'
    }), [searchParams]);

    const categories = [
        { id: 'vegetables', label: 'Vegetables' },
        { id: 'fruits', label: 'Fruits' },
        { id: 'grains', label: 'Grains' },
        { id: 'livestock', label: 'Livestock' },
        { id: 'dairy', label: 'Dairy' },
        { id: 'market-linkage', label: 'Market Linkage' },
        { id: 'input-supplies', label: 'Input Supplies' },
        { id: 'transport', label: 'Transport & Logistics' },
        { id: 'advisory', label: 'Agri Advisory' },
        { id: 'other', label: 'Other' }
    ];

    useEffect(() => {
        // Fetch products with filters
        dispatch(fetchProducts(filters));
    }, [filters, dispatch]);

    const handleFilterChange = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="products-page">
            {/* Premium Hero Banner */}
            <div className="products-hero-modern">
                <div className="hero-background-effects">
                    <div className="glow-orb orb-1"></div>
                    <div className="glow-orb orb-2"></div>
                </div>
                <div className="container hero-content-modern">
                    <div className="hero-text-content">
                        <h1>Discover <span className="text-gradient">Premium</span> Products & Services</h1>
                        <p>Explore the finest agricultural produce and top-tier services tailored for you.</p>
                    </div>
                    <div className="hero-search-glass">
                        <SearchBar
                            onSearch={(value) => handleFilterChange('search', value)}
                            placeholder="Search fresh tomatoes, logistics, advisory..."
                            initialValue={filters.search}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="products-container container">
                {/* Filters Sidebar */}
                <aside className="filters-sidebar">
                    <h3>Filters</h3>

                    <div className="filter-group">
                        <h4><i className="fas fa-layer-group"></i> Category</h4>
                        <div className="category-list">
                            {categories.map(cat => (
                                <label key={cat.id} className={`filter-chip ${filters.category === cat.id ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={cat.id}
                                        checked={filters.category === cat.id}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="hidden-radio"
                                    />
                                    <span>{cat.label}</span>
                                </label>
                            ))}
                        </div>
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
                        <h4><i className="fas fa-tags"></i> Price Range (KES)</h4>
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
                        <h4><i className="fas fa-sort-amount-down"></i> Sort By</h4>
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
                        <h2>{filters.category ? categories.find(c => c.id === filters.category)?.label : 'All Products & Services'}</h2>
                        <span className="products-badge">{products?.length || 0} Results</span>
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
