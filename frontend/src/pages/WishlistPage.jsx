import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import './WishlistPage.css';

const SAMPLE_WISHLIST = [
  { id: 'w1', title: 'Certified Hybrid Maize Seed (2kg)', price: 450, originalPrice: 650, category: 'seeds', county: 'Uasin Gishu', rating: 4.8, images: ['/images/Maize1.jpg'], farmer: { fullName: 'Eldoret Seed Co-op' } },
  { id: 'w2', title: 'NPK 50kg Fertilizer Bag', price: 3200, originalPrice: 4500, category: 'fertilizers', county: 'Nakuru', rating: 4.7, images: ['/images/DAP fertilizer.jpg'], farmer: { fullName: 'Rift Valley Agro Inputs' } },
  { id: 'w3', title: 'Drip Irrigation Kit (50m)', price: 2800, originalPrice: 3800, category: 'farm-inputs', county: 'Kisumu', rating: 4.9, images: ['/images/Drip Irrigation.jpg'], farmer: { fullName: 'Lake Irrigation Systems' } },
  { id: 'w4', title: 'Garden Hand Tools Set (8pc)', price: 1500, originalPrice: 2200, category: 'tools', county: 'Nairobi', rating: 4.6, images: ['/images/Farm tools.jpg'], farmer: { fullName: 'Nairobi Agri Mart' } },
  { id: 'w5', title: 'Fresh Hass Avocados (10kg Box)', price: 1800, originalPrice: 2200, category: 'fruits', county: "Murang'a", rating: 5.0, images: ['/images/Avocado.jpg'], farmer: { fullName: 'Highland Avocado Orchards' } },
];

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('agrolink_wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch {
        setWishlist(SAMPLE_WISHLIST);
        localStorage.setItem('agrolink_wishlist', JSON.stringify(SAMPLE_WISHLIST));
      }
    } else {
      setWishlist(SAMPLE_WISHLIST);
      localStorage.setItem('agrolink_wishlist', JSON.stringify(SAMPLE_WISHLIST));
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(p => p.id !== id);
    setWishlist(updated);
    localStorage.setItem('agrolink_wishlist', JSON.stringify(updated));
  };

  const clearAll = () => {
    setWishlist([]);
    localStorage.setItem('agrolink_wishlist', JSON.stringify([]));
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        {/* Breadcrumb */}
        <div className="wishlist-breadcrumb">
          <Link to="/">Home</Link>
          <span><i className="fas fa-chevron-right" /></span>
          <span className="current">My Wishlist</span>
        </div>

        {/* Header */}
        <div className="wishlist-header">
          <div className="wishlist-header-left">
            <i className="fas fa-heart" />
            <h1>My Wishlist</h1>
            <span className="wishlist-count">{wishlist.length} items</span>
          </div>
          {wishlist.length > 0 && (
            <button className="wishlist-clear-btn" onClick={clearAll}>
              <i className="fas fa-trash-alt" /> Clear All
            </button>
          )}
        </div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
             <img src="/images/Water.jpg" alt="Empty Wishlist" className="wishlist-empty-img" />
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love to your wishlist and come back anytime.</p>
            <Link to="/products" className="wishlist-shop-btn">
              <i className="fas fa-shopping-bag" /> Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-grid">
              {wishlist.map(product => (
                <div key={product.id} className="wishlist-card-wrapper">
                  <ProductCard product={product} />
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>
              ))}
            </div>
            <div className="wishlist-footer-actions">
              <Link to="/products" className="wishlist-continue-btn">
                <i className="fas fa-arrow-left" /> Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
