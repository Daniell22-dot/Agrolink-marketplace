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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchVal(params.get('search') || '');
  }, [location.search]);

  const categories = [
    { id: 'vegetables', label: 'Vegetables' },
    { id: 'fruits', label: 'Fruits' },
    { id: 'grains', label: 'Grains & Cereals' },
    { id: 'livestock', label: 'Livestock' },
    { id: 'dairy', label: 'Dairy & Eggs' },
    { id: 'herbs', label: 'Herbs & Spices' },
    { id: 'other', label: 'Other Produce' },
  ];

  const navLinks = [
    { to: '/products?deal=true', label: 'Flash Deals' },
    { to: '/products?category=farm-inputs', label: 'Farm Inputs' },
    { to: '/products?category=seeds', label: 'Seeds' },
    { to: '/products?category=fertilizers', label: 'Fertilizers' },
    { to: '/products?category=tools', label: 'Farm Tools' },
    { to: '/products?category=livestock', label: 'Livestock' },
    { to: '/products?category=dairy', label: 'Dairy' },
    { to: '/products?deal=true', label: 'Deals' },
  ];

  return (
    <header className="header-container">
      {/* ── Top Utility Bar ── */}
      <div className="top-bar">
        <div className="top-bar-content container">
          <div className="top-bar-left">
            <a href="#" className="top-bar-link"><i className="fas fa-mobile-alt"></i> Download the App</a>
            <Link to="/orders" className="top-bar-link"><i className="fas fa-truck"></i> Track your order</Link>
            {user?.role === 'farmer' ? (
              <Link to="/dashboard" className="top-bar-link top-bar-sell"><i className="fas fa-store"></i> Seller Dashboard</Link>
            ) : (
              <Link to="/register?role=farmer" className="top-bar-link top-bar-sell"><i className="fas fa-store"></i> Sell on AgroLink</Link>
            )}
            <Link to="/contact" className="top-bar-link"><i className="fas fa-question-circle"></i> Help</Link>
          </div>
          <div className="top-bar-right">
            <span className="top-bar-lang"><i className="fas fa-globe"></i> EN <i className="fas fa-chevron-down"></i></span>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="main-header">
        <div className="main-header-content container">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={logoIcon} alt="AgroLink" className="logo-icon" />
            <span className="logo-text">Agro<span className="logo-highlight">Link</span></span>
          </Link>

          {/* Search Form — Jumia/Kilimall style */}
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              placeholder="Search products, categories, farmers..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>

          {/* Right Actions */}
          <div className="header-actions">
            {/* Account */}
            {user ? (
              <div
                className="action-item account-wrapper"
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
              >
                <div className="account-trigger">
                  <i className="fas fa-user"></i>
                  <div className="account-text">
                    <span className="account-greeting">Hello, {user.fullName?.split(' ')[0] || user.username}</span>
                    <span className="account-label">Account <i className="fas fa-chevron-down"></i></span>
                  </div>
                </div>
                {isAccountOpen && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard" onClick={() => setIsAccountOpen(false)}>Dashboard</Link>
                    <Link to="/profile" onClick={() => setIsAccountOpen(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setIsAccountOpen(false)}>My Orders</Link>
                    <Link to="/chat" onClick={() => setIsAccountOpen(false)}>Messages</Link>
                    {user.role === 'farmer' && (
                      <Link to="/dashboard" onClick={() => setIsAccountOpen(false)}>Sell Produce</Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="action-item account-trigger no-user">
                <i className="fas fa-user"></i>
                <div className="account-text">
                  <span className="account-greeting">Hello</span>
                  <span className="account-label">Sign In <i className="fas fa-chevron-down"></i></span>
                </div>
              </Link>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="action-item wishlist-trigger">
              <i className="fas fa-heart"></i>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-item cart-trigger">
              <div className="cart-icon-box">
                <i className="fas fa-shopping-cart"></i>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* Mobile hamburger */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </div>
      </div>

      {/* ── Category Nav Bar (Green) ── */}
      <div className="cat-nav">
        <div className="cat-nav-content container">
          <div
            className="cat-dropdown"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button className="cat-dropdown-btn">
              <i className="fas fa-bars"></i> All Categories <i className="fas fa-chevron-down"></i>
            </button>
            {isCategoriesOpen && (
              <ul className="cat-dropdown-list">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/products?category=${cat.id}`} onClick={() => setIsCategoriesOpen(false)}>
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav className="cat-nav-links">
            {navLinks.map((link, idx) => (
              <Link to={link.to} key={idx} className={link.label === 'Flash Deals' || link.label === 'Deals' ? 'nav-deal-link' : ''}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-overlay" onClick={() => setIsMenuOpen(false)}></div>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
              <img src={logoIcon} alt="AgroLink" className="logo-icon" />
              <span className="logo-text">Agro<span className="logo-highlight">Link</span></span>
            </Link>
            <button className="close-drawer-btn" onClick={() => setIsMenuOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Mobile search */}
          <form className="mobile-search" onSubmit={(e) => { handleSearchSubmit(e); setIsMenuOpen(false); }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-btn"><i className="fas fa-search"></i></button>
          </form>

          {/* Mobile categories */}
          <div className="mobile-section-title">Categories</div>
          <ul className="mobile-cat-list">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link to={`/products?category=${cat.id}`} onClick={() => setIsMenuOpen(false)}>{cat.label}</Link>
              </li>
            ))}
          </ul>

          <div className="mobile-divider"></div>

          {/* Mobile nav */}
          <div className="mobile-section-title">Menu</div>
          <ul className="mobile-nav-list">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>All Products</Link></li>
            {navLinks.map((link, idx) => (
              <li key={idx}><Link to={link.to} onClick={() => setIsMenuOpen(false)}>{link.label}</Link></li>
            ))}
          </ul>

          <div className="mobile-divider"></div>

          {user ? (
            <>
              <div className="mobile-section-title">Account</div>
              <ul className="mobile-nav-list">
                <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
                <li><Link to="/orders" onClick={() => setIsMenuOpen(false)}>My Orders</Link></li>
                <li><Link to="/chat" onClick={() => setIsMenuOpen(false)}>Messages</Link></li>
                <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link></li>
                <li><button onClick={handleLogout} className="mobile-logout-btn">Logout</button></li>
              </ul>
            </>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-register-btn" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
