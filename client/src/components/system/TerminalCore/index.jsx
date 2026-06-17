import { useState, useEffect, useRef, useCallback } from 'react';
import { TERMINAL_COMMANDS } from '../../../config/terminalCommands';
import { useWindowStore } from '../../../store/useWindowStore';
import { useThemeStore } from '../../../store/useThemeStore';
import { useUIStore } from '../../../store/useUIStore';
import { SYSTEM_INFO } from '../../../config/systemInfo';
import './TerminalCore.css';

const BOOT_LINES = [
  { text: `${SYSTEM_INFO.name} v${SYSTEM_INFO.version} [Build ${SYSTEM_INFO.build}]`, type: 'system' },
  { text: `(c) 2026 ${SYSTEM_INFO.author}. All rights reserved.`, type: 'system' },
  { text: '', type: 'output' },
  { text: 'Initializing kernel...        [OK]', type: 'accent' },
  { text: 'Loading modules...            [OK]', type: 'accent' },
  { text: 'Starting window manager...    [OK]', type: 'accent' },
  { text: 'Mounting file system...       [OK]', type: 'accent' },
  { text: 'System ready.', type: 'success' },
  { text: '', type: 'output' },
  { text: "Type 'help' to see available commands.", type: 'output' },
  { text: '', type: 'output' },
];

export default function TerminalCore({ hideHeader = false, style = {}, customPrompt, skipBoot = false, onCommand, externalCommand, onExternalCommandExecuted }) {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);

  const [cwd, setCwd] = useState([]);

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  const openWindow = useWindowStore((s) => s.openWindow);
  const setTheme = useThemeStore((s) => s.setTheme);
  const { setInputFocused } = useUIStore();

  // Helper to format prompt
  const getPrompt = (currentCwd) => {
    if (customPrompt) return customPrompt;
    const path = currentCwd.length > 0 ? `~/${currentCwd.join('/')}` : '~';
    return `soham@portfolio-os:${path}$`;
  };

  // Boot sequence
  useEffect(() => {
    if (skipBoot) {
      setBooted(true);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setOutput((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setBooted(true);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [skipBoot]);

  useEffect(() => {
    if (externalCommand && booted) {
      handleCommand(externalCommand);
      if (onExternalCommandExecuted) onExternalCommandExecuted();
    }
  }, [externalCommand, booted]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal loads
  useEffect(() => {
    if (booted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [booted]);

  const addOutput = useCallback((lines) => {
    setOutput((prev) => [
      ...prev,
      ...lines.map((text) => ({ text, type: 'output' })),
    ]);
  }, []);

  const clearOutput = useCallback(() => {
    setOutput([]);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed) return;

    // Echo the command
    setOutput((prev) => [
      ...prev,
      { text: `${getPrompt(cwd)} ${trimmed}`, type: 'command' },
    ]);

    // Add to history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    
    // Track terminal command event
    import('../../../store/useAchievementStore').then(({ useAchievementStore }) => {
      useAchievementStore.getState().trackEvent('terminal-command');
    });

    // Parse command
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (onCommand && onCommand(trimmed, addOutput, clearOutput)) {
      setInput('');
      return;
    }

    const command = TERMINAL_COMMANDS[cmd];
    if (command) {
      try {
        command.handler({
          args,
          addOutput,
          clearOutput,
          openWindow,
          setTheme,
          commandHistory: [...commandHistory, trimmed],
          cwd,
          setCwd,
        });
      } catch (err) {
        setOutput((prev) => [
          ...prev,
          { text: `Error executing command: ${err.message}`, type: 'error' },
        ]);
      }
    } else {
      setOutput((prev) => [
        ...prev,
        {
          text: `'${cmd}' is not recognized as a command. Type 'help' for available commands.`,
          type: 'error',
        },
      ]);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    // Enter — submit command (fallback for form submit)
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
      return;
    }

    // Up arrow — previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    }

    // Down arrow — next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }

    // Tab — auto-complete (basic)
    if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.trim().toLowerCase();
      if (!partial) return;
      const match = Object.keys(TERMINAL_COMMANDS).find((cmd) =>
        cmd.startsWith(partial)
      );
      if (match) {
        setInput(match);
      }
    }
  };

  // Click anywhere in terminal to focus input
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal-app" style={style} onClick={handleTerminalClick}>
      {/* Terminal Tab Bar */}
      {!hideHeader && (
        <div className="terminal-header">
          <div className="terminal-tab">
            <span className="terminal-tab-icon">⬛</span>
            PortShell
          </div>
        </div>
      )}

      {/* Output */}
      <div className="terminal-output" ref={outputRef}>
        {output.filter(Boolean).map((line, i) => (
          <div key={i} className={`terminal-line ${line?.type || 'output'}`}>
            {line?.text || ''}
          </div>
        ))}
      </div>

      {/* Input */}
      {booted && (
        <form className="terminal-input-area" onSubmit={handleSubmit}>
          <span className="terminal-prompt">{getPrompt(cwd)}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder=""
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
        </form>
      )}
    </div>
  );
}
