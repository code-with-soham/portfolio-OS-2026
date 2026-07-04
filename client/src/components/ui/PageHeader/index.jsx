import './PageHeader.css';

/**
 * Enterprise UI Component: PageHeader
 */
export const PageHeader = ({
  title,
  description,
  actions,
  className = '',
  ...props
}) => {
  return (
    <header className={`ds-page-header ${className}`} {...props}>
      <div className="ds-page-header-content">
        <h1 className="ds-page-header-title">{title}</h1>
        {description && <p className="ds-page-header-description">{description}</p>}
      </div>
      {actions && (
        <div className="ds-page-header-actions">
          {actions}
        </div>
      )}
    </header>
  );
};
