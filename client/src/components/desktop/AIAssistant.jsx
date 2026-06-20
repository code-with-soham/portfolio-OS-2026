import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { SparkleRegular, SendRegular, DismissRegular } from '@fluentui/react-icons';
import { aiBrain } from '../../ai/brain/aiBrain';
import ReactMarkdown from 'react-markdown';

export default function AIAssistant() {
  const { isAIAssistantOpen, closeAIAssistant } = useDesktopStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm Portfolio Assistant 2.0! Ask me anything about Soham, or ask me to open apps. I am now powered by a semantic AI Brain!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    if (isAIAssistantOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAIAssistantOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle auto query (from Presentation Mode)
  useEffect(() => {
    const handleAutoQuery = (e) => {
      const q = e.detail;
      const userMessage = { role: 'user', text: q };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setTimeout(() => {
         const result = aiBrain.processInput(q);
         setMessages(prev => [...prev, { role: 'assistant', text: result.response }]);
         setIsLoading(false);
      }, 1500);
    };
    window.addEventListener('AI_AUTO_QUERY', handleAutoQuery);
    return () => window.removeEventListener('AI_AUTO_QUERY', handleAutoQuery);
  }, []);

  // No need to fetch data here anymore, aiBrain has it bundled.

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    const currentQuery = query;
    const userMessage = { role: 'user', text: currentQuery };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    // Simulate thinking delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = aiBrain.processInput(currentQuery);
    let responseText = result.response;

    // Handle App opening logic if intent is OPEN_APP or specific app commands
    const q = currentQuery.toLowerCase();
    
    if (result.systemCommand === 'OPEN_APP' || result.intent === 'OPEN_APP') {
      let appId = null;
      if (q.includes('resume')) appId = 'resume';
      else if (q.includes('project')) appId = 'projects';
      else if (q.includes('skill')) appId = 'skills';
      else if (q.includes('vscode') || q.includes('code')) appId = 'vscode';
      else if (q.includes('about')) appId = 'about';
      else if (q.includes('terminal')) appId = 'terminal';
      else if (q.includes('settings')) appId = 'settings';
      else if (q.includes('dashboard')) appId = 'devdashboard';
      else if (q.includes('file') || q.includes('explorer')) appId = 'fileexplorer';

      if (appId) {
        responseText = `Opening ${appId}...`;
        openWindow(appId);
      } else {
        responseText = "Which app would you like me to open? (e.g. Projects, Skills, VS Code, Resume)";
      }
    } else if (result.intent === 'RESUME') {
      // It might just be asking for resume
      if (q.includes('open') || q.includes('show') || q.includes('download')) {
        responseText = `Opening Resume...`;
        openWindow('resume');
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isAIAssistantOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAIAssistant}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              width: 'min(600px, 90vw)',
              height: '400px',
              background: 'var(--mica-base)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-window)',
              boxShadow: 'var(--shadow-window)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(30px)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <SparkleRegular fontSize={20} color="#0078d4" />
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Portfolio Assistant</h3>
              </div>
              <button 
                onClick={closeAIAssistant}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <DismissRegular fontSize={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--color-bg-surface-content)' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: m.role === 'user' ? 'var(--color-accent)' : 'var(--color-bg-surface-hover)',
                    color: m.role === 'user' ? '#fff' : 'var(--color-text-primary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    whiteSpace: m.role === 'user' ? 'pre-wrap' : 'normal'
                  }}>
                    {m.role === 'user' ? (
                      m.text
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0' }} {...props} />,
                          ul: ({node, ...props}) => <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                          ol: ({node, ...props}) => <ol style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                          li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />
                        }}
                      >
                        {m.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--color-bg-surface-hover)' }}>
                    <SparkleRegular className="spin" fontSize={16} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--color-bg-surface-content)', borderRadius: '24px', padding: '8px 16px', border: '1px solid var(--color-border)' }}>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuery();
                    if (e.key === 'Escape') closeAIAssistant();
                  }}
                  placeholder="Ask a question or type a command..."
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9375rem',
                  }}
                />
                <button
                  onClick={handleQuery}
                  disabled={!query.trim() || isLoading}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: query.trim() && !isLoading ? 'pointer' : 'default',
                    color: query.trim() && !isLoading ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SendRegular fontSize={20} />
                </button>
              </div>
            </div>
            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
              .spin { animation: spin 2s linear infinite; }
            `}</style>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
