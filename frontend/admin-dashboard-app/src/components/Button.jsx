import React from 'react';
import './Button.scss';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  icon = null,
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <div className="btn-spinner"></div>}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

export default Button;
