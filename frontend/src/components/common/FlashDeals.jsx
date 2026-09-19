import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FlashDeals.css';

const DEFAULT_DEALS = [
  { id: 'fd1', title: 'H614 Hybrid Maize Seeds - 2kg', price: 799, originalPrice: 1200, discount: 33, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&auto=format&fit=crop', sold: 78 },
  { id: 'fd2', title: 'NPK 50kg Fertilizer Bag', price: 2499, originalPrice: 3500, discount: 29, image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop', sold: 65 },
  { id: 'fd3', title: 'Garden Hoe - Heavy Duty', price: 549, originalPrice: 850, discount: 35, image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=400&auto=format&fit=crop', sold: 82 },
  { id: 'fd4', title: 'Tomato Seeds - KDH1 (50g)', price: 399, originalPrice: 600, discount: 33, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop', sold: 54 },
  { id: 'fd5', title: 'Drip Irrigation Starter Kit', price: 2999, originalPrice: 4500, discount: 33, image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&auto=format&fit=crop', sold: 41 },
  { id: 'fd6', title: 'CAN Fertilizer - 50kg', price: 2299, originalPrice: 3200, discount: 28, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&auto=format&fit=crop', sold: 70 },
  { id: 'fd7', title: 'Pesticide Sprayer - 16L', price: 1899, originalPrice: 2800, discount: 32, image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop', sold: 59 },
  { id: 'fd8', title: 'Bean Seeds - Rose Coco (2kg)', price: 499, originalPrice: 800, discount: 38, image: 'https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=400&auto=format&fit=crop', sold: 88 },
];

const pad = (n) => String(n).padStart(2, '0');

const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

const FlashDeals = ({ deals }) => {
  const scrollRef = useRef(null);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight);
  const [autoScrollDir, setAutoScrollDir] = useState('right');
  const displayData = (deals && deals.length > 0) ? deals : DEFAULT_DEALS;

  // Countdown timer resets at midnight
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 5) {
        setAutoScrollDir('left');
      } else if (el.scrollLeft <= 5) {
        setAutoScrollDir('right');
      }

      el.scrollBy({
        left: autoScrollDir === 'right' ? 200 : -200,
        behavior: 'smooth',
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [autoScrollDir]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flash-deals-scroll-wrapper">
      <button className="flash-scroll-btn flash-scroll-left" onClick={() => scroll('left')} aria-label="Scroll left">
        <i className="fas fa-chevron-left" />
      </button>
      <button className="flash-scroll-btn flash-scroll-right" onClick={() => scroll('right')} aria-label="Scroll right">
        <i className="fas fa-chevron-right" />
      </button>

      <div className="flash-deals-scroll" ref={scrollRef}>
        {displayData.map((deal) => (
          <Link to={`/product/${deal.id}`} className="flash-deal-card" key={deal.id}>
            <div className="flash-deal-image">
              <div className="flash-deal-discount">-{deal.discount}%</div>
              <img src={deal.image} alt={deal.title} className="flash-deal-img" />
            </div>
            <div className="flash-deal-info">
              <div className="flash-deal-name">{deal.title}</div>
              <div className="flash-deal-prices">
                <span className="flash-deal-price-new">KES {deal.price.toLocaleString()}</span>
                <span className="flash-deal-price-old">KES {deal.originalPrice.toLocaleString()}</span>
              </div>
              <div className="flash-deal-sold-bar">
                <div className="flash-deal-sold-fill" style={{ width: `${deal.sold}%` }} />
              </div>
              <div className="flash-deal-sold-text">{deal.sold}% sold</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { pad };
export default FlashDeals;
