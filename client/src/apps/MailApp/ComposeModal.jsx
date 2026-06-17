import { useState } from 'react';
import { 
  DismissRegular, 
  SendRegular, 
  AttachRegular, 
  PersonRegular,
  DocumentPdfRegular
} from '@fluentui/react-icons';

export default function ComposeModal({ onClose, onSend }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [hasAttachment, setHasAttachment] = useState(false);

  const handleAutoFill = () => {
    setTo('sohamkundu84@gmail.com');
  };

  const handleAttachResume = () => {
    setHasAttachment(true);
  };

  const handleSend = () => {
    if (!to || !subject) {
      alert("Please specify at least a recipient and a subject.");
      return;
    }
    onSend({
      to,
      subject,
      message,
      hasAttachment,
      date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
  };

  return (
    <div className="compose-overlay" onClick={onClose}>
      <div className="compose-modal" onClick={e => e.stopPropagation()}>
        <div className="compose-header">
          <span>New Message</span>
          <div className="compose-close" onClick={onClose}>
            <DismissRegular />
          </div>
        </div>

        <div className="compose-toolbar">
          <button className="mail-btn mail-btn-primary" onClick={handleSend}>
            <SendRegular /> Send
          </button>
          <button className="mail-btn" onClick={handleAttachResume}>
            <AttachRegular /> Attach Resume
          </button>
          <button className="mail-btn" onClick={handleAutoFill}>
            <PersonRegular /> Recruiter Contact
          </button>
        </div>

        <div className="compose-form">
          <div className="compose-field">
            <span className="compose-label">To</span>
            <input 
              className="compose-input"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <div className="compose-field">
            <span className="compose-label">Subject</span>
            <input 
              className="compose-input"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>
          
          <textarea 
            className="compose-body"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
        </div>

        {hasAttachment && (
          <div className="compose-attachments">
            <div className="attachment-chip">
              <DocumentPdfRegular style={{color: '#d13438'}} />
              resume.pdf
              <DismissRegular 
                style={{cursor: 'pointer', fontSize: '14px'}} 
                onClick={() => setHasAttachment(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
