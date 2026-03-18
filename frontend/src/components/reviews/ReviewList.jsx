import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RatingStars from './RatingStars';

const API_URL = process.env.REACT_APP_API_URL;

const ReviewList = ({ productId, refreshKey }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    if (!productId) return;
    setIsLoading(true);
    axios.get(`${API_URL}/reviews/${productId}`)
      .then(res => {
        const data = res.data?.data || res.data || [];
        setReviews(Array.isArray(data) ? data : []);
        if (data.length > 0) {
          const avg = data.reduce((sum, r) => sum + (r.rating || 0), 0) / data.length;
          setAvgRating(avg);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, [productId, refreshKey]);

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: reviews.length ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '30px' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #1C4B2D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
          <i className="fas fa-comment-slash" style={{ fontSize: '32px', color: '#d1d5db', marginBottom: '10px' }} />
          <p style={{ margin: 0, fontWeight: 600 }}>No reviews yet</p>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>Be the first to review this product!</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div style={{ display: 'flex', gap: '32px', padding: '20px', background: '#f9fafb', borderRadius: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{avgRating.toFixed(1)}</div>
              <RatingStars rating={avgRating} size={20} />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ flex: 1, minWidth: '140px' }}>
              {distribution.map(({ star, count, pct }) => (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#374151', width: '12px', textAlign: 'right' }}>{star}</span>
                  <i className="fas fa-star" style={{ fontSize: '11px', color: '#f59e0b' }} />
                  <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#e5e7eb', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: '4px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', width: '24px' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map((review, i) => (
              <div key={review.id || i} style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1C4B2D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                      {(review.reviewer_name || review.user?.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                        {review.reviewer_name || review.user?.full_name || 'Anonymous'}
                      </div>
                      <RatingStars rating={review.rating || 0} size={13} />
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>{formatDate(review.created_at)}</span>
                </div>
                {review.comment && (
                  <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewList;
