import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import logoIcon from '../../assets/icons/12.png';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { totalItems, items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsAccountOpen(false);
    setIsMenuOpen(false);
  };

  const cartCount = totalItems !== undefined 
    ? totalItems 
    : (items?.reduce((sum, i) => sum + i.quantity, 0) || 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/products');
    }
  };

  // Sync search input value with URL search parameter if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchVal(params.get('search') || '');
  }, [location.search]);

  const categories = [
    { id: 'vegetables', label: 'Vegetables', icon: 'fa-carrot' },
    { id: 'fruits', label: 'Fruits', icon: 'fa-apple-alt' },
    { id: 'grains', label: 'Grains', icon: 'fa-seedling' },
    { id: 'livestock', label: 'Livestock', icon: 'fa-cow' },
    { id: 'dairy', label: 'Dairy', icon: 'fa-cheese' },
    { id: 'other', label: 'Other Produce', icon: 'fa-box' }
  ];

  return (
    <header className="header-container animate-fade-in">
      {/* Top Utility Bar */}
      <div className="top-bar">
        <div className="top-bar-content container">
          <div className="top-bar-left">
            <span><i className="fas fa-phone-alt"></i> Hotline: +254 112 219 135</span>
            <span><i className="fas fa-shipping-fast"></i> Countrywide Delivery Available</span>
          </div>
          <div className="top-bar-right">
            <Link to="/how-it-works"><i className="fas fa-question-circle"></i> How it Works</Link>
            <Link to="/about">About Us</Link>
            {user?.role === 'farmer' ? (
              <Link to="/dashboard" className="sell-link"><i className="fas fa-store"></i> Seller Dashboard</Link>
            ) : (
              <Link to="/register?role=farmer" className="sell-link"><i className="fas fa-store"></i> Sell on AgroLink</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="main-header-content container">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logoIcon} alt="AgroLink Logo" className="logo-icon" />
            <span className="logo-text">Agro<span className="logo-highlight">Link</span></span>
          </Link>

          {/* Search Form */}
          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon-inside"></i>
              <input
                type="text"
                placeholder="Search products, categories, farmers..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="header-search-input"
              />
            </div>
            <button type="submit" className="header-search-btn">Search</button>
          </form>

          {/* User Actions */}
          <div className="header-actions">
            {/* Account Menu */}
            {user ? (
              <div 
                className="header-action-item user-dropdown-container"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <div className="user-trigger">
                  <div className="user-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="user-info-text">
                    <span className="user-welcome">Hi, {user.fullName?.split(' ')[0] || user.username}</span>
                    <span className="user-account-label">My Account <i className="fas fa-chevron-down"></i></span>
                  </div>
                </div>
                {isAccountOpen && (
                  <div className="dropdown-menu account-dropdown">
                    <Link to="/dashboard" onClick={() => setIsAccountOpen(false)}><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
                    <Link to="/profile" onClick={() => setIsAccountOpen(false)}><i className="fas fa-user-cog"></i> Profile</Link>
                    <Link to="/orders" onClick={() => setIsAccountOpen(false)}><i className="fas fa-box-open"></i> My Orders</Link>
                    <Link to="/chat" onClick={() => setIsAccountOpen(false)}><i className="fas fa-comments"></i> Messages</Link>
                    {user.role === 'farmer' && (
                      <Link to="/dashboard" onClick={() => setIsAccountOpen(false)}><i className="fas fa-plus-circle"></i> Sell Produce</Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-wrapper">
                <Link to="/login" className="header-btn-login">Login</Link>
                <Link to="/register" className="header-btn-register">Register</Link>
              </div>
            )}

            {/* Cart Link */}
            <Link to="/cart" className="header-action-item cart-trigger">
              <div className="cart-icon-wrapper">
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
              </div>
              <span className="cart-label hide-mobile">Cart</span>
            </Link>

            {/* Mobile Hamburger Menu Trigger */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-bar-content container">
          <div 
            className="categories-dropdown-wrapper"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button className="categories-btn">
              <i className="fas fa-bars"></i> All Categories <i className="fas fa-chevron-down"></i>
            </button>
            {isCategoriesOpen && (
              <ul className="categories-list">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/products?category=${cat.id}`} onClick={() => setIsCategoriesOpen(false)}>
                      <i className={`fas ${cat.icon}`}></i> {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav className="header-navbar">
            <Link to="/">Home</Link>
            <Link to="/products">Marketplace</Link>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
              <img src={logoIcon} alt="AgroLink Logo" className="logo-icon" />
              <span className="logo-text">Agro<span className="logo-highlight">Link</span></span>
            </Link>
            <button className="close-drawer-btn" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Mobile Search */}
          <form className="mobile-search-form" onSubmit={(e) => { handleSearchSubmit(e); setIsMenuOpen(false); }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn"><i className="fas fa-search"></i></button>
          </form>

          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Marketplace</Link></li>
            <li><Link to="/services" onClick={() => setIsMenuOpen(false)}>Services</Link></li>
            <li><Link to="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
            {user ? (
              <>
                <li className="mobile-nav-divider"></li>
                <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link></li>
                <li><Link to="/chat" onClick={() => setIsMenuOpen(false)}>Messages</Link></li>
                <li><button onClick={handleLogout} className="mobile-logout-btn">Logout</button></li>
              </>
            ) : (
              <>
                <li className="mobile-nav-divider"></li>
                <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
                <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;