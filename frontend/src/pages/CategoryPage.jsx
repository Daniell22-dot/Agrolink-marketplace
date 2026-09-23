import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import api from '../services/api';
import SEO from '../components/seo/SEO';
import './CategoryPage.css';

const CATEGORY_DATA = {
  'farm-inputs': {
    name: 'Farm Inputs',
    description: 'Everything you need for a successful farming season. From irrigation systems to protective gear, find quality farm inputs at wholesale prices.',
    heroImage: '/images/Drip Irrigation.jpg',
    color: '#15803D',
    subcategories: [
      { name: 'Irrigation Kits', slug: 'farm-inputs', image: '/images/Drip Irrigation.jpg', count: 45 },
      { name: 'Protective Gear', slug: 'farm-inputs', image: '/images/Gum boots.jpg', count: 32 },
      { name: 'Sprayers & Pumps', slug: 'farm-inputs', image: '/images/knapsack sprayer.jpeg', count: 28 },
      { name: 'Storage Bags', slug: 'farm-inputs', image: '/images/Shopping bags.jpg', count: 19 },
      { name: 'Post-Harvest Equipment', slug: 'farm-inputs', image: '/images/Fabric grow bag.jpeg', count: 23 },
      { name: 'Greenhouse Materials', slug: 'farm-inputs', image: '/images/Planting bags.jpeg', count: 17 },
    ],
  },
  seeds: {
    name: 'Seeds',
    description: 'Certified, high-yield seeds for every season. From hybrid maize to exotic vegetables, get the best genetics for your farm.',
    heroImage: '/images/Variant of seeds.jpg',
    color: '#166534',
    subcategories: [
      { name: 'Maize Seeds', slug: 'seeds', image: '/images/Maize1.jpg', count: 34 },
      { name: 'Vegetable Seeds', slug: 'seeds', image: '/images/Carrots.jpg', count: 56 },
      { name: 'Fruit Seeds', slug: 'seeds', image: '/images/Bananas.jpg', count: 28 },
      { name: 'Herb & Spice Seeds', slug: 'seeds', image: '/images/Coffee.jpg', count: 41 },
      { name: 'Legume Seeds', slug: 'seeds', image: '/images/Red Beans.jpg', count: 22 },
      { name: 'Flower Seeds', slug: 'seeds', image: '/images/Berries.jpg', count: 18 },
    ],
  },
  tools: {
    name: 'Farm Tools',
    description: 'Durable hand tools and mechanized equipment for every farming task. Built tough for Kenyan conditions.',
    heroImage: '/images/Farm tools.jpg',
    color: '#14532D',
    subcategories: [
      { name: 'Hoes & Jembes', slug: 'tools', image: '/images/Farm tools.jpg', count: 31 },
      { name: 'Pangas & Machetes', slug: 'tools', image: '/images/Panga.jpeg', count: 27 },
      { name: 'Shovels & Spades', slug: 'tools', image: '/images/Shovel and Spade.jpeg', count: 22 },
      { name: 'Pruning Tools', slug: 'tools', image: '/images/Gloves.jpg', count: 18 },
      { name: 'Wheelbarrows', slug: 'tools', image: '/images/Wheelbarrows.jpeg', count: 14 },
      { name: 'Measuring Tools', slug: 'tools', image: '/images/Shevel and Rake.jpg', count: 9 },
    ],
  },
  baskets: {
    name: 'Baskets & Storage',
    description: 'Traditional and modern storage solutions for your harvested produce. From woven baskets to industrial grain silos.',
    heroImage: '/images/Shopping bag.jpg',
    color: '#0d9488',
    subcategories: [
      { name: 'Woven Baskets', slug: 'baskets', image: '/images/Shopping bag.jpg', count: 38 },
      { name: 'Sacks & Bags', slug: 'baskets', image: '/images/Shopping bags.jpg', count: 25 },
      { name: 'Plastic Crates', slug: 'baskets', image: '/images/Shopping bags.jpg', count: 19 },
      { name: 'Grain Bins', slug: 'baskets', image: '/images/Maize1.jpg', count: 12 },
      { name: 'Cold Storage', slug: 'baskets', image: '/images/Milk.jpg', count: 8 },
      { name: 'Drying Racks', slug: 'baskets', image: '/images/Farm tools.jpg', count: 15 },
    ],
  },
  fertilizers: {
    name: 'Fertilizers',
    description: 'Premium organic and inorganic fertilizers to boost your crop yields. Soil-tested and farmer-approved.',
    heroImage: '/images/Fertilizer.jpg',
    color: '#15803D',
    subcategories: [
      { name: 'NPK Fertilizers', slug: 'fertilizers', image: '/images/DAP fertilizer.jpg', count: 34 },
      { name: 'Organic Compost', slug: 'fertilizers', image: '/images/Fertilizer.jpg', count: 27 },
      { name: 'Urea & DAP', slug: 'fertilizers', image: '/images/DAP fertilizer.jpg', count: 21 },
      { name: 'Foliar Feeds', slug: 'fertilizers', image: '/images/Fertilizer.jpg', count: 15 },
      { name: 'Soil Amendments', slug: 'fertilizers', image: '/images/Fertilizer.jpg', count: 12 },
      { name: 'Micronutrients', slug: 'fertilizers', image: '/images/CAN fertilizer.jpeg', count: 9 },
    ],
  },
  livestock: {
    name: 'Livestock',
    description: 'Healthy livestock from trusted Kenyan farmers. Cattle, goats, sheep, poultry, and pigs for breeding or market.',
    heroImage: '/images/Cow.jpg',
    color: '#7C2D12',
    subcategories: [
      { name: 'Cattle', slug: 'livestock', image: '/images/Cow.jpg', count: 34 },
      { name: 'Goats', slug: 'livestock', image: '/images/Goat.jpg', count: 28 },
      { name: 'Sheep', slug: 'livestock', image: '/images/Sheep.jpg', count: 22 },
      { name: 'Poultry', slug: 'livestock', image: '/images/Chicks.jpg', count: 45 },
      { name: 'Pigs', slug: 'livestock', image: '/images/Pigs.jpg', count: 18 },
      { name: 'Rabbits', slug: 'livestock', image: '/images/Rabbits farming.jpg', count: 12 },
    ],
  },
  dairy: {
    name: 'Dairy & Eggs',
    description: 'Fresh milk, eggs, and dairy products straight from the farm. Quality tested and delivered cold.',
    heroImage: '/images/Milk.jpg',
    color: '#1E40AF',
    subcategories: [
      { name: 'Fresh Milk', slug: 'dairy', image: '/images/Milk.jpg', count: 38 },
      { name: 'Eggs', slug: 'dairy', image: '/images/Chicks.jpg', count: 25 },
      { name: 'Yogurt & Butter', slug: 'dairy', image: '/images/Milk.jpg', count: 15 },
      { name: 'Cheese', slug: 'dairy', image: '/images/Milk.jpg', count: 12 },
      { name: 'Cream', slug: 'dairy', image: '/images/Milk.jpg', count: 9 },
    ],
  },
};

