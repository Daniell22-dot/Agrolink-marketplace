import React from 'react';

const StatsCard = ({ icon, iconColor, iconBg, label, value, subLabel, trend }) => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      border: '1px solid #f0f0f0',
      transition: 'box-shadow 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'}
      onMouseOut={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'}
    >
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: iconBg || '#f0fdf4',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <i className={icon || 'fas fa-chart-bar'} style={{ fontSize: '20px', color: iconColor || '#1C4B2D' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
          {value ?? '—'}
        </div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px', fontWeight: 500 }}>
          {label}
        </div>
        {(subLabel || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            {trend !== undefined && (
              <span style={{
                fontSize: '12px', fontWeight: 600,
                color: trend >= 0 ? '#10b981' : '#ef4444',
              }}>
                <i className={trend >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'} style={{ marginRight: '2px' }} />
                {Math.abs(trend)}%
              </span>
            )}
            {subLabel && (
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{subLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
