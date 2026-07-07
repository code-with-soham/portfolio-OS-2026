// ============================================
// Portfolio OS 2026 — File Explorer Pro v3.0
// ============================================

import ExplorerShell from './components/ExplorerShell';
import './FileExplorerApp.css';

export default function FileExplorerApp({ appId }) {
  return (
    <ExplorerShell appId={appId} />
  );
}
