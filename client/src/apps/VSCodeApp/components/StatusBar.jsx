import React from 'react';
import {
  BranchRegular,
  ErrorCircleRegular,
  AlertRegular,
  CheckmarkRegular,
  WifiRegular,
  PersonAvailableRegular
} from '@fluentui/react-icons';

export default function StatusBar({ activeFile, splitActiveFile, splitMode, uptimeFormatted }) {
  // Try to find the file type/language
  let language = 'TypeScript';
  const fileToLookAt = activeFile === 'Welcome' && splitMode ? splitActiveFile : activeFile;

  if (fileToLookAt) {
    if (fileToLookAt.endsWith('.md')) language = 'Markdown';
    if (fileToLookAt.endsWith('.json')) language = 'JSON';
    if (fileToLookAt.endsWith('.db')) language = 'SQLite';
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
          <AlertRegular fontSize={12} style={{ marginRight: 4 }} /> PortfolioOS
        </div>
        <div className="vscode-status-item" title="Portfolio OS: main">
          <BranchRegular fontSize={12} style={{ marginRight: 4 }} /> main*
        </div>
        <div className="vscode-status-item" title="No Problems">
          <ErrorCircleRegular fontSize={12} style={{ marginRight: 4 }} /> 0 Errors
        </div>
        <div className="vscode-status-item" title="Network Connection">
          <WifiRegular fontSize={12} style={{ color: '#89d185', marginRight: 4 }} /> Connected
        </div>
        <div className="vscode-status-item" title="Placement Status">
          <PersonAvailableRegular fontSize={12} style={{ color: '#3794ff', marginRight: 4 }} /> 2027 Placement Ready
        </div>
      </div>
      <div className="vscode-status-right">
        <div className="vscode-status-item" title="Tech Stack: React">
          React
        </div>
        <div className="vscode-status-item" title="Tech Stack: Node">
          Node
        </div>
        <div className="vscode-status-item" title="Tech Stack: TypeScript">
          TypeScript
        </div>
        <div className="vscode-status-item" title="Select Encoding">
          UTF-8
        </div>
        <div className="vscode-status-item" title="Select End of Line Sequence">
          LF
        </div>
        {language && (
          <div className="vscode-status-item" title="Select Language Mode">
            {language}
          </div>
        )}
        <div className="vscode-status-item" title="Prettier">
          <CheckmarkRegular fontSize={12} style={{ marginRight: 4 }} /> Prettier
        </div>
      </div>
    </div>
  );
}
