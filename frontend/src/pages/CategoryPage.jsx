import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import './CategoryPage.css';

const CATEGORY_DATA = {
  'farm-inputs': {
    name: 'Farm Inputs',
    description: 'Everything you need for a successful farming season. From irrigation systems to protective gear, find quality farm inputs at wholesale prices.',
    heroImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&auto=format&fit=crop',
    color: '#15803D',
    subcategories: [
      { name: 'Irrigation Kits', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&auto=format&fit=crop', count: 45 },
      { name: 'Protective Gear', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=300&auto=format&fit=crop', count: 32 },
      { name: 'Sprayers & Pumps', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop', count: 28 },
      { name: 'Storage Bags', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&auto=format&fit=crop', count: 19 },
      { name: 'Post-Harvest Equipment', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop', count: 23 },
      { name: 'Greenhouse Materials', slug: 'farm-inputs', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop', count: 17 },
    ],
  },
  seeds: {
    name: 'Seeds',
    description: 'Certified, high-yield seeds for every season. From hybrid maize to exotic vegetables, get the best genetics for your farm.',
    heroImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&auto=format&fit=crop',
    color: '#166534',
    subcategories: [
      { name: 'Maize Seeds', slug: 'seeds', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop', count: 34 },
      { name: 'Vegetable Seeds', slug: 'seeds', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop', count: 56 },
      { name: 'Fruit Seeds', slug: 'seeds', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&auto=format&fit=crop', count: 28 },
      { name: 'Herb & Spice Seeds', slug: 'seeds', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop', count: 41 },
      { name: 'Legume Seeds', slug: 'seeds', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&auto=format&fit=crop', count: 22 },
      { name: 'Flower Seeds', slug: 'seeds', image: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=300&auto=format&fit=crop', count: 18 },
    ],
  },
  tools: {
    name: 'Farm Tools',
    description: 'Durable hand tools and mechanized equipment for every farming task. Built tough for Kenyan conditions.',
    heroImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&auto=format&fit=crop',
    color: '#14532D',
    subcategories: [
      { name: 'Hoes & Jembes', slug: 'tools', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop', count: 31 },
      { name: 'Pangas & Machetes', slug: 'tools', image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=300&auto=format&fit=crop', count: 27 },
      { name: 'Shovels & Spades', slug: 'tools', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop', count: 22 },
      { name: 'Pruning Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop', count: 18 },
      { name: 'Wheelbarrows', slug: 'tools', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&auto=format&fit=crop', count: 14 },
      { name: 'Measuring Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop', count: 9 },
    ],
  },
  baskets: {
    name: 'Baskets & Storage',
    description: 'Traditional and modern storage solutions for your harvested produce. From woven baskets to industrial grain silos.',
    heroImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&auto=format&fit=crop',
    color: '#0d9488',
    subcategories: [
      { name: 'Woven Baskets', slug: 'baskets', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&auto=format&fit=crop', count: 38 },
      { name: 'Sacks & Bags', slug: 'baskets', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop', count: 25 },
      { name: 'Plastic Crates', slug: 'baskets', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop', count: 19 },
      { name: 'Grain Bins', slug: 'baskets', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&auto=format&fit=crop', count: 12 },
      { name: 'Cold Storage', slug: 'baskets', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&auto=format&fit=crop', count: 8 },
      { name: 'Drying Racks', slug: 'baskets', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop', count: 15 },
    ],
  },
  fertilizers: {
    name: 'Fertilizers',
    description: 'Premium organic and inorganic fertilizers to boost your crop yields. Soil-tested and farmer-approved.',
    heroImage: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&auto=format&fit=crop',
    color: '#15803D',
    subcategories: [
      { name: 'NPK Fertilizers', slug: 'fertilizers', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=300&auto=format&fit=crop', count: 34 },
      { name: 'Organic Compost', slug: 'fertilizers', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&auto=format&fit=crop', count: 27 },
      { name: 'Urea & DAP', slug: 'fertilizers', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&auto=format&fit=crop', count: 21 },
      { name: 'Foliar Feeds', slug: 'fertilizers', image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&auto=format&fit=crop', count: 15 },
      { name: 'Soil Amendments', slug: 'fertilizers', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&auto=format&fit=crop', count: 12 },
      { name: 'Micronutrients', slug: 'fertilizers', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&auto=format&fit=crop', count: 9 },
    ],
  },
};

const SAMPLE_PRODUCTS = {
  'farm-inputs': [
    { id: 'fi1', title: 'Drip Irrigation Kit (50m)', price: 2800, originalPrice: 3800, category: 'farm-inputs', county: 'Kisumu', rating: 4.9, images: ['https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=500&auto=format&fit=crop'], farmer: { fullName: 'Lake Irrigation Systems' } },
    { id: 'fi2', title: 'Knapsack Sprayer Pump (20L)', price: 1800, originalPrice: 2500, category: 'farm-inputs', county: 'Nakuru', rating: 4.7, images: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=500&auto=format&fit=crop'], farmer: { fullName: 'Rift Valley Agro' } },
    { id: 'fi3', title: 'Greenhouse Polyethylene Film (200mic)', price: 3500, originalPrice: 4200, category: 'farm-inputs', county: 'Nyeri', rating: 4.6, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Highland Farm Supplies' } },
    { id: 'fi4', title: 'Safety Boots (Steel Toe)', price: 1200, originalPrice: 1600, category: 'farm-inputs', county: 'Nairobi', rating: 4.8, images: ['https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=500&auto=format&fit=crop'], farmer: { fullName: 'Nairobi Agri Mart' } },
  ],
  seeds: [
    { id: 's1', title: 'Certified Hybrid Maize Seed (2kg)', price: 450, originalPrice: 650, category: 'seeds', county: 'Uasin Gishu', rating: 4.8, images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Eldoret Seed Co-op' } },
    { id: 's2', title: 'Tomato Seeds (100g Pack)', price: 280, originalPrice: 400, category: 'seeds', county: 'Kiambu', rating: 4.7, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop'], farmer: { fullName: 'Central Seed Bank' } },
    { id: 's3', title: 'Sukuma Wiki Seeds (500g)', price: 180, originalPrice: 250, category: 'seeds', county: 'Kisii', rating: 4.9, images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop'], farmer: { fullName: 'Kisii Green Farms' } },
    { id: 's4', title: 'Capsicum Seeds (200g)', price: 320, originalPrice: 450, category: 'seeds', county: 'Machakos', rating: 4.6, images: ['https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Eastern Seedlings' } },
  ],
  tools: [
    { id: 't1', title: 'Garden Hand Tools Set (8pc)', price: 1500, originalPrice: 2200, category: 'tools', county: 'Nairobi', rating: 4.6, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Nairobi Agri Mart' } },
    { id: 't2', title: 'Heavy Duty Jembe (Full Size)', price: 850, originalPrice: 1100, category: 'tools', county: 'Machakos', rating: 4.8, images: ['https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=500&auto=format&fit=crop'], farmer: { fullName: 'Ukambani Hardware' } },
    { id: 't3', title: 'Panga / Machete (18 inch)', price: 650, originalPrice: 900, category: 'tools', county: 'Kakamega', rating: 4.7, images: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=500&auto=format&fit=crop'], farmer: { fullName: 'Western Tools Co-op' } },
    { id: 't4', title: 'Wheelbarrow (100L Heavy Duty)', price: 4500, originalPrice: 5500, category: 'tools', county: 'Nakuru', rating: 4.9, images: ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&auto=format&fit=crop'], farmer: { fullName: 'Rift Valley Hardware' } },
  ],
  baskets: [
    { id: 'b1', title: 'Kiondo Woven Basket (Large)', price: 800, originalPrice: 1200, category: 'baskets', county: 'Machakos', rating: 4.8, images: ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&auto=format&fit=crop'], farmer: { fullName: 'Ukambani Weavers' } },
    { id: 'b2', title: 'Grain Storage Sack (100kg)', price: 250, originalPrice: 350, category: 'baskets', county: 'Uasin Gishu', rating: 4.6, images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Eldoret Supplies' } },
    { id: 'b3', title: 'Plastic Harvest Crate (60L)', price: 450, originalPrice: 600, category: 'baskets', county: 'Nairobi', rating: 4.7, images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop'], farmer: { fullName: 'Nairobi Agri Mart' } },
    { id: 'b4', title: 'Traditional Mkeka Mat (Pack of 5)', price: 350, originalPrice: 500, category: 'baskets', county: 'Coast', rating: 4.5, images: ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=500&auto=format&fit=crop'], farmer: { fullName: 'Coastal Weavers Co-op' } },
  ],
  fertilizers: [
    { id: 'f1', title: 'NPK 50kg Fertilizer Bag', price: 3200, originalPrice: 4500, category: 'fertilizers', county: 'Nakuru', rating: 4.7, images: ['https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop'], farmer: { fullName: 'Rift Valley Agro Inputs' } },
    { id: 'f2', title: 'Organic Compost Fertilizer (25kg)', price: 850, originalPrice: 1200, category: 'fertilizers', county: 'Kiambu', rating: 4.9, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Green Valley Organics' } },
    { id: 'f3', title: 'Urea Fertilizer (50kg)', price: 2800, originalPrice: 3400, category: 'fertilizers', county: 'Uasin Gishu', rating: 4.6, images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop'], farmer: { fullName: 'Eldoret Agro Centre' } },
    { id: 'f4', title: 'CAN Fertilizer (50kg)', price: 3100, originalPrice: 3900, category: 'fertilizers', county: 'Narok', rating: 4.8, images: ['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=500&auto=format&fit=crop'], farmer: { fullName: 'Maasai Agro Supplies' } },
  ],
};

const ALL_CATEGORIES = [
  { slug: 'farm-inputs', name: 'Farm Inputs' },
  { slug: 'seeds', name: 'Seeds' },
  { slug: 'tools', name: 'Farm Tools' },
  { slug: 'baskets', name: 'Baskets & Storage' },
  { slug: 'fertilizers', name: 'Fertilizers' },
];

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryData = CATEGORY_DATA[slug];
  const catProducts = SAMPLE_PRODUCTS[slug] || [];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(catProducts);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!categoryData) {
    return (
      <div className="category-page">
        <div className="category-container">
          <div className="category-not-found">
            <h2>Category Not Found</h2>
            <p>The category you're looking for doesn't exist.</p>
            <Link to="/products" className="category-back-btn">Browse All Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero Banner */}
      <div className="category-hero" style={{ '--cat-color': categoryData.color }}>
        <img src={categoryData.heroImage} alt={categoryData.name} className="category-hero-img" />
        <div className="category-hero-overlay">
          <div className="category-hero-content">
            <nav className="category-breadcrumb">
              <Link to="/">Home</Link>
              <span><i className="fas fa-chevron-right" /></span>
              <span>{categoryData.name}</span>
            </nav>
            <h1>{categoryData.name}</h1>
            <p>{categoryData.description}</p>
          </div>
        </div>
      </div>

      <div className="category-container">
        {/* Category Selector Tabs */}
        <div className="category-tabs">
          {ALL_CATEGORIES.map(cat => (
            <Link
              to={`/category/${cat.slug}`}
              key={cat.slug}
              className={`category-tab ${cat.slug === slug ? 'active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Subcategories Grid */}
        <section className="category-subcats-section">
          <h2 className="category-section-title">Shop by Subcategory</h2>
          <div className="category-subcats-grid">
            {categoryData.subcategories.map((sub, idx) => (
              <Link to={`/products?category=${sub.slug}`} key={idx} className="category-subcat-card">
                <div className="category-subcat-img">
                  <img src={sub.image} alt={sub.name} />
                </div>
                <div className="category-subcat-info">
                  <span className="category-subcat-name">{sub.name}</span>
                  <span className="category-subcat-count">{sub.count} items</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="category-products-section">
          <div className="category-products-header">
            <h2 className="category-section-title">Featured in {categoryData.name}</h2>
            <Link to={`/products?category=${slug}`} className="category-see-all">
              See All <i className="fas fa-arrow-right" />
            </Link>
          </div>
          {loading ? (
            <div className="category-loading">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="category-skeleton" />
              ))}
            </div>
          ) : (
            <div className="category-products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Other Categories */}
        <section className="category-others-section">
          <h2 className="category-section-title">Other Categories</h2>
          <div className="category-others-grid">
            {ALL_CATEGORIES.filter(c => c.slug !== slug).map(cat => {
              const data = CATEGORY_DATA[cat.slug];
              return (
                <Link to={`/category/${cat.slug}`} key={cat.slug} className="category-other-card">
                  <img src={data.heroImage} alt={data.name} className="category-other-img" />
                  <div className="category-other-overlay">
                    <h3>{data.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
