import React from 'react';
import { Link } from 'react-router-dom';
import StatsCard from './StatsCard';

const FarmerDashboard = ({ stats, orders, products, user }) => {
  const recentOrders = orders?.slice(0, 5) || [];
  const myProducts = products?.slice(0, 6) || [];

  const statusColor = {
    pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6',
    shipped: '#06b6d4', delivered: '#22C55E', cancelled: '#ef4444',
  };

  return (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', marginBottom: '32px',
      }}>
        <StatsCard icon="fas fa-receipt" iconColor="#3b82f6" iconBg="#eff6ff" label="Total Orders" value={stats?.totalOrders || 0} />
        <StatsCard icon="fas fa-clock" iconColor="#f59e0b" iconBg="#fffbeb" label="Pending" value={stats?.pendingOrders || 0} />
        <StatsCard icon="fas fa-seedling" iconColor="#22C55E" iconBg="#f0fdf4" label="My Products" value={stats?.totalProducts || 0} />
        <StatsCard icon="fas fa-coins" iconColor="#22C55E" iconBg="#f0fdf4" label="Total Revenue" value={`KES ${(stats?.totalSales || 0).toLocaleString()}`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              <i className="fas fa-history" style={{ marginRight: '8px', color: '#22C55E' }} />
              Incoming Orders
            </h3>
            <Link to="/orders" style={{ fontSize: '13px', color: '#22C55E', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
              <i className="fas fa-inbox" style={{ fontSize: '32px', marginBottom: '10px', color: '#d1d5db' }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No orders yet</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>Orders will appear here once customers buy your products</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentOrders.map(order => (
                <Link key={order.id} to={`/order/${order.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', background: '#f9fafb', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                  onMouseOut={e => e.currentTarget.style.background = '#f9fafb'}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Order #{order.id}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                      {new Date(order.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#22C55E' }}>KES {parseFloat(order.total_amount || 0).toLocaleString()}</div>
                    <span style={{ display: 'inline-block', marginTop: '3px', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, background: `${statusColor[order.status] || '#9ca3af'}20`, color: statusColor[order.status] || '#9ca3af', textTransform: 'capitalize' }}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* My Products */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              <i className="fas fa-seedling" style={{ marginRight: '8px', color: '#22C55E' }} />
              My Products
            </h3>
            <Link to="/products" style={{ fontSize: '13px', color: '#22C55E', textDecoration: 'none', fontWeight: 600 }}>Manage →</Link>
          </div>
          {myProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
              <i className="fas fa-plus-circle" style={{ fontSize: '32px', marginBottom: '10px', color: '#d1d5db' }} />
              <p style={{ margin: 0, fontSize: '14px' }}>No products listed yet</p>
              <Link to="/products" style={{ display: 'inline-block', marginTop: '10px', color: '#22C55E', fontWeight: 600, fontSize: '13px' }}>
                List Your First Product →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myProducts.map(product => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: '#f9fafb' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#22C55E22', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="fas fa-seedling" style={{ color: '#22C55E', fontSize: '16px' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{product.name}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>KES {parseFloat(product.price || 0).toLocaleString()} / {product.unit || 'kg'}</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: product.stock_quantity > 0 ? '#10b981' : '#ef4444' }}>
                    {product.stock_quantity > 0 ? 'In Stock' : 'Out'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
