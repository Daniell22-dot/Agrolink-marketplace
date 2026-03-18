import React from 'react';

const Loader = ({ size = 'md', fullPage = false, text = 'Loading...' }) => {
  const sizes = { sm: 24, md: 40, lg: 60 };
  const dim = sizes[size] || sizes.md;

  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: dim,
          height: dim,
          border: `${dim / 8}px solid #e5e7eb`,
          borderTop: `${dim / 8}px solid #1C4B2D`,
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && size !== 'sm' && (
        <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>{text}</span>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255,255,255,0.85)',
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
      {spinner}
    </div>
  );
};

export default Loader;
