import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { API_BASE_URL } from '../../constants';
import { SparkleRegular, SendRegular, DismissRegular } from '@fluentui/react-icons';

export default function AIAssistant() {
  const { isAIAssistantOpen, closeAIAssistant } = useDesktopStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi, I'm Portfolio Assistant. Ask me anything about Soham, or ask me to open apps!" }
  ]);
  const [data, setData] = useState({
    profile: null,
    projects: null,
    skills: null,
    achievements: null
  });
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, achievementsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/profile`).then(r => r.json()),
          fetch(`${API_BASE_URL}/projects`).then(r => r.json()),
          fetch(`${API_BASE_URL}/skills`).then(r => r.json()),
          fetch(`${API_BASE_URL}/achievements`).then(r => r.json()),
        ]);
        setData({
          profile: profileRes,
          projects: projectsRes,
          skills: skillsRes,
          achievements: achievementsRes
        });
      } catch (err) {
        console.error('Failed to fetch data for AI', err);
      }
    };
    fetchData();
  }, []);

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    const q = query.toLowerCase();
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let responseText = "I'm not sure how to answer that. Try asking 'Who is Soham?', 'Show Projects', or 'Open Resume'.";

    // App launching intents
    if (q.includes('open resume') || q.includes('show resume')) {
      responseText = "Opening Resume...";
      openWindow('resume');
    } else if (q.includes('show projects') || q.includes('open projects')) {
      responseText = "Opening Projects...";
      openWindow('projects');
    } else if (q.includes('open vs code') || q.includes('open vscode')) {
      responseText = "Launching VS Code...";
      openWindow('vscode');
    } else if (q.includes('show skills') || q.includes('open skills')) {
      if (data.skills) {
        const cats = data.skills.map(s => s.category).join(', ');
        responseText = `Soham's skills include: ${cats}. Opening Skills app for more details...`;
      } else {
        responseText = "Opening Skills app...";
      }
      openWindow('skills');
    } 
    // Conversational intents
    else if (q.includes('who is soham') || q.includes('about soham')) {
      if (data.profile) {
        responseText = `${data.profile.bio}\n\nLocation: ${data.profile.location}\nEducation: ${data.profile.education}`;
      } else {
        responseText = "Soham is an amazing developer. Opening About app...";
        openWindow('about');
      }
    } else if (q.includes('achievements') || q.includes('awards')) {
      if (data.achievements) {
        responseText = `Soham has several achievements, including:\n- ${data.achievements[0]?.title}\n- ${data.achievements[1]?.title}`;
      }
    } else if (q.includes('os') || q.includes('portfolio os') || q.includes('system') || q.includes('how did you build this')) {
      responseText = "Portfolio OS is a cutting-edge web-based operating system designed by Soham Kundu. It features a fully functional desktop environment, a window manager, a file system, a task manager, and apps like VS Code and Browser. It was built using React, Vite, Framer Motion, and Zustand for state management.";
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
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
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
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    whiteSpace: 'pre-wrap'
                  }}>
                    {m.text}
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
