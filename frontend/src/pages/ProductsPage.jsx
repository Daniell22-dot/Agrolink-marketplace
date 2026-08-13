import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import SearchBar from '../components/common/SearchBar';
import './ProductsPage.css';

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const filters = React.useMemo(() => ({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'newest'
    }), [searchParams]);

    const categories = [
        { id: 'vegetables', label: 'Vegetables', icon: 'fa-carrot' },
        { id: 'fruits', label: 'Fruits', icon: 'fa-apple-alt' },
        { id: 'grains', label: 'Grains', icon: 'fa-seedling' },
        { id: 'livestock', label: 'Livestock', icon: 'fa-cow' },
        { id: 'dairy', label: 'Dairy', icon: 'fa-cheese' },
        { id: 'other', label: 'Other', icon: 'fa-box' }
    ];

    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    useEffect(() => {
        const t = setTimeout(() => setDebouncedFilters(filters), 400);
        return () => clearTimeout(t);
    }, [filters]);

    useEffect(() => {
        dispatch(fetchProducts(debouncedFilters));
    }, [debouncedFilters, dispatch]);

    const handleFilterChange = (name, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(name, value);
        } else {
            newParams.delete(name);
        }
        setSearchParams(newParams);
    };

    const agriculturalProducts = products?.filter(p => 
        categories.some(cat => cat.id === p.category) || !p.category
    );

    const currentCategoryLabel = filters.category 
        ? categories.find(c => c.id === filters.category)?.label 
        : 'All Produce';

    return (
        <div className="jumia-products-page">
            {/* Breadcrumb Bar */}
            <div className="breadcrumb-bar">
                <div className="container">
                    <Link to="/">Home</Link>
                    <span> <i className="fas fa-chevron-right"></i> </span>
                    <Link to="/products">Products</Link>
                    {filters.category && (
                        <>
                            <span> <i className="fas fa-chevron-right"></i> </span>
                            <span className="current">{currentCategoryLabel}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Simplified Hero */}
            <div className="premium-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Fresh From The Farm</h1>
                        <div className="hero-search">
                            <SearchBar
                                onSearch={(value) => handleFilterChange('search', value)}
                                placeholder="Search products, brands and categories..."
                                initialValue={filters.search}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="jumia-layout container">
                {/* Mobile Filter Toggle */}
                <button 
                    className="mobile-filter-toggle"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                    <i className="fas fa-filter"></i> Filters
                </button>

                {/* Left Sidebar */}
                <aside className={`jumia-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
                    <div className="sidebar-section">
                        <h3>Category</h3>
                        <ul className="category-list-jumia">
                            <li 
                                className={!filters.category ? 'active' : ''}
                                onClick={() => handleFilterChange('category', '')}
                            >
                                All Categories
                            </li>
                            {categories.map(cat => (
                                <li 
                                    key={cat.id} 
                                    className={filters.category === cat.id ? 'active' : ''}
                                    onClick={() => handleFilterChange('category', cat.id)}
                                >
                                    {cat.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3>Price (KES)</h3>
                        <div className="jumia-price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                </aside>

                {/* Right Main Area */}
                <main className="jumia-main">
                    <div className="jumia-top-bar">
                        <div className="results-count">
                            {agriculturalProducts?.length || 0} products found
                        </div>
                        <div className="sort-bar">
                            <label>Sort by:</label>
                            <select
                                value={filters.sort}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="popular">Popularity</option>
                            </select>
                            <div className="view-toggles">
                                <button className="active"><i className="fas fa-th"></i></button>
                                <button><i className="fas fa-list"></i></button>
                            </div>
                        </div>
                    </div>

                    <div className="jumia-products-container">
                        {loading ? (
                            <div className="jumia-grid">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="skeleton-card"></div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="jumia-error">
                                <i className="fas fa-exclamation-triangle"></i>
                                <p>{error}</p>
                            </div>
                        ) : agriculturalProducts && agriculturalProducts.length > 0 ? (
                            <div className="jumia-grid">
                                {agriculturalProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="jumia-empty">
                                <div className="empty-icon-wrap">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3>There are no products in this category</h3>
                                <p>Try clearing filters or search for something else</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
