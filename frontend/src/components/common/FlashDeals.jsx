import React, { useRef } from 'react';
import './FlashDeals.css';

const flashDealsData = [
  {
    id: 1,
    name: 'H614 Hybrid Maize Seeds - 2kg',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&auto=format&fit=crop',
    oldPrice: 1200,
    newPrice: 799,
    discount: 33,
    sold: 78,
  },
  {
    id: 2,
    name: 'NPK 50kg Fertilizer Bag',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop',
    oldPrice: 3500,
    newPrice: 2499,
    discount: 29,
    sold: 65,
  },
  {
    id: 3,
    name: 'Garden Hoe - Heavy Duty',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&auto=format&fit=crop',
    oldPrice: 850,
    newPrice: 549,
    discount: 35,
    sold: 82,
  },
  {
    id: 4,
    name: 'Tomato Seeds - KDH1 (50g)',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop',
    oldPrice: 600,
    newPrice: 399,
    discount: 33,
    sold: 54,
  },
  {
    id: 5,
    name: 'Drip Irrigation Starter Kit',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&auto=format&fit=crop',
    oldPrice: 4500,
    newPrice: 2999,
    discount: 33,
    sold: 41,
  },
  {
    id: 6,
    name: 'CAN Fertilizer - 50kg',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&auto=format&fit=crop',
    oldPrice: 3200,
    newPrice: 2299,
    discount: 28,
    sold: 70,
  },
  {
    id: 7,
    name: 'Pesticide Sprayer - 16L',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&auto=format&fit=crop',
    oldPrice: 2800,
    newPrice: 1899,
    discount: 32,
    sold: 59,
  },
  {
    id: 8,
    name: 'Bean Seeds - Rose Coco (2kg)',
    image: 'https://images.unsplash.com/photo-1509622905150-fa66d3906e09?w=400&auto=format&fit=crop',
    oldPrice: 800,
    newPrice: 499,
    discount: 38,
    sold: 88,
  },
];

const FlashDeals = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="flash-deals-section">
      <div className="container">
        <div className="flash-deals-header">
          <div className="flash-deals-title">
            <i className="fas fa-bolt"></i>
            <h2>Flash Deals</h2>
          </div>
          <div className="flash-deals-timer">
            <i className="fas fa-clock"></i>
            <span>Ends in</span>
            <span className="timer-segment">04</span>:
            <span className="timer-segment">23</span>:
            <span className="timer-segment">57</span>
          </div>
        </div>

        <div className="flash-deals-scroll-wrapper">
          <button className="scroll-btn scroll-btn-left" onClick={() => scroll('left')} aria-label="Scroll left">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="scroll-btn scroll-btn-right" onClick={() => scroll('right')} aria-label="Scroll right">
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="flash-deals-scroll" ref={scrollRef}>
            {flashDealsData.map((deal) => (
              <div className="flash-deal-card" key={deal.id}>
                <div className="flash-deal-image">
                  <div className="flash-deal-discount">-{deal.discount}%</div>
                  <img src={deal.image} alt={deal.name} className="flash-deal-img" />
                </div>
                <div className="flash-deal-info">
                  <div className="flash-deal-name">{deal.name}</div>
                  <div className="flash-deal-prices">
                    <span className="flash-deal-price-new">KES {deal.newPrice.toLocaleString()}</span>
                    <span className="flash-deal-price-old">KES {deal.oldPrice.toLocaleString()}</span>
                  </div>
                  <div className="flash-deal-sold-bar">
                    <div className="flash-deal-sold-fill" style={{ width: `${deal.sold}%` }}></div>
                  </div>
                  <div className="flash-deal-sold-text">{deal.sold}% sold</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
