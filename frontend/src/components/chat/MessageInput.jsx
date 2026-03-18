import React, { useState, useRef } from 'react';

const MessageInput = ({ onSend, isSending, disabled }) => {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isSending || disabled) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex', alignItems: 'flex-end', gap: '10px',
        padding: '12px 16px', borderTop: '1px solid #e5e7eb',
        background: '#fff',
      }}
    >
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          disabled={disabled || isSending}
          rows={1}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '24px',
            border: '1px solid #d1d5db',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            fontFamily: 'inherit',
            lineHeight: 1.5,
            maxHeight: '120px',
            overflowY: 'auto',
            boxSizing: 'border-box',
            background: disabled ? '#f9fafb' : '#fff',
            color: '#111827',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#1C4B2D'}
          onBlur={e => e.target.style.borderColor = '#d1d5db'}
        />
      </div>
      <button
        type="submit"
        disabled={!text.trim() || isSending || disabled}
        style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: 'none', flexShrink: 0,
          background: !text.trim() || isSending || disabled ? '#e5e7eb' : '#1C4B2D',
          color: !text.trim() || isSending || disabled ? '#9ca3af' : '#fff',
          cursor: !text.trim() || isSending || disabled ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', transition: 'all 0.15s',
        }}
        title="Send message"
      >
        {isSending
          ? <i className="fas fa-spinner fa-spin" />
          : <i className="fas fa-paper-plane" />}
      </button>
    </form>
  );
};

export default MessageInput;
