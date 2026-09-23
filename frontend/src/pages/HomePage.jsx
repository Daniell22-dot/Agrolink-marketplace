import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import ReviewMarquee from '../components/reviews/ReviewMarquee';
import FarmAdvisory from '../components/common/FarmAdvisory';
import AgriNews from '../components/common/AgriNews';
import recommendationService from '../services/recommendationService';
import api from '../services/api';
import SEO, { organizationStructuredData, websiteStructuredData } from '../components/seo/SEO';
import './HomePage.css';

const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  let diff = midnight - now;
  if (diff < 0) diff = 0;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

const pad = (n) => String(n).padStart(2, '0');

const HERO_CATEGORIES = [
  { icon: 'fas fa-carrot', name: 'Vegetables', slug: 'vegetables', image: '/images/Carrots.jpg' },
  { icon: 'fas fa-apple-alt', name: 'Fruits', slug: 'fruits', image: '/images/Bananas.jpg' },
  { icon: 'fas fa-seedling', name: 'Seeds', slug: 'seeds', image: '/images/Variant of seeds.jpg' },
  { icon: 'fas fa-cow', name: 'Livestock', slug: 'livestock', image: '/images/Cow.jpg' },
  { icon: 'fas fa-cheese', name: 'Dairy', slug: 'dairy', image: '/images/Milk.jpg' },
  { icon: 'fas fa-seedling', name: 'Farm Inputs', slug: 'farm-inputs', image: '/images/Drip Irrigation.jpg' },
  { icon: 'fas fa-flask', name: 'Fertilizers', slug: 'fertilizers', image: '/images/Fertilizer.jpg' },
  { icon: 'fas fa-tools', name: 'Farm Tools', slug: 'tools', image: '/images/Farm tools.jpg' },
];

const GRID_CATEGORIES = [
  { name: 'Vegetables', slug: 'vegetables', image: '/images/Carrots.jpg' },
  { name: 'Fruits', slug: 'fruits', image: '/images/Bananas.jpg' },
  { name: 'Grains & Cereals', slug: 'grains', image: '/images/Maize1.jpg' },
  { name: 'Livestock', slug: 'livestock', image: '/images/Cow.jpg' },
  { name: 'Farm Inputs', slug: 'farm-inputs', image: '/images/Drip Irrigation.jpg' },
  { name: 'Seeds', slug: 'seeds', image: '/images/Variant of seeds.jpg' },
  { name: 'Farm Tools', slug: 'tools', image: '/images/Farm tools.jpg' },
  { name: 'Fertilizers', slug: 'fertilizers', image: '/images/Fertilizer.jpg' },
];

