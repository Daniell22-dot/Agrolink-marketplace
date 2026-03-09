import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import api from '../services/api';
import recommendationService from '../services/recommendationService';
import RecommendationCarousel from '../components/products/RecommendationCarousel';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedProduct: product, isLoading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchSimilar = React.useCallback(() => recommendationService.getSimilar(id, 8), [id]);

    useEffect(() => {
        dispatch(fetchProductById(id));
        fetchReviews();
        // Track view for recommendations
        if (user) {
            api.post('/recommendations/track', {
                productId: parseInt(id),
                interactionType: 'view'
            }).catch(() => { });
        }
    }, [dispatch, id, user]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews/product/${id}`);
            setReviews(response.data.data || []);
        } catch (error) {
            // Reviews may not exist yet
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please log in to add items to cart');
            navigate('/login');
            return;
        }
        dispatch(addToCart({ productId: parseInt(id), quantity }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewForm.comment.trim()) {
            toast.error('Please write a review');
            return;
        }
        setSubmittingReview(true);
        try {
            await api.post(`/reviews`, {
                productId: parseInt(id),
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            toast.success('Review submitted!');
            setReviewForm({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const images = product?.images || [];
    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    if (isLoading) {
        return (
            <div className="product-detail-page">
                <div className="container"><div className="loading-state"><div className="spinner"></div><p>Loading product...</p></div></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="empty-state">
                        <i className="fas fa-search"></i>
                        <h3>Product not found</h3>
                        <Link to="/products" className="btn btn-primary">Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/products">← Back to Products</Link>
                </div>

                {/* Product Main */}
                <div className="product-main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            {images.length > 0 ? (
                                <img src={images[activeImage]} alt={product.name} />
                            ) : (
                                <div className="no-image"><i className="fas fa-image"></i><span>No Image</span></div>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="thumbnail-strip">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`thumb ${i === activeImage ? 'active' : ''}`}
                                        onClick={() => setActiveImage(i)}
                                    >
                                        <img src={img} alt={`${product.name} ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <div className="product-category-tag">{product.category || 'Agriculture'}</div>
                        <h1>{product.name}</h1>

                        {avgRating && (
                            <div className="rating-row">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <i key={star} className={`fas fa-star ${star <= Math.round(avgRating) ? 'filled' : ''}`}></i>
                                    ))}
                                </div>
                                <span>{avgRating} ({reviews.length} reviews)</span>
                            </div>
                        )}

                        <div className="price-section">
                            <span className="price">KES {parseFloat(product.price || 0).toLocaleString()}</span>
                            <span className="unit">per {product.unit || 'kg'}</span>
                        </div>

                        <p className="product-description">{product.description}</p>

                        <div className="product-meta">
                            <div className="meta-item">
                                <i className="fas fa-boxes"></i>
                                <span>{product.quantity || 0} {product.unit || 'units'} available</span>
                            </div>
                            <div className="meta-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>{product.location || 'Kenya'}</span>
                            </div>
                            {product.harvest_date && (
                                <div className="meta-item">
                                    <i className="fas fa-calendar"></i>
                                    <span>Harvested: {new Date(product.harvest_date).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="meta-item">
                                <i className="fas fa-eye"></i>
                                <span>{product.views || 0} views</span>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="cart-actions">
                            <div className="qty-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">−</button>
                                <span className="qty-value">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.quantity || 99, quantity + 1))} className="qty-btn">+</button>
                            </div>
                            <button className="btn btn-primary btn-lg add-cart-btn" onClick={handleAddToCart}>
                                <i className="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>

                        <Link to="/chat" className="chat-seller-btn">
                            <i className="fas fa-comments"></i> Chat with Farmer
                        </Link>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2><i className="fas fa-star"></i> Reviews ({reviews.length})</h2>

                    {user && (
                        <form className="review-form" onSubmit={handleReviewSubmit}>
                            <h4>Write a Review</h4>
                            <div className="star-select">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        type="button"
                                        key={star}
                                        className={`star-btn ${star <= reviewForm.rating ? 'selected' : ''}`}
                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                    >
                                        <i className="fas fa-star"></i>
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Share your experience..."
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            ></textarea>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submittingReview}>
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((review, i) => (
                                <div key={i} className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <div className="reviewer-avatar">{review.user?.full_name?.charAt(0) || 'U'}</div>
                                            <div>
                                                <span className="reviewer-name">{review.user?.full_name || 'Anonymous'}</span>
                                                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="review-stars">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <i key={star} className={`fas fa-star ${star <= review.rating ? 'filled' : ''}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-text">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Similar Products (ML engine) */}
                <div style={{ marginTop: '40px' }}>
                    <RecommendationCarousel
                        title="Similar Products"
                        icon="fas fa-th-large"
                        fetchFn={fetchSimilar}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
