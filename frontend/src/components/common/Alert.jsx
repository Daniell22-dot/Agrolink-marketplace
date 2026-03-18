import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  };

  const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '500',
    background:
      type === 'success' ? '#d1fae5' :
      type === 'error' ? '#fee2e2' :
      type === 'warning' ? '#fef3c7' : '#dbeafe',
    color:
      type === 'success' ? '#065f46' :
      type === 'error' ? '#991b1b' :
      type === 'warning' ? '#92400e' : '#1e40af',
    border: `1px solid ${
      type === 'success' ? '#6ee7b7' :
      type === 'error' ? '#fca5a5' :
      type === 'warning' ? '#fcd34d' : '#93c5fd'
    }`,
  };

  return (
    <div style={styles} role="alert">
      <i className={icons[type]} />
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: '16px' }}
          aria-label="Close"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  );
};

export default Alert;
