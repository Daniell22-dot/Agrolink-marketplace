import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChatButton = ({ farmerId, children = 'Chat with Farmer', className = '' }) => {
    const navigate = useNavigate();

    const handleChat = (e) => {
        e.preventDefault();
        if (!farmerId) return;
        navigate(`/chat?farmerId=${farmerId}`);
    };

    if (!farmerId) return null;

    return (
        <button onClick={handleChat} className={`chat-seller-btn ${className}`} type="button">
            <i className="fas fa-comments"></i> {children}
        </button>
    );
};

export default ChatButton;
