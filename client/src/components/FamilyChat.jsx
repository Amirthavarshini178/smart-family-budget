import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { formatTime } from '../utils/helpers';

export default function FamilyChat() {
  const { chatMessages, sendMessage } = useApp();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem' }}>Family Chat</h3>
        <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>Share messages, reminders, and updates with family</p>
      </div>

      <div className="section" style={{ padding: 0, overflow: 'hidden' }}>
        {chatMessages.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <div className="empty-icon">💬</div>
            <p>No messages yet. Start the family conversation!</p>
          </div>
        ) : (
          <div className="chat-messages">
            {chatMessages.map(msg => {
              const isMine = msg.senderId === user?.userId;
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                  {!isMine && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 3, paddingLeft: 4 }}>{msg.senderName}</div>
                  )}
                  <div className={`chat-bubble ${isMine ? 'sent' : 'received'}`}>
                    {msg.message}
                    <div className="time">{formatTime(msg.createdAt)}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="chat-input-row">
          <input
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Type a message… (Enter to send)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={!input.trim()}>
            Send ↗
          </button>
        </div>
      </div>
    </div>
  );
}
