import { Card } from '../Card';
import './MetricCard.css';

/**
 * Enterprise UI Component: MetricCard
 */
export const MetricCard = ({ label, value, trend, trendValue, icon, className = '', ...props }) => {
  return (
    <Card className={`ds-metric-card ${className}`} {...props}>
      <div className="ds-metric-header">
        <span className="ds-metric-label">{label}</span>
        {icon && <span className="ds-metric-icon" style={{ color: 'var(--ds-text-tertiary)' }}>{icon}</span>}
      </div>
      <div className="ds-metric-value">{value}</div>
      {trendValue && (
        <div className={`ds-metric-trend ds-metric-trend-${trend || 'neutral'}`}>
          {trend === 'up' && <span>↑</span>}
          {trend === 'down' && <span>↓</span>}
          {trend === 'neutral' && <span>→</span>}
          {trendValue}
        </div>
      )}
    </Card>
  );
};
