import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, total } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        shippingAddress: '',
        contactPhone: user?.phone || '',
        paymentMethod: 'mpesa',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.shippingAddress) newErrors.shippingAddress = 'Address is required';
        if (!formData.contactPhone) newErrors.contactPhone = 'Phone is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            // Create order
            // dispatch(createOrder(formData));
            // Redirect to payment
            navigate('/orders');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>

                <div className="checkout-container">
                    {/* Checkout Form */}
                    <div className="checkout-form">
                        <form onSubmit={handleSubmit}>
                            {/* Shipping Information */}
                            <div className="form-section card">
                                <h3><i className="fas fa-shipping-fast"></i> Delivery Information</h3>

                                <div className="form-group">
                                    <label className="form-label">Shipping Address *</label>
                                    <textarea
                                        className={`form-control ${errors.shippingAddress ? 'error' : ''}`}
                                        rows="3"
                                        placeholder="Enter your full delivery address"
                                        value={formData.shippingAddress}
                                        onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                                    />
                                    {errors.shippingAddress && <span className="error-text">{errors.shippingAddress}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Contact Phone *</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.contactPhone ? 'error' : ''}`}
                                        placeholder="0712345678"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    />
                                    {errors.contactPhone && <span className="error-text">{errors.contactPhone}</span>}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="form-section card">
                                <h3><i className="fas fa-credit-card"></i> Payment Method</h3>

                                <div className="payment-options">
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="mpesa"
                                            checked={formData.paymentMethod === 'mpesa'}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        />
                                        <div className="payment-card">
                                            <i className="fas fa-mobile-alt"></i>
                                            <div>
                                                <strong>M-Pesa</strong>
                                                <p>Pay securely with M-Pesa</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        />
                                        <div className="payment-card">
                                            <i className="fas fa-credit-card"></i>
                                            <div>
                                                <strong>Credit/Debit Card</strong>
                                                <p>Visa, Mastercard accepted</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg">
                                Place Order
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary card">
                        <h3>Order Summary</h3>

                        <div className="summary-items">
                            {items?.map(item => (
                                <div key={item.productId} className="summary-item">
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                    </div>
                                    <span className="item-price">KES {(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>KES {total?.toLocaleString() || 0}</span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>KES 200</span>
                        </div>

                        <div className="summary-row total">
                            <span>Total</span>
                            <span>KES {((total || 0) + 200).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
