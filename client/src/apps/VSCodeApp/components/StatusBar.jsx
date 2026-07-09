import React from 'react';
import {
  BranchRegular,
  ArrowSyncRegular,
  ErrorCircleRegular,
  WarningRegular,
  AlertRegular,
  RecordRegular,
  CheckmarkRegular
} from '@fluentui/react-icons';

export default function StatusBar({ activeFile, splitActiveFile, splitMode, uptimeFormatted }) {
  // Try to find the file type/language
  let language = 'JavaScript';
  const fileToLookAt = activeFile === 'Welcome' && splitMode ? splitActiveFile : activeFile;

  if (fileToLookAt) {
    if (fileToLookAt.endsWith('.md')) language = 'Markdown';
    if (fileToLookAt.endsWith('.json') || fileToLookAt.endsWith('.db')) language = 'JSON';
    if (fileToLookAt.endsWith('.yml') || fileToLookAt.endsWith('.yaml')) language = 'YAML';
    if (fileToLookAt.endsWith('.html')) language = 'HTML';
    if (fileToLookAt.endsWith('.css')) language = 'CSS';
    if (fileToLookAt.endsWith('.sys') || fileToLookAt.endsWith('.log')) language = 'Plain Text';
    if (fileToLookAt === 'Welcome') language = '';
  }

  return (
    <div className="vscode-status-bar">
      <div className="vscode-status-left">
        <div className="vscode-status-item vscode-status-remote" title="Remote Window">
          <AlertRegular fontSize={12} style={{ marginRight: 4 }} /> Portfolio OS
        </div>
        <div className="vscode-status-item" title="Portfolio OS: main">
          <BranchRegular fontSize={12} style={{ marginRight: 4 }} /> main*
        </div>
        <div className="vscode-status-item" title="Synchronize Changes">
          <ArrowSyncRegular fontSize={12} />
        </div>
        <div className="vscode-status-item" title="No Problems">
          <ErrorCircleRegular fontSize={12} style={{ color: 'var(--vscode-statusBarItem-errorBackground)', marginRight: 2 }} /> 0
          <WarningRegular fontSize={12} style={{ color: 'var(--vscode-statusBarItem-warningBackground)', marginLeft: 6, marginRight: 2 }} /> 0
        </div>
        <div className="vscode-status-item" title="Portfolio OS Uptime">
          <RecordRegular fontSize={12} style={{ color: '#89d185', marginRight: 4 }} /> {uptimeFormatted}
        </div>
      </div>
      <div className="vscode-status-right">
        {language && (
          <div className="vscode-status-item" title="Go to Line/Column">
            Ln 1, Col 1
          </div>
        )}
        <div className="vscode-status-item" title="Select Indentation">
          Spaces: 2
        </div>
        <div className="vscode-status-item" title="Select Encoding">
          UTF-8
        </div>
        <div className="vscode-status-item" title="Select End of Line Sequence">
          CRLF
        </div>
        {language && (
          <div className="vscode-status-item" title="Select Language Mode">
            {language}
          </div>
        )}
        <div className="vscode-status-item" title="Prettier">
          <CheckmarkRegular fontSize={12} style={{ marginRight: 4 }} /> Prettier
        </div>
        <div className="vscode-status-item" title="Live Server">
          <span className="live-server-icon"></span> Go Live
        </div>
      </div>
    </div>
  );
}
