import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecommendationCarousel from '../components/products/RecommendationCarousel';
import ReviewMarquee from '../components/reviews/ReviewMarquee';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/products/ProductCard';
import recommendationService from '../services/recommendationService';
import api from '../services/api';
import './HomePage.css';

/* ── Static content (no fake metrics or awards) ──────────────── */
const SERVICES = [
  { icon: 'fas fa-link',      title: 'Market Linkage',       desc: 'Connect directly with verified buyers and sellers across Kenya, cutting out the middlemen.', path: '/products?category=market-linkage' },
  { icon: 'fas fa-seedling',  title: 'Input Supplies',       desc: 'Source quality seeds, fertilizers, and agrochemicals from trusted suppliers.', path: '/products?category=input-supplies' },
  { icon: 'fas fa-truck',     title: 'Transport & Logistics', desc: 'Reliable delivery services to get your produce to market fresh and on time.', path: '/products?category=transport' },
  { icon: 'fas fa-chart-pie', title: 'Agri Advisory',        desc: 'Access expert agronomic advice and AI-driven price insights to maximise your yields.', path: '/products?category=advisory' },
];

const STEPS = [
  { icon: 'fas fa-user-plus',        num: '01', title: 'Sign Up',          desc: 'Create your free account in a few minutes.' },
  { icon: 'fas fa-id-card',          num: '02', title: 'Build Your Profile', desc: 'Set up your farm or buyer profile to get discovered.' },
  { icon: 'fas fa-list',             num: '03', title: 'List & Connect',    desc: 'Post your produce or browse available products.' },
  { icon: 'fas fa-hand-holding-usd', num: '04', title: 'Trade & Get Paid',  desc: 'Close deals securely through M-Pesa integration.' },
];

