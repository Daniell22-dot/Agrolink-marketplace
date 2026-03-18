import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = ({ orderId, amount, paymentMethod }) => {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '460px', width: '100%' }}>
        {/* Success animation circle */}
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1C4B2D, #2d7a4a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 0 16px rgba(28,75,45,0.08), 0 0 0 32px rgba(28,75,45,0.04)',
          animation: 'successPulse 0.5s ease',
        }}>
          <i className="fas fa-check" style={{ fontSize: '40px', color: '#fff' }} />
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 800, color: '#111827' }}>Payment Successful!</h1>
        <p style={{ margin: '0 0 28px', color: '#6b7280', fontSize: '15px' }}>
          Your order has been placed and payment confirmed.
        </p>

        {/* Details Card */}
        <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '28px', textAlign: 'left', border: '1px solid #e5e7eb' }}>
          {[
            { icon: 'fas fa-receipt', label: 'Order ID', value: `#${orderId || '—'}` },
            { icon: 'fas fa-coins', label: 'Amount Paid', value: `KES ${Number(amount || 0).toLocaleString()}` },
            { icon: 'fas fa-credit-card', label: 'Payment Method', value: paymentMethod || 'M-Pesa', capitalize: true },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: row.label !== 'Payment Method' ? '1px solid #e5e7eb' : 'none' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className={row.icon} style={{ color: '#1C4B2D' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 500 }}>{row.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', textTransform: row.capitalize ? 'capitalize' : 'none' }}>
                  {row.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What next */}
        <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '14px 16px', marginBottom: '28px', display: 'flex', gap: '10px', textAlign: 'left' }}>
          <i className="fas fa-info-circle" style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
            The farmer has been notified and will confirm your order shortly. You'll be able to track your delivery from the orders page.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link
            to={orderId ? `/order/${orderId}` : '/orders'}
            style={{ padding: '12px 24px', borderRadius: '10px', background: '#1C4B2D', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}
          >
            <i className="fas fa-box" style={{ marginRight: '8px' }} />Track Order
          </Link>
          <Link
            to="/products"
            style={{ padding: '12px 24px', borderRadius: '10px', border: '2px solid #1C4B2D', color: '#1C4B2D', fontWeight: 700, textDecoration: 'none', fontSize: '15px' }}
          >
            <i className="fas fa-store" style={{ marginRight: '8px' }} />Keep Shopping
          </Link>
        </div>
        <style>{`@keyframes successPulse { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      </div>
    </div>
  );
};

export default PaymentSuccess;