const SAMPLE_PRODUCTS = {
  'farm-inputs': [
    { id: 'fi1', title: 'Drip Irrigation Kit (50m)', price: 2800, originalPrice: 3800, category: 'farm-inputs', county: 'Kisumu', rating: 4.9, images: ['/images/Drip Irrigation.jpg'], farmer: { fullName: 'Lake Irrigation Systems' } },
    { id: 'fi2', title: 'Knapsack Sprayer Pump (20L)', price: 1800, originalPrice: 2500, category: 'farm-inputs', county: 'Nakuru', rating: 4.7, images: ['/images/knapsack sprayer.jpeg'], farmer: { fullName: 'Rift Valley Agro' } },
    { id: 'fi3', title: 'Greenhouse Polyethylene Film (200mic)', price: 3500, originalPrice: 4200, category: 'farm-inputs', county: 'Nyeri', rating: 4.6, images: ['/images/Fabric grow bag.jpeg'], farmer: { fullName: 'Highland Farm Supplies' } },
    { id: 'fi4', title: 'Safety Boots (Steel Toe)', price: 1200, originalPrice: 1600, category: 'farm-inputs', county: 'Nairobi', rating: 4.8, images: ['/images/Gum boots.jpg'], farmer: { fullName: 'Nairobi Agri Mart' } },
  ],
  seeds: [
    { id: 's1', title: 'Certified Hybrid Maize Seed (2kg)', price: 450, originalPrice: 650, category: 'seeds', county: 'Uasin Gishu', rating: 4.8, images: ['/images/Maize1.jpg'], farmer: { fullName: 'Eldoret Seed Co-op' } },
    { id: 's2', title: 'Tomato Seeds (100g Pack)', price: 280, originalPrice: 400, category: 'seeds', county: 'Kiambu', rating: 4.7, images: ['/images/Carrots.jpg'], farmer: { fullName: 'Central Seed Bank' } },
    { id: 's3', title: 'Sukuma Wiki Seeds (500g)', price: 180, originalPrice: 250, category: 'seeds', county: 'Kisii', rating: 4.9, images: ['/images/Sweat Potatoes.jpg'], farmer: { fullName: 'Kisii Green Farms' } },
    { id: 's4', title: 'Capsicum Seeds (200g)', price: 320, originalPrice: 450, category: 'seeds', county: 'Machakos', rating: 4.6, images: ['/images/Bananas.jpg'], farmer: { fullName: 'Eastern Seedlings' } },
  ],
  tools: [
    { id: 't1', title: 'Garden Hand Tools Set (8pc)', price: 1500, originalPrice: 2200, category: 'tools', county: 'Nairobi', rating: 4.6, images: ['/images/Farm tools.jpg'], farmer: { fullName: 'Nairobi Agri Mart' } },
    { id: 't2', title: 'Heavy Duty Jembe (Full Size)', price: 850, originalPrice: 1100, category: 'tools', county: 'Machakos', rating: 4.8, images: ['/images/Farm tools.jpg'], farmer: { fullName: 'Ukambani Hardware' } },
    { id: 't3', title: 'Panga / Machete (18 inch)', price: 650, originalPrice: 900, category: 'tools', county: 'Kakamega', rating: 4.7, images: ['/images/Panga.jpeg'], farmer: { fullName: 'Western Tools Co-op' } },
    { id: 't4', title: 'Wheelbarrow (100L Heavy Duty)', price: 4500, originalPrice: 5500, category: 'tools', county: 'Nakuru', rating: 4.9, images: ['/images/Wheelbarrows.jpeg'], farmer: { fullName: 'Rift Valley Hardware' } },
  ],
  baskets: [
    { id: 'b1', title: 'Kiondo Woven Basket (Large)', price: 800, originalPrice: 1200, category: 'baskets', county: 'Machakos', rating: 4.8, images: ['/images/Shopping bag.jpg'], farmer: { fullName: 'Ukambani Weavers' } },
    { id: 'b2', title: 'Grain Storage Sack (100kg)', price: 250, originalPrice: 350, category: 'baskets', county: 'Uasin Gishu', rating: 4.6, images: ['/images/Shopping bags.jpg'], farmer: { fullName: 'Eldoret Supplies' } },
    { id: 'b3', title: 'Plastic Harvest Crate (60L)', price: 450, originalPrice: 600, category: 'baskets', county: 'Nairobi', rating: 4.7, images: ['/images/Shopping bags.jpg'], farmer: { fullName: 'Nairobi Agri Mart' } },
    { id: 'b4', title: 'Traditional Mkeka Mat (Pack of 5)', price: 350, originalPrice: 500, category: 'baskets', county: 'Coast', rating: 4.5, images: ['/images/Shopping bag.jpg'], farmer: { fullName: 'Coastal Weavers Co-op' } },
  ],
  fertilizers: [
    { id: 'f1', title: 'NPK 50kg Fertilizer Bag', price: 3200, originalPrice: 4500, category: 'fertilizers', county: 'Nakuru', rating: 4.7, images: ['/images/DAP fertilizer.jpg'], farmer: { fullName: 'Rift Valley Agro Inputs' } },
    { id: 'f2', title: 'Organic Compost Fertilizer (25kg)', price: 850, originalPrice: 1200, category: 'fertilizers', county: 'Kiambu', rating: 4.9, images: ['/images/Fertilizer.jpg'], farmer: { fullName: 'Green Valley Organics' } },
    { id: 'f3', title: 'Urea Fertilizer (50kg)', price: 2800, originalPrice: 3400, category: 'fertilizers', county: 'Uasin Gishu', rating: 4.6, images: ['/images/CAN fertilizer.jpeg'], farmer: { fullName: 'Eldoret Agro Centre' } },
    { id: 'f4', title: 'CAN Fertilizer (50kg)', price: 3100, originalPrice: 3900, category: 'fertilizers', county: 'Narok', rating: 4.8, images: ['/images/Fertilizer.jpg'], farmer: { fullName: 'Maasai Agro Supplies' } },
  ],
  livestock: [
    { id: 'l1', title: 'Healthy Dairy Cow (Friesian)', price: 85000, originalPrice: 95000, category: 'livestock', county: 'Nakuru', rating: 4.9, images: ['/images/Cow.jpg'], farmer: { fullName: 'Nakuru Dairy Farms' } },
    { id: 'l2', title: 'Boer Goat (Breeding Pair)', price: 25000, originalPrice: 30000, category: 'livestock', county: 'Machakos', rating: 4.8, images: ['/images/Goat.jpg'], farmer: { fullName: 'Eastern Livestock' } },
    { id: 'l3', title: 'Dorper Sheep (Mature Ewe)', price: 12000, originalPrice: 15000, category: 'livestock', county: 'Kajiado', rating: 4.7, images: ['/images/Sheep.jpg'], farmer: { fullName: 'Kajiado Pastoralists' } },
    { id: 'l4', title: 'Kienyeji Chicken (Broiler)', price: 550, originalPrice: 700, category: 'livestock', county: 'Nyeri', rating: 4.6, images: ['/images/Chicks.jpg'], farmer: { fullName: 'Nyeri Poultry Farm' } },
  ],
  dairy: [
    { id: 'd1', title: 'Fresh Cow Milk (1L)', price: 80, originalPrice: 100, category: 'dairy', county: 'Nakuru', rating: 4.9, images: ['/images/Milk.jpg'], farmer: { fullName: 'Rift Valley Dairies' } },
    { id: 'd2', title: 'Farm Fresh Eggs (Tray of 30)', price: 550, originalPrice: 650, category: 'dairy', county: 'Nyeri', rating: 4.9, images: ['/images/Chicks.jpg'], farmer: { fullName: 'Nyeri Poultry Farm' } },
    { id: 'd3', title: 'Natural Yogurt (500ml)', price: 200, originalPrice: 250, category: 'dairy', county: 'Kiambu', rating: 4.7, images: ['/images/Milk.jpg'], farmer: { fullName: 'Kiambu Dairy Co-op' } },
    { id: 'd4', title: 'Farm Butter (250g)', price: 180, originalPrice: 220, category: 'dairy', county: 'Nakuru', rating: 4.8, images: ['/images/Milk.jpg'], farmer: { fullName: 'Rift Valley Dairies' } },
  ],
};

const ALL_CATEGORIES = [
  { slug: 'farm-inputs', name: 'Farm Inputs' },
  { slug: 'seeds', name: 'Seeds' },
  { slug: 'tools', name: 'Farm Tools' },
  { slug: 'baskets', name: 'Baskets & Storage' },
  { slug: 'fertilizers', name: 'Fertilizers' },
  { slug: 'livestock', name: 'Livestock' },
  { slug: 'dairy', name: 'Dairy & Eggs' },
];

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryData = CATEGORY_DATA[slug];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/products?category=${slug}&limit=50&sort=newest`)
      .then(res => {
        if (!cancelled) {
          const rows = res.data?.data?.rows || res.data?.data || [];
          setProducts(rows);
        }
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

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
      {categoryData && (
        <SEO
          title={`${categoryData.name} - AgroLink Kenya`}
          description={categoryData.description}
          canonical={`https://agrolink.co.ke/category/${slug}`}
          breadcrumbs={[
            { label: 'Home', url: 'https://agrolink.co.ke/' },
            { label: categoryData.name, url: `https://agrolink.co.ke/category/${slug}` },
          ]}
        />
      )}
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
