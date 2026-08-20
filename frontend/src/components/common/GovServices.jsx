import React from 'react';
import { Link } from 'react-router-dom';
import './GovServices.css';

const services = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop',
    title: 'Subsidized Fertilizer',
    description: 'Access government-subsidized NPK and CAN fertilizers through your local cooperative or county office.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&auto=format&fit=crop',
    title: 'Irrigation Schemes',
    description: 'Find and join national or local irrigation programs to secure water access for your farm year-round.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop',
    title: 'NHIF for Farmers',
    description: 'Agricultural insurance and health coverage schemes designed specifically for smallholder farmers.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&auto=format&fit=crop',
    title: 'Extension Services',
    description: 'Free government agricultural extension officers available in every sub-county for hands-on farm guidance.',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop',
    title: 'Seed Certification',
    description: 'KEPHIS certified seeds directory — ensure you plant only approved, high-quality seed varieties.',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=400&auto=format&fit=crop',
    title: 'County Agricultural Offices',
    description: 'Connect with your county agricultural department for permits, subsidies, and technical support.',
  },
];

const GovServices = () => {
  return (
    <section className="gov-services-section">
      <div className="container">
        <div className="gov-services-grid">
          {services.map((service) => (
            <div className="gov-service-card" key={service.id}>
              <div className="gov-service-image">
                <img src={service.image} alt={service.title} />
              </div>
              <div className="gov-service-title">{service.title}</div>
              <div className="gov-service-desc">{service.description}</div>
              <Link to="/about" className="gov-service-link">
                Learn More <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GovServices;
