import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, fetchChatMessages, sendMessage, selectChat } from '../redux/slices/chatSlice';
import './ChatPage.css';

const ChatPage = () => {
    const dispatch = useDispatch();
    const { chats, selectedChat, messages, isLoading, isSending } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [messageText, setMessageText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    useEffect(() => {
        if (selectedChat) {
            dispatch(fetchChatMessages(selectedChat.id));
        }
    }, [dispatch, selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedChat) return;
        dispatch(sendMessage({ chatId: selectedChat.id, content: messageText.trim() }));
        setMessageText('');
    };

    const handleSelectChat = (chat) => {
        dispatch(selectChat(chat));
    };

    const getChatPartner = (chat) => {
        if (!chat || !user) return { name: 'Unknown', initial: 'U' };
        const isBuyer = chat.buyer_id === user.id;
        const partnerName = isBuyer
            ? chat.farmer_name || chat.farmer?.full_name || 'Farmer'
            : chat.buyer_name || chat.buyer?.full_name || 'Buyer';
        return { name: partnerName, initial: partnerName.charAt(0).toUpperCase() };
    };

    const chatMessages = selectedChat ? (messages[selectedChat.id] || []) : [];
    const filteredChats = chats.filter(chat => {
        const partner = getChatPartner(chat);
        return partner.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        if (diff < 86400000) {
            return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
        }
        if (diff < 604800000) {
            return date.toLocaleDateString('en-KE', { weekday: 'short' });
        }
        return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                {/* Chat Sidebar */}
                <div className={`chat-sidebar ${selectedChat ? 'hide-mobile' : ''}`}>
                    <div className="sidebar-header">
                        <h2>Messages</h2>
                        <span className="chat-count">{chats.length}</span>
                    </div>
                    <div className="chat-search">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="chat-list">
                        {isLoading && !chats.length ? (
                            <div className="sidebar-loading"><div className="spinner"></div></div>
                        ) : filteredChats.length === 0 ? (
                            <div className="no-chats">
                                <i className="fas fa-comments"></i>
                                <p>No conversations yet</p>
                                <span>Start chatting with farmers and buyers from product pages</span>
                            </div>
                        ) : (
                            filteredChats.map((chat) => {
                                const partner = getChatPartner(chat);
                                return (
                                    <div
                                        key={chat.id}
                                        className={`chat-list-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                                        onClick={() => handleSelectChat(chat)}
                                    >
                                        <div className="chat-avatar">{partner.initial}</div>
                                        <div className="chat-preview">
                                            <div className="chat-preview-top">
                                                <span className="chat-name">{partner.name}</span>
                                                <span className="chat-time">{formatTime(chat.last_message_at)}</span>
                                            </div>
                                            <p className="chat-last-msg">{chat.last_message || 'No messages yet'}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Main */}
                <div className={`chat-main ${!selectedChat ? 'hide-mobile' : ''}`}>
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                <button className="back-btn mobile-only" onClick={() => dispatch(selectChat(null))}>
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <div className="chat-avatar sm">{getChatPartner(selectedChat).initial}</div>
                                <div className="header-info">
                                    <h3>{getChatPartner(selectedChat).name}</h3>
                                    {selectedChat.product_name && (
                                        <span className="product-context">Re: {selectedChat.product_name}</span>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="messages-area">
                                {chatMessages.length === 0 ? (
                                    <div className="no-messages">
                                        <i className="fas fa-hand-peace"></i>
                                        <p>Start the conversation!</p>
                                    </div>
                                ) : (
                                    chatMessages.map((msg, i) => (
                                        <div
                                            key={msg.id || i}
                                            className={`message ${msg.sender_id === user?.id ? 'sent' : 'received'}`}
                                        >
                                            <div className="message-bubble">
                                                <p>{msg.content}</p>
                                                <span className="msg-time">{formatTime(msg.created_at)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form className="message-input" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    disabled={isSending}
                                />
                                <button type="submit" className="send-btn" disabled={!messageText.trim() || isSending}>
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <div className="empty-chat-icon">
                                <i className="fas fa-comments"></i>
                            </div>
                            <h3>Select a Conversation</h3>
                            <p>Choose a chat from the sidebar to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
