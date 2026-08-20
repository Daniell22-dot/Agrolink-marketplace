import React from 'react';
import './FarmAdvisory.css';

const advisoryCards = [
  {
    id: 1,
    icon: 'fas fa-calendar-alt',
    title: 'Crop Calendar',
    description: 'Plan your planting season — Long rains (Mar-May) ideal for maize and beans in most regions.',
    link: '#',
    type: 'tip',
  },
  {
    id: 2,
    icon: 'fas fa-cloud-sun-rain',
    title: 'Weather Alert',
    description: 'Heavy rains expected in Central Kenya this week. Ensure proper drainage for your crops.',
    link: '#',
    type: 'warning',
  },
  {
    id: 3,
    icon: 'fas fa-bug',
    title: 'Pest Watch',
    description: 'Fall Armyworm outbreak reported in Nakuru County. Inspect your maize fields early.',
    link: '#',
    type: 'alert',
  },
  {
    id: 4,
    icon: 'fas fa-chart-line',
    title: 'Market Tip',
    description: 'Tomato prices expected to rise 20% next week due to supply shortages in Nairobi markets.',
    link: '#',
    type: 'tip',
  },
  {
    id: 5,
    icon: 'fas fa-mountain',
    title: 'Soil Health',
    description: 'Optimal soil pH for maize: 5.5-7.0. Test your soil before the planting season begins.',
    link: '#',
    type: 'tip',
  },
  {
    id: 6,
    icon: 'fas fa-tint',
    title: 'Irrigation Tip',
    description: 'Drip irrigation saves 60% water vs flood irrigation. Consider upgrading before the dry season.',
    link: '#',
    type: 'tip',
  },
];

const FarmAdvisory = () => {
  return (
    <section className="farm-advisory-section">
      <div className="container">
        <div className="farm-advisory-header">
          <h2>Smart Farm Advisory</h2>
          <p>Personalized tips and alerts for your farming activities</p>
        </div>

        <div className="farm-advisory-grid">
          {advisoryCards.map((card) => (
            <div className={`farm-advisory-card ${card.type}`} key={card.id}>
              <div className="advisory-card-icon">
                <i className={card.icon}></i>
              </div>
              <div className="advisory-card-title">{card.title}</div>
              <div className="advisory-card-desc">{card.description}</div>
              <a href={card.link} className="advisory-card-link">
                Learn More <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FarmAdvisory;
