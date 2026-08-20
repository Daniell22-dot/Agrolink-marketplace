import React from 'react';
import { Link } from 'react-router-dom';
import './GovServices.css';

const services = [
  {
    id: 1,
    icon: 'fas fa-tractor',
    title: 'Subsidized Fertilizer',
    description: 'Access government-subsidized NPK and CAN fertilizers through your local cooperative or county office.',
  },
  {
    id: 2,
    icon: 'fas fa-water',
    title: 'Irrigation Schemes',
    description: 'Find and join national or local irrigation programs to secure water access for your farm year-round.',
  },
  {
    id: 3,
    icon: 'fas fa-hospital',
    title: 'NHIF for Farmers',
    description: 'Agricultural insurance and health coverage schemes designed specifically for smallholder farmers.',
  },
  {
    id: 4,
    icon: 'fas fa-users',
    title: 'Extension Services',
    description: 'Free government agricultural extension officers available in every sub-county for hands-on farm guidance.',
  },
  {
    id: 5,
    icon: 'fas fa-certificate',
    title: 'Seed Certification',
    description: 'KEPHIS certified seeds directory — ensure you plant only approved, high-quality seed varieties.',
  },
  {
    id: 6,
    icon: 'fas fa-landmark',
    title: 'County Agricultural Offices',
    description: 'Connect with your county agricultural department for permits, subsidies, and technical support.',
  },
];

const GovServices = () => {
  return (
    <section className="gov-services-section">
      <div className="container">
        <div className="gov-services-header">
          <h2>Government Services & Irrigation</h2>
          <p>Access official agricultural support programs and services</p>
        </div>

        <div className="gov-services-grid">
          {services.map((service) => (
            <div className="gov-service-card" key={service.id}>
              <div className="gov-service-icon">
                <i className={service.icon}></i>
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
