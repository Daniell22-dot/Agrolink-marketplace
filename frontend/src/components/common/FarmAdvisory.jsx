import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FarmAdvisory.css';

const defaultWeatherCard = {
  id: 2,
  image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&auto=format&fit=crop',
  title: 'Weather Alert',
  description: 'Weather data temporarily unavailable. Monitor local forecasts for farming decisions.',
  path: '/about',
  type: 'info',
};

const staticAdvisoryCards = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&auto=format&fit=crop',
    title: 'Crop Calendar',
    description: 'Plan your planting season — Long rains (Mar-May) ideal for maize and beans in most regions.',
    path: '/products?category=seeds',
    type: 'tip',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&auto=format&fit=crop',
    title: 'Pest Watch',
    description: 'Fall Armyworm outbreak reported in Nakuru County. Inspect your maize fields early.',
    path: '/products?category=pesticides',
    type: 'alert',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&auto=format&fit=crop',
    title: 'Market Tip',
    description: 'Tomato prices expected to rise 20% next week due to supply shortages in Nairobi markets.',
    path: '/products',
    type: 'tip',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&auto=format&fit=crop',
    title: 'Soil Health',
    description: 'Optimal soil pH for maize: 5.5-7.0. Test your soil before the planting season begins.',
    path: '/about',
    type: 'tip',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&auto=format&fit=crop',
    title: 'Irrigation Tip',
    description: 'Drip irrigation saves 60% water vs flood irrigation. Consider upgrading before the dry season.',
    path: '/products?category=irrigation',
    type: 'tip',
  },
];

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const FarmAdvisory = () => {
  const [weatherAlert, setWeatherAlert] = useState(defaultWeatherCard.description);
  const [weatherType, setWeatherType] = useState(defaultWeatherCard.type);
  const [location, setLocation] = useState('Nairobi');

  useEffect(() => {
    const fetchWeatherAdvisory = async (lat, lon, cityName) => {
      try {
        const params = new URLSearchParams();
        if (lat && lon) {
          params.append('lat', lat);
          params.append('lon', lon);
        } else if (cityName) {
          params.append('city', cityName);
        }

        const response = await fetch(`${API_BASE}/weather/advisory?${params.toString()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();
        if (result.success && result.data) {
          setWeatherAlert(result.data.alert);
          setWeatherType(result.data.type || 'info');
          setLocation(result.data.location || 'your area');
        }
      } catch (err) {
        console.error('Weather advisory fetch failed:', err);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherAdvisory(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation denied or failed:', err.message);
          fetchWeatherAdvisory(null, null, 'Nairobi');
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      fetchWeatherAdvisory(null, null, 'Nairobi');
    }
  }, []);

  const weatherCard = {
    ...defaultWeatherCard,
    description: `${location}: ${weatherAlert}`,
    type: weatherType,
  };

  const allCards = [staticAdvisoryCards[0], weatherCard, ...staticAdvisoryCards.slice(1)];

  return (
    <section className="farm-advisory-section">
      <div className="container">
        <div className="farm-advisory-grid">
          {allCards.map((card) => (
            <div className={`farm-advisory-card ${card.type}`} key={card.id}>
              <div className="advisory-card-image">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="advisory-card-title">{card.title}</div>
              <div className="advisory-card-desc">{card.description}</div>
              <Link to={card.path} className="advisory-card-link">
                Learn More <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FarmAdvisory;
