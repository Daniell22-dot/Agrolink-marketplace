import React, { useState } from 'react';
import OrderCard from './OrderCard';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const OrderList = ({ orders = [], onCancel, isLoading }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #e5e7eb', borderTop: '4px solid #1C4B2D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '7px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
              background: activeTab === tab ? '#1C4B2D' : '#f3f4f6',
              color: activeTab === tab ? '#fff' : '#374151',
              transition: 'all 0.15s',
            }}
          >
            {tab === 'all' ? `All (${orders.length})` : `${tab} (${orders.filter(o => o.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
          <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#d1d5db', marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px', fontWeight: 700, color: '#374151' }}>No orders found</h3>
          <p style={{ margin: 0, fontSize: '14px' }}>
            {activeTab === 'all' ? 'You haven\'t placed any orders yet.' : `No ${activeTab} orders.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(order => (
            <OrderCard key={order.id} order={order} onCancel={onCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
