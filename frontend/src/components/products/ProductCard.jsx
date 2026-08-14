import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const displayImage = (product.images && product.images.length > 0 ? product.images[0] : null) || product.image_url || product.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop';
  const title = product.name || product.title || 'Fresh Produce';
  const price = product.price || 0;
  const originalPrice = product.originalPrice || product.original_price;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    toast.success(`${title} added to cart!`);
  };

  const isOutOfStock = product.quantity !== undefined && product.quantity <= 0;

  // Calculate discount percentage if originalPrice exists
  let discountPercentage = null;
  if (originalPrice && price && originalPrice > price) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      {/* Image Section */}
      <div className="pc-image-wrapper">
        <img 
          src={displayImage} 
          alt={title} 
          className="pc-image" 
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop';
          }}
        />
        
        {/* Discount / Category Badge */}
        {discountPercentage ? (
          <span className="pc-discount-badge">
            -{discountPercentage}%
          </span>
        ) : product.category ? (
          <span className="pc-category-badge">
            {product.category}
          </span>
        ) : null}

        {/* Wishlist Heart */}
        <button className="pc-wishlist-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <i className="far fa-heart" />
        </button>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="pc-out-of-stock">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="pc-content">
        <h3 className="pc-title">{title}</h3>
        
        {(product.farmer_name || product.county) && (
          <p className="pc-location">
            <i className="fas fa-map-marker-alt" />
            {product.county || 'Nairobi, Kenya'}
          </p>
        )}

        {/* Rating row (Visual only) */}
        <div className="pc-rating">
          <div className="pc-stars">
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star" />
            <i className="fas fa-star-half-alt" />
          </div>
          <span className="pc-rating-count">(4.5)</span>
        </div>

        {/* Price Wrap */}
        <div className="pc-price-wrap">
          <span className="pc-price">
            KES {parseFloat(product.price || 0).toLocaleString()}
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="pc-old-price">
              KES {parseFloat(product.original_price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Low Stock Warning */}
        {!isOutOfStock && product.quantity <= 10 && product.quantity > 0 && (
          <div className="pc-stock-alert">
            <i className="fas fa-bolt" />
            Only {product.quantity} left!
          </div>
        )}

        {/* Footer with Full-width Add to Cart */}
        <div className="pc-footer">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="pc-add-btn"
            title="Add to Cart"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
