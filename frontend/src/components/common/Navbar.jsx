import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/products', label: 'Marketplace' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🌾</span>
          <span style={{ fontWeight: 800, color: '#1C4B2D', fontSize: '18px', letterSpacing: '-0.5px' }}>
            AGRO LINK
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="nav-links-desktop">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 14px', borderRadius: '8px', textDecoration: 'none',
                fontSize: '14px', fontWeight: 500,
                color: isActive(link.to) ? '#1C4B2D' : '#374151',
                background: isActive(link.to) ? '#f0fdf4' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAuthenticated ? (
            <>
              <Link to="/cart" style={{ position: 'relative', padding: '8px', color: '#374151', textDecoration: 'none' }}>
                <i className="fas fa-shopping-cart" style={{ fontSize: '18px' }} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '2px', right: '2px',
                    background: '#1C4B2D', color: '#fff',
                    borderRadius: '50%', fontSize: '10px', fontWeight: 700,
                    width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <Link to="/chat" style={{ padding: '8px', color: '#374151', textDecoration: 'none' }}>
                <i className="fas fa-comments" style={{ fontSize: '18px' }} />
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 12px', borderRadius: '8px', border: '1px solid #e5e7eb',
                    background: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#374151',
                  }}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#1C4B2D', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {(user?.full_name || user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hide-mobile">{user?.full_name?.split(' ')[0] || user?.username || 'Account'}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '10px' }} />
                </button>
                {menuOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                    background: '#fff', borderRadius: '10px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                    minWidth: '180px', zIndex: 200, overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                  }}>
                    {[
                      { to: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
                      { to: '/orders', label: 'My Orders', icon: 'fas fa-box' },
                      { to: '/profile', label: 'Profile', icon: 'fas fa-user-cog' },
                    ].map(item => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '12px 16px', textDecoration: 'none', color: '#374151', fontSize: '14px',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <i className={item.icon} style={{ width: '16px', color: '#1C4B2D' }} />
                        {item.label}
                      </Link>
                    ))}
                    <hr style={{ margin: '4px 0', borderColor: '#e5e7eb' }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                        padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                        color: '#dc2626', fontSize: '14px', textAlign: 'left',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <i className="fas fa-sign-out-alt" style={{ width: '16px' }} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: 600, color: '#1C4B2D',
                  border: '2px solid #1C4B2D',
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
                  fontSize: '14px', fontWeight: 600, color: '#fff', background: '#1C4B2D',
                  border: '2px solid #1C4B2D',
                }}
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '21px', color: '#374151', padding: '6px',
            }}
          >
            <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
