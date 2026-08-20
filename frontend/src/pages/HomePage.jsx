import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecommendationCarousel from '../components/products/RecommendationCarousel';
import ReviewMarquee from '../components/reviews/ReviewMarquee';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/products/ProductCard';
import FlashDeals from '../components/common/FlashDeals';
import FarmAdvisory from '../components/common/FarmAdvisory';
import AgriNews from '../components/common/AgriNews';
import GovServices from '../components/common/GovServices';
import SeasonalCalendar from '../components/common/SeasonalCalendar';
import api from '../services/api';
import './HomePage.css';

const CATEGORIES = [
  { icon: 'fas fa-carrot', name: 'Vegetables', slug: 'vegetables', count: '2.4k+' },
  { icon: 'fas fa-apple-alt', name: 'Fresh Fruits', slug: 'fruits', count: '1.8k+' },
  { icon: 'fas fa-seedling', name: 'Grains & Cereals', slug: 'grains', count: '3.1k+' },
  { icon: 'fas fa-cheese', name: 'Dairy & Eggs', slug: 'dairy', count: '890+' },
  { icon: 'fas fa-cow', name: 'Livestock', slug: 'livestock', count: '650+' },
  { icon: 'fas fa-leaf', name: 'Herbs & Spices', slug: 'herbs', count: '420+' },
  { icon: 'fas fa-spray-can', name: 'Fertilizers', slug: 'fertilizer', count: '340+' },
  { icon: 'fas fa-tools', name: 'Farm Tools', slug: 'tools', count: '280+' },
  { icon: 'fas fa-shield-alt', name: 'Pesticides', slug: 'pesticides', count: '190+' },
  { icon: 'fas fa-tint', name: 'Irrigation', slug: 'irrigation', count: '150+' },
  { icon: 'fas fa-tractor', name: 'Machinery', slug: 'machinery', count: '120+' },
  { icon: 'fas fa-box', name: 'Other Supplies', slug: 'other', count: '560+' },
];

