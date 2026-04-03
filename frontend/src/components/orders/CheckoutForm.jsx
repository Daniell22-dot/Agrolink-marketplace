import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CheckoutForm = ({ onSubmit, isLoading }) => {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    contactPhone: user?.phone || '',
    paymentMethod: 'mpesa',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  // validate function
  const validate = () => {
    const errs = {};
    if (!formData.shippingAddress.trim()) errs.shippingAddress = 'Shipping address is required';
    if (!formData.contactPhone.trim()) errs.contactPhone = 'Contact phone is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(formData.contactPhone.trim())) errs.contactPhone = 'Enter a valid phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  const fieldStyle = (err) => ({
    width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
    border: `1px solid ${err ? '#ef4444' : '#d1d5db'}`, outline: 'none',
    boxSizing: 'border-box',
  });

  const paymentOptions = [
    { value: 'mpesa', icon: 'fas fa-mobile-alt', label: 'M-Pesa', desc: 'Pay via Safaricom M-Pesa STK Push' },
    { value: 'card', icon: 'fas fa-credit-card', label: 'Card', desc: 'Visa or Mastercard accepted' },
    { value: 'cash', icon: 'fas fa-money-bill-wave', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Delivery Section */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          <i className="fas fa-shipping-fast" style={{ marginRight: '8px', color: '#1C4B2D' }} />
          Delivery Information
        </h3>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Shipping Address <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            style={{ ...fieldStyle(errors.shippingAddress), resize: 'vertical', minHeight: '80px' }}
            placeholder="Enter your full delivery address (county, town, street)"
            value={formData.shippingAddress}
            onChange={e => handleChange('shippingAddress', e.target.value)}
          />
          {errors.shippingAddress && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.shippingAddress}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
            Contact Phone <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="tel"
            style={fieldStyle(errors.contactPhone)}
            placeholder="0712 345 678"
            value={formData.contactPhone}
            onChange={e => handleChange('contactPhone', e.target.value)}
          />
          {errors.contactPhone && <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>{errors.contactPhone}</p>}
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>
          <i className="fas fa-credit-card" style={{ marginRight: '8px', color: '#1C4B2D' }} />
          Payment Method
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {paymentOptions.map(opt => (
            <label
              key={opt.value}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                borderRadius: '10px', cursor: 'pointer',
                border: `2px solid ${formData.paymentMethod === opt.value ? '#1C4B2D' : '#e5e7eb'}`,
                background: formData.paymentMethod === opt.value ? '#f0fdf4' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              <input type="radio" name="paymentMethod" value={opt.value} checked={formData.paymentMethod === opt.value} onChange={e => handleChange('paymentMethod', e.target.value)} style={{ display: 'none' }} />
              <i className={opt.icon} style={{ fontSize: '20px', color: '#1C4B2D', width: '24px', textAlign: 'center' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>{opt.label}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{opt.desc}</div>
              </div>
              {formData.paymentMethod === opt.value && <i className="fas fa-check-circle" style={{ marginLeft: 'auto', color: '#1C4B2D', fontSize: '18px' }} />}
            </label>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
          Order Notes (Optional)
        </label>
        <textarea
          style={{ ...fieldStyle(false), minHeight: '60px', resize: 'vertical' }}
          placeholder="Any special instructions for your order or delivery..."
          value={formData.notes}
          onChange={e => handleChange('notes', e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: '14px', borderRadius: '10px', border: 'none',
          background: isLoading ? '#9ca3af' : '#1C4B2D', color: '#fff',
          fontWeight: 700, fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {isLoading ? <><i className="fas fa-spinner fa-spin" /> Processing...</> : <><i className="fas fa-lock" /> Place Order Securely</>}
      </button>
    </form>
  );
};

export default CheckoutForm;
