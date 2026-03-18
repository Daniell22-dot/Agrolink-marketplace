import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isFarmer = user?.role === 'farmer';

  const links = [
    { to: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { to: '/orders', icon: 'fas fa-box', label: 'My Orders' },
    { to: '/cart', icon: 'fas fa-shopping-cart', label: 'Cart' },
    { to: '/chat', icon: 'fas fa-comments', label: 'Messages' },
    { to: '/profile', icon: 'fas fa-user-cog', label: 'Profile' },
    ...(isFarmer ? [{ to: '/products', icon: 'fas fa-seedling', label: 'Manage Products' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
          onClick={onClose}
        />
      )}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '260px', zIndex: 300,
        background: '#fff', boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <Link to="/" onClick={onClose} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '22px' }}>🌾</span>
            <span style={{ fontWeight: 800, color: '#1C4B2D', fontSize: '16px' }}>AGRO LINK</span>
          </Link>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '18px' }}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', background: '#1C4B2D',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, overflow: 'hidden'
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user?.fullName || user?.full_name || user?.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                  {user?.fullName || user?.full_name || user?.username}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {isFarmer ? '🌾 Farmer' : '🛒 Buyer'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
                color: isActive(link.to) ? '#1C4B2D' : '#374151',
                background: isActive(link.to) ? '#f0fdf4' : 'transparent',
                borderLeft: isActive(link.to) ? '3px solid #1C4B2D' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <i className={link.icon} style={{ width: '18px', textAlign: 'center' }} />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
