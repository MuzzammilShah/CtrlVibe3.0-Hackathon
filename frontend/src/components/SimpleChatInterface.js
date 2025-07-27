import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../utils/markdown';

// Modern styling for chat interface
const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 120px)',
  width: '100%',
  maxWidth: '900px',
  margin: '2rem auto',
  background: 'white',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  border: '1px solid #f1f5f9',
};

const chatHeaderStyle = {
  padding: '1.5rem 2rem',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
  borderBottom: '1px solid #e2e8f0',
  fontWeight: '600',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#1e293b',
  fontSize: '1.125rem',
};

const messageListStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  backgroundColor: '#fafafa',
};

const messageStyle = {
  padding: '1rem 1.5rem',
  borderRadius: '1.5rem',
  maxWidth: '85%',
  fontSize: '0.95rem',
  lineHeight: '1.6',
  position: 'relative',
};

const userMessageStyle = {
  ...messageStyle,
  alignSelf: 'flex-end',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  color: 'white',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
};

const assistantMessageStyle = {
  ...messageStyle,
  alignSelf: 'flex-start',
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  color: '#374151',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
};

const inputContainerStyle = {
  padding: '1.5rem 2rem',
  borderTop: '1px solid #e2e8f0',
  backgroundColor: 'white',
};

const inputFormStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'flex-end',
};

const inputStyle = {
  flex: 1,
  padding: '1rem 1.25rem',
  border: '2px solid #e2e8f0',
  borderRadius: '1.25rem',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  resize: 'none',
  minHeight: '3rem',
  maxHeight: '8rem',
  lineHeight: '1.5',
  transition: 'all 0.2s ease',
  outline: 'none',
};

const inputFocusStyle = {
  borderColor: '#0ea5e9',
  boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
  backgroundColor: '#f0f9ff',
};

const buttonStyle = {
  padding: '1rem 1.5rem',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '1.25rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '600',
  fontFamily: 'inherit',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  whiteSpace: 'nowrap',
};

const buttonHoverStyle = {
  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
  transform: 'translateY(-1px)',
  boxShadow: '0 6px 8px -1px rgb(0 0 0 / 0.15)',
};

const disabledButtonStyle = {
  ...buttonStyle,
  background: '#94a3b8',
  cursor: 'not-allowed',
  transform: 'none',
  boxShadow: 'none',
};

// Modern welcome section styling
const welcomeStyle = {
  textAlign: 'center',
  margin: '2rem auto 3rem',
  maxWidth: '900px',
  padding: '0 2rem',
};

const welcomeTitleStyle = {
  fontSize: 'clamp(2rem, 4vw, 2.5rem)',
  fontWeight: '700',
  marginBottom: '1rem',
  color: '#1e293b',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const welcomeSubtitleStyle = {
  fontSize: 'clamp(1rem, 2vw, 1.125rem)',
  color: '#64748b',
  lineHeight: '1.6',
  marginBottom: '2rem',
};

const agentCardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
  margin: '3rem auto',
  maxWidth: '1100px',
  padding: '0 2rem',
};

const agentCardStyle = {
  background: 'white',
  borderRadius: '1.5rem',
  padding: '2rem',
  border: '1px solid #f1f5f9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  minHeight: '200px',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
};

const agentCardHoverStyle = {
  transform: 'translateY(-4px)',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  borderColor: '#e0f2fe',
};

const agentIconStyle = {
  fontSize: '3rem',
  marginBottom: '1.5rem',
  display: 'block',
};

const agentTitleStyle = {
  fontWeight: '600',
  marginBottom: '0.75rem',
  color: '#1e293b',
  fontSize: '1.25rem',
};

const agentDescriptionStyle = {
  fontSize: '0.95rem',
  color: '#64748b',
  lineHeight: '1.5',
};

const SimpleChatInterface = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to PA Agent! 🎉 I\'m your intelligent AI work assistant, ready to help you with emails, calendar management, documentation, and code review. Choose a specialized agent below or start a conversation with me directly.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const agents = [
    {
      id: 'email',
      title: 'Email Assistant',
      description: 'Manage your inbox, summarize emails, and draft intelligent responses',
      icon: '✉️',
      path: '/email',
    },
    {
      id: 'calendar',
      title: 'Calendar Planner',
      description: 'Schedule meetings and manage your events with natural language',
      icon: '📅',
      path: '/calendar',
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Generate professional project plans, reports and presentations',
      icon: '📄',
      path: '/docs',
    },
    {
      id: 'code',
      title: 'Code Review',
      description: 'Get intelligent feedback on your code and refactoring suggestions',
      icon: '💻',
      path: '/code',
    },
  ];
  
  const handleAgentClick = (path) => {
    navigate(path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      console.log('Sending chat request:', userMessage.content);
      
      // Use the simple chat endpoint instead of streaming
      const response = await fetch('http://localhost:8000/api/chat-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat response:', data);

      // Add assistant response to chat
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I couldn\'t generate a response.'
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

    } catch (err) {
      console.error('Chat error:', err);
      setError(`Failed to get response: ${err.message}`);
      setIsLoading(false);
      
      // Add error message to chat
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or check your connection.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)', minHeight: '100vh' }}>
      {/* Modern Welcome Section */}
      <div style={welcomeStyle}>
        <h1 style={welcomeTitleStyle}>Welcome to PA Agent</h1>
        <p style={welcomeSubtitleStyle}>
          Choose a specialized AI agent below or start a conversation for general assistance
        </p>
      </div>
      
      {/* Modern Agent Cards */}
      <div style={agentCardsContainerStyle}>
        {agents.map((agent) => (
          <div
            key={agent.id}
            style={{
              ...agentCardStyle,
              ...(hoveredAgent === agent.id ? agentCardHoverStyle : {}),
            }}
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
            onClick={() => handleAgentClick(agent.path)}
          >
            <div style={agentIconStyle}>{agent.icon}</div>
            <div style={agentTitleStyle}>{agent.title}</div>
            <div style={agentDescriptionStyle}>{agent.description}</div>
          </div>
        ))}
      </div>

      {/* Modern Chat Interface */}
      <div style={chatContainerStyle}>
        <div style={chatHeaderStyle}>
          <span>💬 General Assistant</span>
          <span style={{ 
            fontSize: '0.875rem', 
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {isLoading ? (
              <>
                <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                Thinking...
              </>
            ) : (
              <>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981',
                  display: 'inline-block'
                }}></span>
                Ready
              </>
            )}
          </span>
        </div>

        <div style={messageListStyle}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={
                message.role === 'user' ? userMessageStyle : assistantMessageStyle
              }
            >
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                {message.role === 'user' ? 'You' : 'PA Agent'}
              </div>
              <div>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={assistantMessageStyle}>
              <div style={{ 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                opacity: 0.8
              }}>
                PA Agent
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                color: '#64748b',
                fontStyle: 'italic'
              }}>
                <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                Processing your request...
              </div>
            </div>
          )}
        </div>

        <div style={inputContainerStyle}>
          {error && (
            <div style={{ 
              color: '#dc2626',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={inputFormStyle}>
            <textarea
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder="Ask me anything about your work..."
              style={{
                ...inputStyle,
                ...(isInputFocused ? inputFocusStyle : {})
              }}
              disabled={isLoading}
              rows={1}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={
                isLoading || !input.trim() 
                  ? disabledButtonStyle 
                  : isButtonHovered 
                    ? { ...buttonStyle, ...buttonHoverStyle }
                    : buttonStyle
              }
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleChatInterface;
