import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAgentProfile, fetchMyDeliveries } from '../../redux/slices/deliverySlice';
import SEO from '../../components/seo/SEO';
import './AgentPages.css';

const AgentEarningsPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { deliveries, agentProfile, loading } = useSelector((state) => state.delivery);

    useEffect(() => {
        dispatch(fetchMyAgentProfile());
        dispatch(fetchMyDeliveries());
    }, [dispatch]);

    const completedDeliveries = deliveries.filter(d => d.status === 'delivered');
    const totalEarnings = completedDeliveries.reduce((sum, d) => sum + (parseFloat(d.deliveryFee) || 0), 0);
    const pendingEarnings = deliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status))
        .reduce((sum, d) => sum + (parseFloat(d.deliveryFee) || 0), 0);

    return (
        <div className="agent-page">
            <SEO title="Agent Earnings - AgroLink Kenya" description="Track your delivery earnings and performance." canonical="https://agrolink.co.ke/agent/earnings" noindex />
            <div className="container">
                <div className="agent-header">
                    <Link to="/agent" className="back-link">← Back to Dashboard</Link>
                    <h1>My Earnings</h1>
                </div>

                <div className="earnings-summary">
                    <div className="earnings-card">
                        <span className="earnings-label">Total Earned</span>
                        <span className="earnings-value">KES {totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="earnings-card">
                        <span className="earnings-label">Pending</span>
                        <span className="earnings-value">KES {pendingEarnings.toLocaleString()}</span>
                    </div>
                    <div className="earnings-card">
                        <span className="earnings-label">Completed Deliveries</span>
                        <span className="earnings-value">{completedDeliveries.length}</span>
                    </div>
                </div>

                <div className="delivery-list">
                    <h3>Delivery History</h3>
                    {loading ? (
                        <div className="loading-state"><div className="spinner"></div></div>
                    ) : completedDeliveries.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-receipt"></i>
                            <p>No completed deliveries yet.</p>
                        </div>
                    ) : (
                        completedDeliveries.map(delivery => (
                            <div key={delivery.id} className="delivery-card">
                                <div className="delivery-header">
                                    <span className="delivery-id">Job #{delivery.id}</span>
                                    <span className="delivery-fee">KES {delivery.deliveryFee}</span>
                                </div>
                                <div className="delivery-body">
                                    <p><i className="fas fa-map-marker-alt"></i> {delivery.deliveryAddress}</p>
                                    {delivery.deliveredAt && (
                                        <p><i className="fas fa-check"></i> Completed: {new Date(delivery.deliveredAt).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentEarningsPage;
