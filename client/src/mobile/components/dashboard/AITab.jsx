import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SendRegular, SparkleRegular, BotRegular } from '@fluentui/react-icons';
import { aiBrain } from '../../../ai/brain/aiBrain';
import ReactMarkdown from 'react-markdown';

const PREDEFINED_PROMPTS = [
  "What is your best project?",
  "Tell me about SUPPORTGPT",
  "What backend technologies do you know?",
  "Tell me about your hackathon experience",
  "Download your resume"
];

export default function AITab() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm VS-31, Soham's AI Assistant! Ask me anything about his projects, skills, or experience." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleQuery = async (textToProcess) => {
    const currentQuery = textToProcess || query;
    if (!currentQuery.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: currentQuery }]);
    setQuery('');
    setIsLoading(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = aiBrain.processInput(currentQuery);
    setMessages(prev => [...prev, { role: 'assistant', text: result.response }]);
    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px', gap: '16px' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'var(--color-bg-elevated)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BotRegular fontSize={28} color="#000" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px' }}>VS-31 AI Brain</h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>Powered by Local Knowledge Graph</p>
        </div>
      </div>

      {/* Predefined Prompts */}
      {messages.length === 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PREDEFINED_PROMPTS.map((prompt, idx) => (
            <button 
              key={idx}
              onClick={() => handleQuery(prompt)}
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-accent)',
                color: 'var(--color-text-primary)',
                padding: '8px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '20px' }}>
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '16px',
              borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
              borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
              background: m.role === 'user' ? 'var(--color-accent)' : 'var(--color-bg-surface)',
              color: m.role === 'user' ? '#fff' : 'var(--color-text-primary)',
              fontSize: '14px',
              lineHeight: 1.5,
              border: m.role === 'assistant' ? '1px solid var(--color-border)' : 'none'
            }}>
              {m.role === 'user' ? (
                m.text
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p style={{ margin: '0 0 8px 0' }} {...props} />,
                    ul: ({node, ...props}) => <ul style={{ margin: '0 0 8px 0', paddingLeft: '20px' }} {...props} />,
                    li: ({node, ...props}) => <li style={{ marginBottom: '4px' }} {...props} />
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              )}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
              <SparkleRegular className="spin" fontSize={16} color="var(--color-accent)" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--color-bg-surface)', borderRadius: '24px', padding: '8px 16px', border: '1px solid var(--color-border)' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleQuery();
          }}
          placeholder="Ask about Soham..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
          }}
        />
        <button
          onClick={() => handleQuery()}
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

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 2s linear infinite; }
      `}</style>
    </div>
  );
}
