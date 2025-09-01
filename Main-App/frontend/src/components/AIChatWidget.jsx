import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser, FaBrain } from 'react-icons/fa';
import './AIChatWidget.css';

const API_BASE_URL = 'http://localhost:8000/api';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  // Initialize position safely
  const [position, setPosition] = useState(() => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return { 
      x: Math.max(20, windowWidth - 420), // 420 = 400 (width) + 20 (margin)
      y: Math.max(20, windowHeight - 570) // 570 = 550 (height) + 20 (margin)
    };
  });
  const [buttonPosition, setButtonPosition] = useState(() => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    return { 
      x: Math.max(20, windowWidth - 80), // Right side with margin
      y: Math.max(20, windowHeight - 100) // Bottom with margin
    };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [buttonDragOffset, setButtonDragOffset] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const widgetRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && isFirstTime) {
      const welcomeMessage = {
        id: 1,
        role: 'assistant',
        content: 'مرحبا! أنا مساعد ChooFlex الذكي 🎬\nيمكنني مساعدتك في العثور على أفلام ومسلسلات رائعة!\nWhat can I help you find today? �✨',
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

  // Dragging functionality - can drag from anywhere on the chat header
  const handleMouseDown = (e) => {
    // Only allow dragging from the header area, not from input or buttons
    if (e.target.closest('.chat-widget-header') && 
        !e.target.closest('.close-button') && 
        !e.target.closest('.chat-widget-input') &&
        !e.target.closest('input') &&
        !e.target.closest('button')) {
      setIsDragging(true);
      const rect = widgetRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault(); // Prevent text selection while dragging
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && widgetRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep widget within screen bounds
      const maxX = window.innerWidth - widgetRef.current.offsetWidth;
      const maxY = window.innerHeight - widgetRef.current.offsetHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Button dragging functionality
  const handleButtonMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingButton(true);
    const rect = buttonRef.current.getBoundingClientRect();
    setButtonDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleButtonMouseMove = (e) => {
    if (isDraggingButton && buttonRef.current) {
      const newX = e.clientX - buttonDragOffset.x;
      const newY = e.clientY - buttonDragOffset.y;
      
      // Keep button within screen bounds
      const maxX = window.innerWidth - buttonRef.current.offsetWidth;
      const maxY = window.innerHeight - buttonRef.current.offsetHeight;
      
      setButtonPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleButtonMouseUp = () => {
    setIsDraggingButton(false);
  };

  useEffect(() => {
    if (isDraggingButton) {
      document.addEventListener('mousemove', handleButtonMouseMove);
      document.addEventListener('mouseup', handleButtonMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleButtonMouseMove);
        document.removeEventListener('mouseup', handleButtonMouseUp);
      };
    }
  }, [isDraggingButton, buttonDragOffset]);

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
        content: 'عذراً، أواجه مشكلة في الوصول الآن. حاول مرة أخرى! 😔\nSorry, I\'m having trouble right now. Please try again! 😔',
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

  // Handle button click vs drag
  const handleButtonClick = (e) => {
    if (!isDraggingButton) {
      if (!isOpen) {
        // Only recalculate position when opening, not when closing
        const buttonRect = buttonRef.current?.getBoundingClientRect();
        if (buttonRect) {
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const chatWidth = 380;
          const chatHeight = 550;
          
          // Calculate best position for chat window
          let newX = buttonRect.left - chatWidth - 15; // To the left of button
          let newY = buttonRect.top; // Aligned with button top
          
          // If chat would go off left edge, put it to the right of button
          if (newX < 20) {
            newX = buttonRect.right + 15;
          }
          
          // If chat would still go off right edge, center it
          if (newX + chatWidth > windowWidth - 20) {
            newX = (windowWidth - chatWidth) / 2;
          }
          
          // If chat would go off top edge, move it down
          if (newY < 20) {
            newY = 20;
          }
          
          // If chat would go off bottom edge, move it up
          if (newY + chatHeight > windowHeight - 20) {
            newY = windowHeight - chatHeight - 20;
          }
          
          // Final bounds check
          newX = Math.max(20, Math.min(newX, windowWidth - chatWidth - 20));
          newY = Math.max(20, Math.min(newY, windowHeight - chatHeight - 20));
          
          console.log('Setting chat position:', { x: newX, y: newY });
          setPosition({ x: newX, y: newY });
        }
      }
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div 
        ref={buttonRef}
        className={`chat-widget-button ${isOpen ? 'open' : ''} ${isDraggingButton ? 'dragging' : ''}`}
        onMouseDown={handleButtonMouseDown}
        onClick={handleButtonClick}
        style={{
          position: 'fixed',
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          bottom: 'auto',
          right: 'auto',
          cursor: isDraggingButton ? 'grabbing' : 'grab'
        }}
        title="اسحب لتحريك الزر أو انقر لفتح الشات / Drag to move or click to open chat"
      >
        {isOpen ? <FaTimes /> : <FaBrain />}
        <div className="pulse-ring"></div>
        <div className="pulse-ring-2"></div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`chat-widget-window ${isDragging ? 'dragging' : ''}`}
          ref={widgetRef}
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 9998
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="chat-widget-header" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
            <div className="header-info">
              <div className="ai-logo">
                <FaBrain className="brain-icon" />
                <div className="logo-glow"></div>
              </div>
              <div>
                <h4>ChooFlex AI Assistant</h4>
                {/* <span>🎬 اسحب من هنا لتحريك / Drag here to move</span> */}
              </div>
            </div>
            <div className="header-controls">
              <button 
                className="close-button"
                onClick={() => setIsOpen(false)}
                title="إغلاق / Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="chat-widget-messages">
            {messages.map((message) => (
              <div key={message.id} className={`widget-message ${message.role}`}>
                <div className="widget-message-avatar">
                  {message.role === 'user' ? (
                    <FaUser />
                  ) : (
                    <FaBrain className="ai-avatar" />
                  )}
                </div>
                <div className={`widget-message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="widget-message assistant">
                <div className="widget-message-avatar">
                  <FaBrain className="ai-avatar loading" />
                </div>
                <div className="widget-message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="thinking-text">جاري التفكير... Thinking...</span>
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
              placeholder="اسأل عن الأفلام والمسلسلات... Ask about movies & series..."
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
