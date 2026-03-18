import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/orderSlice';
import { fetchProducts } from '../redux/slices/productSlice';
import RecommendationCarousel from '../components/products/RecommendationCarousel';
import recommendationService from '../services/recommendationService';
import './DashboardPage.css';

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { orders } = useSelector((state) => state.order);
    const { products } = useSelector((state) => state.products);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalSpent: 0,
        totalProducts: 0,
        totalSales: 0
    });

    useEffect(() => {
        dispatch(fetchOrders({ page: 1, limit: 100 }));
        if (user?.role === 'farmer') {
            dispatch(fetchProducts({ page: 1, limit: 100 }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (orders.length > 0) {
            const pending = orders.filter(o => o.status === 'pending').length;
            const completed = orders.filter(o => o.status === 'delivered').length;
            const spent = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
            setStats(prev => ({
                ...prev,
                totalOrders: orders.length,
                pendingOrders: pending,
                completedOrders: completed,
                totalSpent: spent,
                totalSales: spent
            }));
        }
    }, [orders]);

    useEffect(() => {
        if (products.length > 0) {
            setStats(prev => ({ ...prev, totalProducts: products.length }));
        }
    }, [products]);

    const isFarmer = user?.role === 'farmer';
    const fetchRecentlyViewed = React.useCallback(() => recommendationService.getRecentlyViewed(10), []);

    return (
        <div className="dashboard-page">
            <div className="container">
                {/* Welcome Header */}
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <div className="avatar-circle">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                user?.fullName?.charAt(0)?.toUpperCase() || user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'
                            )}
                        </div>
                        <div>
                            <h1>Welcome back, {user?.fullName || user?.full_name || user?.username || 'User'}!</h1>
                            <p className="role-badge">{isFarmer ? '🌾 Farmer' : '🛒 Buyer'} • {user?.county || user?.location || 'Kenya'}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        {isFarmer ? (
                            <Link to="/products" className="btn btn-primary">
                                <i className="fas fa-plus"></i> List Product
                            </Link>
                        ) : (
                            <Link to="/products" className="btn btn-primary">
                                <i className="fas fa-shopping-bag"></i> Browse Products
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon orders-icon"><i className="fas fa-receipt"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.totalOrders}</span>
                            <span className="stat-label">Total Orders</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pending-icon"><i className="fas fa-clock"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.pendingOrders}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon completed-icon"><i className="fas fa-check-circle"></i></div>
                        <div className="stat-info">
                            <span className="stat-number">{stats.completedOrders}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </div>
                    {isFarmer ? (
                        <div className="stat-card">
                            <div className="stat-icon products-icon"><i className="fas fa-seedling"></i></div>
                            <div className="stat-info">
                                <span className="stat-number">{stats.totalProducts}</span>
                                <span className="stat-label">My Products</span>
                            </div>
                        </div>
                    ) : (
                        <div className="stat-card">
                            <div className="stat-icon spent-icon"><i className="fas fa-wallet"></i></div>
                            <div className="stat-info">
                                <span className="stat-number">KES {stats.totalSpent.toLocaleString()}</span>
                                <span className="stat-label">Total Spent</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dashboard Content Grid */}
                <div className="dashboard-content">
                    {/* Recent Orders */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3><i className="fas fa-history"></i> Recent Orders</h3>
                            <Link to="/orders" className="view-all">View All →</Link>
                        </div>
                        <div className="card-body">
                            {orders.length === 0 ? (
                                <div className="empty-state">
                                    <i className="fas fa-inbox"></i>
                                    <p>No orders yet</p>
                                    <Link to="/products" className="btn btn-outline btn-sm">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="orders-list">
                                    {orders.slice(0, 5).map((order) => (
                                        <Link to={`/order/${order.id}`} key={order.id} className="order-item">
                                            <div className="order-info">
                                                <span className="order-id">Order #{order.id}</span>
                                                <span className="order-date">
                                                    {new Date(order.created_at).toLocaleDateString('en-KE', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="order-meta">
                                                <span className="order-amount">KES {parseFloat(order.total_amount || 0).toLocaleString()}</span>
                                                <span className={`status-badge status-${order.status}`}>{order.status}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions / Products */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
                        </div>
                        <div className="card-body">
                            <div className="quick-actions">
                                <Link to="/products" className="action-btn">
                                    <i className="fas fa-store"></i>
                                    <span>Marketplace</span>
                                </Link>
                                <Link to="/orders" className="action-btn">
                                    <i className="fas fa-box"></i>
                                    <span>My Orders</span>
                                </Link>
                                <Link to="/chat" className="action-btn">
                                    <i className="fas fa-comments"></i>
                                    <span>Messages</span>
                                </Link>
                                <Link to="/profile" className="action-btn">
                                    <i className="fas fa-user-cog"></i>
                                    <span>Settings</span>
                                </Link>
                                <Link to="/cart" className="action-btn">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span>My Cart</span>
                                </Link>
                                {isFarmer && (
                                    <Link to="/products" className="action-btn highlight">
                                        <i className="fas fa-plus-circle"></i>
                                        <span>Add Product</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Viewed (ML Engine) */}
                <div style={{ marginTop: '40px' }}>
                    <RecommendationCarousel
                        title="Recently Viewed"
                        icon="fas fa-history"
                        fetchFn={fetchRecentlyViewed}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
