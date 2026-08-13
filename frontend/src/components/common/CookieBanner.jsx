import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('agrolink_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth page entry
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('agrolink_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('agrolink_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-overlay" role="dialog" aria-live="polite" aria-label="Cookie Preference Banner">
      <div className="cookie-banner-card">
        <div className="cookie-banner-icon">
          <i className="fas fa-cookie-bite"></i>
        </div>
        
        <div className="cookie-banner-content">
          <h4>We Value Your Privacy</h4>
          <p>
            AgroLink uses cookies to personalize content, store your shopping preferences, provide security, 
            and analyze our marketplace traffic. Learn more in our <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </div>

        <div className="cookie-banner-actions">
          <button 
            type="button" 
            className="cookie-btn cookie-decline" 
            onClick={handleDecline}
          >
            Decline Non-Essential
          </button>
          <button 
            type="button" 
            className="cookie-btn cookie-accept" 
            onClick={handleAccept}
          >
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
