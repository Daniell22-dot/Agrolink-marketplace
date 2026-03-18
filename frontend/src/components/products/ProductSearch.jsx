import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts, setFilters } from '../../redux/slices/productSlice';

const ProductSearch = ({ initialValue = '' }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState(initialValue);
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(setFilters({ search: val.trim(), category: '' }));
      dispatch(fetchProducts({ page: 1, limit: 12, search: val.trim() }));
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    dispatch(setFilters({ search: '', category: '' }));
    dispatch(fetchProducts({ page: 1, limit: 12, search: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearTimeout(debounceRef.current);
    dispatch(setFilters({ search: query.trim(), category: '' }));
    dispatch(fetchProducts({ page: 1, limit: 12, search: query.trim() }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '480px', width: '100%' }}>
      <i className="fas fa-search" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '15px', pointerEvents: 'none' }} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for maize, tomatoes, milk..."
        style={{
          width: '100%', padding: '12px 44px 12px 42px', borderRadius: '10px',
          border: '1.5px solid #d1d5db', outline: 'none', fontSize: '14px', color: '#111827',
          background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#1C4B2D'}
        onBlur={e => e.target.style.borderColor = '#d1d5db'}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px', padding: '4px' }}
        >
          <i className="fas fa-times" />
        </button>
      )}
    </form>
  );
};

export default ProductSearch;
