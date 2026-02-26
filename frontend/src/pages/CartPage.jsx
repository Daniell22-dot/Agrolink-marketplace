import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/cart/CartItem';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { items, total, loading } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Fetch cart items
    }, []);

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
                <h1 className="page-title">Shopping Cart</h1>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your cart...</p>
                    </div>
                ) : items && items.length > 0 ? (
                    <div className="cart-container">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {items.map(item => (
                                <CartItem key={item.productId} item={item} />
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary card">
                            <h3>Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal ({items.length} items)</span>
                                <span>KES {total?.toLocaleString() || 0}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>KES {(200).toLocaleString()}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>KES {((total || 0) + 200).toLocaleString()}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary btn-lg"
                            >
                                Proceed to Checkout
                            </button>

                            <Link to="/products" className="continue-shopping">
                                <i className="fas fa-arrow-left"></i> Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <i className="fas fa-shopping-cart"></i>
                        <h2>Your cart is empty</h2>
                        <p>Start adding products to your cart</p>
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
