import React from 'react';
import './HowItWorksPage.css';

const HowItWorksPage = () => {
    return (
        <div className="how-it-works-page">
            <div className="page-header">
                <div className="container">
                    <h1>How AgroLink Works</h1>
                    <p>Your one-stop agricultural marketplace connecting farmers and buyers</p>
                </div>
            </div>

            <div className="container py-xl">
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <i className="fas fa-user-plus step-icon"></i>
                        <h3>Create an Account</h3>
                        <p>Sign up easily as either a farmer looking to sell produce, or a buyer looking to purchase fresh agricultural goods.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <i className="fas fa-store step-icon"></i>
                        <h3>List or Browse</h3>
                        <p>Farmers can instantly list their harvested crops with photos and prices. Buyers can browse across multiple categories to find exactly what they need.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <i className="fas fa-comments step-icon"></i>
                        <h3>Connect & Negotiate</h3>
                        <p>Use our built-in real-time chat to discuss quantities, delivery options, and negotiate fair prices directly.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <i className="fas fa-truck-loading step-icon"></i>
                        <h3>Trade Safely</h3>
                        <p>Once finalized, buyers can place orders securely through the platform. Track order statuses from pending to delivered.</p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Ready to get started?</h2>
                    <p>Join thousands of farmers and buyers already using AgroLink.</p>
                    <div className="cta-buttons">
                        <a href="/register?role=farmer" className="btn btn-primary">Join as Farmer</a>
                        <a href="/register?role=buyer" className="btn btn-secondary">Join as Buyer</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;
