import React, { useState } from 'react';
import { useWhatsAppChatStore } from '../../../store/useWhatsAppChatStore';
import { useWhatsAppAuthStore } from '../../../store/useWhatsAppAuthStore';

export default function Sidebar() {
  const { chats, activeChatId, setActiveChat, createChat } = useWhatsAppChatStore();
  const { user, logout } = useWhatsAppAuthStore();
  const [newPhone, setNewPhone] = useState('');

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (newPhone.trim()) {
      await createChat(newPhone.trim());
      setNewPhone('');
    }
  };

  return (
    <div className="wa-sidebar" style={{ width: '30%', minWidth: '300px', borderRight: '1px solid var(--wa-border)', display: 'flex', flexDirection: 'column', background: 'var(--wa-panel-bg)' }}>
      {/* Header */}
      <div className="wa-sidebar-header" style={{ padding: '10px 15px', background: 'var(--wa-bg-app)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--wa-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span style={{ color: 'var(--wa-text-primary)' }}>{user?.name}</span>
        </div>
        <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'var(--wa-text-secondary)', cursor: 'pointer' }}>Logout</button>
      </div>

      {/* Search / Create */}
      <div style={{ padding: '10px', background: 'var(--wa-bg-app)' }}>
        <form onSubmit={handleCreateChat} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Start new chat (+91...)" 
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'var(--wa-panel-bg)', color: 'var(--wa-text-primary)' }}
          />
          <button type="submit" style={{ display: 'none' }}>Add</button>
        </form>
      </div>

      {/* Chat List */}
      <div className="wa-chat-list" style={{ flex: 1, overflowY: 'auto' }}>
        {chats.map(chat => {
          // Find the other participant
          const otherUser = chat.participants.find(p => p._id !== user._id);
          const isActive = activeChatId === chat._id;
          
          return (
            <div 
              key={chat._id} 
              onClick={() => setActiveChat(chat._id)}
              style={{ padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', background: isActive ? 'var(--wa-active-chat)' : 'transparent', borderBottom: '1px solid var(--wa-border)' }}
            >
              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem' }}>
                {otherUser?.name?.charAt(0) || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--wa-text-primary)', fontWeight: '500' }}>{otherUser?.name || 'Unknown'}</span>
                  <span style={{ color: 'var(--wa-text-secondary)', fontSize: '0.8rem' }}>
                    {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <div style={{ color: 'var(--wa-text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                  {chat.lastMessage?.text || 'No messages yet'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
