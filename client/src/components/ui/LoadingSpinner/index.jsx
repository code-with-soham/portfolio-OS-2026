import './LoadingSpinner.css';

/**
 * Enterprise UI Component: LoadingSpinner
 */
export const LoadingSpinner = ({
  size = 'md',
  color,
  className = '',
  ...props
}) => {
  const classNames = [
    'ds-spinner',
    `ds-spinner-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classNames}
      style={{ color: color || 'var(--ds-accent)', ...props.style }}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};
