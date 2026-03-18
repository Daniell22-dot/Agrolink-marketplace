import React from 'react';

const RatingStars = ({ rating = 0, maxStars = 5, size = 16, interactive = false, onChange, showCount, count }) => {
  const [hovered, setHovered] = React.useState(0);

  const display = interactive ? (hovered || rating) : rating;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i + 1 <= Math.floor(display);
        const half = !filled && i < display && display % 1 >= 0.5;
        return (
          <span
            key={i}
            onClick={() => interactive && onChange && onChange(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{ cursor: interactive ? 'pointer' : 'default', fontSize: size, lineHeight: 1, color: filled || half ? '#f59e0b' : '#d1d5db', transition: 'color 0.1s', transform: interactive && hovered === i + 1 ? 'scale(1.2)' : 'none', display: 'inline-block' }}
            title={interactive ? `${i + 1} star${i !== 0 ? 's' : ''}` : undefined}
          >
            {filled ? '★' : half ? '⯨' : '☆'}
          </span>
        );
      })}
      {showCount && count !== undefined && (
        <span style={{ fontSize: size * 0.8, color: '#6b7280', marginLeft: '6px', fontWeight: 500 }}>
          ({count})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
