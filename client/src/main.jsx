// ============================================
// Portfolio OS 2026 — Application Entry Point
// ============================================
// Mounts the React application to the DOM.
// Global styles (Tailwind CSS) are imported here.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
