import React from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../../hooks/useCart';
import { resolveProductImage } from '../../utils/productImages';

const CartItem = ({ item }) => {
    const { updateItemQuantity, removeItem } = useCart();
    const imageCatalog = useSelector(state => state.products.imageCatalog);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        updateItemQuantity(item.productId, newQuantity);
    };

    return (
        <div className="cart-item-card">
            <div className="cart-item-image">
                <img
                    src={resolveProductImage(item, imageCatalog)}
                    alt={item.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop';
                    }}
                />
            </div>
            
            <div className="cart-item-info">
                <div className="cart-item-header">
                    <h3>{item.name}</h3>
                    <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                        <i className="fas fa-trash-alt"></i>
                    </button>
                </div>
                
                <p className="item-unit">{item.unit || 'unit'}</p>
                
                <div className="cart-item-footer">
                    <div className="quantity-controls">
                        <button 
                            className="qty-btn" 
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            <i className="fas fa-minus"></i>
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                            className="qty-btn" 
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                        >
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div className="item-price-info">
                        <span className="unit-price">KES {item.price?.toLocaleString()}</span>
                        <span className="item-subtotal">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
