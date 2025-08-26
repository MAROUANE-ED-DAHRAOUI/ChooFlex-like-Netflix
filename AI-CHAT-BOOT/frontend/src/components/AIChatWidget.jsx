import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import './AIChatWidget.css';

const API_BASE_URL = 'http://localhost:5003/api';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && isFirstTime) {
      const welcomeMessage = {
        id: 1,
        role: 'assistant',
        content: 'Hi! I\'m your ChooFlex AI assistant. I can help you find movies and series. What are you in the mood for? 🎬',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      setIsFirstTime(false);
    }
  }, [isOpen, isFirstTime]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: inputMessage,
        conversationHistory
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I\'m having trouble right now. Please try again! 😔',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div 
        className={`chat-widget-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          <div className="chat-widget-header">
            <div className="header-info">
              <FaRobot className="header-icon" />
              <div>
                <h4>ChooFlex AI</h4>
                <span>Movie & Series Assistant</span>
              </div>
            </div>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="chat-widget-messages">
            {messages.map((message) => (
              <div key={message.id} className={`widget-message ${message.role}`}>
                <div className="widget-message-avatar">
                  {message.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className={`widget-message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="widget-message assistant">
                <div className="widget-message-avatar">
                  <FaRobot />
                </div>
                <div className="widget-message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-widget-input">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about movies or series..."
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="widget-send-button"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
