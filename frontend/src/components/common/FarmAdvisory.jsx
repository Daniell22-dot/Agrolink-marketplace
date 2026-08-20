import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FarmAdvisory.css';

const API_KEY = '3857035bcc477411b4545871081afbf5';
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Nairobi,ke&appid=${API_KEY}&units=metric`;

const defaultWeatherCard = {
  id: 2,
  image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&auto=format&fit=crop',
  title: 'Weather Alert',
  description: 'Heavy rains expected in Central Kenya this week. Ensure proper drainage for your crops.',
  path: '/about',
  type: 'warning',
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

const getDayName = (dateStr) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(dateStr).getDay()];
};

const buildWeatherAlert = (data) => {
  const now = new Date();
  const threeDaysLater = new Date(now);
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);

  const upcoming = data.list.filter((item) => {
    const forecastDate = new Date(item.dt * 1000);
    return forecastDate >= now && forecastDate <= threeDaysLater;
  });

  if (upcoming.length === 0) return null;

  let minTemp = Infinity;
  let maxTemp = -Infinity;
  let totalRain = 0;
  let hasHeavyRain = false;
  const dayConditions = {};

  upcoming.forEach((item) => {
    const temp = item.main.temp;
    if (temp < minTemp) minTemp = temp;
    if (temp > maxTemp) maxTemp = temp;

    const rain = item.rain ? item.rain['3h'] || 0 : 0;
    totalRain += rain;
    if (rain > 5) hasHeavyRain = true;

    const dayName = getDayName(item.dt * 1000);
    if (!dayConditions[dayName]) {
      dayConditions[dayName] = { conditions: [], rain: 0 };
    }
    dayConditions[dayName].conditions.push(item.weather[0].main);
    dayConditions[dayName].rain += rain;
  });

  const daysWithSignificantRain = Object.entries(dayConditions)
    .filter(([, info]) => info.rain > 2)
    .map(([day]) => day);

  const uniqueConditions = [
    ...new Set(upcoming.map((item) => item.weather[0].main)),
  ];

  const tempMin = Math.round(minTemp);
  const tempMax = Math.round(maxTemp);

  let description = '';
  if (hasHeavyRain || totalRain > 15) {
    description = `Heavy rain expected in Nairobi: ${tempMin}-${tempMax}°C. `;
    if (daysWithSignificantRain.length > 0) {
      description += `Heavy showers forecasted ${daysWithSignificantRain.join('-')}. `;
    }
    description += 'Ensure proper drainage for your crops.';
  } else if (totalRain > 3) {
    description = `Light rain in Nairobi: ${tempMin}-${tempMax}°C. `;
    if (daysWithSignificantRain.length > 0) {
      description += `Showers expected ${daysWithSignificantRain.join('-')}. `;
    }
    description += 'Monitor soil moisture levels.';
  } else {
    const conditionText = uniqueConditions.includes('Clear')
      ? 'Clear skies'
      : uniqueConditions.includes('Clouds')
        ? 'Partly cloudy'
        : uniqueConditions.join(', ');
    description = `${conditionText} in Nairobi: ${tempMin}-${tempMax}°C. `;
    description += 'No significant rain expected. Consider irrigation for dry-season crops.';
  }

  return description;
};

const FarmAdvisory = () => {
  const [weatherAlert, setWeatherAlert] = useState(defaultWeatherCard.description);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(WEATHER_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const alert = buildWeatherAlert(data);
        if (alert) setWeatherAlert(alert);
      } catch {
        setWeatherAlert(defaultWeatherCard.description);
      }
    };

    fetchWeather();
  }, []);

  const weatherCard = { ...defaultWeatherCard, description: weatherAlert };
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
