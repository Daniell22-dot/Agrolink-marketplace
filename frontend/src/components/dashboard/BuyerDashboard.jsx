import React from 'react';
import { Link } from 'react-router-dom';
import StatsCard from './StatsCard';

const BuyerDashboard = ({ stats, orders, user }) => {
  const recentOrders = orders?.slice(0, 5) || [];

  const statusColor = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  return (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatsCard
          icon="fas fa-receipt"
          iconColor="#3b82f6"
          iconBg="#eff6ff"
          label="Total Orders"
          value={stats?.totalOrders || 0}
        />
        <StatsCard
          icon="fas fa-clock"
          iconColor="#f59e0b"
          iconBg="#fffbeb"
          label="Pending Orders"
          value={stats?.pendingOrders || 0}
        />
        <StatsCard
          icon="fas fa-check-circle"
          iconColor="#10b981"
          iconBg="#ecfdf5"
          label="Completed Orders"
          value={stats?.completedOrders || 0}
        />
        <StatsCard
          icon="fas fa-wallet"
          iconColor="#1C4B2D"
          iconBg="#f0fdf4"
          label="Total Spent"
          value={`KES ${(stats?.totalSpent || 0).toLocaleString()}`}
        />
      </div>

      {/* Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              <i className="fas fa-history" style={{ marginRight: '8px', color: '#1C4B2D' }} />
              Recent Orders
            </h3>
            <Link to="/orders" style={{ fontSize: '13px', color: '#1C4B2D', textDecoration: 'none', fontWeight: 600 }}>
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
              <i className="fas fa-inbox" style={{ fontSize: '32px', marginBottom: '10px', color: '#d1d5db' }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No orders yet</p>
              <Link to="/products" style={{ display: 'inline-block', marginTop: '10px', color: '#1C4B2D', fontWeight: 600, fontSize: '13px' }}>
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  to={`/order/${order.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '8px', background: '#f9fafb',
                    textDecoration: 'none', transition: 'background 0.15s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseOut={e => e.currentTarget.style.background = '#f9fafb'}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Order #{order.id}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C4B2D' }}>
                      KES {parseFloat(order.total_amount || 0).toLocaleString()}
                    </div>
                    <span style={{
                      display: 'inline-block', marginTop: '3px',
                      padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700,
                      background: `${statusColor[order.status] || '#9ca3af'}20`,
                      color: statusColor[order.status] || '#9ca3af',
                      textTransform: 'capitalize',
                    }}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
            <i className="fas fa-bolt" style={{ marginRight: '8px', color: '#1C4B2D' }} />
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { to: '/products', icon: 'fas fa-store', label: 'Browse Market' },
              { to: '/orders', icon: 'fas fa-box', label: 'My Orders' },
              { to: '/cart', icon: 'fas fa-shopping-cart', label: 'View Cart' },
              { to: '/chat', icon: 'fas fa-comments', label: 'Messages' },
              { to: '/profile', icon: 'fas fa-user-cog', label: 'Settings' },
              { to: '/how-it-works', icon: 'fas fa-question-circle', label: 'How It Works' },
            ].map(action => (
              <Link
                key={action.to}
                to={action.to}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '6px', padding: '14px', borderRadius: '10px',
                  background: '#f9fafb', textDecoration: 'none', color: '#374151',
                  fontSize: '12px', fontWeight: 600, textAlign: 'center',
                  transition: 'all 0.15s', border: '1px solid transparent',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#1C4B2D'; e.currentTarget.style.color = '#1C4B2D'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#374151'; }}
              >
                <i className={action.icon} style={{ fontSize: '20px' }} />
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
