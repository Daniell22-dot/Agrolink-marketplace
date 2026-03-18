import React, { useState } from 'react';

const MpesaPayment = ({ amount, onSuccess, onError, isLoading, setIsLoading }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, '');
    if (!/^(07|01|2547|2541)\d{7,8}$/.test(cleaned)) {
      setError('Enter a valid Kenyan phone number (e.g. 0712345678)');
      return;
    }
    setError('');
    if (setIsLoading) setIsLoading(true);
    try {
      // Simulate STK Push
      setSent(true);
      if (onSuccess) setTimeout(() => onSuccess({ phone: cleaned, method: 'mpesa' }), 3000);
    } catch (err) {
      if (onError) onError(err);
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <i className="fas fa-mobile-alt" style={{ fontSize: '28px', color: '#1C4B2D' }} />
        </div>
        <h3 style={{ margin: '0 0 8px', color: '#111827' }}>STK Push Sent!</h3>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
          Check your phone <strong>{phone}</strong> and enter your M-Pesa PIN to complete payment of <strong>KES {Number(amount).toLocaleString()}</strong>.
        </p>
        <div style={{ marginTop: '16px', padding: '12px', background: '#fffbeb', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
          <i className="fas fa-info-circle" style={{ marginRight: '6px' }} />
          Do not close this page. Waiting for confirmation...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
          <i className="fas fa-mobile-alt" style={{ fontSize: '24px', color: '#1C4B2D' }} />
        </div>
        <h3 style={{ margin: '0 0 4px', color: '#111827', fontSize: '18px' }}>Pay with M-Pesa</h3>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Amount: <strong>KES {Number(amount || 0).toLocaleString()}</strong></p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
          M-Pesa Phone Number <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={e => { setPhone(e.target.value); setError(''); }}
          placeholder="0712 345 678"
          style={{
            width: '100%', padding: '12px', borderRadius: '8px', fontSize: '15px',
            border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`, outline: 'none', boxSizing: 'border-box',
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%', padding: '13px', borderRadius: '8px', border: 'none',
          background: '#1C4B2D', color: '#fff', fontWeight: 700, fontSize: '15px',
          cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {isLoading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-paper-plane" />}
        {isLoading ? 'Sending...' : 'Send STK Push'}
      </button>
    </form>
  );
};

export default MpesaPayment;
