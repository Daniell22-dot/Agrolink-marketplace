import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Banner */}
            <section className="about-hero">
                <div className="container about-hero-inner">
                    <div className="about-hero-content">
                        <h1>Empowering Kenya's Agricultural Future</h1>
                        <p>AgroLink bridges the gap between smallholder farmers and buyers, creating a transparent, fair, and efficient agricultural marketplace.</p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="hp-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-text-content">
                            <span className="about-label">Our Story</span>
                            <h2>From Farm to Market, Simplified</h2>
                            <p>
                                Founded to address the challenges in Kenyan agriculture, AgroLink was born from a simple observation: Kenyan farmers
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
                        <div className="about-visual-content">
                            <div className="about-icon-card">
                                <i className="fas fa-seedling"></i>
                                <span>Growing Together</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="hp-section hp-section--light">
                <div className="container">
                    <div className="about-header-center">
                        <span className="about-label">Our Values</span>
                        <h2>What Drives Us</h2>
                    </div>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-balance-scale"></i></div>
                            <h3>Fair Trade</h3>
                            <p>We ensure farmers get fair prices for their produce by providing transparent pricing and direct market access.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-shield-alt"></i></div>
                            <h3>Trust & Security</h3>
                            <p>Every transaction is protected. Verified profiles and secure M-Pesa integration build trust between parties.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-hands-helping"></i></div>
                            <h3>Community First</h3>
                            <p>We empower local farming communities with tools, resources, and insights to build sustainable livelihoods.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon"><i className="fas fa-lightbulb"></i></div>
                            <h3>Innovation</h3>
                            <p>From AI-powered recommendations to real-time geolocation, we use technology to solve agricultural challenges.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Join the AgroLink Community Today</h2>
                        <p>Whether you're a farmer looking for buyers or a buyer seeking fresh produce — we are your marketplace.</p>
                        <div className="cta-buttons">
                            <Link to="/register?role=farmer" className="btn btn-primary btn-lg"><i className="fas fa-tractor"></i> Join as Farmer</Link>
                            <Link to="/register?role=buyer" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--primary-green)', color: 'var(--primary-green)' }}><i className="fas fa-shopping-bag"></i> Join as Buyer</Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
