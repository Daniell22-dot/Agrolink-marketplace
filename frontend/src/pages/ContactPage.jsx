import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './ContactPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', subject: '', message: ''
    });
    const [sending, setSending] = useState(false);
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }
        setSending(true);
        // Simulate sending
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSending(false);
        }, 1500);
    };

    const faqs = [
        {
            question: 'How do I register as a farmer?',
            answer: 'Click "Join as Farmer" on the homepage, fill in your details including National ID, phone number, and location. Once verified, you can start listing your produce.'
        },
        {
            question: 'How do payments work?',
            answer: 'We support M-Pesa, card payments, and cash on delivery. All online payments go through our secure escrow system — the farmer gets paid only after the buyer confirms delivery.'
        },
        {
            question: 'Is there a fee for using AgriLink?',
            answer: 'Registration is free. A small transaction fee (2.5%) is charged on successful sales to maintain the platform and provide support services.'
        },
        {
            question: 'How do I report a problem with an order?',
            answer: 'Go to "My Orders", select the problematic order, and click "Report Issue". Our support team will investigate and resolve it within 48 hours.'
        },
        {
            question: 'Can I sell in multiple counties?',
            answer: 'Yes! You can list products available for delivery across any county. Buyers can filter products by location and your delivery area.'
        }
    ];

    return (
        <div className="contact-page">
            {/* Header */}
            <section className="contact-hero">
                <h1>Get in Touch</h1>
                <p>Have questions or need help? We're here for you.</p>
            </section>

            <div className="contact-body container">
                <div className="contact-grid">
                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    className="form-control"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message *</label>
                                <textarea
                                    name="message"
                                    className="form-control"
                                    rows="5"
                                    placeholder="Tell us more about your inquiry..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
                                {sending ? (
                                    <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                                ) : (
                                    <><i className="fas fa-paper-plane"></i> Send Message</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="contact-info-section">
                        <h2>Contact Information</h2>
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-icon"><i className="fas fa-envelope"></i></div>
                                <div>
                                    <h4>Email</h4>
                                    <p>support@agrilink.co.ke</p>
                                    <p>info@agrilink.co.ke</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><i className="fas fa-phone-alt"></i></div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+254 700 123 456</p>
                                    <p>+254 733 789 012</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><i className="fas fa-map-marker-alt"></i></div>
                                <div>
                                    <h4>Office</h4>
                                    <p>Westlands, Nairobi</p>
                                    <p>Kenya</p>
                                </div>
                            </div>
                            <div className="info-card">
                                <div className="info-icon"><i className="fas fa-clock"></i></div>
                                <div>
                                    <h4>Working Hours</h4>
                                    <p>Mon - Fri: 8:00 AM - 6:00 PM</p>
                                    <p>Sat: 9:00 AM - 1:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="social-section">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="social-link"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <section className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
                            >
                                <button
                                    className="faq-question"
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                >
                                    <span>{faq.question}</span>
                                    <i className={`fas fa-chevron-${expandedFaq === index ? 'up' : 'down'}`}></i>
                                </button>
                                {expandedFaq === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;
