import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidth = false,
  icon,
  ...rest
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.65 : 1,
    border: 'none',
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'inherit',
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '16px' },
  };

  const variantStyles = {
    primary: { background: '#1C4B2D', color: '#fff' },
    secondary: { background: '#f3f4f6', color: '#374151' },
    danger: { background: '#dc2626', color: '#fff' },
    outline: { background: 'transparent', color: '#1C4B2D', border: '2px solid #1C4B2D' },
    ghost: { background: 'transparent', color: '#1C4B2D' },
  };

  const style = { ...baseStyle, ...sizeStyles[size], ...variantStyles[variant] };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      className={className}
      {...rest}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : icon ? (
        <i className={icon} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
