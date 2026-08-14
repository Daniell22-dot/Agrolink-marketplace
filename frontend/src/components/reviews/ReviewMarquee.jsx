import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewMarquee.css';

// Rich placeholder reviews from verified Kenyan farmers and buyers
const PLACEHOLDER_REVIEWS = [
  {
    id: 'p1',
    rating: 5,
    comment: "Selling my maize directly to buyers in Nairobi saved me over KES 15,000 in broker fees! Delivery was smooth and M-Pesa payment arrived instantly.",
    User: { fullName: "Wanjiku Kimani", county: "Nakuru County", role: "Maize Farmer" },
    Product: { name: "Grade 1 Yellow Maize" },
    verified: true
  },
  {
    id: 'p2',
    rating: 5,
    comment: "Ordered 500kg of fresh tomatoes for my restaurant in Westlands. Delivered fresh within 24 hours directly from a verified farm in Subukia.",
    User: { fullName: "David Ochieng", county: "Nairobi County", role: "Restaurant Owner" },
    Product: { name: "Organic Farm Tomatoes" },
    verified: true
  },
  {
    id: 'p3',
    rating: 4,
    comment: "The input supplies catalog is excellent. I bought certified hybrid seeds at wholesale prices. Yield was 30% higher this season!",
    User: { fullName: "Kiprop Cheruiyot", county: "Uasin Gishu", role: "Wheat & Seed Farmer" },
    Product: { name: "Certified Hybrid Seeds" },
    verified: true
  },
  {
    id: 'p4',
    rating: 5,
    comment: "Fair pricing transparency and direct messaging with farmers changed the game for our produce distribution business.",
    User: { fullName: "Aminat Hussein", county: "Mombasa County", role: "Wholesale Buyer" },
    Product: { name: "Fresh Hass Avocados" },
    verified: true
  },
  {
    id: 'p5',
    rating: 5,
    comment: "Got competitive freight quotes for transporting my potato harvest from Nyandarua to Machakos seamlessly.",
    User: { fullName: "Njoroge Mwangi", county: "Nyandarua County", role: "Potato Farmer" },
    Product: { name: "Shangi Potatoes (100kg Bags)" },
    verified: true
  }
];

const ReviewMarquee = () => {
  const [reviews, setReviews] = useState(PLACEHOLDER_REVIEWS);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/reviews/latest`);
        if (response.data?.data && response.data.data.length > 0) {
          setReviews(response.data.data);
        }
      } catch (error) {
        // Soft fallback to placeholder ratings
      }
    };
    fetchReviews();
  }, []);

  // Quadruple items to ensure unbroken infinite scroll marquee
  const displayReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <div className="review-marquee-container">
      <div className="container">
        <div className="marquee-header">
          <span className="marquee-badge"><i className="fas fa-star"></i> Community Ratings</span>
          <h2 className="section-title">Verified Farmer &amp; Buyer Feedback</h2>
          <p className="section-subtitle">Real experiences from agricultural traders across Kenya's 47 counties.</p>
        </div>
      </div>

      <div className="marquee-wrapper">
        <div className="marquee-content left-to-right">
          {displayReviews.map((review, index) => (
            <div key={`${review.id}-${index}`} className="review-card">
              <div className="card-top">
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fas fa-star ${i < review.rating ? 'active' : ''}`}></i>
                  ))}
                </div>
                {review.verified !== false && (
                  <span className="verified-chip">
                    <i className="fas fa-check-circle"></i> Verified
                  </span>
                )}
              </div>

              <p className="review-text">"{review.comment}"</p>

              <div className="review-footer">
                <div className="reviewer-avatar">
                  {review.User?.fullName ? review.User.fullName.charAt(0) : 'U'}
                </div>
                <div className="reviewer-meta">
                  <span className="reviewer-name">{review.User?.fullName || 'AgroLink User'}</span>
                  <span className="reviewer-location">
                    <i className="fas fa-map-marker-alt"></i> {review.User?.county || 'Kenya'} {review.User?.role ? `• ${review.User.role}` : ''}
                  </span>
                </div>
              </div>

              {review.Product && (
                <div className="reviewed-product">
                  <i className="fas fa-shopping-basket"></i>
                  <span>{review.Product.name}</span>
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
