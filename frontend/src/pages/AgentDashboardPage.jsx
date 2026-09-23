import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyDeliveries, acceptDelivery, updateDeliveryStatus, submitProof } from '../../redux/slices/deliverySlice';
import SEO from '../../components/seo/SEO';
import './AgentPages.css';

const AgentDashboardPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { deliveries, loading } = useSelector((state) => state.delivery);
    const [activeTab, setActiveTab] = useState('available');

    useEffect(() => {
        if (activeTab === 'my-jobs') {
            dispatch(fetchMyDeliveries());
        }
    }, [dispatch, activeTab]);

    const availableDeliveries = deliveries.filter(d => d.status === 'pending' && !d.agentId);
    const myActiveDeliveries = deliveries.filter(d => d.agentId === user?.id && ['assigned', 'picked_up', 'in_transit'].includes(d.status));

    return (
        <div className="agent-page">
            <SEO
                title="Agent Dashboard - AgroLink Kenya"
                description="Manage your delivery jobs, track earnings, and accept new delivery requests."
                canonical="https://agrolink.co.ke/agent"
                noindex
            />
            <div className="container">
                <div className="agent-header">
                    <h1>Delivery Agent Dashboard</h1>
                    <div className="agent-stats">
                        <div className="stat-card">
                            <span className="stat-value">{myActiveDeliveries.length}</span>
                            <span className="stat-label">Active Jobs</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{availableDeliveries.length}</span>
                            <span className="stat-label">Available</span>
                        </div>
                    </div>
                </div>

                <div className="agent-tabs">
                    <button className={`agent-tab ${activeTab === 'available' ? 'active' : ''}`} onClick={() => setActiveTab('available')}>
                        Available Deliveries
                    </button>
                    <button className={`agent-tab ${activeTab === 'my-jobs' ? 'active' : ''}`} onClick={() => setActiveTab('my-jobs')}>
                        My Jobs
                    </button>
                    <Link to="/agent/earnings" className="agent-tab">Earnings</Link>
                </div>

                {activeTab === 'available' && (
                    <div className="delivery-list">
                        {loading ? (
                            <div className="loading-state"><div className="spinner"></div></div>
                        ) : availableDeliveries.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-box-open"></i>
                                <p>No available deliveries right now. Check back later!</p>
                            </div>
                        ) : (
                            availableDeliveries.map(delivery => (
                                <div key={delivery.id} className="delivery-card">
                                    <div className="delivery-header">
                                        <span className="delivery-id">#{delivery.id}</span>
                                        <span className="delivery-fee">KES {delivery.deliveryFee}</span>
                                    </div>
                                    <div className="delivery-body">
                                        <p><i className="fas fa-map-marker-alt"></i> {delivery.deliveryAddress}</p>
                                        <p><i className="fas fa-phone"></i> {delivery.deliveryPhone}</p>
                                        {delivery.deliveryInstructions && (
                                            <p><i className="fas fa-info-circle"></i> {delivery.deliveryInstructions}</p>
                                        )}
                                    </div>
                                    <button className="btn btn-primary" onClick={() => dispatch(acceptDelivery(delivery.id))}>
                                        Accept Delivery
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'my-jobs' && (
                    <div className="delivery-list">
                        {loading ? (
                            <div className="loading-state"><div className="spinner"></div></div>
                        ) : myActiveDeliveries.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-clipboard-list"></i>
                                <p>You haven't accepted any deliveries yet.</p>
                            </div>
                        ) : (
                            myActiveDeliveries.map(delivery => (
                                <div key={delivery.id} className="delivery-card">
                                    <div className="delivery-header">
                                        <span className="delivery-id">Job #{delivery.id}</span>
                                        <span className={`delivery-status status-${delivery.status}`}>{delivery.status.replace('_', ' ')}</span>
                                    </div>
                                    <div className="delivery-body">
                                        <p><i className="fas fa-map-marker-alt"></i> {delivery.deliveryAddress}</p>
                                        <p><i className="fas fa-phone"></i> {delivery.deliveryPhone}</p>
                                    </div>
                                    <div className="delivery-actions">
                                        {delivery.status === 'assigned' && (
                                            <button className="btn btn-primary" onClick={() => dispatch(updateDeliveryStatus({ id: delivery.id, status: 'picked_up' }))}>
                                                Mark Picked Up
                                            </button>
                                        )}
                                        {delivery.status === 'picked_up' && (
                                            <button className="btn btn-primary" onClick={() => dispatch(updateDeliveryStatus({ id: delivery.id, status: 'in_transit' }))}>
                                                Start Transit
                                            </button>
                                        )}
                                        {delivery.status === 'in_transit' && (
                                            <Link to={`/agent/job/${delivery.id}`} className="btn btn-primary">
                                                Complete Delivery
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentDashboardPage;
