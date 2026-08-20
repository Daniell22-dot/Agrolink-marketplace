import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FlashDeals from '../components/common/FlashDeals';
import ProductCard from '../components/products/ProductCard';
import api from '../services/api';
import './HomePage.css';

const HERO_CATEGORIES = [
  { icon: 'fas fa-carrot', name: 'Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-apple-alt', name: 'Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-seedling', name: 'Grains', slug: 'grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-cow', name: 'Livestock', slug: 'livestock', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-cheese', name: 'Dairy', slug: 'dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-seedling', name: 'Farm Inputs', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-spray-can', name: 'Fertilizers', slug: 'fertilizer', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=80&auto=format&fit=crop' },
  { icon: 'fas fa-tools', name: 'Farm Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=80&auto=format&fit=crop' },
];

const GRID_CATEGORIES = [
  { name: 'Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop' },
  { name: 'Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&auto=format&fit=crop' },
  { name: 'Grains', slug: 'grains', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop' },
  { name: 'Livestock', slug: 'livestock', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&auto=format&fit=crop' },
  { name: 'Dairy', slug: 'dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&auto=format&fit=crop' },
  { name: 'Farm Inputs', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&auto=format&fit=crop' },
  { name: 'Fertilizers', slug: 'fertilizer', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop' },
  { name: 'Farm Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop' },
];

const FLASH_DEALS = [
  { id: 'd1', title: 'Certified Hybrid Maize Seed (2kg)', price: 450, originalPrice: 650, discount: 31, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop', sold: 72 },
  { id: 'd2', title: 'NPK 50kg Fertilizer Bag', price: 3200, originalPrice: 4500, discount: 29, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&auto=format&fit=crop', sold: 85 },
  { id: 'd3', title: 'Drip Irrigation Kit (50m)', price: 2800, originalPrice: 3800, discount: 26, image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&auto=format&fit=crop', sold: 45 },
  { id: 'd4', title: 'Organic Compost Fertilizer (25kg)', price: 850, originalPrice: 1200, discount: 29, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop', sold: 60 },
  { id: 'd5', title: 'Garden Hand Tools Set (8pc)', price: 1500, originalPrice: 2200, discount: 32, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop', sold: 38 },
  { id: 'd6', title: 'Tomato Seeds (100g Pack)', price: 280, originalPrice: 400, discount: 30, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop', sold: 91 },
  { id: 'd7', title: 'Poultry Feed (50kg)', price: 3500, originalPrice: 4200, discount: 17, image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&auto=format&fit=crop', sold: 55 },
  { id: 'd8', title: 'Sprayer Pump (20L)', price: 1800, originalPrice: 2500, discount: 28, image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop', sold: 67 },
];

const HomePage = () => {
  const [guestProducts, setGuestProducts] = useState([]);
  const [guestLoading, setGuestLoading] = useState(true);
  const [heroBannerIndex, setHeroBannerIndex] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 5, minutes: 23, seconds: 47 });

  useEffect(() => {
    api.get('/products?limit=12&sort=newest')
      .then(res => setGuestProducts(res.data?.data?.rows || res.data?.data || []))
      .catch(() => {})
      .finally(() => setGuestLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        seconds -= 1;
        if (seconds < 0) { seconds = 59; minutes -= 1; }
        if (minutes < 0) { minutes = 59; hours -= 1; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
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
    { id: 's1', title: 'Fresh Grade A Tomatoes (50kg Crate)', price: 3200, originalPrice: 3800, unit: 'crate', category: 'vegetables', county: 'Kiambu', rating: 4.8, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop'], farmer: { fullName: 'Mwangi Fresh Farm' } },
    { id: 's2', title: 'Organic White Maize (90kg Bag)', price: 2800, originalPrice: 3200, unit: 'bag', category: 'grains', county: 'Uasin Gishu', rating: 4.9, images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop'], farmer: { fullName: 'Eldoret Granary Ltd' } },
    { id: 's3', title: 'Fresh Farm Milk (10L)', price: 750, originalPrice: 850, unit: 'liter', category: 'dairy', county: 'Nakuru', rating: 4.7, images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Rift Valley Dairies' } },
    { id: 's4', title: 'Hass Avocados (10kg Box)', price: 1800, originalPrice: 2200, unit: 'kg', category: 'fruits', county: "Murang'a", rating: 5.0, images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop'], farmer: { fullName: 'Highland Avocado Orchards' } },
    { id: 's5', title: 'Fresh Sukuma Wiki Bundle (24 heads)', price: 180, originalPrice: 240, unit: 'bundle', category: 'vegetables', county: 'Kisii', rating: 4.6, images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop'], farmer: { fullName: 'Kisii Green Farms' } },
    { id: 's6', title: 'Rice Paddy (50kg Bag)', price: 4500, originalPrice: 5200, unit: 'bag', category: 'grains', county: 'Mwea', rating: 4.8, images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop'], farmer: { fullName: 'Mwea Irrigation Scheme' } },
    { id: 's7', title: 'Fresh Passion Fruit (5kg)', price: 600, originalPrice: 750, unit: 'kg', category: 'fruits', county: 'Machakos', rating: 4.5, images: ['https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=500&auto=format&fit=crop'], farmer: { fullName: 'Machakos Tropical Farm' } },
    { id: 's8', title: 'Farm Fresh Eggs (Tray of 30)', price: 550, originalPrice: 650, unit: 'tray', category: 'dairy', county: 'Nyeri', rating: 4.9, images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop'], farmer: { fullName: 'Nyeri Poultry Farm' } },
  ];

  const pad = (n) => String(n).padStart(2, '0');

  const heroBanners = [
    { text: 'Fresh Farm Products', sub: 'Direct from Farmers', gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)' },
    { text: 'Planting Season Deals', sub: 'Up to 40% Off Seeds & Fertilizer', gradient: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)' },
    { text: 'Livestock Marketplace', sub: 'Buy & Sell Livestock Securely', gradient: 'linear-gradient(135deg, #081c15 0%, #1b4332 50%, #2d6a4f 100%)' },
  ];

  return (
    <div className="jumia-homepage">

      {/* ── 1. HERO SECTION ──────────────────────────────── */}
      <section className="j-hero">
        <div className="j-hero-inner">
          <div className="j-hero-categories">
            {HERO_CATEGORIES.map((cat) => (
              <Link to={`/products?category=${cat.slug}`} key={cat.slug} className="j-hero-cat-item">
                <img src={cat.image} alt={cat.name} className="j-hero-cat-img" />
                <span>{cat.name}</span>
              </Link>
            ))}
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

      {/* ── 3. FLASH DEALS ───────────────────────────────── */}
      <section className="j-flash-section">
        <div className="j-flash-header">
          <h2 className="j-flash-title">
            <i className="fas fa-bolt" /> Flash Sales
          </h2>
          <div className="j-flash-timer">
            <span className="j-flash-timer-label">Ends in:</span>
            <div className="j-flash-timer-box">{pad(countdown.hours)}</div>
            <span className="j-flash-timer-sep">:</span>
            <div className="j-flash-timer-box">{pad(countdown.minutes)}</div>
            <span className="j-flash-timer-sep">:</span>
            <div className="j-flash-timer-box">{pad(countdown.seconds)}</div>
          </div>
        </div>
        <FlashDeals deals={FLASH_DEALS} />
      </section>

      {/* ── 4. CATEGORIES GRID ───────────────────────────── */}
      <section className="j-categories-section">
        <div className="j-section-container">
          <h2 className="j-section-title">Categories</h2>
          <div className="j-categories-grid">
            {GRID_CATEGORIES.map((cat) => (
              <Link to={`/products?category=${cat.slug}`} key={cat.slug} className="j-category-tile">
                <div className="j-category-tile-img">
                  <img src={cat.image} alt={cat.name} />
                </div>
                <span className="j-category-tile-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. JUST FOR YOU ──────────────────────────────── */}
      <section className="j-foryou-section">
        <div className="j-foryou-inner">
          <div className="j-foryou-banners">
            <div className="j-foryou-banner j-foryou-banner-green">
              <span className="j-foryou-banner-tag">SALE</span>
              <h3>Farm Inputs Sale</h3>
              <p>Up to 30% Off</p>
              <Link to="/products?category=farm-inputs">Shop Now</Link>
            </div>
            <div className="j-foryou-banner j-foryou-banner-orange">
              <span className="j-foryou-banner-tag">NEW</span>
              <h3>New Arrivals</h3>
              <p>Fresh This Week</p>
              <Link to="/products?sort=newest">See All</Link>
            </div>
            <div className="j-foryou-banner j-foryou-banner-dark">
              <span className="j-foryou-banner-tag">BULK</span>
              <h3>Bulk Orders</h3>
              <p>Best Wholesale Prices</p>
              <Link to="/products">Order Now</Link>
            </div>
          </div>
          <div className="j-foryou-main">
            <div className="j-foryou-header">
              <h2>Just For You</h2>
              <Link to="/products" className="j-see-all">See All &rsaquo;</Link>
            </div>
            {guestLoading ? (
              <div className="j-foryou-loading"><div className="spinner" /></div>
            ) : (
              <div className="j-foryou-grid">
                {displayProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
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
