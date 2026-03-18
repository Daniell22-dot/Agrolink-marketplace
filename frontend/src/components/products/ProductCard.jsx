import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth);

  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image_url;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };

  const isOutOfStock = product.quantity !== undefined && product.quantity <= 0;

  return (
    <Link
      to={`/product/${product.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* Image */}
        <div style={{ aspectRatio: '4/3', background: '#f0fdf4', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
          {displayImage ? (
            <img src={displayImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-seedling" style={{ fontSize: '48px', color: '#1C4B2D', opacity: 0.3 }} />
            </div>
          )}
          {/* Category badge */}
          {product.category && (
            <span style={{
              position: 'absolute', top: '10px', left: '10px',
              background: 'rgba(28,75,45,0.85)', color: '#fff',
              padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              textTransform: 'capitalize',
            }}>
              {product.category}
            </span>
          )}
          {isOutOfStock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ background: '#ef4444', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '13px' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#111827', lineHeight: 1.3 }}>
            {product.name}
          </h3>
          {(product.farmer_name || product.county) && (
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#6b7280' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '4px', color: '#1C4B2D' }} />
              {product.farmer_name ? `${product.farmer_name} · ` : ''}{product.county || ''}
            </p>
          )}

          {product.description && (
            <p style={{
              margin: '0 0 10px', fontSize: '12px', color: '#6b7280', lineHeight: 1.5, flex: 1,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {product.description}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#1C4B2D' }}>
                KES {parseFloat(product.price || 0).toLocaleString()}
              </span>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}> / {product.unit || 'kg'}</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                padding: '8px 14px', borderRadius: '8px', border: 'none',
                background: isOutOfStock ? '#e5e7eb' : '#1C4B2D',
                color: isOutOfStock ? '#9ca3af' : '#fff',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: '12px',
                display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <i className="fas fa-cart-plus" />
              Add
            </button>
          </div>

          {product.quantity !== undefined && product.quantity > 0 && product.quantity <= 10 && (
            <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '4px' }} />
              Only {product.quantity} {product.unit || 'kg'} left!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
