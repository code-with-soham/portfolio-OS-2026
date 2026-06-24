import React, { useEffect, useState, useRef } from 'react';
import { useWhatsAppChatStore } from '../../../store/useWhatsAppChatStore';
import { useWhatsAppMessageStore } from '../../../store/useWhatsAppMessageStore';
import { useWhatsAppAuthStore } from '../../../store/useWhatsAppAuthStore';
import { useWhatsAppSocketStore } from '../../../store/useWhatsAppSocketStore';

export default function ChatWindow() {
  const { activeChatId, chats } = useWhatsAppChatStore();
  const { messagesByChat, fetchMessages } = useWhatsAppMessageStore();
  const { user } = useWhatsAppAuthStore();
  const { sendMessage } = useWhatsAppSocketStore();
  
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c._id === activeChatId);
  const otherUser = activeChat?.participants.find(p => p._id !== user._id);
  const messages = messagesByChat[activeChatId] || [];

  useEffect(() => {
    if (activeChatId && !messagesByChat[activeChatId]) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChatId) return;

    const currentText = text;
    setText(''); // clear input immediately

    try {
      await sendMessage(activeChatId, currentText, otherUser?._id);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!activeChatId) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--wa-bg-app)', color: 'var(--wa-text-secondary)', flexDirection: 'column' }}>
        <h2 style={{ fontWeight: 'normal' }}>WhatsApp Web</h2>
        <p>Select a chat or start a new conversation</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--wa-chat-bg)' }}>
      {/* Header */}
      <div style={{ padding: '10px 15px', background: 'var(--wa-panel-bg)', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid var(--wa-border)' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          {otherUser?.name?.charAt(0) || '?'}
        </div>
        <div>
          <div style={{ color: 'var(--wa-text-primary)', fontWeight: '500' }}>{otherUser?.name || 'Unknown'}</div>
          <div style={{ color: 'var(--wa-text-secondary)', fontSize: '0.8rem' }}>
            {otherUser?.isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {messages.map(msg => {
          const isMe = msg.senderId === user._id || msg.senderId?._id === user._id;
          return (
            <div key={msg._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '65%', background: isMe ? 'var(--wa-msg-out)' : 'var(--wa-msg-in)', padding: '8px 12px', borderRadius: '8px', color: 'var(--wa-text-primary)', position: 'relative', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '0.95rem', wordBreak: 'break-word' }}>{msg.text}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--wa-text-secondary)' }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && (
                  <span style={{ fontSize: '0.8rem', color: msg.read ? '#3b82f6' : 'var(--wa-text-secondary)' }}>
                    ✓✓
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '10px 15px', background: 'var(--wa-panel-bg)', display: 'flex', gap: '10px' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', flex: 1, gap: '10px' }}>
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: 'none', background: 'var(--wa-bg-app)', color: 'var(--wa-text-primary)', outline: 'none' }}
          />
          <button type="submit" style={{ display: 'none' }}>Send</button>
        </form>
      </div>
    </div>
  );
}