const SERVICES = [
  { icon: 'fas fa-link', title: 'Market Linkage', desc: 'Connect directly with verified buyers and sellers across Kenya, cutting out the middlemen.', path: '/products?category=market-linkage' },
  { icon: 'fas fa-seedling', title: 'Input Supplies', desc: 'Source quality seeds, fertilizers, and agrochemicals from trusted suppliers.', path: '/products?category=input-supplies' },
  { icon: 'fas fa-truck', title: 'Transport & Logistics', desc: 'Reliable delivery services to get your produce to market fresh and on time.', path: '/products?category=transport' },
  { icon: 'fas fa-chart-pie', title: 'Agri Advisory', desc: 'Access expert agronomic advice and AI-driven price insights to maximise your yields.', path: '/pricing' },
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
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [guestProducts, setGuestProducts] = useState([]);
  const [guestLoading, setGuestLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=12&sort=newest')
      .then(res => setGuestProducts(res.data?.data?.rows || res.data?.data || []))
      .catch(() => {})
      .finally(() => setGuestLoading(false));
  }, []);

  const fetchTrending = useCallback(() => import('../services/recommendationService').then(m => m.default.getTrending(10)), []);
  const fetchForYou = useCallback(() => import('../services/recommendationService').then(m => m.default.getForYou(10)), []);

  const handleSearch = (query) =>
    navigate(query.trim() ? `/products?search=${encodeURIComponent(query)}` : '/products');

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

  return (
    <div className="homepage">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hp-hero">
        <div className="container hp-hero-inner">
          <div className="hp-hero-text">
            <div className="hp-hero-badge">Kenya's #1 Agricultural Marketplace</div>
            <h1>Fresh From <span className="hp-accent">Farm</span> to <span className="hp-accent">Table</span></h1>
            <p>Buy and sell agricultural products directly. No middlemen. Fair prices. Secure M-Pesa payments across all 47 counties.</p>

            <div className="hp-search-wrap">
              <SearchBar onSearch={handleSearch} placeholder="Search tomatoes, maize, fertilizers, seeds..." />
            </div>

            <div className="hp-cta-row">
              {!isAuthenticated ? (
                <>
                  <Link to="/register?role=farmer" className="btn btn-white btn-lg">
                    <i className="fas fa-tractor" /> Sell on AgroLink
                  </Link>
                  <Link to="/register?role=buyer" className="btn btn-white-outline btn-lg">
                    <i className="fas fa-shopping-bag" /> Join as Buyer
                  </Link>
                </>
              ) : (
                <Link to="/products" className="btn btn-white btn-lg">
                  <i className="fas fa-store" /> Browse Products
                </Link>
              )}
            </div>
          </div>

          <div className="hp-hero-pills">
            <div className="hp-pill"><i className="fas fa-balance-scale" /> Fair Market Prices</div>
            <div className="hp-pill"><i className="fas fa-handshake" /> Verified Traders</div>
            <div className="hp-pill"><i className="fas fa-shield-alt" /> Secure M-Pesa Payments</div>
            <div className="hp-pill"><i className="fas fa-truck" /> Countrywide Delivery</div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES BAR (Jumia-style) ────────────────── */}
      <section className="hp-categories-bar">
        <div className="container">
          <div className="hp-categories-scroll">
            {CATEGORIES.map(c => (
              <Link to={`/products?category=${c.slug}`} key={c.slug} className="hp-cat-item">
                <div className="hp-cat-icon"><i className={c.icon} /></div>
                <span className="hp-cat-name">{c.name}</span>
                <span className="hp-cat-count">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH DEALS ──────────────────────────────── */}
      <FlashDeals deals={FLASH_DEALS} />

      {/* ── LOGGED-IN RECOMMENDATIONS ──────────────── */}
      {isAuthenticated && (
        <section className="hp-section hp-section--light">
          <div className="container">
            {user?.county && (
              <RecommendationCarousel
                title={`Products Near You — ${user.county}`}
                icon="fas fa-map-marker-alt"
                fetchFn={fetchForYou}
              />
            )}
            <RecommendationCarousel
              title={user?.county ? 'Trending Nationwide' : 'Recommended For You'}
              icon="fas fa-fire"
              fetchFn={fetchTrending}
            />
          </div>
        </section>
      )}

      {/* ── MAIN PRODUCTS + SIDEBARS ────────────────── */}
      <section className="hp-section hp-section--light">
        <div className="container hp-dual-layout">

          {/* LEFT SIDEBAR */}
          <aside className="hp-sidebar hp-sidebar-left">
            <div className="hp-sidebar-box">
              <h3><i className="fas fa-th-large" /> Categories</h3>
              <ul className="hp-sidebar-nav">
                {CATEGORIES.slice(0, 8).map(c => (
                  <li key={c.slug}>
                    <Link to={`/products?category=${c.slug}`}>
                      <i className={c.icon} /> {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hp-sidebar-box hp-promo-card hp-promo-orange">
              <span className="hp-promo-tag">PROMO</span>
              <i className="fas fa-percentage hp-promo-big-icon" />
              <h4>Seasonal Fertilizer Sale</h4>
              <p>Save up to 25% on NPK & CAN fertilizers this planting season.</p>
              <Link to="/products?category=fertilizer" className="btn btn-white btn-sm">Shop Now</Link>
            </div>

            <div className="hp-sidebar-box hp-promo-card hp-promo-green">
              <span className="hp-promo-tag">LOGISTICS</span>
              <i className="fas fa-truck hp-promo-big-icon" />
              <h4>Countrywide Freight</h4>
              <p>Flat rates for refrigerated produce transport across Kenya.</p>
              <Link to="/services" className="btn btn-white-outline btn-sm">Book Now</Link>
            </div>

            <div className="hp-sidebar-box hp-promo-card hp-promo-dark">
              <span className="hp-promo-tag">AI POWERED</span>
              <i className="fas fa-robot hp-promo-big-icon" />
              <h4>AI Price Insights</h4>
              <p>Predict crop prices 30 days ahead with AgroLink AI.</p>
              <Link to="/pricing" className="btn btn-white btn-sm">Try Free</Link>
            </div>

            <div className="hp-sidebar-box hp-quick-support">
              <h4><i className="fas fa-headset" /> Trade Support</h4>
              <p>Need help finding bulk buyers or trusted transport?</p>
              <a href="tel:+254112219135" className="hp-support-link"><i className="fas fa-phone-alt" /> +254 112 219 135</a>
            </div>
          </aside>

          {/* MAIN CENTER */}
          <main className="hp-main-content">
            <div className="hp-section-head">
              <h2><i className="fas fa-fire" style={{color: 'var(--primary-orange)', marginRight: 8}} /> Fresh From Kenyan Farms</h2>
              <Link to="/products" className="hp-view-all">View All <i className="fas fa-arrow-right" /></Link>
            </div>

            {guestLoading ? (
              <div className="hp-loading"><div className="spinner" /></div>
            ) : (
              <div className="hp-product-grid">
                {displayProducts.slice(0, 8).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {!isAuthenticated && (
              <div className="hp-guest-cta">
                <div className="hp-guest-cta-icon"><i className="fas fa-shopping-cart" /></div>
                <h3>Start Shopping on AgroLink</h3>
                <p>Create a free account to add items to your cart, track orders, and access exclusive deals.</p>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started — It's Free</Link>
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="hp-sidebar hp-sidebar-right">
            <div className="hp-sidebar-box hp-promo-card hp-promo-orange">
              <span className="hp-promo-tag">HOT DEAL</span>
              <i className="fas fa-percentage hp-promo-big-icon" />
              <h4>Yara Fertilizer Sale</h4>
              <p>Save up to 15% on NPK & CAN fertilizers this season.</p>
              <Link to="/products?category=fertilizer" className="btn btn-white btn-sm">Shop Deal</Link>
            </div>

            <div className="hp-sidebar-box hp-promo-card hp-promo-green">
              <span className="hp-promo-tag">LOGISTICS</span>
              <i className="fas fa-truck hp-promo-big-icon" />
              <h4>Countrywide Freight</h4>
              <p>Flat rates for refrigerated produce transport across Kenya.</p>
              <Link to="/services" className="btn btn-white-outline btn-sm">Book Truck</Link>
            </div>

            <div className="hp-sidebar-box hp-promo-card hp-promo-dark">
              <span className="hp-promo-tag">AGRI ADVISORY</span>
              <i className="fas fa-robot hp-promo-big-icon" />
              <h4>AI Price Insights</h4>
              <p>Predict crop prices 30 days ahead with AgroLink AI.</p>
              <Link to="/pricing" className="btn btn-white btn-sm">Try Insights</Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ── SMART FARM ADVISORY ──────────────────── */}
      <section className="hp-section">
        <div className="container">
          <div className="hp-section-head">
            <h2><i className="fas fa-brain" style={{color: 'var(--primary-green)', marginRight: 8}} /> Smart Farm Advisory</h2>
            <Link to="/pricing" className="hp-view-all">Get Full Access <i className="fas fa-arrow-right" /></Link>
          </div>
          <FarmAdvisory />
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────── */}
      <section className="hp-section hp-section--light">
        <div className="container">
          <div className="hp-section-head centered">
            <h2>Our Services</h2>
            <p>Everything you need to succeed in agricultural trade, in one place.</p>
          </div>
          <div className="hp-services-grid">
            {SERVICES.map(s => (
              <div className="hp-service-card" key={s.title}>
                <div className="hp-service-icon"><i className={s.icon} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link to={s.path} className="hp-link">Explore <i className="fas fa-arrow-right" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASONAL PLANTING CALENDAR ───────────── */}
      <section className="hp-section">
        <div className="container">
          <div className="hp-section-head centered">
            <h2><i className="fas fa-calendar-alt" style={{color: 'var(--primary-green)', marginRight: 8}} /> Planting Calendar</h2>
            <p>Know the best seasons to plant, irrigate, and harvest across Kenya.</p>
          </div>
          <SeasonalCalendar />
        </div>
      </section>

      {/* ── GOVERNMENT & IRRIGATION SERVICES ──────── */}
      <section className="hp-section hp-section--light">
        <div className="container">
          <div className="hp-section-head centered">
            <h2><i className="fas fa-landmark" style={{color: 'var(--primary-green)', marginRight: 8}} /> Government & Irrigation Services</h2>
            <p>Access subsidized inputs, insurance, and extension services from the Government of Kenya.</p>
          </div>
          <GovServices />
        </div>
      </section>

      {/* ── AGRICULTURE NEWS ──────────────────────── */}
      <section className="hp-section">
        <div className="container">
          <div className="hp-section-head">
            <h2><i className="fas fa-newspaper" style={{color: 'var(--primary-orange)', marginRight: 8}} /> Agriculture News & Insights</h2>
            <Link to="/about" className="hp-view-all">View All <i className="fas fa-arrow-right" /></Link>
          </div>
          <AgriNews />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="hp-section hp-section--light">
        <div className="container">
          <div className="hp-section-head centered">
            <h2>How It Works</h2>
            <p>Start trading on AgroLink in four easy steps.</p>
          </div>
          <div className="hp-steps-grid">
            {[
              { icon: 'fas fa-user-plus', num: '01', title: 'Sign Up', desc: 'Create your free account in a few minutes.' },
              { icon: 'fas fa-id-card', num: '02', title: 'Build Your Profile', desc: 'Set up your farm or buyer profile to get discovered.' },
              { icon: 'fas fa-list', num: '03', title: 'List & Connect', desc: 'Post your produce or browse available products.' },
              { icon: 'fas fa-hand-holding-usd', num: '04', title: 'Trade & Get Paid', desc: 'Close deals securely through M-Pesa integration.' },
            ].map(step => (
              <div className="hp-step" key={step.num}>
                <div className="hp-step-num">{step.num}</div>
                <div className="hp-step-icon"><i className={step.icon} /></div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="hp-centered-btn">
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ───────────────────────────────── */}
      <ReviewMarquee />

      {/* ── ABOUT ─────────────────────────────────── */}
      <section className="hp-section">
        <div className="container hp-about-grid">
          <div className="hp-about-visual">
            <div className="hp-about-icon-wrap">
              <i className="fas fa-leaf" />
            </div>
          </div>
          <div className="hp-about-text">
            <h2>About AgroLink</h2>
            <p>
              AgroLink connects Kenya's farmers, buyers, and agribusinesses on a single trusted platform.
              We eliminate friction, ensure fair pricing, and put more money directly in farmers' pockets.
            </p>
            <ul className="hp-about-list">
              <li><i className="fas fa-check-circle" /> Farmers and buyers from all 47 counties</li>
              <li><i className="fas fa-check-circle" /> Secure M-Pesa payment integration</li>
              <li><i className="fas fa-check-circle" /> AI-driven price predictions and market insights</li>
              <li><i className="fas fa-check-circle" /> Government subsidy and insurance access</li>
            </ul>
            <Link to="/about" className="btn btn-primary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── APP DOWNLOAD ──────────────────────────── */}
      <section className="hp-section hp-section--green">
        <div className="container hp-app-grid">
          <div className="hp-app-text">
            <h2>Take AgroLink Wherever You Go</h2>
            <p>Real-time market prices, instant trade alerts, and M-Pesa payments — all from your phone.</p>
            <div className="hp-app-features">
              <span><i className="fas fa-chart-line" /> Real-time Market Prices</span>
              <span><i className="fas fa-bell" /> Instant Trade Alerts</span>
              <span><i className="fas fa-lock" /> Secure M-Pesa Payments</span>
              <span><i className="fas fa-address-book" /> Farmer and Buyer Directory</span>
            </div>
            <div className="hp-app-badges">
              <div className="hp-badge"><i className="fab fa-google-play" /><div><small>Get it on</small><strong>Google Play</strong></div></div>
              <div className="hp-badge"><i className="fab fa-apple" /><div><small>Download on the</small><strong>App Store</strong></div></div>
            </div>
          </div>
          <div className="hp-phone-mock">
            <div className="hp-phone-notch" />
            <div className="hp-phone-row"><i className="fas fa-seedling" /><span>Tomatoes — KES 80/kg</span></div>
            <div className="hp-phone-row hp-phone-row--green"><i className="fas fa-arrow-up" /><span>Maize prices up 12%</span></div>
            <div className="hp-phone-row"><i className="fas fa-truck" /><span>3 deliveries pending</span></div>
            <div className="hp-phone-row"><i className="fas fa-cloud-sun" /><span>Rains expected Tue</span></div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────── */}
      <div className="hp-trust-bar">
        <div className="container hp-trust-row">
          <span><i className="fas fa-check-circle" /> Verified Farmers</span>
          <span><i className="fas fa-shield-alt" /> Secure Payments</span>
          <span><i className="fas fa-headset" /> 24/7 Support</span>
          <span><i className="fas fa-leaf" /> 47 Counties Covered</span>
          <span><i className="fas fa-tractor" /> Government Certified</span>
          <span><i className="fas fa-lock" /> SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
