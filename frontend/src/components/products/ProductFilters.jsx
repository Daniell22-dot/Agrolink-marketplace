import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts, setFilters, clearFilters } from '../../redux/slices/productSlice';

const CATEGORIES = [
  { value: '', label: 'All Categories', icon: '🌍' },
  { value: 'vegetables', label: 'Vegetables', icon: '🥦' },
  { value: 'fruits', label: 'Fruits', icon: '🍎' },
  { value: 'grains', label: 'Grains & Cereals', icon: '🌾' },
  { value: 'dairy', label: 'Dairy & Eggs', icon: '🥛' },
  { value: 'meat', label: 'Meat & Poultry', icon: '🥩' },
  { value: 'herbs', label: 'Herbs & Spices', icon: '🌿' },
  { value: 'other', label: 'Other', icon: '🏪' },
];

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under KES 100', min: 0, max: 100 },
  { label: 'KES 100–500', min: 100, max: 500 },
  { label: 'KES 500–2,000', min: 500, max: 2000 },
  { label: 'KES 2,000+', min: 2000, max: Infinity },
];

const ProductFilters = ({ activeCategory = '', onCategoryChange }) => {
  const dispatch = useDispatch();
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);

  const handleCategory = (value) => {
    dispatch(setFilters({ category: value, search: '' }));
    dispatch(fetchProducts({ page: 1, limit: 12, category: value }));
    if (onCategoryChange) onCategoryChange(value);
  };

  const handlePriceRange = (index) => {
    setSelectedPriceRange(index);
    // Could extend productSlice to filter by price on the frontend
  };

  const handleClearAll = () => {
    dispatch(clearFilters());
    dispatch(fetchProducts({ page: 1, limit: 12 }));
    setSelectedPriceRange(0);
    if (onCategoryChange) onCategoryChange('');
  };

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e5e7eb' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#111827' }}>
          <i className="fas fa-filter" style={{ marginRight: '7px', color: '#1C4B2D' }} />Filters
        </h3>
        {(activeCategory || selectedPriceRange > 0) && (
          <button onClick={handleClearAll} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#ef4444', fontWeight: 600 }}>
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', border: 'none',
                background: activeCategory === cat.value ? '#f0fdf4' : 'transparent',
                color: activeCategory === cat.value ? '#1C4B2D' : '#374151',
                cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: activeCategory === cat.value ? 700 : 400,
                transition: 'all 0.15s',
                borderLeft: `3px solid ${activeCategory === cat.value ? '#1C4B2D' : 'transparent'}`,
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
              {activeCategory === cat.value && <i className="fas fa-check" style={{ marginLeft: 'auto', fontSize: '12px' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {PRICE_RANGES.map((range, i) => (
            <button
              key={i}
              onClick={() => handlePriceRange(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', border: 'none',
                background: selectedPriceRange === i ? '#f0fdf4' : 'transparent',
                color: selectedPriceRange === i ? '#1C4B2D' : '#374151',
                cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: selectedPriceRange === i ? 700 : 400,
                transition: 'all 0.15s',
                borderLeft: `3px solid ${selectedPriceRange === i ? '#1C4B2D' : 'transparent'}`,
              }}
            >
              {range.label}
              {selectedPriceRange === i && <i className="fas fa-check" style={{ marginLeft: 'auto', fontSize: '12px' }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
