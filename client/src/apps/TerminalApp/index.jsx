// ============================================
// Portfolio OS 2026 — Terminal App
// ============================================
// Wrapper for TerminalCore to act as an OS window app.

import TerminalCore from '../../components/system/TerminalCore';

export default function TerminalApp() {
  return <TerminalCore hideHeader={false} />;
}

