import React from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../../assets/icons/12.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-info">
            <Link to="/" className="footer-logo">
              <img src={logoIcon} alt="AgroLink Logo" />
              Agro<span>Link</span>
            </Link>
            <p className="footer-desc">
              Empowering Kenya's farmers through technology and direct market linkages.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/contact">Help Center</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="contact-list">
              <li>
                <i className="fas fa-phone-alt"></i>
                <div>
                  <span>Phone</span>
                  <p>+254 700 133456</p>
                </div>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <div>
                  <span>Email</span>
                  <p>info@agrilink.co.ke</p>
                </div>
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <span>HQ Address</span>
                  <p>Agro House, 4th Floor<br />Nairobi, Kenya</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Get Our App</h3>
            <p className="app-text">Available on Google Play Store</p>
            <div className="footer-play-badge">
              <i className="fab fa-google-play"></i>
              <div className="badge-text">
                <span className="badge-small">GET IT ON</span>
                <span className="badge-large">Google Play</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 AgriLink. All Rights Reserved. Empowering Kenyan Farmers.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;