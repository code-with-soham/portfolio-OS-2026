import './Badge.css';

/**
 * Enterprise UI Component: Badge
 */
export const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const classNames = [
    'ds-badge',
    `ds-badge-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
};
