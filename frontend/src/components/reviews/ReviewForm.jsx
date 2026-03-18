import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RatingStars from './RatingStars';

const API_URL = process.env.REACT_APP_API_URL;

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a star rating'); return; }
    if (comment.trim().length < 10) { toast.error('Review comment must be at least 10 characters'); return; }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/reviews`,
        { productId, rating, comment },
        { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = { 1: 'Terrible', 2: 'Poor', 3: 'Average', 4: 'Good', 5: 'Excellent' };

  return (
    <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
      <h4 style={{ margin: '0 0 16px', fontWeight: 700, color: '#111827', fontSize: '15px' }}>
        <i className="fas fa-star" style={{ marginRight: '7px', color: '#f59e0b' }} />
        Write a Review
      </h4>

      <form onSubmit={handleSubmit}>
        {/* Stars */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Your Rating *</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RatingStars rating={rating} size={28} interactive onChange={setRating} />
            {rating > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f59e0b' }}>
                {ratingLabels[rating]}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Your Review * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(min 10 characters)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
              border: '1px solid #d1d5db', outline: 'none',
              resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = '#1C4B2D'}
            onBlur={e => e.target.style.borderColor = '#d1d5db'}
          />
          <div style={{ textAlign: 'right', fontSize: '11px', color: comment.length >= 10 ? '#10b981' : '#9ca3af', marginTop: '4px' }}>
            {comment.length} characters {comment.length < 10 ? `(${10 - comment.length} more needed)` : '✓'}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          style={{
            padding: '10px 24px', borderRadius: '8px', border: 'none',
            background: isSubmitting || rating === 0 ? '#9ca3af' : '#1C4B2D',
            color: '#fff', fontWeight: 700, fontSize: '14px',
            cursor: isSubmitting || rating === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}
        >
          {isSubmitting && <i className="fas fa-spinner fa-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
