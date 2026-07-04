import { Card } from '../Card';
import './StatCard.css';

/**
 * Enterprise UI Component: StatCard
 */
export const StatCard = ({ icon, label, value, className = '', ...props }) => {
  return (
    <Card className={`ds-stat-card ${className}`} {...props}>
      {icon && (
        <div className="ds-stat-icon-wrapper">
          {icon}
        </div>
      )}
      <div className="ds-stat-content">
        {label && <span className="ds-stat-label">{label}</span>}
        <span className="ds-stat-value">{value}</span>
      </div>
    </Card>
  );
};
