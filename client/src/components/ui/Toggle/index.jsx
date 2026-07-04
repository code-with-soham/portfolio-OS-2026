import { forwardRef } from 'react';
import './Toggle.css';

/**
 * Enterprise UI Component: Toggle / Switch
 */
export const Toggle = forwardRef(({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  
  const wrapperClasses = [
    'ds-toggle-wrapper',
    'ds-focusable',
    checked ? 'ds-toggle-checked' : '',
    disabled ? 'ds-toggle-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange?.(!checked);
    }
  };

  return (
    <div
      ref={ref}
      className={wrapperClasses}
      onClick={() => !disabled && onChange?.(!checked)}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      {...props}
    >
      <div className="ds-toggle-track">
        <div className="ds-toggle-thumb" />
      </div>
      {label && <span className="ds-toggle-label">{label}</span>}
    </div>
  );
});

Toggle.displayName = 'Toggle';
