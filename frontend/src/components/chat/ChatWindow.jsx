import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChatMessages, sendMessage, selectChat } from '../../redux/slices/chatSlice';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatWindow = ({ chat, messages = [], currentUserId, isSending, isLoading }) => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const getChatPartner = () => {
    if (!chat || !currentUserId) return { name: 'Chat', initial: 'C' };
    const isBuyer = chat.buyer_id === currentUserId;
    const name = isBuyer
      ? chat.farmer_name || chat.farmer?.full_name || 'Farmer'
      : chat.buyer_name || chat.buyer?.full_name || 'Buyer';
    return { name, initial: name.charAt(0).toUpperCase() };
  };

  const handleSend = (content) => {
    if (!chat || !content.trim()) return;
    dispatch(sendMessage({ chatId: chat.id, content }));
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const partner = getChatPartner();

  if (!chat) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', color: '#6b7280' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <i className="fas fa-comments" style={{ fontSize: '32px', color: '#9ca3af' }} />
        </div>
        <h3 style={{ margin: '0 0 8px', color: '#374151', fontWeight: 700 }}>Select a Conversation</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>Choose a chat from the sidebar to start messaging</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', gap: '12px',
        background: '#fff', flexShrink: 0,
      }}>
        <button
          onClick={() => dispatch(selectChat(null))}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: '6px', fontSize: '16px', borderRadius: '6px' }}
          className="show-mobile"
        >
          <i className="fas fa-arrow-left" />
        </button>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%', background: '#1C4B2D',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
        }}>
          {partner.initial}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>{partner.name}</div>
          {chat.product_name && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              <i className="fas fa-seedling" style={{ marginRight: '4px', color: '#1C4B2D' }} />
              Re: {chat.product_name}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      {/* Input */}
      <MessageInput onSend={handleSend} isSending={isSending} />
    </div>
  );
};

export default ChatWindow;
