// ============================================
// Portfolio OS 2026 — AppShell
// ============================================
// Shared layout wrapper for all applications.
// Provides consistent padding, scrolling, and loading/error states.

import './AppShell.css';

/**
 * AppShell — Wraps app content with consistent layout and state handling.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - App content
 * @param {boolean} props.isLoading - Show loading shimmer
 * @param {object} props.error - Error object to show error state
 * @param {function} props.onRetry - Callback for retry button on error
 * @param {string} props.className - Additional CSS class
 * @param {boolean} props.noPadding - Skip default padding (for Terminal, etc.)
 */
export default function AppShell({ children, isLoading, error, onRetry, className = '', noPadding = false }) {
  if (isLoading) {
    return (
      <div className={`app-shell ${className}`}>
        <div className="app-shell-loading">
          <div className="app-shell-shimmer" />
          <div className="app-shell-shimmer short" />
          <div className="app-shell-shimmer" />
          <div className="app-shell-shimmer medium" />
          <div className="app-shell-shimmer short" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app-shell ${className}`}>
        <div className="app-shell-error">
          <span className="app-shell-error-icon">⚠️</span>
          <h3 className="app-shell-error-title">Failed to load data</h3>
          <p className="app-shell-error-msg">
            {error.message || 'Something went wrong. Please try again.'}
          </p>
          {onRetry && (
            <button className="app-shell-error-btn" onClick={onRetry}>
              ↻ Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`app-shell ${noPadding ? 'no-padding' : ''} ${className}`}>
      {children}
    </div>
  );
}
