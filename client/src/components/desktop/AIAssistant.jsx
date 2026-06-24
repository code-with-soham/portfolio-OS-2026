import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X, LogOut } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import { useWindowStore } from '../../store/useWindowStore';
import { useVoiceStore } from '../../store/useVoiceStore';
import { useAuthStore } from '../../store/useAuthStore';
import { aiBrain } from '../../ai/brain/aiBrain';
import { voiceController } from '../../ai/voice/voiceController';
import ReactMarkdown from 'react-markdown';
import LoginScreen from '../auth/LoginScreen';
import api from '../../services/api';

const AIAssistant = () => {
  const { isAIAssistantOpen, toggleAIAssistant, closeAIAssistant } = useDesktopStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const { isListening, isSpeaking } = useVoiceStore();
  
  // Auth state
  const { isAuthenticated, user, token, logout } = useAuthStore();
  const [conversationId, setConversationId] = useState(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;
  
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Set up axios interceptor once
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const currentToken = useAuthStore.getState().token;
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, []);

  // Initialize voice controller and load history when auth changes
  useEffect(() => {
    voiceController.init();
  }, []);

  useEffect(() => {
    if (isAuthenticated && isAIAssistantOpen) {
      loadChatHistory();
    }
  }, [isAuthenticated, isAIAssistantOpen]);

  const loadChatHistory = async () => {
    try {
      // 1. Get user's conversations
      const convRes = await api.get('/chats/conversation');
      let currentConvId = null;

      if (convRes.data.length > 0) {
        currentConvId = convRes.data[0]._id;
      } else {
        // Create new conversation if none exists
        const newConv = await api.post('/chats/conversation', { title: 'General Session' });
        currentConvId = newConv.data._id;
      }
      
      setConversationId(currentConvId);

      // 2. Fetch messages
      const msgRes = await api.get(`/chats/${currentConvId}/messages`);
      if (msgRes.data.length > 0) {
        setMessages(msgRes.data.map(m => ({ role: m.role, text: m.content })));
      } else {
        setMessages([{ role: 'assistant', text: `Hi ${user?.name || 'there'}, I'm VS-31, your AI Assistant! Ask me anything.` }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      if (messages.length === 0) {
         setMessages([{ role: 'assistant', text: "Hi, I'm VS-31! It looks like I couldn't load past messages, but I am ready to help." }]);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading || !isAuthenticated) return;
    
    const currentQuery = message.trim();
    const userMessage = { role: 'user', text: currentQuery };
    
    // Optimistic UI update
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setCharCount(0);
    setIsLoading(true);

    // Save user message to backend
    if (conversationId) {
      api.post('/chats/message', { conversationId, role: 'user', content: currentQuery }).catch(console.error);
    }

    // Simulate thinking delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = aiBrain.processInput(currentQuery);
    let responseText = result.response;

    // Handle App opening logic
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
      if (q.includes('open') || q.includes('show') || q.includes('download')) {
        responseText = `Opening Resume...`;
        openWindow('resume');
      }
    }

    // Save assistant message to backend
    if (conversationId) {
      api.post('/chats/message', { conversationId, role: 'assistant', content: responseText }).catch(console.error);
    }

    setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle auto query (from Presentation Mode)
  useEffect(() => {
    const handleAutoQuery = (e) => {
      if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isAIAssistantOpen, isAuthenticated]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAIAssistantOpen && chatRef.current && !chatRef.current.contains(event.target)) {
        if (!event.target.closest('.floating-ai-button') && !event.target.closest('iframe')) {
          closeAIAssistant();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAIAssistantOpen, closeAIAssistant]);

  // Use voice recognized text in the input
  useEffect(() => {
    const handleVoiceRecognized = (e) => {
      if (!isAuthenticated) return;
      if (e.detail && e.detail.text) {
        const text = e.detail.text;
        setMessage(text);
        setCharCount(text.length);
      }
    };
    window.addEventListener('VOICE_RECOGNIZED', handleVoiceRecognized);
    return () => window.removeEventListener('VOICE_RECOGNIZED', handleVoiceRecognized);
  }, [isAuthenticated]);

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000 }}>
      {/* Floating Button */}
      <button 
        className="floating-ai-button"
        onClick={toggleAIAssistant}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.8) 0%, rgba(168,85,247,0.8) 100%)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          transition: 'transform 0.5s ease',
          transform: isAIAssistantOpen ? 'rotate(90deg)' : 'rotate(0deg)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          {isAIAssistantOpen ? <X size={32} color="white" /> : <Bot size={32} color="white" />}
        </div>
      </button>

      {/* Interface Wrapper */}
      {isAIAssistantOpen && (
        <div 
          ref={chatRef}
          className="acrylic"
          style={{
            position: 'absolute',
            bottom: '80px',
            right: 0,
            width: '450px',
            maxWidth: 'calc(100vw - 48px)',
            height: '600px',
            maxHeight: 'calc(100vh - 120px)',
            borderRadius: 'var(--radius-window)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-window)',
            overflow: 'hidden',
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            transformOrigin: 'bottom right'
          }}
        >
          {!isAuthenticated ? (
            <LoginScreen />
          ) : (
            <>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-primary)' }}>AI Assistant</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    fontSize: '12px', 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    color: '#ef4444', 
                    border: '1px solid rgba(239, 68, 68, 0.2)', 
                    borderRadius: '12px' 
                  }}>
                    GPT-4 Pro
                  </span>
                  
                  <button 
                    onClick={logout}
                    title="Logout"
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    <LogOut size={16} />
                  </button>

                  <button 
                    onClick={closeAIAssistant}
                    style={{ background: 'transparent', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
                      borderBottomLeftRadius: m.role === 'user' ? '16px' : '4px',
                      background: m.role === 'user' ? 'var(--color-accent)' : 'var(--color-bg-surface-content)',
                      color: m.role === 'user' ? '#fff' : 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-card)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      wordBreak: 'break-word'
                    }}>
                      {m.role === 'user' ? m.text : (
                        <div className="markdown-body">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '16px',
                      borderBottomLeftRadius: '4px',
                      background: 'var(--color-bg-surface-content)',
                      display: 'flex',
                      gap: '6px'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-secondary)', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-secondary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }}></div>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-secondary)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={{
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)',
                padding: '0'
              }}>
                <textarea
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={isListening ? "Listening..." : "What would you like to explore today? Ask anything..."}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    maxHeight: '150px',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    padding: '16px 24px',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    lineHeight: 1.5
                  }}
                />

                {/* Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 24px 16px 24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--color-bg-surface-hover)', padding: '4px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <button style={iconBtnStyle} onMouseEnter={(e) => e.currentTarget.style.color='var(--color-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color='var(--color-text-secondary)'}><Paperclip size={16} /></button>
                      <button style={iconBtnStyle} onMouseEnter={(e) => e.currentTarget.style.color='var(--color-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color='var(--color-text-secondary)'}><Link size={16} /></button>
                      <button style={iconBtnStyle} onMouseEnter={(e) => e.currentTarget.style.color='var(--color-text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color='var(--color-text-secondary)'}><Code size={16} /></button>
                    </div>
                    
                    <button 
                      onClick={() => voiceController.toggleListening()}
                      style={{
                        ...iconBtnStyle,
                        border: '1px solid',
                        borderColor: isListening ? '#22c55e' : 'var(--color-border)',
                        background: isListening ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                        color: isListening ? '#22c55e' : 'var(--color-text-secondary)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ef4444'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = isListening ? '#22c55e' : 'var(--color-border)'}
                    >
                      <Mic size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                      {charCount}/{maxChars}
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || isLoading}
                      style={{
                        background: (!message.trim() || isLoading) ? 'var(--color-bg-surface-hover)' : 'linear-gradient(to right, #ef4444, #dc2626)',
                        color: (!message.trim() || isLoading) ? 'var(--color-text-tertiary)' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        cursor: (!message.trim() || isLoading) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: (!message.trim() || isLoading) ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.3)'
                      }}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 24px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '12px',
                  color: 'var(--color-text-tertiary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Info size={14} />
                    <span>Press Shift + Enter for new line</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div>
                    <span>{isListening ? 'Listening...' : 'All systems operational'}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .floating-ai-button:hover {
          transform: scale(1.1) rotate(5deg) !important;
        }
        .markdown-body p { margin-bottom: 8px; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body a { color: var(--color-accent-light); text-decoration: underline; }
        .markdown-body ul { padding-left: 20px; margin-bottom: 8px; }
        .markdown-body li { margin-bottom: 4px; }
      `}</style>
    </div>
  );
};

const iconBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--color-text-secondary)',
  cursor: 'pointer',
  padding: '6px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s ease, color 0.2s ease'
};

export default AIAssistant;
