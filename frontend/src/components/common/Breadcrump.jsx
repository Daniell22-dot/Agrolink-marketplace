import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => {
  // items: [{ label, to }]
  return (
    <nav aria-label="breadcrumb" style={{ marginBottom: '16px' }}>
      <ol style={{
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        gap: '4px',
        fontSize: '14px',
        alignItems: 'center',
      }}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {index > 0 && (
                <i className="fas fa-chevron-right" style={{ fontSize: '10px', color: '#9ca3af' }} />
              )}
              {isLast ? (
                <span style={{ color: '#6b7280', fontWeight: 500 }}>{item.label}</span>
              ) : (
                <Link
                  to={item.to}
                  style={{ color: '#1C4B2D', textDecoration: 'none', fontWeight: 500 }}
                  onMouseOver={e => e.target.style.textDecoration = 'underline'}
                  onMouseOut={e => e.target.style.textDecoration = 'none'}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
