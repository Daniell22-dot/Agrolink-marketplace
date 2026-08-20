import React, { useState, useEffect } from 'react';
import './AgriNews.css';

const FALLBACK_NEWS = [
  {
    id: 'fallback-1',
    category: 'Policy',
    image: 'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=600&auto=format&fit=crop',
    title: "Kenya Reviews Plant Health & Phytosanitary Guidelines",
    excerpt: 'Kenya is updating its Plant Protection Act to strengthen phytosanitary standards for agricultural exports across East Africa.',
    date: 'Jun 3, 2021',
    source: 'Kilimo News',
    url: 'https://kilimonews.co.ke/agriculture-policy/kenya-reviewing-guidelines-on-plant-health-and-phytosanitary-issues/',
  },
  {
    id: 'fallback-2',
    category: 'Market',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop',
    title: 'Maize Prices in Kenya: Current Farm Gate & Market Rates',
    excerpt: 'NCPB and private miller prices for 90kg bags vary by region. Current rates range from KES 2,200 to KES 3,800 per bag.',
    date: 'Jan 10, 2026',
    source: 'Agrisoko',
    url: 'https://www.agrisoko254.com/learn/market-prices/maize-prices-kenya-2025',
  },
  {
    id: 'fallback-3',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop',
    title: 'KALRO Introduces Adaptive Grasses & Livestock Breeds',
    excerpt: 'Kenya Agricultural and Livestock Research Organization embraces smart agriculture with climate-adaptive livestock breeds.',
    date: 'Oct 1, 2021',
    source: 'Kilimo News',
    url: 'https://kilimonews.co.ke/science-and-technology/kalro-working-towards-the-introduction-of-adaptive-grasses-and-animal-breeds/',
  },
  {
    id: 'fallback-4',
    category: 'Weather',
    image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&auto=format&fit=crop',
    title: 'El Niño 2026: Latest Forecast & Impact in Kenya',
    excerpt: 'A strengthening El Niño is expected to bring above-normal rainfall with heightened flood risk across Kenya.',
    date: 'Aug 5, 2026',
    source: 'The Star',
    url: 'https://www.the-star.co.ke/news/2026-08-05-el-nino-2026-latest-forecast-and-impact-in-kenya',
  },
  {
    id: 'fallback-5',
    category: 'Seeds',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop',
    title: 'NCPB Takes Over Seed Subsidy Function from Kenya Seed',
    excerpt: 'Parliament directs NCPB to manage maize seed subsidies using its existing fertilizer distribution framework.',
    date: 'Mar 17, 2026',
    source: 'People Daily',
    url: 'https://peopledaily.digital/news/ncpb-takes-over-seed-subsidy-function-from-kenya-seed-company',
  },
  {
    id: 'fallback-6',
    category: 'Climate',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop',
    title: 'Climate-Smart Agriculture Gains Traction in Western Kenya',
    excerpt: 'Over 12,000 farmers adopt conservation tillage and cover cropping to combat changing weather patterns.',
    date: 'Aug 3, 2026',
    source: 'Kilimo News',
    url: 'https://kilimonews.co.ke/science-and-technology/empowering-african-plant-protection-agencies-to-combat-devastating-potato-pest/',
  },
];

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&auto=format&fit=crop',
];

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const AgriNews = () => {
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/news`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const articles = data.data.map((article, index) => ({
            ...article,
            id: article.id || `live-${index}`,
            image: article.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
            category: article.category || 'Agriculture',
          }));
          setNews(articles);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="agri-news-section">
      <div className="container">
        {loading && (
          <div className="agri-news-loading">
            <div className="spinner" />
          </div>
        )}
        {!loading && (
          <div className="agri-news-scroll">
            {news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="agri-news-card"
              >
                <div className="agri-news-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="agri-news-category">{item.category}</span>
                </div>
                <div className="agri-news-body">
                  <div className="agri-news-title">{item.title}</div>
                  <div className="agri-news-excerpt">{item.excerpt}</div>
                  <div className="agri-news-meta">
                    <span className="agri-news-date">
                      <i className="fas fa-calendar-alt" style={{ marginRight: 4 }}></i>
                      {item.date}
                    </span>
                  </div>
                  <span className="agri-news-source">
                    {item.source} <i className="fas fa-external-link-alt" style={{ marginLeft: 4, fontSize: 11 }}></i>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AgriNews;
