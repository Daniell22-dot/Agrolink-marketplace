import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../../assets/icons/12.png';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="footer">
      {/* Newsletter Strip */}
      <div className="footer-newsletter-strip">
        <div className="container newsletter-inner">
          <div className="newsletter-text">
            <i className="fas fa-envelope-open-text"></i>
            <div>
              <h3>Stay Updated with AgroLink</h3>
              <p>Get the latest farm deals, seasonal offers & market prices delivered to your inbox.</p>
            </div>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              {subscribed ? (
                <><i className="fas fa-check"></i> Subscribed!</>
              ) : (
                <><i className="fas fa-paper-plane"></i> Subscribe</>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Column 1: Brand & About */}
            <div className="footer-col footer-brand">
              <Link to="/" className="footer-logo">
                <img src={logoIcon} alt="AgroLink Logo" />
                Agro<span>Link</span>
              </Link>
              <p className="footer-desc">
                Kenya's #1 farm-to-table marketplace. Connecting local farmers directly
                with consumers for fresher produce and fairer prices.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/category/farm-inputs">Farm Inputs</Link></li>
                <li><Link to="/category/seeds">Seeds</Link></li>
                <li><Link to="/category/tools">Farm Tools</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div className="footer-col">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/terms">Returns & Refunds</Link></li>
                <li><Link to="/faq">FAQs</Link></li>
                <li><Link to="/orders">Track Your Order</Link></li>
                <li><Link to="/how-it-works">Delivery Info</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact & App */}
            <div className="footer-col footer-contact-col">
              <h4>Get In Touch</h4>
              <ul className="contact-list">
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <span>+254 700 133456</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@agrilink.co.ke</span>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Agro House, 4th Floor, Nairobi</span>
                </li>
              </ul>

              <h4 className="app-heading">Download Our App</h4>
              <div className="app-badges">
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-badge">
                  <i className="fab fa-google-play"></i>
                  <div>
                    <span className="badge-small">GET IT ON</span>
                    <span className="badge-large">Google Play</span>
                  </div>
                </a>
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" className="app-badge">
                  <i className="fab fa-apple"></i>
                  <div>
                    <span className="badge-small">Download on the</span>
                    <span className="badge-large">App Store</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="copyright">
            © {new Date().getFullYear()} AgroLink. All Rights Reserved. Empowering Kenyan Farmers.
          </p>

          <div className="payment-partners">
            <span className="payment-label">We Accept:</span>
            <div className="payment-icons">
              <div className="payment-icon" title="M-Pesa">
                <i className="fas fa-mobile-alt"></i>
                <span>M-Pesa</span>
              </div>
              <div className="payment-icon" title="Visa">
                <i className="fab fa-cc-visa"></i>
              </div>
              <div className="payment-icon" title="Mastercard">
                <i className="fab fa-cc-mastercard"></i>
              </div>
              <div className="payment-icon" title="PayPal">
                <i className="fab fa-cc-paypal"></i>
              </div>
            </div>
          </div>

          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="separator">•</span>
            <Link to="/status">System Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;