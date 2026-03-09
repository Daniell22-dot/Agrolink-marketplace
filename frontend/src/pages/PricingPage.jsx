import React from 'react';
import './PricingPage.css';

const PricingPage = () => {
    return (
        <div className="pricing-page">
            <div className="page-header">
                <div className="container">
                    <h1>Simple, Transparent Pricing</h1>
                    <p>AgroLink is free for buyers. Farmers only pay a small commission on successful sales.</p>
                </div>
            </div>

            <div className="container py-xl">
                <div className="pricing-cards">
                    {/* Buyer Plan */}
                    <div className="pricing-card">
                        <div className="pricing-header">
                            <h3>For Buyers</h3>
                            <div className="price">
                                <span className="currency">Ksh</span>
                                <span className="amount">0</span>
                                <span className="period">/forever</span>
                            </div>
                            <p>Perfect for individuals, restaurants, and wholesalers.</p>
                        </div>
                        <ul className="pricing-features">
                            <li><i className="fas fa-check"></i> Browse all farm products</li>
                            <li><i className="fas fa-check"></i> Chat directly with farmers</li>
                            <li><i className="fas fa-check"></i> Secure escrow payments</li>
                            <li><i className="fas fa-check"></i> Order tracking & history</li>
                            <li><i className="fas fa-check"></i> ML-powered recommendations</li>
                        </ul>
                        <div className="pricing-footer">
                            <a href="/register?role=buyer" className="btn btn-outline btn-full">Create Free Buyer Account</a>
                        </div>
                    </div>

                    {/* Farmer Plan */}
                    <div className="pricing-card featured">
                        <div className="popular-badge">Most Popular</div>
                        <div className="pricing-header">
                            <h3>For Farmers</h3>
                            <div className="price">
                                <span className="amount">5%</span>
                                <span className="period"> commission</span>
                            </div>
                            <p>Only pay when you sell. No subscription fees.</p>
                        </div>
                        <ul className="pricing-features">
                            <li><i className="fas fa-check"></i> Unlimited product listings</li>
                            <li><i className="fas fa-check"></i> Direct chat with buyers</li>
                            <li><i className="fas fa-check"></i> Guaranteed payouts</li>
                            <li><i className="fas fa-check"></i> Sales analytics dashboard</li>
                            <li><i className="fas fa-check"></i> Premium support</li>
                            <li><i className="fas fa-check"></i> Featured listings access</li>
                        </ul>
                        <div className="pricing-footer">
                            <a href="/register?role=farmer" className="btn btn-primary btn-full">Start Selling Today</a>
                        </div>
                    </div>
                </div>

                <div className="faq-preview text-center py-lg">
                    <h2>Enterprise & Cooperatives?</h2>
                    <p>Are you an agribusiness or farmer cooperative with high volume? Contact us for custom enterprise rates.</p>
                    <a href="/contact" className="btn btn-secondary mt-1">Contact Sales</a>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;
