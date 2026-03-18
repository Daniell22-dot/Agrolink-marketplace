import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { startChat } from '../../redux/slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import RatingStars from '../reviews/RatingStars';

const ProductDetails = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;
  const maxQty = product.stock_quantity || 999;

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  const handleContactFarmer = async () => {
    if (!isAuthenticated) { toast.error('Please login to contact the farmer'); return; }
    if (user?.id === product.farmer_id) { toast.error("You can't message yourself"); return; }
    try {
      await dispatch(startChat(product.farmer_id)).unwrap();
      navigate('/chat');
    } catch {
      toast.error('Failed to start chat');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Price & Category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {product.category && (
          <span style={{ padding: '4px 12px', borderRadius: '20px', background: '#f0fdf4', color: '#1C4B2D', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>
            {product.category}
          </span>
        )}
        <span style={{ padding: '4px 12px', borderRadius: '20px', background: isOutOfStock ? '#fef2f2' : '#ecfdf5', color: isOutOfStock ? '#ef4444' : '#10b981', fontSize: '12px', fontWeight: 700 }}>
          {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock_quantity} ${product.unit})`}
        </span>
      </div>

      {/* Name */}
      <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
        {product.name}
      </h1>

      {/* Rating placeholder */}
      {product.average_rating !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RatingStars rating={product.average_rating || 0} size={18} />
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            ({product.review_count || 0} review{product.review_count !== 1 ? 's' : ''})
          </span>
        </div>
      )}

      {/* Price */}
      <div>
        <span style={{ fontSize: '32px', fontWeight: 800, color: '#1C4B2D' }}>
          KES {parseFloat(product.price || 0).toLocaleString()}
        </span>
        <span style={{ fontSize: '16px', color: '#9ca3af', marginLeft: '6px' }}>/ {product.unit || 'kg'}</span>
      </div>

      {/* Description */}
      {product.description && (
        <p style={{ margin: 0, fontSize: '15px', color: '#374151', lineHeight: 1.7 }}>
          {product.description}
        </p>
      )}

      {/* Farmer Info */}
      {(product.farmer_name || product.county) && (
        <div style={{ padding: '14px', background: '#f9fafb', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1C4B2D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
            {(product.farmer_name || 'F').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{product.farmer_name || 'Farmer'}</div>
            {product.county && (
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '4px', color: '#1C4B2D' }} />{product.county}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quantity Selector + Cart */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '10px', overflow: 'hidden' }}>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}
            style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', fontSize: '18px', color: '#374151', fontWeight: 700 }}>−</button>
          <span style={{ padding: '10px 16px', fontWeight: 700, fontSize: '16px', minWidth: '50px', textAlign: 'center', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db' }}>
            {quantity}
          </span>
          <button onClick={() => setQuantity(q => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty}
            style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: quantity >= maxQty ? 'not-allowed' : 'pointer', fontSize: '18px', color: '#374151', fontWeight: 700 }}>+</button>
        </div>
        <span style={{ fontSize: '13px', color: '#9ca3af' }}>{product.unit}</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          style={{ flex: 1, minWidth: '140px', padding: '14px', borderRadius: '10px', border: 'none', background: isOutOfStock ? '#e5e7eb' : '#1C4B2D', color: isOutOfStock ? '#9ca3af' : '#fff', fontWeight: 700, fontSize: '15px', cursor: isOutOfStock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <i className="fas fa-cart-plus" /> Add to Cart
        </button>
        <button
          onClick={handleContactFarmer}
          style={{ flex: 1, minWidth: '140px', padding: '14px', borderRadius: '10px', border: '2px solid #1C4B2D', background: '#fff', color: '#1C4B2D', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <i className="fas fa-comments" /> Contact Farmer
        </button>
      </div>

      {/* Freshness guarantee */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {[
          { icon: 'fas fa-leaf', text: 'Farm Fresh' },
          { icon: 'fas fa-shield-alt', text: 'Quality Assured' },
          { icon: 'fas fa-truck', text: 'Fast Delivery' },
        ].map(item => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6b7280' }}>
            <i className={item.icon} style={{ color: '#1C4B2D' }} />{item.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
