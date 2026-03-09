import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../redux/slices/orderSlice';
import toast from 'react-hot-toast';
import './OrderDetailPage.css';

const ORDER_STEPS = ['pending', 'approved', 'shipped', 'delivered'];

const OrderDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedOrder: order, isLoading } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await dispatch(cancelOrder(id)).unwrap();
                toast.success('Order cancelled');
            } catch (err) {
                toast.error('Failed to cancel order');
            }
        }
    };

    const getStepIndex = (status) => {
        if (status === 'cancelled') return -1;
        return ORDER_STEPS.indexOf(status);
    };

    if (isLoading) {
        return (
            <div className="order-detail-page">
                <div className="container">
                    <div className="loading-state"><div className="spinner"></div><p>Loading order...</p></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-detail-page">
                <div className="container">
                    <div className="empty-state">
                        <i className="fas fa-exclamation-circle"></i>
                        <h3>Order not found</h3>
                        <Link to="/orders" className="btn btn-primary">Back to Orders</Link>
                    </div>
                </div>
            </div>
        );
    }

    const currentStep = getStepIndex(order.status);

    return (
        <div className="order-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/orders">← Back to Orders</Link>
                </div>

                {/* Order Header */}
                <div className="order-detail-header">
                    <div>
                        <h1>Order #{order.id}</h1>
                        <p className="order-meta-text">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-KE', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="header-right">
                        <span className={`status-pill status-${order.status}`}>{order.status}</span>
                        {order.status === 'pending' && (
                            <button className="btn btn-sm cancel-btn" onClick={handleCancel}>
                                <i className="fas fa-times-circle"></i> Cancel Order
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Timeline */}
                {order.status !== 'cancelled' && (
                    <div className="timeline-card">
                        <h3>Order Progress</h3>
                        <div className="timeline">
                            {ORDER_STEPS.map((step, index) => (
                                <div
                                    key={step}
                                    className={`timeline-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
                                >
                                    <div className="step-dot">
                                        {index <= currentStep ? <i className="fas fa-check"></i> : <span>{index + 1}</span>}
                                    </div>
                                    <span className="step-label">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {order.status === 'cancelled' && (
                    <div className="cancelled-banner">
                        <i className="fas fa-ban"></i>
                        <span>This order has been cancelled</span>
                    </div>
                )}

                {/* Order Content Grid */}
                <div className="order-detail-grid">
                    {/* Order Items */}
                    <div className="detail-card">
                        <h3><i className="fas fa-box"></i> Order Items</h3>
                        <div className="items-list">
                            {order.items && order.items.length > 0 ? (
                                order.items.map((item, index) => (
                                    <div key={index} className="item-row">
                                        <div className="item-info">
                                            <span className="item-name">{item.product_name || `Product #${item.product_id}`}</span>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <div className="item-prices">
                                            <span className="item-unit">KES {parseFloat(item.price || 0).toLocaleString()} each</span>
                                            <span className="item-subtotal">KES {parseFloat(item.subtotal || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-items">Order items details not available</p>
                            )}
                        </div>
                        <div className="order-total">
                            <span>Total Amount</span>
                            <span className="total-amount">KES {parseFloat(order.total_amount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Order Info */}
                    <div className="info-stack">
                        <div className="detail-card">
                            <h3><i className="fas fa-credit-card"></i> Payment</h3>
                            <div className="info-list">
                                <div className="info-row">
                                    <span>Method</span>
                                    <span className="info-value">{order.payment_method || 'M-Pesa'}</span>
                                </div>
                                <div className="info-row">
                                    <span>Status</span>
                                    <span className={`info-value pay-${order.payment_status}`}>{order.payment_status || 'pending'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-card">
                            <h3><i className="fas fa-truck"></i> Delivery</h3>
                            <div className="info-list">
                                <div className="info-row">
                                    <span>Address</span>
                                    <span className="info-value">{order.shipping_address || '—'}</span>
                                </div>
                                <div className="info-row">
                                    <span>Phone</span>
                                    <span className="info-value">{order.contact_phone || '—'}</span>
                                </div>
                                {order.delivery_notes && (
                                    <div className="info-row">
                                        <span>Notes</span>
                                        <span className="info-value">{order.delivery_notes}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
