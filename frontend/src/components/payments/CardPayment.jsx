import React, { useState } from 'react';

const CardPayment = ({ amount, onSuccess, onError, isLoading }) => {
  const [form, setForm] = useState({ cardNumber: '', expiryDate: '', cvv: '', cardHolder: '' });
  const [errors, setErrors] = useState({});

  const formatCardNumber = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handleChange = (field, rawValue) => {
    let value = rawValue;
    if (field === 'cardNumber') value = formatCardNumber(rawValue);
    if (field === 'expiryDate') value = formatExpiry(rawValue);
    if (field === 'cvv') value = rawValue.replace(/\D/g, '').slice(0, 4);
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (form.cardNumber.replace(/\s/g, '').length !== 16) errs.cardNumber = 'Enter a 16-digit card number';
    if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) errs.expiryDate = 'Enter expiry as MM/YY';
    if (form.cvv.length < 3) errs.cvv = 'Enter valid CVV (3-4 digits)';
    if (!form.cardHolder.trim()) errs.cardHolder = 'Cardholder name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (onSuccess) onSuccess({ ...form, method: 'card' });
    } catch (err) {
      if (onError) onError(err);
    }
  };

  const cardDetect = () => {
    const n = form.cardNumber.replace(/\s/g, '');
    if (n.startsWith('4')) return { icon: 'fab fa-cc-visa', color: '#1a1f71' };
    if (/^5[1-5]/.test(n)) return { icon: 'fab fa-cc-mastercard', color: '#eb001b' };
    return { icon: 'fas fa-credit-card', color: '#6b7280' };
  };

  const { icon: cardIcon, color: cardColor } = cardDetect();

  const fieldWrap = (children) => <div style={{ marginBottom: '14px' }}>{children}</div>;
  const label = (text, req) => (
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
      {text}{req && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
  );
  const input = (field, ...props) => (
    <input
      value={form[field]}
      onChange={e => handleChange(field, e.target.value)}
      style={{ width: '100%', padding: '11px 12px', borderRadius: '8px', fontSize: '14px', border: `1px solid ${errors[field] ? '#ef4444' : '#d1d5db'}`, outline: 'none', boxSizing: 'border-box' }}
      {...(props[0] || {})}
    />
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
          <i className="fas fa-credit-card" style={{ fontSize: '24px', color: '#3b82f6' }} />
        </div>
        <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#111827' }}>Card Payment</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>Amount: <strong>KES {Number(amount || 0).toLocaleString()}</strong></p>
      </div>

      {fieldWrap(<>
        {label('Card Number', true)}
        <div style={{ position: 'relative' }}>
          {input('cardNumber', { placeholder: '1234 5678 9012 3456' })}
          <i className={cardIcon} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '22px', color: cardColor }} />
        </div>
        {errors.cardNumber && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.cardNumber}</p>}
      </>)}

      {fieldWrap(<>
        {label('Cardholder Name', true)}
        {input('cardHolder', { placeholder: 'JOHN DOE' })}
        {errors.cardHolder && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.cardHolder}</p>}
      </>)}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {fieldWrap(<>
          {label('Expiry Date', true)}
          {input('expiryDate', { placeholder: 'MM/YY' })}
          {errors.expiryDate && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.expiryDate}</p>}
        </>)}
        {fieldWrap(<>
          {label('CVV', true)}
          {input('cvv', { placeholder: '•••', type: 'password' })}
          {errors.cvv && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.cvv}</p>}
        </>)}
      </div>

      <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fas fa-lock" style={{ color: '#1C4B2D' }} />
        <span style={{ fontSize: '12px', color: '#374151' }}>Your card details are encrypted and secure</span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        {isLoading ? <i className="fas fa-spinner fa-spin" /> : <i className="fas fa-lock" />}
        {isLoading ? 'Processing...' : `Pay KES ${Number(amount || 0).toLocaleString()}`}
      </button>
    </form>
  );
};

export default CardPayment;
