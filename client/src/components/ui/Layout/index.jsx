import { forwardRef } from 'react';
import './Layout.css';

/**
 * Enterprise UI Component: AppShell
 * Root container for applications.
 */
export const AppShell = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`ds-app-shell ${className}`} {...props}>
    {children}
  </div>
));
AppShell.displayName = 'AppShell';

export const AppBody = ({ children, className = '', ...props }) => (
  <div className={`ds-app-body ${className}`} {...props}>{children}</div>
);

export const Sidebar = ({ children, className = '', ...props }) => (
  <aside className={`ds-sidebar ds-scrollbar ${className}`} {...props}>{children}</aside>
);

export const TopBar = ({ children, className = '', ...props }) => (
  <header className={`ds-topbar ${className}`} {...props}>{children}</header>
);

export const StatusBar = ({ children, className = '', ...props }) => (
  <footer className={`ds-statusbar ${className}`} {...props}>{children}</footer>
);

export const ContentArea = forwardRef(({ children, className = '', ...props }, ref) => (
  <main ref={ref} className={`ds-content-area ds-scrollbar ${className}`} {...props}>
    {children}
  </main>
));
ContentArea.displayName = 'ContentArea';

export const CardGrid = ({ children, className = '', ...props }) => (
  <div className={`ds-card-grid ${className}`} {...props}>{children}</div>
);

export const ResponsiveGrid = ({ children, className = '', ...props }) => (
  <div className={`ds-responsive-grid ${className}`} {...props}>{children}</div>
);

export const SplitView = ({ children, className = '', ...props }) => (
  <div className={`ds-split-view ${className}`} {...props}>{children}</div>
);

export const SplitPane = ({ children, className = '', ...props }) => (
  <div className={`ds-split-view-pane ${className}`} {...props}>{children}</div>
);

export const InspectorPanel = ({ children, className = '', ...props }) => (
  <aside className={`ds-inspector-panel ds-scrollbar ${className}`} {...props}>{children}</aside>
);

export const EmptyLayout = ({ children, className = '', ...props }) => (
  <div className={`ds-empty-layout ${className}`} {...props}>{children}</div>
);
