import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const widths = { sm: '400px', md: '560px', lg: '720px', xl: '900px' };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1050,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)', padding: '16px',
      }}
      onClick={e => e.target === e.currentTarget && onClose && onClose()}
    >
      <div
        style={{
          background: '#fff', borderRadius: '12px',
          width: '100%', maxWidth: widths[size] || widths.md,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'modalFadeIn 0.2s ease',
        }}
      >
        {/* Header */}
        {(title || onClose) && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
          }}>
            {title && <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#111827' }}>{title}</h3>}
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#6b7280', fontSize: '20px', padding: '4px', lineHeight: 1,
                }}
                aria-label="Close modal"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #e5e7eb',
            display: 'flex', justifyContent: 'flex-end', gap: '12px',
          }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

export default Modal;
