import React from 'react';
import { Link } from 'react-router-dom';
import './TermsPage.css';

const TermsPage = () => {
    return (
        <div className="terms-page">
            <div className="terms-hero">
                <div className="container">
                    <h1>Terms of Service &amp; Returns Policy</h1>
                    <p>AgroLink Kenya — Buyer Protection, Escrow &amp; Refund Policy</p>
                </div>
            </div>

            <div className="container py-xl">
                <div className="terms-content">
                    <section className="terms-section">
                        <h2>1. Marketplace Escrow Guarantee</h2>
                        <p>
                            All produce transactions conducted through M-Pesa on AgroLink are protected by our Escrow Guarantee.
                            When a buyer places an order, payment is safely held until delivery is fulfilled and confirmed.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>2. Produce Inspection &amp; Returns</h2>
                        <p>
                            Due to the perishable nature of agricultural produce (fruits, vegetables, dairy, meat), buyers must inspect goods upon delivery.
                            If produce is damaged, spoiled, or non-compliant with the listed grade, buyers can reject delivery immediately to trigger a full refund.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>3. Refund Processing</h2>
                        <p>
                            Approved refunds are credited directly back to the buyer's M-Pesa account within 24 hours of trade dispute verification.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>4. Seller Obligations</h2>
                        <p>
                            Farmers and agribusiness sellers must accurately represent product grades, weight units, and prices. Misleading listings will result in account suspension under our security protocol.
                        </p>
                    </section>

                    <div className="terms-actions">
                        <Link to="/contact" className="btn btn-primary">Have a dispute? Contact Help Center</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
