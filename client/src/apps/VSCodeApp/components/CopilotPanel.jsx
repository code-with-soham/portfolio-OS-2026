import React, { useState, useRef, useEffect } from 'react';
import { SendRegular, BotRegular, PersonRegular } from '@fluentui/react-icons';
import './CopilotPanel.css';

export default function CopilotPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi there! I am your Portfolio Copilot. You can ask me anything about Soham's projects, skills, or experience." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I'm sorry, I don't have information on that specific topic. Try asking about Soham's projects, tech stack, or achievements!";
      const q = userMsg.toLowerCase();
      
      if (q.includes('project') || q.includes('built') || q.includes('made')) {
        botResponse = "Soham has built several impressive projects, including:\n\n- **Portfolio OS**: A web-based Windows 11 clone built with React.\n- **AI Mock Interview Platform**: Uses Next.js and OpenAI to conduct role-based interviews.\n- **Placement Predictor**: An ML model (Python/Scikit-learn) with 92% accuracy.";
      } else if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
        botResponse = "Soham's core tech stack includes **React, Next.js, Node.js, Express, MongoDB**, and **Tailwind CSS** for full-stack web development. For AI/ML, he uses **Python, TensorFlow, and LangChain**.";
      } else if (q.includes('experience') || q.includes('work') || q.includes('intern')) {
        botResponse = "Soham worked as a **Frontend Developer Intern at Expantra Tech Pvt Ltd**, where he gained hands-on experience building scalable web applications and optimizing user interfaces.";
      } else if (q.includes('hello') || q.includes('hi')) {
        botResponse = "Hello! I'm here to help you navigate Soham's portfolio. What would you like to know?";
      }

      setMessages(prev => [...prev, { role: 'assistant', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="vscode-copilot-panel">
      <div className="vscode-copilot-header">
        <h3>GitHub Copilot</h3>
        <button className="vscode-copilot-close" onClick={onClose}>×</button>
      </div>
      
      <div className="vscode-copilot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`vscode-copilot-message ${msg.role}`}>
            <div className="vscode-copilot-avatar">
              {msg.role === 'assistant' ? <BotRegular /> : <PersonRegular />}
            </div>
            <div className="vscode-copilot-bubble">
              {msg.text.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="vscode-copilot-message assistant">
            <div className="vscode-copilot-avatar"><BotRegular /></div>
            <div className="vscode-copilot-bubble typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="vscode-copilot-input-area">
        <textarea 
          placeholder="Ask Copilot a question..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <button onClick={handleSend} disabled={!input.trim() || isTyping}>
          <SendRegular />
        </button>
      </div>
    </div>
  );
}
