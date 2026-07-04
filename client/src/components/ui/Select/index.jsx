import { forwardRef } from 'react';
import './Select.css';

/**
 * Enterprise UI Component: Select
 */
export const Select = forwardRef(({
  label,
  error,
  success,
  helperText,
  options = [],
  className = '',
  disabled = false,
  ...props
}, ref) => {
  
  const wrapperClasses = [
    'ds-input-wrapper',
    error ? 'ds-input-error' : '',
    success ? 'ds-input-success' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {label && <label className="ds-input-label">{label}</label>}
      <div className="ds-input-container">
        <select
          ref={ref}
          className="ds-input ds-select ds-focusable ds-scrollbar"
          disabled={disabled}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="ds-input-icon ds-input-icon-right ds-select-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      
      {(error || success || helperText) && (
        <span className="ds-input-message">
          {error || success || helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
