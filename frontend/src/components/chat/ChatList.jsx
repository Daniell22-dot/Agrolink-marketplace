import React from 'react';

const ChatList = ({ chats = [], selectedChat, onSelectChat, isLoading, currentUserId }) => {
  const getChatPartner = (chat) => {
    if (!chat || !currentUserId) return { name: 'Unknown', initial: 'U' };
    const isBuyer = chat.buyer_id === currentUserId;
    const name = isBuyer
      ? chat.farmer_name || chat.farmer?.full_name || 'Farmer'
      : chat.buyer_name || chat.buyer?.full_name || 'Buyer';
    return { name, initial: name.charAt(0).toUpperCase() };
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diff = Date.now() - date;
    if (diff < 86400000) return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString('en-KE', { weekday: 'short' });
    return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTop: '3px solid #1C4B2D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
        <i className="fas fa-comments" style={{ fontSize: '36px', color: '#d1d5db', marginBottom: '12px' }} />
        <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#374151' }}>No conversations yet</p>
        <p style={{ margin: 0, fontSize: '12px' }}>Start chatting with farmers from any product page</p>
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'auto', flex: 1 }}>
      {chats.map(chat => {
        const partner = getChatPartner(chat);
        const isActive = selectedChat?.id === chat.id;
        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', cursor: 'pointer',
              background: isActive ? '#f0fdf4' : 'transparent',
              borderLeft: `3px solid ${isActive ? '#1C4B2D' : 'transparent'}`,
              transition: 'all 0.15s',
            }}
            onMouseOver={e => !isActive && (e.currentTarget.style.background = '#f9fafb')}
            onMouseOut={e => !isActive && (e.currentTarget.style.background = 'transparent')}
          >
            {/* Avatar */}
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
              background: isActive ? '#1C4B2D' : '#e5e7eb', color: isActive ? '#fff' : '#374151',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '16px',
            }}>
              {partner.initial}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {partner.name}
                </span>
                <span style={{ fontSize: '11px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>
                  {formatTime(chat.last_message_at)}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.product_name && <><i className="fas fa-seedling" style={{ fontSize: '10px', marginRight: '4px', color: '#1C4B2D' }} />{chat.product_name} · </>}
                {chat.last_message || 'No messages yet'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
