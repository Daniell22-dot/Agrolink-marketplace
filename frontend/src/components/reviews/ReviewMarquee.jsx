import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewMarquee.css';

const ReviewMarquee = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/latest`);
                setReviews(response.data.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading || reviews.length === 0) return null;

    // Duplicate reviews to ensure seamless loop if small count
    const displayReviews = [...reviews, ...reviews, ...reviews];

    return (
        <div className="review-marquee-container">
            <h2 className="section-title">What Our Community Says</h2>
            <div className="marquee-wrapper">
                <div className="marquee-content">
                    {displayReviews.map((review, index) => (
                        <div key={`${review.id}-${index}`} className="review-card">
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star ${i < review.rating ? 'active' : ''}`}></i>
                                ))}
                            </div>
                            <p className="review-text">"{review.comment}"</p>
                            <div className="review-footer">
                                <span className="reviewer-name">{review.User.fullName}</span>
                                <span className="reviewer-location">{review.User.county}</span>
                            </div>
                            {review.Product && (
                                <div className="reviewed-product">
                                    <span>Reviewed: {review.Product.name}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewMarquee;
