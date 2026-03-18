import React from 'react';

const MessageList = ({ messages = [], currentUserId, isLoading, messagesEndRef }) => {
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <div style={{ width: 36, height: 36, border: '4px solid #e5e7eb', borderTop: '4px solid #1C4B2D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280', padding: '40px' }}>
        <i className="fas fa-hand-peace" style={{ fontSize: '36px', color: '#d1d5db', marginBottom: '12px' }} />
        <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#374151' }}>Start the conversation!</p>
        <p style={{ margin: 0, fontSize: '13px' }}>Say hello to get things started</p>
      </div>
    );
  }

  // Group messages by date
  let lastDate = '';

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {messages.map((msg, i) => {
        const isSent = msg.sender_id === currentUserId;
        const msgDate = formatDate(msg.created_at);
        const showDate = msgDate !== lastDate;
        lastDate = msgDate;

        return (
          <React.Fragment key={msg.id || i}>
            {showDate && (
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <span style={{ fontSize: '11px', color: '#9ca3af', background: '#f3f4f6', padding: '3px 10px', borderRadius: '20px' }}>
                  {msgDate}
                </span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: isSent ? 'flex-end' : 'flex-start',
              marginBottom: '2px',
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '10px 14px',
                borderRadius: isSent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: isSent ? '#1C4B2D' : '#fff',
                color: isSent ? '#fff' : '#111827',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                border: isSent ? 'none' : '1px solid #e5e7eb',
              }}>
                <p style={{ margin: '0 0 4px', fontSize: '14px', lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {msg.content}
                </p>
                <span style={{ fontSize: '10px', opacity: 0.7, display: 'block', textAlign: 'right' }}>
                  {formatTime(msg.created_at)}
                  {isSent && <i className="fas fa-check" style={{ marginLeft: '4px' }} />}
                </span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
