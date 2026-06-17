import React from 'react';
import {
  BranchRegular,
  ArrowSyncRegular,
  ErrorCircleRegular,
  WarningRegular,
  AlertRegular
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
        <div className="vscode-status-item vscode-status-remote">
          {/* <AlertRegular fontSize={12} /> */}
        </div>
        <div className="vscode-status-item">
          <BranchRegular fontSize={12} /> main*
        </div>
        <div className="vscode-status-item">
          {/* <ArrowSyncRegular fontSize={12} /> */}
        </div>
        {/* <div className="vscode-status-item">
          <ErrorCircleRegular fontSize={12} style={{ color: '#ea4a5a' }} /> 0
          <WarningRegular fontSize={12} style={{ color: '#cca700', marginLeft: 6 }} /> 2
        </div> */}
      </div>
      <div className="vscode-status-right">
        {language && (
          <div className="vscode-status-item">
            Ln 1, Col 1
          </div>
        )}
        <div className="vscode-status-item">
          Spaces: 2
        </div>
        <div className="vscode-status-item">
          UTF-8
        </div>
        <div className="vscode-status-item">
          CRLF
        </div>
        {language && (
          <div className="vscode-status-item">
            {language}
          </div>
        )}
        <div className="vscode-status-item" title="Portfolio OS Uptime">
          <span style={{ color: '#89d185' }}>●</span> {uptimeFormatted}
        </div>
      </div>
    </div>
  );
}
