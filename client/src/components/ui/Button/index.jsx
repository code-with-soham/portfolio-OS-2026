import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { buttonMotion } from '../../../animations/ButtonMotion';
import './Button.css';

/**
 * Enterprise UI Component: Button
 * Supports states: Default, Hover, Active, Focus, Disabled, Loading
 * Variants: primary, secondary, ghost, danger, success
 */
export const Button = forwardRef(({
  variant = 'primary',
  children,
  icon,
  iconOnly = false,
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  
  const classNames = [
    'ds-button',
    'ds-focusable',
    `ds-button-${variant}`,
    iconOnly ? 'ds-button-icon' : '',
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      className={classNames}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : buttonMotion.hover}
      whileTap={isDisabled ? {} : buttonMotion.tap}
      {...props}
    >
      {isLoading && <div className="ds-button-spinner" />}
      {!isLoading && icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {!iconOnly && <span>{children}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';
