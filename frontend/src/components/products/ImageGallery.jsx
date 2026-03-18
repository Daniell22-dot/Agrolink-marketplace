import React, { useState } from 'react';

const ImageGallery = ({ images = [], productName = '' }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Support both string array and object array { url, alt }
  const normalizedImages = images.length > 0
    ? images.map(img => (typeof img === 'string' ? { url: img, alt: productName } : img))
    : [{ url: null, alt: productName }];

  const activeImage = normalizedImages[activeIdx];

  const next = () => setActiveIdx(i => (i + 1) % normalizedImages.length);
  const prev = () => setActiveIdx(i => (i - 1 + normalizedImages.length) % normalizedImages.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Main Image */}
      <div
        style={{
          position: 'relative', borderRadius: '14px', overflow: 'hidden',
          background: '#f0fdf4', aspectRatio: '1 / 1',
          cursor: activeImage.url ? 'zoom-in' : 'default',
        }}
        onClick={() => activeImage.url && setIsZoomed(true)}
      >
        {activeImage.url ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
            onMouseOut={e => e.target.style.transform = 'none'}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-seedling" style={{ fontSize: '80px', color: '#1C4B2D', opacity: 0.2 }} />
          </div>
        )}

        {/* Prev/Next arrows */}
        {normalizedImages.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); prev(); }}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: '#374151', fontSize: '13px' }}>
              <i className="fas fa-chevron-left" />
            </button>
            <button onClick={e => { e.stopPropagation(); next(); }}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', color: '#374151', fontSize: '13px' }}>
              <i className="fas fa-chevron-right" />
            </button>
          </>
        )}

        {/* Image count badge */}
        {normalizedImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
            {activeIdx + 1}/{normalizedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {normalizedImages.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {normalizedImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${i === activeIdx ? '#1C4B2D' : '#e5e7eb'}`,
                padding: 0, cursor: 'pointer', background: '#f0fdf4', transition: 'border-color 0.15s', flexShrink: 0,
              }}
            >
              {img.url ? (
                <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="fas fa-seedling" style={{ color: '#1C4B2D', fontSize: '22px' }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', cursor: 'zoom-out' }}
        >
          <img src={activeImage.url} alt={activeImage.alt} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
          <button onClick={() => setIsZoomed(false)} style={{ position: 'fixed', top: '20px', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fas fa-times" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
