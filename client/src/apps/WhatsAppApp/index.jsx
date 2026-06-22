// ============================================
// Portfolio OS 2026 — WhatsApp Desktop App
// ============================================
// Full-featured WhatsApp Web clone with:
// - Real-time messaging via Socket.IO
// - AI-simulated contact replies
// - Emoji picker, attachments, typing indicators
// - Status, Calls, Settings, and Profile views
// - Read receipts and online status

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatRegular,
  CallRegular,
  VideoRegular,
  SearchRegular,
  SettingsRegular,
  PersonRegular,
  SendRegular,
  EmojiRegular,
  AttachRegular,
  MicRegular,
  MoreHorizontalRegular,
  ImageRegular,
  CameraRegular,
  DocumentRegular,
  PersonAddRegular,
  PeopleRegular,
  FilterRegular,
  ArrowLeftRegular,
  CheckmarkRegular,
  LockClosedRegular,
  PaintBrushRegular,
  PhoneRegular,
  StarRegular,
  EditRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import { useWhatsAppStore } from '../../store/useWhatsAppStore';
import {
  connectSocket,
  disconnectSocket,
  joinRoom,
  emitMessage,
  emitTyping,
  isSocketConnected,
} from '../../services/socketService';
import './WhatsAppApp.css';

// ─── Common Emojis ───
const EMOJIS = [
  '😀','😂','😍','🥰','😎','🤔','😊','🙌','👍','❤️',
  '🔥','🎉','💯','🚀','✨','😢','😡','🤣','🥳','😜',
  '🤯','💪','👏','🙏','💕','🌟','🎯','🏆','💡','🎨',
  '🎮','🎵','📱','💻','⚡','🌈','☀️','🌙','⭐','🍕',
  '☕','🍰','🧠','🦋','🌸','🍀','👀','🎭','📸','🗺️',
  '🌍','🎶','🪄','🫡','🫶','😤','🤗','😇','🥱','🤡',
  '👻','💀','🤝','✌️','🫰','🤞',
];

// ─── Time Formatter ───
function formatTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return d.toLocaleDateString();
}

// ─── Read Receipt Icon ───
function ReadReceipt({ status }) {
  if (status === 'sent') return <span className="wa-message-status sent">✓</span>;
  if (status === 'delivered') return <span className="wa-message-status delivered">✓✓</span>;
  if (status === 'read') return <span className="wa-message-status read">✓✓</span>;
  return null;
}

