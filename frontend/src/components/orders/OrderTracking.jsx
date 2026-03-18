import React from 'react';

const steps = [
  { key: 'pending',    icon: 'fas fa-receipt',      label: 'Order Placed' },
  { key: 'confirmed',  icon: 'fas fa-check',         label: 'Confirmed' },
  { key: 'processing', icon: 'fas fa-cog',           label: 'Processing' },
  { key: 'shipped',    icon: 'fas fa-truck',         label: 'Shipped' },
  { key: 'delivered',  icon: 'fas fa-check-circle',  label: 'Delivered' },
];

const OrderTracking = ({ status }) => {
  const currentIdx = steps.findIndex(s => s.key === status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div style={{ padding: '16px', borderRadius: '10px', background: '#fef2f2', textAlign: 'center', color: '#dc2626' }}>
        <i className="fas fa-times-circle" style={{ fontSize: '28px', marginBottom: '8px' }} />
        <p style={{ margin: 0, fontWeight: 700 }}>Order Cancelled</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Progress line */}
        <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '3px', background: '#e5e7eb', zIndex: 0 }} />
        <div style={{
          position: 'absolute', top: '20px', left: '10%',
          width: `${currentIdx > 0 ? (currentIdx / (steps.length - 1)) * 80 : 0}%`,
          height: '3px', background: '#1C4B2D', zIndex: 1, transition: 'width 0.5s ease',
        }} />

        {steps.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: done ? '#1C4B2D' : '#e5e7eb',
                color: done ? '#fff' : '#9ca3af',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px',
                boxShadow: active ? '0 0 0 4px rgba(28,75,45,0.2)' : 'none',
                transition: 'all 0.3s',
              }}>
                <i className={step.icon} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: done ? 700 : 400, color: done ? '#1C4B2D' : '#9ca3af', marginTop: '6px', textAlign: 'center' }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracking;
