import { forwardRef } from 'react';
import './Textarea.css';

/**
 * Enterprise UI Component: Textarea
 */
export const Textarea = forwardRef(({
  label,
  error,
  success,
  helperText,
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
        <textarea
          ref={ref}
          className="ds-input ds-textarea ds-focusable ds-scrollbar"
          disabled={disabled}
          {...props}
        />
      </div>
      
      {(error || success || helperText) && (
        <span className="ds-input-message">
          {error || success || helperText}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
