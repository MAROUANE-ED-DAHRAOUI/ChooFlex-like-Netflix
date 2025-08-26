import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import './ChatBot.css';

const API_BASE_URL = 'http://localhost:5003/api';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m your ChooFlex AI assistant. I know about all the movies and series on the platform. Ask me anything! 🎬✨',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load suggestions on component mount
  useEffect(() => {
    loadSuggestions();
    inputRef.current?.focus();
  }, []);

  const loadSuggestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/suggestions`);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: messageText,
        conversationHistory
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        tokensUsed: response.data.tokensUsed
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment. 😔',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">
        <div className="header-content">
          <FaRobot className="bot-icon" />
          <div className="header-text">
            <h2>ChooFlex AI Assistant</h2>
            <p>Ask me about movies and series!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-content">
              <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                {message.content}
              </div>
              <div className="message-time">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">
              <FaRobot />
            </div>
            <div className="message-content">
              <div className="message-bubble loading">
                <FaSpinner className="spinner" />
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && suggestions.length > 0 && (
        <div className="suggestions-container">
          <p className="suggestions-title">Try asking:</p>
          <div className="suggestions-grid">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-chip"
                onClick={() => sendMessage(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me about movies, series, or anything..."
            disabled={isLoading}
            rows="1"
            className="message-input"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
