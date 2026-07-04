import { useState, Children, cloneElement, isValidElement } from 'react';
import { motion } from 'framer-motion';
import './Tabs.css';

/**
 * Enterprise UI Component: Tabs
 */
export const Tabs = ({ defaultValue, children, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const clonedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  return (
    <div className={`ds-tabs ${className}`} {...props}>
      {clonedChildren}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => {
  const clonedChildren = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  return <div className={`ds-tabs-list ${className}`}>{clonedChildren}</div>;
};

export const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = '' }) => {
  const isActive = activeTab === value;

  return (
    <button
      className={`ds-tab-trigger ds-focusable ${className}`}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => setActiveTab(value)}
      role="tab"
      aria-selected={isActive}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="ds-tab-indicator"
          className="ds-tab-indicator"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};

export const TabsContent = ({ value, activeTab, children, className = '' }) => {
  const isActive = activeTab === value;
  
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`ds-tabs-content ${className}`}
      data-state={isActive ? 'active' : 'inactive'}
      role="tabpanel"
    >
      {children}
    </motion.div>
  );
};
