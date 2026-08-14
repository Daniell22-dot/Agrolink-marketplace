import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FaqPage.css';

const FAQ_ITEMS = [
    {
        q: 'How does trading work on AgroLink?',
        a: 'Farmers and suppliers list their produce or agricultural services. Buyers can browse, contact sellers directly, or place orders through our secure M-Pesa escrow system.'
    },
    {
        q: 'How does the M-Pesa Escrow Payment Guarantee work?',
        a: 'When you place an order, your payment is held safely in escrow. Funds are only released to the farmer or seller once you verify delivery of your produce.'
    },
    {
        q: 'Can I order produce without creating an account?',
        a: 'You can freely browse products, prices, and categories without logging in. To place an order, add items to your cart, or chat with sellers, you will need to register a free account.'
    },
    {
        q: 'How are delivery and transport handled?',
        a: 'Sellers specify delivery options on their listings. You can also explore our dedicated Transport & Logistics services page to book refrigerated trucks or local freight.'
    },
    {
        q: 'What happens if a product is out of stock?',
        a: 'Products show real-time stock levels. If an item is depleted, it displays an "Out of Stock" badge so you are immediately notified.'
    },
    {
        q: 'How can I register as a seller or farmer?',
        a: 'Click "Sell on AgroLink" in the top bar or sign up with a Farmer account to access the Seller Dashboard and list your harvest.'
    }
];

const FaqPage = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div className="faq-page">
            <div className="faq-hero">
                <div className="container">
                    <h1>Frequently Asked Questions</h1>
                    <p>Everything you need to know about trading, payments, and delivery on AgroLink</p>
                </div>
            </div>

            <div className="container py-xl">
                <div className="faq-content-box">
                    {FAQ_ITEMS.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`faq-item ${openIndex === idx ? 'open' : ''}`}
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        >
                            <div className="faq-question">
                                <h3>{item.q}</h3>
                                <i className={`fas ${openIndex === idx ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                            </div>
                            {openIndex === idx && (
                                <div className="faq-answer">
                                    <p>{item.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="faq-contact-card">
                    <h3>Still have questions?</h3>
                    <p>Our trade support team is available 24/7 to assist you.</p>
                    <Link to="/contact" className="btn btn-primary">Contact Help Center</Link>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
