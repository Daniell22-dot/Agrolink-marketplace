import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import SearchBar from '../components/common/SearchBar';
import './ProductsPage.css';

// Sample fallback products to ensure cards always render even if backend is empty
const SAMPLE_PRODUCTS = [
    {
        id: 'sample-1',
        title: 'Mwea Pishori Aromatic Rice (50kg Bag)',
        price: 6800,
        originalPrice: 7500,
        unit: 'bag',
        category: 'grains',
        county: 'Kirinyaga',
        rating: 4.9,
        reviewsCount: 88,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Mwea Rice Millers Co.', isVerified: true }
    },
    {
        id: 'sample-2',
        title: 'Fresh Sweet Cassava Roots (50kg Bag)',
        price: 2200,
        originalPrice: 2600,
        unit: 'bag',
        category: 'vegetables',
        county: 'Busia',
        rating: 4.7,
        reviewsCount: 32,
        images: ['https://images.pexels.com/photos/7543161/pexels-photo-7543161.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Western Roots Farm', isVerified: true }
    },
    {
        id: 'sample-3',
        title: 'Fresh Farm Yams & Tubers (50kg Sacks)',
        price: 3800,
        originalPrice: 4200,
        unit: 'bag',
        category: 'vegetables',
        county: 'Meru',
        rating: 4.8,
        reviewsCount: 45,
        images: ['https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Meru Highland Tubers', isVerified: true }
    },
    {
        id: 'sample-4',
        title: 'Premium AA Arabica Coffee Beans (10kg Bag)',
        price: 4500,
        originalPrice: 5200,
        unit: 'bag',
        category: 'grains',
        county: 'Nyeri',
        rating: 5.0,
        reviewsCount: 94,
        images: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Nyeri Hill Coffee Estate', isVerified: true }
    },
    {
        id: 'sample-5',
        title: 'Highland Black Orthodox Tea (5kg Pack)',
        price: 2500,
        originalPrice: 2900,
        unit: 'piece',
        category: 'other',
        county: 'Kericho',
        rating: 4.9,
        reviewsCount: 67,
        images: ['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Kericho Tea Plantations', isVerified: true }
    },
    {
        id: 'sample-6',
        title: 'Pure White Refined Cane Sugar (50kg Bag)',
        price: 7200,
        originalPrice: 8000,
        unit: 'bag',
        category: 'other',
        county: 'Kakamega',
        rating: 4.8,
        reviewsCount: 112,
        images: ['https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Mumias Sugar Outgrowers', isVerified: true }
    },
    {
        id: 'sample-7',
        title: 'Raw Sugarcane Stalks (Bunch of 20)',
        price: 900,
        originalPrice: 1200,
        unit: 'bunches',
        category: 'fruits',
        county: 'Migori',
        rating: 4.6,
        reviewsCount: 23,
        images: ['https://images.pexels.com/photos/2254097/pexels-photo-2254097.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Sunkuli Cane Farms', isVerified: true }
    },
    {
        id: 'sample-8',
        title: 'Dry White Maize Grains (90kg Bag)',
        price: 2800,
        originalPrice: 3200,
        unit: 'bag',
        category: 'grains',
        county: 'Uasin Gishu',
        rating: 4.9,
        reviewsCount: 145,
        images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Eldoret Granary Ltd', isVerified: true }
    },
    {
        id: 'sample-9',
        title: 'Sifted Grade 1 Maize Flour / Unga (24 x 2kg Bundle)',
        price: 2950,
        originalPrice: 3300,
        unit: 'bag',
        category: 'grains',
        county: 'Nairobi',
        rating: 4.9,
        reviewsCount: 210,
        images: ['https://images.pexels.com/photos/6086003/pexels-photo-6086003.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Grain Millers Kenya', isVerified: true }
    },
    {
        id: 'sample-10',
        title: 'Grade A Hard Red Wheat Grains (90kg Bag)',
        price: 3900,
        originalPrice: 4400,
        unit: 'bag',
        category: 'grains',
        county: 'Narok',
        rating: 4.8,
        reviewsCount: 56,
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'WheatFields Narok', isVerified: true }
    },
    {
        id: 'sample-11',
        title: 'All-Purpose Fortified Wheat Flour (12 x 2kg Carton)',
        price: 2100,
        originalPrice: 2400,
        unit: 'bag',
        category: 'grains',
        county: 'Nakuru',
        rating: 4.8,
        reviewsCount: 78,
        images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Rift Valley Millers', isVerified: true }
    },
    {
        id: 'sample-12',
        title: 'Organic High-Protein Soyabeans (50kg Bag)',
        price: 4800,
        originalPrice: 5500,
        unit: 'bag',
        category: 'grains',
        county: 'Bungoma',
        rating: 4.7,
        reviewsCount: 39,
        images: ['https://images.pexels.com/photos/12338945/pexels-photo-12338945.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Bungoma Soya Co-op', isVerified: true }
    },
    {
        id: 'sample-13',
        title: 'Special Rosecoco Dry Beans (90kg Bag)',
        price: 8500,
        originalPrice: 9500,
        unit: 'bag',
        category: 'grains',
        county: 'Machakos',
        rating: 4.9,
        reviewsCount: 92,
        images: ['https://images.pexels.com/photos/13620780/pexels-photo-13620780.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Eastern Pulse Growers', isVerified: true }
    },
    {
        id: 'sample-14',
        title: 'Yellow Nyayo Beans (90kg Bag)',
        price: 7800,
        originalPrice: 8600,
        unit: 'bag',
        category: 'grains',
        county: 'Kitui',
        rating: 4.8,
        reviewsCount: 61,
        images: ['https://images.pexels.com/photos/13620780/pexels-photo-13620780.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Kitui Farmers Hub', isVerified: true }
    },
    {
        id: 'sample-15',
        title: 'Fresh Sukuma Wiki / Collard Greens (50kg Crate)',
        price: 1500,
        originalPrice: 1800,
        unit: 'crate',
        category: 'vegetables',
        county: 'Kiambu',
        rating: 4.8,
        reviewsCount: 114,
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Limuru Green Greens', isVerified: true }
    },
    {
        id: 'sample-16',
        title: 'Crisp Green Head Cabbage (50kg Sacks)',
        price: 1600,
        originalPrice: 2000,
        unit: 'bag',
        category: 'vegetables',
        county: 'Nyandarua',
        rating: 4.7,
        reviewsCount: 73,
        images: ['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Kinangop Veggie Farms', isVerified: true }
    },
    {
        id: 'sample-17',
        title: 'Organic Curly Kales (Fresh Harvest 20kg Net)',
        price: 1200,
        originalPrice: 1500,
        unit: 'crate',
        category: 'vegetables',
        county: 'Nyeri',
        rating: 4.9,
        reviewsCount: 54,
        images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Highland Organic Greens', isVerified: true }
    },
    {
        id: 'sample-18',
        title: 'Fresh Lake Victoria Tilapia Fish (10kg Box)',
        price: 4500,
        originalPrice: 5200,
        unit: 'kg',
        category: 'other',
        county: 'Kisumu',
        rating: 4.9,
        reviewsCount: 130,
        images: ['https://images.pexels.com/photos/229789/pexels-photo-229789.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Lake Victoria Fisheries', isVerified: true }
    },
    {
        id: 'sample-19',
        title: 'Fresh Prime Beef Meat Cuts (Full Carcass / Wholesale)',
        price: 550,
        originalPrice: 620,
        unit: 'kg',
        category: 'livestock',
        county: 'Kajiado',
        rating: 4.9,
        reviewsCount: 165,
        images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Maasai Mara Meats', isVerified: true }
    },
    {
        id: 'sample-20',
        title: 'Shangi Irish Potatoes (50kg Bag)',
        price: 2400,
        originalPrice: 2800,
        unit: 'bag',
        category: 'vegetables',
        county: 'Nyandarua',
        rating: 4.8,
        reviewsCount: 180,
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Kinangop Potato Co-op', isVerified: true }
    },
    {
        id: 'sample-21',
        title: 'Sweet Yellow Flesh Potatoes (50kg Bag)',
        price: 2600,
        originalPrice: 3000,
        unit: 'bag',
        category: 'vegetables',
        county: 'Bomet',
        rating: 4.8,
        reviewsCount: 42,
        images: ['https://images.pexels.com/photos/7999009/pexels-photo-7999009.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Bomet Potato Growers', isVerified: true }
    },
    {
        id: 'sample-22',
        title: 'Fresh Lean Pork Meat Cuts',
        price: 520,
        originalPrice: 600,
        unit: 'kg',
        category: 'livestock',
        county: 'Kiambu',
        rating: 4.7,
        reviewsCount: 58,
        images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Thika Piggeries Ltd', isVerified: true }
    },
    {
        id: 'sample-23',
        title: 'Vaccinated Day-Old Kienyeji Chicks (Box of 50)',
        price: 5500,
        originalPrice: 6500,
        unit: 'pieces',
        category: 'livestock',
        county: 'Nakuru',
        rating: 4.9,
        reviewsCount: 110,
        images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Naivasha Hatcheries', isVerified: true }
    },
    {
        id: 'sample-24',
        title: 'In-Calf Friesian Dairy Cow (High Milk Yield)',
        price: 115000,
        originalPrice: 130000,
        unit: 'pieces',
        category: 'livestock',
        county: 'Nakuru',
        rating: 5.0,
        reviewsCount: 29,
        images: ['https://images.pexels.com/photos/422202/pexels-photo-422202.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Rift Valley Breeders', isVerified: true }
    },
    {
        id: 'sample-25',
        title: 'Mature Kienyeji Rooster / Cock (Breeding Stock)',
        price: 1800,
        originalPrice: 2200,
        unit: 'pieces',
        category: 'livestock',
        county: 'Machakos',
        rating: 4.9,
        reviewsCount: 47,
        images: ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Ukambani Poultry Farm', isVerified: true }
    },
    {
        id: 'sample-26',
        title: 'Purebreed Dorper Sheep (Breeding Ram)',
        price: 18000,
        originalPrice: 21000,
        unit: 'pieces',
        category: 'livestock',
        county: 'Laikipia',
        rating: 4.9,
        reviewsCount: 36,
        images: ['https://images.pexels.com/photos/25851592/pexels-photo-25851592.jpeg?auto=compress&cs=tinysrgb&w=500'],
        farmer: { fullName: 'Laikipia Livestock Ranch', isVerified: true }
    },
    {
        id: 'sample-27',
        title: 'Galla Dairy Goat (High Milk & Meat Breed)',
        price: 14500,
        originalPrice: 16500,
        unit: 'pieces',
        category: 'livestock',
        county: 'Garissa',
        rating: 4.8,
        reviewsCount: 52,
        images: ['https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Garissa Goat Breeders', isVerified: true }
    },
    {
        id: 'sample-28',
        title: 'Fresh Grade A Hybrid Tomatoes (50kg Crate)',
        price: 3200,
        originalPrice: 3800,
        unit: 'crate',
        category: 'vegetables',
        county: 'Kiambu',
        rating: 4.8,
        reviewsCount: 34,
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop'],
        farmer: { fullName: 'Mwangi Fresh Farm', isVerified: true }
    }
];

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
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

    // Combine fetched products with sample products if API returns empty
    const rawProducts = (products && products.length > 0) ? products : SAMPLE_PRODUCTS;

    const displayProducts = rawProducts.filter(p => {
        if (filters.category && p.category !== filters.category) return false;
        if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
        return true;
    });

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
                    <Link to="/products">Marketplace</Link>
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
                                placeholder="Search products, categories, farmers..."
                                initialValue={filters.search}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="jumia-layout container dual-sidebar-layout">
                {/* Mobile Filter Toggle */}
                <button 
                    className="mobile-filter-toggle"
                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                    <i className="fas fa-filter"></i> Filters &amp; Categories
                </button>

                {/* Left Sidebar: Filters */}
                <aside className={`jumia-sidebar left-sidebar ${isMobileFiltersOpen ? 'open' : ''}`}>
                    <div className="sidebar-section">
                        <h3>Categories</h3>
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
                                    <i className={`fas ${cat.icon}`}></i> {cat.label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sidebar-section">
                        <h3>Price Range (KES)</h3>
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

                    <div className="sidebar-section">
                        <h3>Buyer Protection</h3>
                        <div className="protection-badge">
                            <i className="fas fa-shield-alt"></i>
                            <div>
                                <strong>Escrow Guarantee</strong>
                                <p>Funds released upon verified delivery</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Center Area: Products Grid */}
                <main className="jumia-main">
                    <div className="jumia-top-bar">
                        <div className="results-count">
                            {displayProducts.length} products found
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
                        </div>
                    </div>

                    <div className="jumia-products-container">
                        {loading && products?.length === 0 ? (
                            <div className="jumia-grid">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="skeleton-card"></div>
                                ))}
                            </div>
                        ) : displayProducts.length > 0 ? (
                            <div className="jumia-grid">
                                {displayProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="jumia-empty">
                                <div className="empty-icon-wrap">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3>No products match your criteria</h3>
                                <p>Try clearing your price filters or searching for another term</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar: Featured & Trending Highlights */}
                <aside className="jumia-sidebar right-sidebar">
                    <div className="sidebar-section">
                        <h3><i className="fas fa-fire" style={{ color: 'var(--primary-orange)' }}></i> Fast Selling Produce</h3>
                        <div className="mini-product-list">
                            {SAMPLE_PRODUCTS.slice(0, 3).map(p => (
                                <Link key={p.id} to={`/product/${p.id}`} className="mini-product-item">
                                    <img src={p.images[0]} alt={p.title} />
                                    <div className="mini-product-info">
                                        <span className="mini-product-title">{p.title}</span>
                                        <span className="mini-product-price">KES {p.price.toLocaleString()}</span>
                                        <span className="mini-product-county"><i className="fas fa-map-marker-alt"></i> {p.county}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section promo-banner-box">
                        <div className="promo-inner">
                            <i className="fas fa-truck-loading promo-icon"></i>
                            <h4>Bulk Freight Rates</h4>
                            <p>Get discounted logistics for orders over 500kg</p>
                            <Link to="/services" className="promo-btn">Explore Freight</Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProductsPage;
