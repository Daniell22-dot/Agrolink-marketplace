import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './RecommendationCarousel.css';

const RecommendationCarousel = ({ title, icon, fetchFn, emptyMessage }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const result = await fetchFn();
                setProducts(result.data || []);
            } catch (error) {
                // Silently fail — carousel just won't show
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [fetchFn]);

    if (loading) {
        return (
            <div className="rec-carousel">
                <h3 className="rec-title"><i className={icon}></i> {title}</h3>
                <div className="rec-loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="rec-carousel">
            <div className="rec-header">
                <h3 className="rec-title"><i className={icon}></i> {title}</h3>
                <Link to="/products" className="rec-view-all">View All →</Link>
            </div>
            <div className="rec-scroll">
                {products.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="rec-card">
                        <div className="rec-image">
                            {product.images && product.images.length > 0 ? (
                                <img src={typeof product.images === 'string' ? JSON.parse(product.images)[0] : product.images[0]} alt={product.name} />
                            ) : (
                                <div className="rec-no-image"><i className="fas fa-leaf"></i></div>
                            )}
                            {product.views > 50 && (
                                <span className="rec-badge hot"><i className="fas fa-fire"></i> Hot</span>
                            )}
                        </div>
                        <div className="rec-info">
                            <h4>{product.name}</h4>
                            <span className="rec-price">KES {parseFloat(product.price || 0).toLocaleString()}</span>
                            <span className="rec-location"><i className="fas fa-map-pin"></i> {product.location || 'Kenya'}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecommendationCarousel;
