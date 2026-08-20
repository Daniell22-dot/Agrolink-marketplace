import React from 'react';
import { Link } from 'react-router-dom';
import './AgriNews.css';

const newsData = [
  {
    id: 1,
    category: 'Policy',
    theme: 'policy',
    icon: 'fas fa-landmark',
    title: "Kenya's New Agricultural Export Policy Takes Effect",
    excerpt: 'The government has introduced new regulations to streamline crop exports and boost farmer earnings across East Africa.',
    date: 'Aug 15, 2026',
    readTime: '4 min read',
  },
  {
    id: 2,
    category: 'Market',
    theme: 'market',
    icon: 'fas fa-chart-line',
    title: 'NCPB Announces Maize Purchase Prices for This Season',
    excerpt: 'The National Cereals and Produce Board has set new minimum prices to protect farmers from exploitative middlemen.',
    date: 'Aug 12, 2026',
    readTime: '3 min read',
  },
  {
    id: 3,
    category: 'Technology',
    theme: 'technology',
    icon: 'fas fa-robot',
    title: 'AI Drones Transforming Farming in Laikipia County',
    excerpt: 'Precision agriculture technology is helping farmers reduce pesticide use by 40% while improving crop yields significantly.',
    date: 'Aug 10, 2026',
    readTime: '5 min read',
  },
  {
    id: 4,
    category: 'Weather',
    theme: 'weather',
    icon: 'fas fa-cloud-showers-heavy',
    title: 'El Niño Preparation: What Farmers Need to Know',
    excerpt: 'Meteorologists predict above-normal rainfall. Prepare your fields with proper drainage and crop selection strategies.',
    date: 'Aug 8, 2026',
    readTime: '4 min read',
  },
  {
    id: 5,
    category: 'Seeds',
    theme: 'seed',
    icon: 'fas fa-seedling',
    title: 'New Drought-Resistant Maize Variety Released by KEPHIS',
    excerpt: 'The Kenya Plant Health Inspectorate Service has approved a new hybrid that survives with 30% less rainfall.',
    date: 'Aug 5, 2026',
    readTime: '3 min read',
  },
  {
    id: 6,
    category: 'Climate',
    theme: 'climate',
    icon: 'fas fa-globe-africa',
    title: 'Climate-Smart Agriculture Gains Traction in Western Kenya',
    excerpt: 'Over 12,000 farmers have adopted conservation tillage and cover cropping to combat changing weather patterns.',
    date: 'Aug 3, 2026',
    readTime: '6 min read',
  },
];

const AgriNews = () => {
  return (
    <section className="agri-news-section">
      <div className="container">
        <div className="agri-news-header">
          <h2>Agriculture News & Insights</h2>
          <Link to="/about" className="agri-news-view-all">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="agri-news-scroll">
          {newsData.map((news) => (
            <div className="agri-news-card" key={news.id}>
              <div className={`agri-news-image ${news.theme}`}>
                <i className={news.icon}></i>
                <span className="agri-news-category">{news.category}</span>
              </div>
              <div className="agri-news-body">
                <div className="agri-news-title">{news.title}</div>
                <div className="agri-news-excerpt">{news.excerpt}</div>
                <div className="agri-news-meta">
                  <span className="agri-news-date">
                    <i className="fas fa-calendar-alt" style={{ marginRight: 4 }}></i>
                    {news.date}
                  </span>
                  <span className="agri-news-read-time">
                    <i className="fas fa-clock" style={{ marginRight: 4 }}></i>
                    {news.readTime}
                  </span>
                </div>
                <Link to="/about" className="agri-news-read-more">
                  Read More <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgriNews;
