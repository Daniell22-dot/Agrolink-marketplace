import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  disabled = false,
  icon,
  helperText,
  className = '',
  ...rest
}) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '16px' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#374151',
          }}
        >
          {label}
          {required && <span style={{ color: '#dc2626', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <i
            className={icon}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '14px',
            }}
          />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: icon ? '10px 12px 10px 36px' : '10px 12px',
            border: `1px solid ${error ? '#dc2626' : '#d1d5db'}`,
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            background: disabled ? '#f9fafb' : '#fff',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => !error && (e.target.style.borderColor = '#1C4B2D')}
          onBlur={e => !error && (e.target.style.borderColor = '#d1d5db')}
          {...rest}
        />
      </div>
      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block' }}>
          <i className="fas fa-exclamation-circle" style={{ marginRight: '4px' }} />
          {error}
        </span>
      )}
      {helperText && !error && (
        <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
