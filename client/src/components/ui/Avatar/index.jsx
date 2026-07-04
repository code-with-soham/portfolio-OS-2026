import { useState } from 'react';
import './Avatar.css';

/**
 * Enterprise UI Component: Avatar
 */
export const Avatar = ({
  src,
  alt,
  fallback,
  size = 'md',
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);

  const classNames = [
    'ds-avatar',
    `ds-avatar-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {src && !error ? (
        <img 
          src={src} 
          alt={alt} 
          className="ds-avatar-img" 
          onError={() => setError(true)}
        />
      ) : (
        <span className="ds-avatar-fallback">
          {fallback || (alt ? alt.substring(0, 2) : '??')}
        </span>
      )}
    </div>
  );
};