const HomePage = () => {
  const [guestProducts, setGuestProducts] = useState([]);
  const [guestLoading, setGuestLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [heroBannerIndex, setHeroBannerIndex] = useState(0);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);

  useEffect(() => {
    let cancelled = false;
    setGuestLoading(true);
    recommendationService.getTrending(12)
      .then(products => {
        if (!cancelled) {
          const normalized = (products || []).map(p => ({
            id: p.id,
            title: p.name,
            price: parseFloat(p.price),
            originalPrice: undefined,
            unit: p.unit || 'kg',
            category: p.category,
            county: p.location || p.county || 'Kenya',
            rating: p.rating || 0,
            images: p.image_url || p.images || [],
            farmer: p.farmer ? { fullName: p.farmer.fullName || p.farmer.name || 'Farmer' } : (p.farmer_name ? { fullName: p.farmer_name } : { fullName: 'Farmer' })
          }));
          setGuestProducts(normalized);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGuestProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setGuestLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setCategoryLoading(true);
    const categoriesToFetch = [
      { slug: 'vegetables', name: 'Vegetables' },
      { slug: 'fruits', name: 'Fruits' },
      { slug: 'grains', name: 'Grains & Cereals' },
      { slug: 'dairy', name: 'Dairy' },
      { slug: 'livestock', name: 'Livestock' },
      { slug: 'farm-inputs', name: 'Farm Inputs' },
      { slug: 'seeds', name: 'Seeds' },
      { slug: 'tools', name: 'Farm Tools' },
      { slug: 'fertilizers', name: 'Fertilizers' },
    ];

    Promise.all(
      categoriesToFetch.map(cat =>
        api.get(`/products?category=${cat.slug}&limit=8&sort=newest`)
          .then(res => ({ slug: cat.slug, name: cat.name, products: res.data?.data?.rows || res.data?.data || [] }))
          .catch(() => ({ slug: cat.slug, name: cat.name, products: [] }))
      )
    ).then(results => {
      if (!cancelled) {
        const grouped = {};
        results.forEach(r => {
          if (r.products.length > 0) {
            grouped[r.slug] = { name: r.name, products: r.products };
          }
        });
        setProductsByCategory(grouped);
      }
    })
    .finally(() => {
      if (!cancelled) setCategoryLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setHeroBannerIndex(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(bannerTimer);
  }, []);

  const displayProducts = guestProducts.length > 0 ? guestProducts : [
    { id: 's1', title: 'Fresh Grade A Tomatoes (50kg Crate)', price: 3200, originalPrice: 3800, unit: 'crate', category: 'vegetables', county: 'Kiambu', rating: 4.8, images: ['/images/Chillie(Pilipili).jpg'], farmer: { fullName: 'Mwangi Fresh Farm' } },
    { id: 's2', title: 'Organic White Maize (90kg Bag)', price: 2800, originalPrice: 3200, unit: 'bag', category: 'grains', county: 'Uasin Gishu', rating: 4.9, images: ['/images/Maize.jpg'], farmer: { fullName: 'Eldoret Granary Ltd' } },
    { id: 's3', title: 'Fresh Farm Milk (10L)', price: 750, originalPrice: 850, unit: 'liter', category: 'dairy', county: 'Nakuru', rating: 4.7, images: ['/images/Milk.jpg'], farmer: { fullName: 'Rift Valley Dairies' } },
    { id: 's4', title: 'Hass Avocados (10kg Box)', price: 1800, originalPrice: 2200, unit: 'kg', category: 'fruits', county: "Murang'a", rating: 5.0, images: ['/images/Avocado.jpg'], farmer: { fullName: 'Highland Avocado Orchards' } },
    { id: 's5', title: 'Fresh Sukuma Wiki Bundle (24 heads)', price: 180, originalPrice: 240, unit: 'bundle', category: 'vegetables', county: 'Kisii', rating: 4.6, images: ['/images/Carrots.jpg'], farmer: { fullName: 'Kisii Green Farms' } },
    { id: 's6', title: 'Rice Paddy (50kg Bag)', price: 4500, originalPrice: 5200, unit: 'bag', category: 'grains', county: 'Mwea', rating: 4.8, images: ['/images/Rice planting.jpg'], farmer: { fullName: 'Mwea Irrigation Scheme' } },
    { id: 's7', title: 'Fresh Passion Fruit (5kg)', price: 600, originalPrice: 750, unit: 'kg', category: 'fruits', county: 'Machakos', rating: 4.5, images: ['/images/Bananas.jpg'], farmer: { fullName: 'Machakos Tropical Farm' } },
    { id: 's8', title: 'Farm Fresh Eggs (Tray of 30)', price: 550, originalPrice: 650, unit: 'tray', category: 'dairy', county: 'Nyeri', rating: 4.9, images: ['/images/Chicks.jpg'], farmer: { fullName: 'Nyeri Poultry Farm' } },
  ];

  const pad = (n) => String(n).padStart(2, '0');

  const heroBanners = [
    { text: 'Fresh Farm Products', sub: 'Direct from Farmers to Your Table', gradient: 'linear-gradient(135deg, #15803D 0%, #166534 50%, #14532D 100%)' },
    { text: 'Planting Season Deals', sub: 'Up to 40% Off Seeds & Fertilizer', gradient: 'linear-gradient(135deg, #166534 0%, #15803D 50%, #22C55E 100%)' },
    { text: 'Livestock Marketplace', sub: 'Buy & Sell Livestock Securely', gradient: 'linear-gradient(135deg, #14532D 0%, #166534 50%, #15803D 100%)' },
  ];

  return (
    <div className="jumia-homepage">
      <SEO
        title="AgroLink Kenya - Fresh Farm Products Direct from Farmers"
        description="Buy fresh farm products directly from Kenyan farmers. Vegetables, fruits, grains, dairy, livestock, farm inputs, seeds, and tools delivered to your door."
        canonical="https://agrolink.co.ke/"
        structuredData={[organizationStructuredData, websiteStructuredData]}
        breadcrumbs={[
          { label: 'Home', url: 'https://agrolink.co.ke/' },
        ]}
      />

      {/* ── 1. HERO SECTION ──────────────────────────────── */}
      <section className="j-hero">
        <div className="j-hero-inner">
          <div className="j-hero-categories">
            {HERO_CATEGORIES.map((cat) => {
              const hasLandingPage = ['farm-inputs', 'seeds', 'tools', 'fertilizers'].includes(cat.slug);
              return (
                <Link
                  to={hasLandingPage ? `/category/${cat.slug}` : `/products?category=${cat.slug}`}
                  key={cat.slug}
                  className="j-hero-cat-item"
                >
                  <img src={cat.image} alt={cat.name} className="j-hero-cat-img" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
          <div className="j-hero-banner">
            <div
              className="j-hero-banner-slide"
              style={{ background: heroBanners[heroBannerIndex].gradient }}
            >
              <h2>{heroBanners[heroBannerIndex].text}</h2>
              <p>{heroBanners[heroBannerIndex].sub}</p>
              <Link to="/products" className="j-hero-banner-btn">Shop Now</Link>
            </div>
            <div className="j-hero-dots">
              {heroBanners.map((_, i) => (
                <span
                  key={i}
                  className={`j-hero-dot ${i === heroBannerIndex ? 'active' : ''}`}
                  onClick={() => setHeroBannerIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SERVICE HIGHLIGHTS BAR ────────────────────── */}
      <section className="j-highlights">
        <div className="j-highlights-inner">
          <div className="j-highlight-item">
            <i className="fas fa-truck" />
            <span>Free Delivery on orders over KES 5,000</span>
          </div>
          <div className="j-highlight-item">
            <i className="fas fa-money-bill" />
            <span>Pay on Delivery</span>
          </div>
          <div className="j-highlight-item">
            <i className="fas fa-certificate" />
            <span>100% Authentic Products</span>
          </div>
          <div className="j-highlight-item">
            <i className="fas fa-headset" />
            <span>24/7 Customer Support</span>
          </div>
          <div className="j-highlight-item">
            <i className="fas fa-lock" />
            <span>Secure M-Pesa Payments</span>
          </div>
        </div>
      </section>

      {/* ── 3. FLASH SALES ─────────────────────────────────── */}
      <section className="j-flash-section">
        <div className="j-flash-header">
          <h2 className="j-flash-title">
            <i className="fas fa-bolt" /> Flash Sales
          </h2>
          <div className="j-flash-timer">
            <span className="j-flash-timer-label">Ends today at 00:00</span>
            <div className="j-flash-timer-box">{pad(countdown.hours)}</div>
            <span className="j-flash-timer-sep">:</span>
            <div className="j-flash-timer-box">{pad(countdown.minutes)}</div>
            <span className="j-flash-timer-sep">:</span>
            <div className="j-flash-timer-box">{pad(countdown.seconds)}</div>
          </div>
        </div>
        {guestLoading ? (
          <div className="j-flash-loading"><div className="spinner" /></div>
        ) : guestProducts.length > 0 ? (
          <div className="j-flash-grid">
            {guestProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="j-flash-empty">No flash sales right now. Check back soon!</div>
        )}
      </section>

      {/* ── 4. CATEGORIES GRID ───────────────────────────── */}
      <section className="j-categories-section">
        <div className="j-section-container">
          <h2 className="j-section-title">Categories</h2>
          <p className="j-section-subtitle">Shop by category and discover fresh farm products</p>
          <div className="j-categories-grid">
            {GRID_CATEGORIES.map((cat) => {
              const categorySlug = cat.slug;
              const hasProducts = productsByCategory[categorySlug];
              return (
                <Link
                  to={hasProducts ? `#category-${categorySlug}` : (categorySlug === 'farm-inputs' || categorySlug === 'seeds' || categorySlug === 'tools' || categorySlug === 'fertilizers' ? `/category/${categorySlug}` : `/products?category=${categorySlug}`)}
                  key={cat.slug}
                  className="j-category-tile"
                >
                  <div className="j-category-tile-img">
                    <img src={cat.image} alt={cat.name} />
                  </div>
                  <span className="j-category-tile-name">{cat.name}</span>
                  {hasProducts && (
                    <span className="j-category-tile-count">{productsByCategory[categorySlug].products.length} products</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. REVIEW MARQUEE ─────────────────────────────── */}
      <ReviewMarquee />

      {/* ── 5.5. FARM ADVISORY ───────────────────────────── */}
      <FarmAdvisory />

      {/* ── 5.6. AGRI NEWS ───────────────────────────────── */}
      <AgriNews />

      {/* ── 6. SHOP BY CATEGORY ──────────────────────────── */}
      <section className="j-category-section">
        <div className="j-section-container">
          <h2 className="j-section-title">Shop by Category</h2>
          <p className="j-section-subtitle">Browse our wide selection of farm-fresh products by category</p>
        </div>
        {categoryLoading ? (
          <div className="j-section-container"><div className="spinner" /></div>
        ) : (
          <div className="j-category-list">
            {Object.entries(productsByCategory).map(([slug, data]) => (
              <div key={slug} id={`category-${slug}`} className="j-category-group">
                <div className="j-category-group-header">
                  <div>
                    <h3 className="j-category-group-title">{data.name}</h3>
                    <p className="j-category-group-count">{data.products.length} product{data.products.length !== 1 ? 's' : ''}</p>
                  </div>
                  <Link to={slug === 'farm-inputs' || slug === 'seeds' || slug === 'tools' || slug === 'fertilizers' ? `/category/${slug}` : `/products?category=${slug}`} className="j-category-group-link">
                    View All <i className="fas fa-arrow-right" />
                  </Link>
                </div>
                <div className="j-category-grid">
                  {data.products.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={{
                      id: product.id,
                      title: product.name,
                      price: parseFloat(product.price),
                      originalPrice: undefined,
                      unit: product.unit || 'kg',
                      category: product.category || slug,
                      county: product.location || product.county || 'Kenya',
                      rating: product.rating || 0,
                      images: product.images || product.image_url || [],
                      farmer: product.farmer || { fullName: 'Farmer' }
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 7. JUST FOR YOU ──────────────────────────────── */}
      <section className="j-foryou-section">
        <div className="j-foryou-inner">
          <div className="j-foryou-main">
            <div className="j-foryou-header">
              <h2>Just For You</h2>
              <Link to="/products" className="j-see-all">See All &rsaquo;</Link>
            </div>
            {guestLoading ? (
              <div className="j-foryou-loading"><div className="spinner" /></div>
            ) : displayProducts.length > 0 ? (
              <div className="j-foryou-grid">
                {displayProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="j-foryou-empty">No recommendations yet. Browse products to get personalized picks.</div>
            )}
          </div>
        </div>
      </section>

      {/* ── 6. BOTTOM TRUST BAR ──────────────────────────── */}
      <section className="j-trust-bar">
        <div className="j-trust-inner">
          <div className="j-trust-item">
            <i className="fas fa-check-circle" />
            <span>Verified Farmers</span>
          </div>
          <div className="j-trust-item">
            <i className="fas fa-lock" />
            <span>Secure Payments</span>
          </div>
          <div className="j-trust-item">
            <i className="fas fa-headset" />
            <span>24/7 Support</span>
          </div>
          <div className="j-trust-item">
            <i className="fas fa-map-marker-alt" />
            <span>47 Counties</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
