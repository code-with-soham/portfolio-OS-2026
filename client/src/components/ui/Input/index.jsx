import { forwardRef } from 'react';
import './Input.css';

/**
 * Enterprise UI Component: Input
 * Supports states: Default, Hover, Focus, Disabled, Error, Success
 */
export const Input = forwardRef(({
  label,
  error,
  success,
  helperText,
  iconLeft,
  iconRight,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  
  const wrapperClasses = [
    'ds-input-wrapper',
    error ? 'ds-input-error' : '',
    success ? 'ds-input-success' : '',
    iconLeft ? 'ds-input-has-icon-left' : '',
    iconRight ? 'ds-input-has-icon-right' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && <label className="ds-input-label">{label}</label>}
      <div className="ds-input-container">
        {iconLeft && <span className="ds-input-icon ds-input-icon-left">{iconLeft}</span>}
        
        <input
          ref={ref}
          className="ds-input ds-focusable"
          disabled={disabled}
          {...props}
        />
        
        {iconRight && <span className="ds-input-icon ds-input-icon-right">{iconRight}</span>}
      </div>
      
      {(error || success || helperText) && (
        <span className="ds-input-message">
          {error || success || helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
