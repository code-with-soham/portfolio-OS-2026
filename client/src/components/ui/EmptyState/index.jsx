import { motion } from 'framer-motion';
import './EmptyState.css';

/**
 * Enterprise UI Component: EmptyState
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  className = ''
}) => {
  return (
    <motion.div 
      className={`ds-empty-state ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {icon && <div className="ds-empty-icon">{icon}</div>}
      {title && <h3 className="ds-empty-title">{title}</h3>}
      {description && <p className="ds-empty-description">{description}</p>}
      {action && <div className="ds-empty-action">{action}</div>}
    </motion.div>
  );
};
