import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const PlaygroundEditor = ({ code, setCode, onExecute, isLoading }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add custom keybinding for Ctrl+Enter to execute
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onExecute();
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e] border-b border-[#333]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#333] z-10">
        <span className="text-xs font-mono text-gray-400">playground.js</span>
        <button 
          onClick={onExecute}
          disabled={isLoading}
          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Executing...
            </>
          ) : (
            '▶ Run (Ctrl+Enter)'
          )}
        </button>
      </div>
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            suggestOnTriggerCharacters: true
          }}
        />
      </div>
    </div>
  );
};

export default PlaygroundEditor;
