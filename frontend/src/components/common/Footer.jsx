import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="contact-row">
          <div className="contact-info">
            <p>
              <i className="fas fa-envelope"></i>
              Email: info@agrilink.co.ke
            </p>
            <p>
              <i className="fas fa-phone-alt"></i>
              Phone: +254 700 133456
            </p>
          </div>
          <div className="footer-google">
            <i className="fab fa-google-play"></i>
            <span>Google Play</span>
          </div>
        </div>
        
        <div className="footer-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <span>/00220 agrilink. All Rights Reserved</span>
        </div>
        
        <div className="copyright">
          <p>© 2026 AgriLink. Empowering Kenyan farmers</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;