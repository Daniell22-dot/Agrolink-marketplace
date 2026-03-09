import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RecommendationCarousel from '../components/products/RecommendationCarousel';
import SearchBar from '../components/common/SearchBar';
import recommendationService from '../services/recommendationService';
import './HomePage.css';

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const fetchTrending = useCallback(() => recommendationService.getTrending(10), []);
  const fetchForYou = useCallback(() => recommendationService.getForYou(10), []);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section - Exact match from image */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <h1>Connecting Farmers<br />to Markets & Services</h1>
            <p>Empowering Agriculture, Enhancing Livelihoods.</p>
            <div className="hero-buttons">
              {!user ? (
                <>
                  <Link to="/register?role=farmer" className="btn btn-white btn-lg">
                    Join as Farmer
                  </Link>
                  <Link to="/register?role=buyer" className="btn btn-white-outline btn-lg">
                    Join as Buyer
                  </Link>
                </>
              ) : (
                <Link to="/products" className="btn btn-white btn-lg">
                  Browse Products
                </Link>
              )}
              <div className="google-play-badge">
                <i className="fab fa-google-play"></i>
                <div className="badge-text">
                  <span className="badge-text-small">Get the app</span>
                  <span className="badge-text-large">Google Play</span>
                </div>
              </div>
            </div>

            <div className="hero-search-container" style={{ marginTop: '2.5rem', width: '100%', maxWidth: '600px' }}>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search for tomatoes, maize, fertilizers..."
              />
            </div>
          </div>
          <div className="hero-right">
            <div className="stat-item">
              <i className="fas fa-balance-scale"></i>
              <span>Fair Market Prices</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-handshake"></i>
              <span>Trusted Buyers & Sellers</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-tractor"></i>
              <span>Agri Services & Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* ML Recommendation Carousels */}
      <section className="recommendations-section">
        <div className="container">
          <RecommendationCarousel
            title="Trending Products"
            icon="fas fa-fire"
            fetchFn={fetchTrending}
          />
          {user && (
            <RecommendationCarousel
              title="Recommended For You"
              icon="fas fa-magic"
              fetchFn={fetchForYou}
            />
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Us</h2>
              <p>Empowering Kenya's Farmers. AgriLink connects farmers, buyers and agribusinesses for a better agricultural future.</p>
              <Link to="/about" className="btn btn-primary">Learn More</Link>
            </div>
            <div className="about-icon">
              <i className="fas fa-leaf"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <i className="fas fa-link"></i>
              <h3>Market Linkage</h3>
            </div>
            <div className="service-card">
              <i className="fas fa-seedling"></i>
              <h3>Input Supplies</h3>
            </div>
            <div className="service-card">
              <i className="fas fa-truck"></i>
              <h3>Transport & Logistics</h3>
            </div>
            <div className="service-card">
              <i className="fas fa-chart-pie"></i>
              <h3>Agri Advisory</h3>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <i className="fas fa-user-plus"></i>
              <span>Sign Up</span>
            </div>
            <div className="step">
              <i className="fas fa-id-card"></i>
              <span>Create Your Profile</span>
            </div>
            <div className="step">
              <i className="fas fa-list"></i>
              <span>List & Connect</span>
            </div>
            <div className="step">
              <i className="fas fa-hand-holding-usd"></i>
              <span>Trade & Get Paid</span>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="app-section">
        <div className="container">
          <div className="app-content">
            <div className="app-left">
              <h2>Download Our App<br />AgroLink</h2>
              <h3>Get the AgriLink App Today!</h3>
              <div className="app-features">
                <span><i className="fas fa-chart-line"></i> Real-Time Market Updates</span>
                <span><i className="fas fa-lock"></i> Secure Payments</span>
                <span><i className="fas fa-address-book"></i> Farmer & Buyer Directory</span>
              </div>
              <div className="google-play-row">
                <div className="google-play-badge">
                  <i className="fab fa-google-play"></i>
                  <div className="badge-text">
                    <span className="badge-text-small">Get the app</span>
                    <span className="badge-text-large">Google Play</span>
                  </div>
                </div>
                <div className="google-play-badge">
                  <i className="fab fa-google-play"></i>
                  <div className="badge-text">
                    <span className="badge-text-small">Get the app</span>
                    <span className="badge-text-large">Google Play</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="app-right">
              <i className="fas fa-mobile-alt"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <i className="fas fa-quote-left"></i>
              <p className="testimonial-text">"AgriLink helped me sell my produce fast and get better prices."</p>
              <p className="testimonial-author">Mary, Kisumu</p>
              <div className="stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <p className="testimonial-text">"The best platform for connecting with reliable buyers. Highly recommended"</p>
              <p className="testimonial-author">David, Nakuru</p>
            </div>
            <div className="partners-section">
              <h3>Our Partners</h3>
              <div className="partner-logos">
                <span>AgriCo</span>
                <span>FarmFresh</span>
                <span>KALRO</span>
                <span>Safaricom</span>
                <span>M-Pesa</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <span><i className="fas fa-check-circle"></i> Verified farmers</span>
        <span><i className="fas fa-check-circle"></i> Secure payments</span>
      </div>
    </div>
  );
};

export default HomePage;