// ─── Main WhatsApp Component ───
export default function WhatsAppApp() {
  const {
    contacts, chats, activeChat, currentView, searchQuery, filter,
    typingContacts, calls, statuses, showEmojiPicker, showAttachMenu,
    messageInput, userProfile,
    setActiveChat, setCurrentView, setSearchQuery, setFilter,
    setMessageInput, toggleEmojiPicker, toggleAttachMenu, closeMenus,
    sendMessage, addStatus,
  } = useWhatsAppStore();

  const [socketConnected, setSocketConnected] = useState(false);
  const [showNewChatDropdown, setShowNewChatDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [viewingStatus, setViewingStatus] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ─── Socket.IO Connection ───
  useEffect(() => {
    const socket = connectSocket();
    const checkInterval = setInterval(() => {
      setSocketConnected(isSocketConnected());
    }, 2000);
    setSocketConnected(isSocketConnected());

    return () => {
      clearInterval(checkInterval);
      disconnectSocket();
    };
  }, []);

  // ─── Join room when chat changes ───
  useEffect(() => {
    if (activeChat) {
      joinRoom(activeChat.id);
    }
  }, [activeChat?.id]);

  // ─── Auto-scroll to bottom ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChat?.id, typingContacts]);

  // ─── Focus input when chat changes ───
  useEffect(() => {
    if (activeChat) {
      inputRef.current?.focus();
    }
  }, [activeChat?.id]);

  // ─── Send handler ───
  const handleSend = useCallback(() => {
    if (!messageInput.trim() || !activeChat) return;
    const msg = sendMessage(messageInput);
    if (msg) {
      emitMessage(activeChat.id, activeChat.name, msg);
    }
  }, [messageInput, activeChat, sendMessage]);

  // ─── Key handler ───
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    // Emit typing
    if (activeChat && e.key !== 'Enter') {
      emitTyping(activeChat.id, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitTyping(activeChat.id, false);
      }, 2000);
    }
  };

  // ─── Emoji insert ───
  const insertEmoji = (emoji) => {
    setMessageInput(messageInput + emoji);
    inputRef.current?.focus();
  };

  // ─── Get filtered contacts ───
  const getFilteredContacts = () => {
    let filtered = contacts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
      );
    }
    switch (filter) {
      case 'unread': filtered = filtered.filter((c) => c.unread > 0); break;
      case 'favorites': filtered = filtered.filter((c) => c.favorite); break;
      default: break;
    }
    return filtered;
  };

  const currentMessages = activeChat ? (chats[activeChat.id] || []) : [];
  const isTyping = activeChat && typingContacts.includes(activeChat.id);
  const filteredContacts = getFilteredContacts();

  // ─── Post Status ───
  const handlePostStatus = () => {
    if (statusText.trim()) {
      addStatus(statusText.trim());
      setStatusText('');
      setShowStatusModal(false);
    }
  };

  return (
    <div className="whatsapp-app" onClick={() => { closeMenus(); setShowNewChatDropdown(false); setShowFilterDropdown(false); }}>
      {/* ═══ Navigation Sidebar ═══ */}
      <div className="wa-nav-sidebar">
        <div className="wa-nav-top">
          <button
            className={`wa-nav-btn ${currentView === 'chats' ? 'active' : ''}`}
            onClick={() => setCurrentView('chats')}
            title="Chats"
          >
            <ChatRegular fontSize={20} />
          </button>
          <button
            className={`wa-nav-btn ${currentView === 'status' ? 'active' : ''}`}
            onClick={() => setCurrentView('status')}
            title="Status"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
            </svg>
          </button>
          <button
            className={`wa-nav-btn ${currentView === 'calls' ? 'active' : ''}`}
            onClick={() => setCurrentView('calls')}
            title="Calls"
          >
            <PhoneRegular fontSize={20} />
          </button>
        </div>
        <div className="wa-nav-bottom">
          <button
            className={`wa-nav-btn ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentView('settings')}
            title="Settings"
          >
            <SettingsRegular fontSize={20} />
          </button>
          <img
            src={userProfile.avatar}
            alt="Profile"
            className="wa-nav-avatar"
            onClick={() => setCurrentView('profile')}
            title="Profile"
          />
        </div>
      </div>

      {/* ═══ Left Panel ═══ */}
      <div className="wa-left-panel">
        {currentView === 'chats' && (
          <>
            <div className="wa-left-header">
              <h2>Chats</h2>
              <div className="wa-header-actions">
                <div style={{ position: 'relative' }}>
                  <button className="wa-icon-btn" onClick={(e) => { e.stopPropagation(); setShowNewChatDropdown(!showNewChatDropdown); }} title="New Chat">
                    <EditRegular fontSize={18} />
                  </button>
                  {showNewChatDropdown && (
                    <div className="wa-dropdown" onClick={(e) => e.stopPropagation()}>
                      <button className="wa-dropdown-item" onClick={() => setShowNewChatDropdown(false)}>
                        <PersonAddRegular fontSize={18} /> New Contact
                      </button>
                      <button className="wa-dropdown-item" onClick={() => setShowNewChatDropdown(false)}>
                        <PeopleRegular fontSize={18} /> New Group
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="wa-icon-btn" onClick={(e) => { e.stopPropagation(); setShowFilterDropdown(!showFilterDropdown); }} title="Filter">
                    <FilterRegular fontSize={18} />
                  </button>
                  {showFilterDropdown && (
                    <div className="wa-dropdown" onClick={(e) => e.stopPropagation()}>
                      <button className="wa-dropdown-item" onClick={() => { setFilter('all'); setShowFilterDropdown(false); }}>
                        <ChatRegular fontSize={18} /> All Chats
                      </button>
                      <button className="wa-dropdown-item" onClick={() => { setFilter('unread'); setShowFilterDropdown(false); }}>
                        <ChatRegular fontSize={18} /> Unread
                      </button>
                      <button className="wa-dropdown-item" onClick={() => { setFilter('favorites'); setShowFilterDropdown(false); }}>
                        <StarRegular fontSize={18} /> Favorites
                      </button>
                      <div className="wa-dropdown-separator" />
                      <button className="wa-dropdown-item" onClick={() => { setFilter('all'); setShowFilterDropdown(false); }}>
                        <PeopleRegular fontSize={18} /> Groups
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="wa-search-wrapper">
              <div className="wa-search-bar">
                <SearchRegular fontSize={16} />
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="wa-filter-tabs">
              {['all', 'unread', 'favorites'].map((f) => (
                <button
                  key={f}
                  className={`wa-filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Contact List */}
            <div className="wa-contact-list">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  className={`wa-contact-item ${activeChat?.id === contact.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(contact.id)}
                >
                  <div className="wa-contact-avatar-wrapper">
                    <img src={contact.image} alt={contact.name} className="wa-contact-avatar" />
                    {contact.online && <div className="wa-online-dot" />}
                  </div>
                  <div className="wa-contact-info">
                    <div className="wa-contact-top">
                      <span className="wa-contact-name">{contact.name}</span>
                      <span className={`wa-contact-time ${contact.unread > 0 ? 'has-unread' : ''}`}>
                        {contact.lastTime}
                      </span>
                    </div>
                    <div className="wa-contact-bottom">
                      <span className="wa-contact-preview">
                        {typingContacts.includes(contact.id) ? (
                          <span style={{ color: '#25d366', fontStyle: 'italic' }}>typing...</span>
                        ) : contact.lastMessage}
                      </span>
                      {contact.unread > 0 && (
                        <span className="wa-unread-badge">{contact.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {currentView === 'status' && (
          <div className="wa-status-view">
            <div className="wa-status-header">
              <h3>Status</h3>
            </div>
            <div className="wa-my-status" onClick={() => setShowStatusModal(true)}>
              <div className="wa-my-status-avatar">
                <img src={userProfile.avatar} alt="My Status" />
                <span className="wa-my-status-add">+</span>
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>My Status</div>
                <div style={{ fontSize: '12px', color: '#8696a0' }}>Tap to add status update</div>
              </div>
            </div>
            <div className="wa-status-section-label">Recent updates</div>
            <div className="wa-status-list">
              {statuses.map((status) => (
                <div key={status.id} className="wa-status-card" onClick={() => setViewingStatus(status)}>
                  <img
                    src={status.contactImage}
                    alt={status.contactName}
                    className={`wa-status-avatar ${status.viewed ? 'viewed' : ''}`}
                  />
                  <div className="wa-status-info">
                    <div className="wa-status-name">{status.contactName}</div>
                    <div className="wa-status-time">{formatRelativeTime(status.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'calls' && (
          <div className="wa-calls-view">
            <div className="wa-calls-header">
              <h3>Calls</h3>
              <button className="wa-icon-btn" title="New Call">
                <PhoneRegular fontSize={18} />
              </button>
            </div>
            <div className="wa-calls-list">
              {calls.map((call) => (
                <div key={call.id} className="wa-call-item">
                  <img src={call.contactImage} alt={call.contactName} className="wa-call-avatar" />
                  <div className="wa-call-info">
                    <div className="wa-call-name">{call.contactName}</div>
                    <div className={`wa-call-detail ${call.direction === 'missed' ? 'missed' : ''}`}>
                      <span>
                        {call.direction === 'incoming' ? '↙' : call.direction === 'outgoing' ? '↗' : '↙'}
                      </span>
                      <span>{formatRelativeTime(call.timestamp)}</span>
                      {call.duration && <span>· {call.duration}</span>}
                    </div>
                  </div>
                  <button className="wa-icon-btn wa-call-type-icon">
                    {call.type === 'video' ? <VideoRegular fontSize={18} /> : <PhoneRegular fontSize={18} />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'settings' && (
          <div className="wa-settings-view">
            <div className="wa-settings-header">
              <h3>Settings</h3>
            </div>
            <div className="wa-profile-hero" style={{ paddingBottom: '16px' }}>
              <img src={userProfile.avatar} alt="Profile" className="wa-profile-avatar-large" style={{ width: '80px', height: '80px' }} />
              <div className="wa-profile-name" style={{ fontSize: '18px' }}>{userProfile.name}</div>
              <div className="wa-profile-phone">{userProfile.phone}</div>
            </div>
            <div className="wa-settings-section">
              <div className="wa-settings-section-title">General</div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon"><PersonRegular fontSize={18} /></div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Account</div>
                  <div className="wa-settings-item-desc">Privacy, security, change number</div>
                </div>
              </div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon"><LockClosedRegular fontSize={18} /></div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Privacy</div>
                  <div className="wa-settings-item-desc">Block contacts, disappearing messages</div>
                </div>
              </div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon"><ChatRegular fontSize={18} /></div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Chats</div>
                  <div className="wa-settings-item-desc">Theme, wallpapers, chat history</div>
                </div>
              </div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon"><PaintBrushRegular fontSize={18} /></div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Notifications</div>
                  <div className="wa-settings-item-desc">Message, group & call tones</div>
                </div>
              </div>
            </div>
            <div className="wa-settings-section">
              <div className="wa-settings-section-title">Help</div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon">ℹ️</div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Help Center</div>
                </div>
              </div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon">📋</div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Terms & Privacy Policy</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="wa-profile-view">
            <div className="wa-profile-header">
              <h3>Profile</h3>
            </div>
            <div className="wa-profile-hero">
              <img src={userProfile.avatar} alt="Profile" className="wa-profile-avatar-large" />
              <div className="wa-profile-name">{userProfile.name}</div>
              <div className="wa-profile-phone">{userProfile.phone}</div>
              <div className="wa-profile-about">{userProfile.about}</div>
            </div>
            <div className="wa-settings-section">
              <div className="wa-settings-section-title">Info</div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon"><PersonRegular fontSize={18} /></div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Name</div>
                  <div className="wa-settings-item-desc">{userProfile.name}</div>
                </div>
              </div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon"><PhoneRegular fontSize={18} /></div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">Phone</div>
                  <div className="wa-settings-item-desc">{userProfile.phone}</div>
                </div>
              </div>
              <div className="wa-settings-item">
                <div className="wa-settings-item-icon">💡</div>
                <div className="wa-settings-item-text">
                  <div className="wa-settings-item-title">About</div>
                  <div className="wa-settings-item-desc">{userProfile.about}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ Right Panel ═══ */}
      <div className="wa-right-panel">
        {/* Connection Status */}
        <div className={`wa-connection-banner ${socketConnected ? 'connected' : 'disconnected'}`}>
          <span className="wa-connection-dot" />
          {socketConnected ? 'Socket.IO Connected' : 'Connecting...'}
        </div>

        {!activeChat || currentView !== 'chats' ? (
          /* Empty State */
          <div className="wa-empty-state">
            <div className="wa-empty-icon">💬</div>
            <h2>WhatsApp Web</h2>
            <p>
              Send and receive messages without keeping your phone online.
              Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
            </p>
            <div className="wa-encryption-note">
              <LockClosedRegular fontSize={14} />
              End-to-end encrypted
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="wa-chat-header">
              <img src={activeChat.image} alt={activeChat.name} className="wa-chat-header-avatar" />
              <div className="wa-chat-header-info">
                <div className="wa-chat-header-name">{activeChat.name}</div>
                <div className={`wa-chat-header-status ${activeChat.online ? 'online' : ''}`}>
                  {isTyping ? 'typing...' : activeChat.online ? 'online' : activeChat.lastSeen ? `last seen ${activeChat.lastSeen}` : 'offline'}
                </div>
              </div>
              <div className="wa-chat-header-actions">
                <button className="wa-icon-btn" title="Video Call">
                  <VideoRegular fontSize={20} />
                </button>
                <button className="wa-icon-btn" title="Voice Call">
                  <PhoneRegular fontSize={20} />
                </button>
                <button className="wa-icon-btn" title="Search">
                  <SearchRegular fontSize={20} />
                </button>
                <button className="wa-icon-btn" title="More">
                  <MoreHorizontalRegular fontSize={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="wa-chat-messages" onClick={() => closeMenus()}>
              {/* Date separator */}
              <div className="wa-date-separator">
                <span>Today</span>
              </div>

              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`wa-message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="wa-message-bubble">
                    <span className="wa-message-text">{msg.text}</span>
                    <span className="wa-message-meta">
                      <span className="wa-message-time">{formatTime(msg.timestamp)}</span>
                      {msg.sender === 'me' && <ReadReceipt status={msg.status} />}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="wa-message received"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="wa-message-bubble">
                      <div className="wa-typing-indicator">
                        <div className="wa-typing-dot" />
                        <div className="wa-typing-dot" />
                        <div className="wa-typing-dot" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  className="wa-emoji-picker"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {EMOJIS.map((emoji, i) => (
                    <button key={i} className="wa-emoji-btn" onClick={() => insertEmoji(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Attachment Menu */}
            <AnimatePresence>
              {showAttachMenu && (
                <motion.div
                  className="wa-attach-menu"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="wa-attach-item">
                    <span className="wa-attach-item-icon photos">📷</span> Photos & Videos
                  </button>
                  <button className="wa-attach-item">
                    <span className="wa-attach-item-icon camera">📸</span> Camera
                  </button>
                  <button className="wa-attach-item">
                    <span className="wa-attach-item-icon document">📄</span> Document
                  </button>
                  <button className="wa-attach-item">
                    <span className="wa-attach-item-icon contact">👤</span> Contact
                  </button>
                  <button className="wa-attach-item">
                    <span className="wa-attach-item-icon poll">📊</span> Poll
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Bar */}
            <div className="wa-chat-input-bar">
              <button className="wa-icon-btn" onClick={(e) => { e.stopPropagation(); toggleEmojiPicker(); }} title="Emoji">
                <EmojiRegular fontSize={22} />
              </button>
              <button className="wa-icon-btn" onClick={(e) => { e.stopPropagation(); toggleAttachMenu(); }} title="Attach">
                <AttachRegular fontSize={22} />
              </button>
              <input
                ref={inputRef}
                type="text"
                className="wa-chat-input"
                placeholder="Type a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {messageInput.trim() ? (
                <button className="wa-icon-btn" onClick={handleSend} title="Send" style={{ color: '#25d366' }}>
                  <SendRegular fontSize={22} />
                </button>
              ) : (
                <button className="wa-icon-btn" title="Voice Message">
                  <MicRegular fontSize={22} />
                </button>
              )}
            </div>
          </>
        )}

        {/* Status Post Modal */}
        <AnimatePresence>
          {showStatusModal && (
            <motion.div
              className="wa-status-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
            >
              <motion.div
                className="wa-status-modal"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Post Status Update</h3>
                <textarea
                  placeholder="What's on your mind?"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  autoFocus
                />
                <div className="wa-status-modal-actions">
                  <button className="wa-btn wa-btn-ghost" onClick={() => setShowStatusModal(false)}>Cancel</button>
                  <button className="wa-btn wa-btn-primary" onClick={handlePostStatus}>Post</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Viewer */}
        <AnimatePresence>
          {viewingStatus && (
            <motion.div
              className="wa-status-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingStatus(null)}
            >
              <button className="wa-icon-btn wa-status-detail-close" onClick={() => setViewingStatus(null)}>
                <DismissRegular fontSize={24} />
              </button>
              <div className="wa-status-detail-header">
                <img src={viewingStatus.contactImage} alt={viewingStatus.contactName} />
                <div>
                  <div style={{ fontWeight: 500 }}>{viewingStatus.contactName}</div>
                  <div style={{ fontSize: '12px', color: '#8696a0' }}>{formatRelativeTime(viewingStatus.timestamp)}</div>
                </div>
              </div>
              <div className="wa-status-detail-text">{viewingStatus.text}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
