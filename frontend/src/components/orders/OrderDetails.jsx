import React from 'react';
import OrderTracking from './OrderTracking';

const OrderDetails = ({ order, onCancel, onUpdateStatus, isFarmer }) => {
  if (!order) return null;

  const nextStatus = {
    pending: 'confirmed', confirmed: 'processing', processing: 'shipped', shipped: 'delivered',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tracking */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#1C4B2D' }} />
          Order Tracking
        </h3>
        <OrderTracking status={order.status} />
      </div>

      {/* Items */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          <i className="fas fa-box-open" style={{ marginRight: '8px', color: '#1C4B2D' }} />
          Order Items
        </h3>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: i < order.items.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {item.image_url ? (
                <img src={item.image_url} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="fas fa-seedling" style={{ color: '#1C4B2D', fontSize: '20px' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{item.product_name || item.name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Quantity: {item.quantity} {item.unit || 'kg'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#1C4B2D' }}>KES {(parseFloat(item.price || 0) * item.quantity).toLocaleString()}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>@ KES {parseFloat(item.price || 0).toLocaleString()}</div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #f3f4f6' }}>
          {[
            { label: 'Subtotal', value: `KES ${(parseFloat(order.total_amount || 0) - 200).toLocaleString()}` },
            { label: 'Delivery Fee', value: 'KES 200' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{row.label}</span>
              <span style={{ fontSize: '13px', color: '#374151' }}>{row.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ fontWeight: 700, color: '#111827' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#1C4B2D' }}>KES {parseFloat(order.total_amount || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          <i className="fas fa-shipping-fast" style={{ marginRight: '8px', color: '#1C4B2D' }} />
          Delivery Info
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { icon: 'fas fa-map-marker-alt', label: 'Address', value: order.shipping_address || 'N/A' },
            { icon: 'fas fa-phone', label: 'Phone', value: order.contact_phone || 'N/A' },
            { icon: 'fas fa-credit-card', label: 'Payment', value: order.payment_method || 'N/A' },
            { icon: 'fas fa-calendar', label: 'Date', value: order.created_at ? new Date(order.created_at).toLocaleDateString('en-KE') : 'N/A' },
          ].map(info => (
            <div key={info.label} style={{ padding: '12px', borderRadius: '8px', background: '#f9fafb' }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
                <i className={info.icon} style={{ marginRight: '5px' }} />{info.label}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>{info.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {order.status === 'pending' && !isFarmer && onCancel && (
          <button
            onClick={() => onCancel(order.id)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '2px solid #ef4444', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
          >
            <i className="fas fa-times" style={{ marginRight: '6px' }} />Cancel Order
          </button>
        )}
        {isFarmer && nextStatus[order.status] && onUpdateStatus && (
          <button
            onClick={() => onUpdateStatus({ orderId: order.id, status: nextStatus[order.status] })}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#1C4B2D', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
          >
            <i className="fas fa-arrow-right" style={{ marginRight: '6px' }} />
            Mark as {nextStatus[order.status]?.charAt(0).toUpperCase() + nextStatus[order.status]?.slice(1)}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
