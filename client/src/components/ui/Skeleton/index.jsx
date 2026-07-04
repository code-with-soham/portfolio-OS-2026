import './Skeleton.css';

/**
 * Enterprise UI Component: Skeleton
 */
export const Skeleton = ({
  width,
  height,
  variant = 'rect',
  className = '',
  ...props
}) => {
  
  const classNames = [
    'ds-skeleton',
    variant === 'circle' ? 'ds-skeleton-circle' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classNames} 
      style={{ width, height, ...props.style }}
      {...props}
    />
  );
};
