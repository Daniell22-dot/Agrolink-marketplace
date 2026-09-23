import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct } from '../../redux/slices/productSlice';

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'herbs', 'other'];
const UNITS = ['kg', 'g', 'litre', 'piece', 'bunch', 'tray', 'bag', 'crate'];

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vegetables',
    unit: 'kg',
    stock_quantity: '',
    image_url: '',
    county: '',
  });
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'vegetables',
        unit: product.unit || 'kg',
        stock_quantity: product.stock_quantity || '',
        image_url: product.image_url || '',
        county: product.county || '',
      });
      setVariants((product.variants || []).map(v => ({
        id: v.id,
        name: v.name || '',
        value: v.value || '',
        priceDelta: v.priceDelta || '',
        stockQty: v.stockQty || '',
        sku: v.sku || ''
      })));
    }
  }, [product]);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) errs.price = 'Enter a valid price';
    if (!form.stock_quantity || isNaN(form.stock_quantity) || parseInt(form.stock_quantity) < 0) errs.stock_quantity = 'Enter a valid stock quantity';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.image_url && !/^https?:\/\//.test(form.image_url)) errs.image_url = 'Enter a valid image URL (https://...)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        const data = {
          ...form,
          price: parseFloat(form.price),
          stock_quantity: parseInt(form.stock_quantity),
          variants: variants.filter(v => v.name && v.value)
        };
        if (isEdit) {
          await dispatch(updateProduct({ productId: product.id, productData: data })).unwrap();
        } else {
          await dispatch(createProduct(data)).unwrap();
        }
        if (onSuccess) onSuccess();
      } catch (err) {
        // toast handled in slice
      } finally {
        setIsSubmitting(false);
      }
    };

  const inputStyle = (err) => ({
    width: '100%', padding: '10px 12px', borderRadius: '8px', fontSize: '14px',
    border: `1px solid ${err ? '#ef4444' : '#d1d5db'}`, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  });

  const Label = ({ text, required }) => (
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
      {text}{required && <span style={{ color: '#ef4444' }}> *</span>}
    </label>
  );

  const Err = ({ field }) => errors[field] ? <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#ef4444' }}>{errors[field]}</p> : null;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Name */}
      <div>
        <Label text="Product Name" required />
        <input style={inputStyle(errors.name)} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Fresh Tomatoes" />
        <Err field="name" />
      </div>

      {/* Category & Unit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <Label text="Category" required />
          <select style={{ ...inputStyle(false), cursor: 'pointer' }} value={form.category} onChange={e => setField('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <Label text="Unit" required />
          <select style={{ ...inputStyle(false), cursor: 'pointer' }} value={form.unit} onChange={e => setField('unit', e.target.value)}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Price & Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <Label text={`Price (KES per ${form.unit})`} required />
          <input type="number" min="0" step="0.01" style={inputStyle(errors.price)} value={form.price} onChange={e => setField('price', e.target.value)} placeholder="0.00" />
          <Err field="price" />
        </div>
        <div>
          <Label text={`Stock (${form.unit}s)`} required />
          <input type="number" min="0" style={inputStyle(errors.stock_quantity)} value={form.stock_quantity} onChange={e => setField('stock_quantity', e.target.value)} placeholder="0" />
          <Err field="stock_quantity" />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label text="Description" required />
        <textarea
          style={{ ...inputStyle(errors.description), resize: 'vertical', minHeight: '80px' }}
          value={form.description}
          onChange={e => setField('description', e.target.value)}
          placeholder="Describe your product — freshness, farming method, delivery details..."
        />
        <Err field="description" />
      </div>

      {/* Image URL */}
      <div>
        <Label text="Product Image URL" />
        <input style={inputStyle(errors.image_url)} value={form.image_url} onChange={e => setField('image_url', e.target.value)} placeholder="https://example.com/image.jpg" />
        <Err field="image_url" />
        {form.image_url && !errors.image_url && (
          <div style={{ marginTop: '8px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={form.image_url} alt="Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain' }} onError={e => e.target.style.display = 'none'} />
          </div>
        )}
      </div>

      {/* County */}
      <div>
        <Label text="County / Location" />
        <input style={inputStyle(false)} value={form.county} onChange={e => setField('county', e.target.value)} placeholder="e.g. Nakuru County" />
      </div>

      {/* Variants */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Label text="Variants (optional)" />
          <button type="button" onClick={() => setVariants(prev => [...prev, { id: Date.now().toString(), name: '', value: '', priceDelta: '', stockQty: '', sku: '' }])} style={{ fontSize: '12px', color: '#1C4B2D', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            + Add Variant
          </button>
        </div>
        {variants.length === 0 && <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>No variants added.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {variants.map((variant, idx) => (
            <div key={variant.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'end', background: '#f9fafb', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px', display: 'block' }}>Name</label>
                <input style={{ ...inputStyle(false), padding: '6px 8px', fontSize: '13px' }} value={variant.name} onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, name: e.target.value } : v))} placeholder="e.g. Size" />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px', display: 'block' }}>Value</label>
                <input style={{ ...inputStyle(false), padding: '6px 8px', fontSize: '13px' }} value={variant.value} onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, value: e.target.value } : v))} placeholder="e.g. 1kg" />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px', display: 'block' }}>Price +</label>
                <input type="number" min="0" step="0.01" style={{ ...inputStyle(false), padding: '6px 8px', fontSize: '13px' }} value={variant.priceDelta} onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, priceDelta: e.target.value } : v))} placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px', display: 'block' }}>Stock</label>
                <input type="number" min="0" style={{ ...inputStyle(false), padding: '6px 8px', fontSize: '13px' }} value={variant.stockQty} onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, stockQty: e.target.value } : v))} placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginBottom: '2px', display: 'block' }}>SKU</label>
                <input style={{ ...inputStyle(false), padding: '6px 8px', fontSize: '13px' }} value={variant.sku} onChange={e => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, sku: e.target.value } : v))} placeholder="optional" />
              </div>
              <button type="button" onClick={() => setVariants(prev => prev.filter((_, i) => i !== idx))} style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '12px' }}>
                <i className="fas fa-trash-alt" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: isSubmitting ? '#9ca3af' : '#1C4B2D', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isSubmitting && <i className="fas fa-spinner fa-spin" />}
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'List Product'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
