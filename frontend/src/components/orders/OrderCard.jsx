import React from 'react';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending:    { color: '#f59e0b', bg: '#fffbeb', icon: 'fas fa-clock', label: 'Pending' },
  confirmed:  { color: '#3b82f6', bg: '#eff6ff', icon: 'fas fa-check', label: 'Confirmed' },
  processing: { color: '#8b5cf6', bg: '#f5f3ff', icon: 'fas fa-cog',   label: 'Processing' },
  shipped:    { color: '#06b6d4', bg: '#ecfeff', icon: 'fas fa-truck', label: 'Shipped' },
  delivered:  { color: '#10b981', bg: '#ecfdf5', icon: 'fas fa-check-circle', label: 'Delivered' },
  cancelled:  { color: '#ef4444', bg: '#fef2f2', icon: 'fas fa-times-circle',  label: 'Cancelled' },
};

const OrderCard = ({ order, onCancel }) => {
  const status = statusConfig[order?.status] || statusConfig.pending;

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
      overflow: 'hidden', transition: 'box-shadow 0.2s',
    }}
      onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
      onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Card Header */}
      <div style={{
        padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fafafa',
      }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Order #{order?.id}</span>
          <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '12px' }}>
            {order?.created_at ? new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
          </span>
        </div>
        <span style={{
          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
          background: status.bg, color: status.color,
        }}>
          <i className={status.icon} style={{ marginRight: '5px' }} />
          {status.label}
        </span>
      </div>

      {/* Items preview */}
      <div style={{ padding: '14px 20px' }}>
        {order?.items?.slice(0, 2).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-seedling" style={{ color: '#1C4B2D', fontSize: '14px' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {item.product_name || item.name}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>Qty: {item.quantity} × KES {parseFloat(item.price || 0).toLocaleString()}</div>
            </div>
          </div>
        ))}
        {order?.items?.length > 2 && (
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>
            +{order.items.length - 2} more item(s)
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>Total</span>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#1C4B2D' }}>
            KES {parseFloat(order?.total_amount || 0).toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {order?.status === 'pending' && onCancel && (
            <button
              onClick={() => onCancel(order.id)}
              style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
            >
              Cancel
            </button>
          )}
          <Link
            to={`/order/${order?.id}`}
            style={{ padding: '7px 14px', borderRadius: '7px', background: '#1C4B2D', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 600 }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
