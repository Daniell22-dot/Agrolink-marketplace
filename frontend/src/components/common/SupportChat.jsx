import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SupportChat.css';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! Welcome to AgroLink support. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE}/support/contact`, {
        name: contactInfo.name || 'Guest User',
        email: contactInfo.email || 'guest@example.com',
        subject: 'Support Chat',
        message: userMessage.text
      });

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Thank you for your message! Our support team will get back to you within 24 hours. For immediate assistance, you can also call us at +254 700 133456.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, there was an error sending your message. Please try again or contact us directly at support@agrilink.co.ke',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Support Button */}
      {!isOpen && (
        <button
          className="support-chat-fab"
          onClick={() => setIsOpen(true)}
          title="Contact Support"
        >
          <i className="fas fa-headset"></i>
          <span className="support-chat-fab-label">Support</span>
        </button>
      )}

      {/* Support Chat Window */}
      {isOpen && (
        <div className={`support-chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="support-chat-header">
            <div className="support-chat-header-info">
              <div className="support-chat-avatar">
                <i className="fas fa-headset"></i>
              </div>
              <div>
                <h4>AgroLink Support</h4>
                <span className="support-chat-status">Online</span>
              </div>
            </div>
            <div className="support-chat-header-actions">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="support-chat-action-btn"
              >
                <i className={`fas fa-${isMinimized ? 'expand' : 'compress'}`}></i>
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                className="support-chat-action-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <div className="support-chat-body">
              {/* Contact Form (shown if no contact info) */}
              {!contactInfo.name && !contactInfo.email ? (
                <div className="support-chat-contact-form">
                  <h5>Before we start, please share your contact details</h5>
                  <form onSubmit={handleContactSubmit} className="support-chat-form">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      required
                    />
                    <button type="submit" className="support-chat-submit-btn">
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="support-chat-messages">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`support-chat-message ${msg.type === 'user' ? 'sent' : 'received'}`}
                      >
                        <div className="support-chat-message-bubble">
                          <p>{msg.text}</p>
                          <span className="support-chat-message-time">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {isSubmitting && (
                      <div className="support-chat-message received">
                        <div className="support-chat-message-bubble typing">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form onSubmit={handleSendMessage} className="support-chat-input-form">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={!message.trim() || isSubmitting}
                      className="support-chat-send-btn"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SupportChat;
