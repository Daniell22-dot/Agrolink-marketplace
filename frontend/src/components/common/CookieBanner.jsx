import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const DEFAULT_PREFERENCES = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

const STORAGE_KEY = 'agrolink_cookie_preferences';

const loadPreferences = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const panelRef = useRef(null);

  useEffect(() => {
    const existing = loadPreferences();
    if (existing) {
      setPreferences(existing);
      return;
    }
    const timer = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const savePreferences = (prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true, personalization: true });
  };

  const handleRejectNonEssential = () => {
    savePreferences({ ...DEFAULT_PREFERENCES });
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const togglePreference = (key) => {
    if (key === 'essential') return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-bar" role="dialog" aria-live="polite" aria-label="Cookie Preferences">
      <div className="cookie-banner-inner">
        <div className="cookie-banner-left">
          <div className="cookie-banner-icon">
            <i className="fas fa-cookie-bite"></i>
          </div>
          <div className="cookie-banner-text">
            <h4>We Value Your Privacy</h4>
            <p>
              AgroLink uses cookies to personalize content, analyze traffic, and enhance your
              experience. Read our{' '}
              <Link to="/privacy">Privacy Policy</Link> for full details.
            </p>
          </div>
        </div>

        <div className="cookie-banner-actions">
          <button
            type="button"
            className="cookie-btn cookie-btn-manage"
            onClick={() => setShowPanel((v) => !v)}
          >
            <i className={`fas fa-sliders-h`}></i>
            Manage Preferences
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-reject"
            onClick={handleRejectNonEssential}
          >
            Reject Non-Essential
          </button>
          <button
            type="button"
            className="cookie-btn cookie-btn-accept"
            onClick={handleAcceptAll}
          >
            Accept All
          </button>
        </div>
      </div>

      {showPanel && (
        <div className="cookie-prefs-panel" ref={panelRef}>
          <div className="cookie-prefs-header">
            <h5>Cookie Preferences</h5>
            <p>Choose which categories of cookies you allow us to use.</p>
          </div>
          <div className="cookie-prefs-list">
            {[
              { key: 'essential', label: 'Essential', desc: 'Required for the site to function. Cannot be disabled.' },
              { key: 'analytics', label: 'Analytics', desc: 'Help us understand how visitors interact with our marketplace.' },
              { key: 'marketing', label: 'Marketing', desc: 'Used to deliver relevant advertisements and track campaign performance.' },
              { key: 'personalization', label: 'Personalization', desc: 'Allow us to tailor content and recommendations to your preferences.' },
            ].map((item) => (
              <div className="cookie-pref-row" key={item.key}>
                <div className="cookie-pref-info">
                  <span className="cookie-pref-label">{item.label}</span>
                  <span className="cookie-pref-desc">{item.desc}</span>
                </div>
                <label className={`cookie-toggle ${preferences[item.key] ? 'active' : ''} ${item.key === 'essential' ? 'disabled' : ''}`}>
                  <input
                    type="checkbox"
                    checked={preferences[item.key]}
                    disabled={item.key === 'essential'}
                    onChange={() => togglePreference(item.key)}
                  />
                  <span className="cookie-toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
          <div className="cookie-prefs-footer">
            <button
              type="button"
              className="cookie-btn cookie-btn-save"
              onClick={handleSavePreferences}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieBanner;
