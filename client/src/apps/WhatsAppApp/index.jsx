import React, { useEffect } from 'react';
import './WhatsAppApp.css';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

import { useWhatsAppAuthStore } from '../../store/useWhatsAppAuthStore';
import { useWhatsAppChatStore } from '../../store/useWhatsAppChatStore';
import { useWhatsAppSocketStore } from '../../store/useWhatsAppSocketStore';

export default function WhatsAppApp() {
  const { isAuthenticated, hydrateAuth } = useWhatsAppAuthStore();
  const { fetchChats } = useWhatsAppChatStore();
  const { connect, disconnect } = useWhatsAppSocketStore();

  useEffect(() => {
    // Check if user is already logged in (from persisted state)
    hydrateAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Connect to Socket and fetch initial chats
      connect();
      fetchChats();
    } else {
      disconnect();
    }

    return () => {
      // Disconnect socket when app closes
      disconnect();
    };
  }, [isAuthenticated]);

  return (
    <div className="wa-app-container" style={{ display: 'flex', height: '100%', width: '100%', background: 'var(--wa-bg-app)', fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif' }}>
      {!isAuthenticated ? (
        <div style={{ width: '100%', height: '100%' }}>
          <Login />
        </div>
      ) : (
        <>
          <Sidebar />
          <ChatWindow />
        </>
      )}
    </div>
  );
}
