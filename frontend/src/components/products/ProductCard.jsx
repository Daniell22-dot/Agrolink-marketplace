import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { resolveProductImage } from '../../utils/productImages';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);
  const imageCatalog = useSelector(state => state.products.imageCatalog);

  const displayImage = resolveProductImage(product, imageCatalog);
  const title = product.name || product.title || 'Fresh Produce';
  const price = product.price || 0;
  const originalPrice = product.originalPrice || product.original_price;
  const rating = product.rating || 4;
  const reviewCount = product.reviewCount || product.review_count || Math.floor(Math.random() * 200) + 5;

  const isOutOfStock = product.quantity !== undefined && product.quantity <= 0;
  const isUnavailable = product.isAvailable === false;
  const isDisabled = isOutOfStock || isUnavailable;

  let discountPercentage = null;
  if (originalPrice && price && originalPrice > price) {
    discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (isDisabled) {
      toast.error(`${title} is currently unavailable`);
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<i key={i} className="fas fa-star" />);
      } else if (i - rating < 1 && i - rating > 0) {
        stars.push(<i key={i} className="fas fa-star-half-alt" />);
      } else {
        stars.push(<i key={i} className="far fa-star" />);
      }
    }
    return stars;
  };

  return (
    <Link to={`/product/${product.id}`} className="jk-card">
      <div className="jk-image-wrap">
        {displayImage ? (
          <img
            className="jk-image"
            src={displayImage}
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="jk-placeholder"
          style={{ display: displayImage ? 'none' : 'flex' }}
        />

        {discountPercentage && (
          <span className="jk-badge">-{discountPercentage}%</span>
        )}

        {isDisabled && (
          <div className="jk-sold-out">
            <span>{isOutOfStock ? 'Out of Stock' : 'Unavailable'}</span>
          </div>
        )}
      </div>

      <div className="jk-body">
        <p className="jk-title">{title}</p>

        <div className="jk-rating">
          <span className="jk-stars">{renderStars()}</span>
          <span className="jk-review-num">({reviewCount})</span>
        </div>

        <div className="jk-price-row">
          <span className="jk-price">KES {parseFloat(price).toLocaleString()}</span>
          {discountPercentage && (
            <span className="jk-old-price">KES {parseFloat(originalPrice).toLocaleString()}</span>
          )}
        </div>

        <p className="jk-location">
          <i className="fas fa-map-marker-alt" />
          {product.county || 'Nairobi'}
        </p>

        <button
          className="jk-cart-btn"
          onClick={handleAddToCart}
          disabled={isDisabled}
        >
          <i className="fas fa-shopping-cart" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
