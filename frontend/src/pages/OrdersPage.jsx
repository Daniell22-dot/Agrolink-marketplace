import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders, setOrderFilters } from '../redux/slices/orderSlice';
import './OrdersPage.css';

const STATUS_TABS = [
    { key: '', label: 'All Orders' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
];

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { orders, isLoading, pagination } = useSelector((state) => state.order);
    const [activeStatus, setActiveStatus] = useState('');

    useEffect(() => {
        dispatch(fetchOrders({ page: 1, limit: 10, status: activeStatus }));
    }, [dispatch, activeStatus]);

    const handleStatusChange = (status) => {
        setActiveStatus(status);
        dispatch(setOrderFilters({ status }));
    };

    const handlePageChange = (page) => {
        dispatch(fetchOrders({ page, limit: 10, status: activeStatus }));
    };

    const filteredOrders = activeStatus
        ? orders.filter(o => o.status === activeStatus)
        : orders;

    return (
        <div className="orders-page">
            <div className="container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track and manage your orders</p>
                </div>

                {/* Status Tabs */}
                <div className="status-tabs">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.key}
                            className={`tab-btn ${activeStatus === tab.key ? 'active' : ''}`}
                            onClick={() => handleStatusChange(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {isLoading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="empty-orders">
                        <i className="fas fa-box-open"></i>
                        <h3>No orders found</h3>
                        <p>{activeStatus ? `No ${activeStatus} orders` : 'You haven\'t placed any orders yet'}</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {filteredOrders.map((order) => (
                            <Link to={`/order/${order.id}`} key={order.id} className="order-card">
                                <div className="order-card-header">
                                    <div>
                                        <span className="order-number">Order #{order.id}</span>
                                        <span className="order-placed">
                                            {new Date(order.created_at).toLocaleDateString('en-KE', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <span className={`status-pill status-${order.status}`}>{order.status}</span>
                                </div>
                                <div className="order-card-body">
                                    <div className="order-detail">
                                        <i className="fas fa-money-bill-wave"></i>
                                        <span>KES {parseFloat(order.total_amount || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="order-detail">
                                        <i className="fas fa-credit-card"></i>
                                        <span>{order.payment_method || 'M-Pesa'}</span>
                                    </div>
                                    <div className="order-detail">
                                        <i className="fas fa-map-pin"></i>
                                        <span>{order.shipping_address ? order.shipping_address.substring(0, 40) + '...' : '—'}</span>
                                    </div>
                                </div>
                                <div className="order-card-footer">
                                    <span className={`payment-status pay-${order.payment_status}`}>
                                        <i className="fas fa-circle"></i> Payment: {order.payment_status || 'pending'}
                                    </span>
                                    <span className="view-link">View Details →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.total > 10 && (
                    <div className="pagination">
                        {Array.from({ length: Math.ceil(pagination.total / 10) }, (_, i) => (
                            <button
                                key={i + 1}
                                className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
