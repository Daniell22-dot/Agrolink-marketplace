import React from 'react';
import './SeasonalCalendar.css';

const seasons = [
  {
    id: 1,
    name: 'Long Rains',
    months: 'March - May',
    crops: 'Maize, Beans, Sorghum, Millet',
    icon: 'fas fa-cloud-rain',
    theme: 'long-rains',
    status: 'upcoming',
  },
  {
    id: 2,
    name: 'Short Rains',
    months: 'October - December',
    crops: 'Maize, Beans, Sweet Potato',
    icon: 'fas fa-cloud-showers-heavy',
    theme: 'short-rains',
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Dry Season',
    months: 'January - February',
    crops: 'Land Preparation, Irrigation Crops',
    icon: 'fas fa-sun',
    theme: 'dry-season',
    status: 'current',
  },
  {
    id: 4,
    name: 'Harvest Season',
    months: 'June - September',
    crops: 'Marketing, Storage, Processing',
    icon: 'fas fa-tractor',
    theme: 'harvest',
    status: 'past',
  },
];

const SeasonalCalendar = () => {
  return (
    <section className="seasonal-calendar-section">
      <div className="container">
        <div className="seasonal-calendar-header">
          <h2>Kenya Agricultural Seasons</h2>
          <p>Plan your farming activities around Kenya's four main agricultural seasons</p>
        </div>

        <div className="seasonal-calendar-grid">
          {seasons.map((season) => (
            <div className={`season-card ${season.theme} ${season.status === 'current' ? 'current' : ''}`} key={season.id}>
              <div className={`season-status ${season.status}`}>
                <span className="status-dot"></span>
                {season.status === 'current' ? 'Current' : season.status === 'upcoming' ? 'Upcoming' : 'Past'}
              </div>
              <div className="season-card-icon">
                <i className={season.icon}></i>
              </div>
              <div className="season-card-name">{season.name}</div>
              <div className="season-card-months">{season.months}</div>
              <div className="season-card-crops-label">Recommended Crops</div>
              <div className="season-card-crops">{season.crops}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeasonalCalendar;
