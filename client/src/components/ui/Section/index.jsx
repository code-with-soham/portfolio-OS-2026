import './Section.css';

/**
 * Enterprise UI Component: Section
 */
export const Section = ({
  title,
  description,
  children,
  className = '',
  ...props
}) => {
  return (
    <section className={`ds-section ${className}`} {...props}>
      {(title || description) && (
        <div className="ds-section-header">
          {title && <h2 className="ds-section-title">{title}</h2>}
          {description && <p className="ds-section-description">{description}</p>}
        </div>
      )}
      <div className="ds-section-content">
        {children}
      </div>
    </section>
  );
};
