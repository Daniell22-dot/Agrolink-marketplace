import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], isLoading, emptyMessage = 'No products found' }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ background: '#f3f4f6', borderRadius: '14px', aspectRatio: '3/4', animation: 'shimmer 1.5s ease-in-out infinite' }} />
        ))}
        <style>{`
          @keyframes shimmer {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
        <i className="fas fa-search" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
        <h3 style={{ margin: '0 0 8px', color: '#374151', fontWeight: 700 }}>No Products Found</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '20px',
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
