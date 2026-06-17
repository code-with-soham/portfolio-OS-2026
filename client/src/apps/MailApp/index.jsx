import { useState } from 'react';
import { 
  MailRegular, 
  SendRegular, 
  DeleteRegular, 
  ArchiveRegular,
  ComposeRegular
} from '@fluentui/react-icons';
import { FOLDERS, MOCK_EMAILS } from './mockData';
import ComposeModal from './ComposeModal';
import './MailApp.css';

export default function MailApp() {
  const [activeFolderId, setActiveFolderId] = useState('inbox');
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [activeEmailId, setActiveEmailId] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const activeFolderEmails = emails.filter(e => e.folder === activeFolderId);
  const activeEmail = emails.find(e => e.id === activeEmailId);

  const handleEmailClick = (emailId) => {
    setActiveEmailId(emailId);
    // Mark as read
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, unread: false } : e));
  };

  const handleSendEmail = (emailData) => {
    const newEmail = {
      id: Date.now(),
      folder: 'sent',
      from: 'Soham Kundu',
      email: 'sohamkundu84@gmail.com',
      to: emailData.to,
      subject: emailData.subject,
      date: emailData.date,
      unread: false,
      content: emailData.message + (emailData.hasAttachment ? '\n\n[Attachment: resume.pdf]' : '')
    };
    setEmails(prev => [newEmail, ...prev]);
    setShowCompose(false);
    setActiveFolderId('sent');
    setActiveEmailId(newEmail.id);
  };

  return (
    <div className="mail-app">
      {/* Header Ribbon */}
      <div className="mail-header">
        <button className="mail-btn mail-btn-primary" onClick={() => setShowCompose(true)}>
          <ComposeRegular /> New Email
        </button>
        <button className="mail-btn">
          <DeleteRegular /> Delete
        </button>
        <button className="mail-btn">
          <ArchiveRegular /> Archive
        </button>
      </div>

      <div className="mail-body">
        {/* Sidebar */}
        <div className="mail-sidebar">
          {FOLDERS.map(folder => {
            const unreadCount = emails.filter(e => e.folder === folder.id && e.unread).length;
            return (
              <div 
                key={folder.id}
                className={`mail-folder ${activeFolderId === folder.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveFolderId(folder.id);
                  setActiveEmailId(null);
                }}
              >
                <div className="mail-folder-icon">{folder.icon}</div>
                <div className="mail-folder-name">{folder.label}</div>
                {unreadCount > 0 && (
                  <div className="mail-folder-unread">{unreadCount}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Email List Pane */}
        <div className="mail-list-pane">
          <div className="mail-list-header">
            {FOLDERS.find(f => f.id === activeFolderId)?.label}
          </div>
          <div className="mail-list">
            {activeFolderEmails.length === 0 ? (
              <div style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                Nothing to show here.
              </div>
            ) : (
              activeFolderEmails.map(email => (
                <div 
                  key={email.id}
                  className={`mail-list-item ${email.unread ? 'unread' : ''} ${activeEmailId === email.id ? 'active' : ''}`}
                  onClick={() => handleEmailClick(email.id)}
                >
                  <div className="mail-item-header">
                    <span className="mail-item-from">{email.from}</span>
                    <span className="mail-item-date">{email.date}</span>
                  </div>
                  <div className="mail-item-subject">{email.subject}</div>
                  <div className="mail-item-preview">{email.content.substring(0, 40)}...</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reading Pane */}
        <div className="mail-reading-pane">
          {activeEmail ? (
            <>
              <div className="mail-reading-header">
                <div className="mail-reading-subject">{activeEmail.subject}</div>
                <div className="mail-reading-meta">
                  <div className="mail-reading-sender">
                    <div className="mail-sender-avatar">
                      {activeEmail.from.charAt(0).toUpperCase()}
                    </div>
                    <div className="mail-sender-info">
                      <div className="mail-sender-name">{activeEmail.from}</div>
                      <div className="mail-sender-email">&lt;{activeEmail.email}&gt;</div>
                      {activeEmail.to && (
                        <div className="mail-sender-email" style={{marginTop: '2px'}}>To: {activeEmail.to}</div>
                      )}
                    </div>
                  </div>
                  <div className="mail-reading-date">{activeEmail.date}</div>
                </div>
              </div>
              <div className="mail-reading-body">
                {activeEmail.content}
              </div>
            </>
          ) : (
            <div className="mail-empty-state">
              <MailRegular fontSize={64} style={{marginBottom: '16px', color: '#c8c6c4'}} />
              <h2>Select an item to read</h2>
              <p>Click on an email in the list to view its contents.</p>
            </div>
          )}
        </div>
      </div>

      {showCompose && (
        <ComposeModal 
          onClose={() => setShowCompose(false)} 
          onSend={handleSendEmail} 
        />
      )}
    </div>
  );
}