const HomePage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Guest product preview — fetched from the public trending endpoint
  const [guestProducts, setGuestProducts] = useState([]);
  const [guestLoading, setGuestLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8&sort=newest')
      .then(res => setGuestProducts(res.data?.data?.rows || res.data?.data || []))
      .catch(() => {})
      .finally(() => setGuestLoading(false));
  }, []);

  const fetchTrending = useCallback(() => recommendationService.getTrending(10), []);
  // For logged-in users pass county from their profile so the backend can boost local products
  const fetchForYou = useCallback(
    () => recommendationService.getForYou(10),
    []
  );

  const handleSearch = (query) =>
    navigate(query.trim() ? `/products?search=${encodeURIComponent(query)}` : '/products');

  return (
    <div className="homepage">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="hp-hero">
        <div className="container hp-hero-inner">
          <div className="hp-hero-text">
            <h1>Connecting <span className="hp-accent">Farmers</span><br />to Markets &amp; Services</h1>
            <p>Empowering Agriculture, Enhancing Livelihoods across Kenya.</p>

            <div className="hp-search-wrap">
              <SearchBar onSearch={handleSearch} placeholder="Search tomatoes, maize, fertilizers…" />
            </div>

            <div className="hp-cta-row">
              {!isAuthenticated ? (
                <>
                  <Link to="/register?role=farmer" className="btn btn-white btn-lg">
                    <i className="fas fa-tractor" /> Join as Farmer
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
          </div>
        </div>
      </section>

      {/* ── LOGGED-IN: LOCATION-BASED RECOMMENDATIONS ─ */}
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

      {/* ── MAIN CONTENT WITH DUAL SIDEBARS ───────────────── */}
      <section className="hp-section hp-section--light">
        <div className="container hp-dual-layout">
          
          {/* LEFT SIDEBAR: Categories & Quick Links */}
          <aside className="hp-sidebar hp-sidebar-left">
            <div className="hp-sidebar-box">
              <h3><i className="fas fa-th-large" /> Categories</h3>
              <ul className="hp-sidebar-nav">
                <li><Link to="/products?category=vegetables"><i className="fas fa-carrot" /> Vegetables</Link></li>
                <li><Link to="/products?category=fruits"><i className="fas fa-apple-alt" /> Fresh Fruits</Link></li>
                <li><Link to="/products?category=grains"><i className="fas fa-seedling" /> Grains & Cereals</Link></li>
                <li><Link to="/products?category=dairy"><i className="fas fa-cheese" /> Dairy Produce</Link></li>
                <li><Link to="/products?category=livestock"><i className="fas fa-cow" /> Livestock</Link></li>
                <li><Link to="/products?category=other"><i className="fas fa-box" /> Other Supplies</Link></li>
              </ul>
            </div>

            <div className="hp-sidebar-box hp-quick-support">
              <h4><i className="fas fa-headset" /> Trade Support</h4>
              <p>Need help finding bulk buyers or trusted transport?</p>
              <a href="tel:+254112219135" className="hp-support-link"><i className="fas fa-phone-alt" /> +254 112 219 135</a>
            </div>
          </aside>

          {/* MAIN CENTER CONTENT */}
          <main className="hp-main-content">

            {/* GUEST OR LOGGED-IN PRODUCE SECTION */}
            <div className="hp-section-head">
              <h2>Fresh From Kenyan Farms</h2>
              <Link to="/products" className="hp-view-all">View All <i className="fas fa-arrow-right" /></Link>
            </div>

            {guestLoading ? (
              <div className="hp-loading"><div className="spinner" /></div>
            ) : (
              <div className="hp-product-grid">
                {((guestProducts && guestProducts.length > 0) ? guestProducts : [
                  {
                    id: 'sample-1',
                    title: 'Fresh Grade A Hybrid Tomatoes (50kg Crate)',
                    price: 3200,
                    originalPrice: 3800,
                    unit: 'crate',
                    category: 'vegetables',
                    county: 'Kiambu',
                    rating: 4.8,
                    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop'],
                    farmer: { fullName: 'Mwangi Fresh Farm' }
                  },
                  {
                    id: 'sample-2',
                    title: 'Organic White Maize (90kg Bag)',
                    price: 2800,
                    originalPrice: 3200,
                    unit: 'bag',
                    category: 'grains',
                    county: 'Uasin Gishu',
                    rating: 4.9,
                    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop'],
                    farmer: { fullName: 'Eldoret Granary Ltd' }
                  },
                  {
                    id: 'sample-3',
                    title: 'Fresh Farm Milk (10L Container)',
                    price: 750,
                    originalPrice: 850,
                    unit: 'liter',
                    category: 'dairy',
                    county: 'Nakuru',
                    rating: 4.7,
                    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop'],
                    farmer: { fullName: 'Rift Valley Dairies' }
                  },
                  {
                    id: 'sample-4',
                    title: 'Sweet Hass Avocados (Export Grade - 10kg Box)',
                    price: 1800,
                    originalPrice: 2200,
                    unit: 'kg',
                    category: 'fruits',
                    county: 'Murang\'a',
                    rating: 5.0,
                    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop'],
                    farmer: { fullName: 'Highland Avocado Orchards' }
                  }
                ]).slice(0, 6).map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            {!isAuthenticated && (
              <div className="hp-guest-cta">
                <p>Create a free account to add items to your cart and access exclusive deals.</p>
                <Link to="/register" className="btn btn-primary">Get Started — It is Free</Link>
              </div>
            )}
          </main>

          {/* RIGHT SIDEBAR: Advertisements & Promotional Deals */}
          <aside className="hp-sidebar hp-sidebar-right">
            
            {/* AD BANNER 1: Fertilizer / Input Promotion */}
            <div className="hp-ad-card hp-ad-orange">
              <span className="hp-ad-tag">SPONSORED AD</span>
              <div className="hp-ad-icon"><i className="fas fa-percentage" /></div>
              <h4>Yara Fertilizer Sale</h4>
              <p>Save up to 15% on NPK & CAN fertilizers this season.</p>
              <Link to="/products?category=input-supplies" className="btn btn-white btn-sm">Shop Deal</Link>
            </div>

            {/* AD BANNER 2: Transport & Logistics Offer */}
            <div className="hp-ad-card hp-ad-green">
              <span className="hp-ad-tag">LOGISTICS DEAL</span>
              <div className="hp-ad-icon"><i className="fas fa-truck" /></div>
              <h4>Countrywide Freight</h4>
              <p>Flat rates for refrigerated produce transport across Kenya.</p>
              <Link to="/services" className="btn btn-white-outline btn-sm">Book Truck</Link>
            </div>

            {/* AD BANNER 3: Agro Advisory App */}
            <div className="hp-ad-card hp-ad-dark">
              <span className="hp-ad-tag">AGRI ADVISORY</span>
              <div className="hp-ad-icon"><i className="fas fa-robot" /></div>
              <h4>AI Price Insights</h4>
              <p>Predict crop prices 30 days ahead with AgroLink AI.</p>
              <Link to="/pricing" className="btn btn-white btn-sm">Try Insights</Link>
            </div>

          </aside>

        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────── */}
      <section className="hp-section">
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

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="hp-section hp-section--light">
        <div className="container">
          <div className="hp-section-head centered">
            <h2>How It Works</h2>
            <p>Start trading on AgroLink in four easy steps.</p>
          </div>
          <div className="hp-steps-grid">
            {STEPS.map((step, i) => (
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

      {/* ── REVIEWS MARQUEE ───────────────────────── */}
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
        </div>
      </div>
    </div>
  );
};

export default HomePage;