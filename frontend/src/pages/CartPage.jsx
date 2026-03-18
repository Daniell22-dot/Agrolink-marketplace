import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/cart/CartItem';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { items, totalPrice, totalItems, isLoading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const deliveryFee = 250;

    const handleCheckout = () => {
        if (!user) {
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Your Shopping Cart</h1>
                    <span className="items-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                </div>

                {isLoading ? (
                    <div className="loading-state glass-panel">
                        <div className="spinner"></div>
                        <p>Optimizing your farm-fresh selection...</p>
                    </div>
                ) : items && items.length > 0 ? (
                    <div className="cart-grid">
                        <div className="cart-main-content">
                            <div className="cart-items-list">
                                {items.map(item => (
                                    <CartItem key={item.productId} item={item} />
                                ))}
                            </div>
                            
                            <Link to="/products" className="back-link">
                                <i className="fas fa-arrow-left"></i> Continue Shopping
                            </Link>
                        </div>

                        <div className="cart-sidebar">
                            <div className="summary-card glass-panel sticky-top">
                                <h2>Order Summary</h2>
                                
                                <div className="summary-details">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>KES {totalPrice?.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Delivery Fee</span>
                                        <span>KES {deliveryFee.toLocaleString()}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Estimated Tax</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    
                                    <div className="summary-divider"></div>
                                    
                                    <div className="summary-row grand-total">
                                        <span>Total</span>
                                        <span>KES {(totalPrice + deliveryFee).toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="checkout-btn premium-btn"
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <div className="secure-payment-badge">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Secure Payment Guaranteed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart-container glass-panel animate-fade-in">
                        <div className="empty-cart-content">
                            <div className="empty-icon-wrapper">
                                <i className="fas fa-shopping-basket"></i>
                            </div>
                            <h2>Your basket is empty</h2>
                            <p>Looks like you haven't added any fresh farm produce to your cart yet.</p>
                            <Link to="/products" className="browse-btn premium-btn">
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
