// ============================================
// Portfolio OS 2026 — Error Boundary
// ============================================
// Catches JavaScript errors in child components.
// Prevents a single crashed app from taking down the entire OS.
//
// React error boundaries require class components.

import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`[ErrorBoundary] ${this.props.appName || 'App'} crashed:`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '40px 20px',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '48px' }}>⚠️</span>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-family)',
              margin: 0,
            }}
          >
            {this.props.appName || 'This app'} has stopped working
          </h3>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family)',
              margin: 0,
              maxWidth: '320px',
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred. You can try restarting the app.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 24px',
              background: 'var(--color-accent)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-accent)')}
          >
            ↻ Restart App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
