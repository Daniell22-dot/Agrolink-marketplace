import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Banner */}
            <section className="about-hero">
                <div className="about-hero-overlay"></div>
                <div className="about-hero-content">
                    <h1>Empowering Kenya's Agricultural Future</h1>
                    <p>AgriLink bridges the gap between smallholder farmers and buyers, creating a transparent, fair, and efficient agricultural marketplace.</p>
                </div>
            </section>

            {/* Our Story */}
            <section className="about-story">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-text">
                            <span className="section-label">Our Story</span>
                            <h2>From Farm to Market, Simplified</h2>
                            <p>
                                Founded in 2024, AgriLink was born from a simple observation: Kenyan farmers
                                struggle to access fair markets, while buyers lack reliable sources of fresh,
                                quality produce. Our platform eliminates the middlemen, connecting farmers
                                directly to buyers across all 47 counties.
                            </p>
                            <p>
                                We leverage technology — geolocation, secure M-Pesa payments, and real-time
                                communication — to make agricultural trade accessible, transparent, and
                                profitable for everyone involved.
                            </p>
                        </div>
                        <div className="story-visual">
                            <div className="story-icon-card">
                                <i className="fas fa-seedling"></i>
                                <span>Growing Together</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="about-impact">
                <div className="container">
                    <span className="section-label light">Our Impact</span>
                    <h2>Making a Difference Across Kenya</h2>
                    <div className="impact-grid">
                        <div className="impact-card">
                            <div className="impact-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>5,000+</h3>
                            <p>Registered Farmers</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">
                                <i className="fas fa-shopping-basket"></i>
                            </div>
                            <h3>12,000+</h3>
                            <p>Transactions Completed</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>47</h3>
                            <p>Counties Covered</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">
                                <i className="fas fa-money-bill-wave"></i>
                            </div>
                            <h3>KES 50M+</h3>
                            <p>Farmer Earnings</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-values">
                <div className="container">
                    <span className="section-label">Our Values</span>
                    <h2>What Drives Us</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-balance-scale"></i></div>
                            <h3>Fair Trade</h3>
                            <p>We ensure farmers get fair prices for their produce by eliminating exploitative middlemen and providing transparent pricing.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-shield-alt"></i></div>
                            <h3>Trust & Security</h3>
                            <p>Every transaction is protected with escrow payments. Verified profiles and reviews build trust between parties.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-hands-helping"></i></div>
                            <h3>Community First</h3>
                            <p>We empower local farming communities with tools, resources, and direct market access to build sustainable livelihoods.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-lightbulb"></i></div>
                            <h3>Innovation</h3>
                            <p>From AI-powered recommendations to real-time geolocation, we use technology to solve real agricultural challenges.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Join the AgriLink Community Today</h2>
                        <p>Whether you're a farmer looking for buyers or a buyer seeking fresh, quality produce — AgriLink is your marketplace.</p>
                        <div className="cta-buttons">
                            <Link to="/register?role=farmer" className="btn btn-primary btn-lg">Join as Farmer</Link>
                            <Link to="/register?role=buyer" className="btn btn-secondary btn-lg">Join as Buyer</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
