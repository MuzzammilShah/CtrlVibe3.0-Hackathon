import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styling for chat interface - matching original ChatInterface
const chatContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 200px)',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
};

const chatHeaderStyle = {
  padding: '16px',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const messageListStyle = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const messageStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  maxWidth: '80%',
};

const userMessageStyle = {
  ...messageStyle,
  alignSelf: 'flex-end',
  backgroundColor: '#007bff',
  color: 'white',
};

const assistantMessageStyle = {
  ...messageStyle,
  alignSelf: 'flex-start',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
};

const inputContainerStyle = {
  padding: '16px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#fff',
};

const inputFormStyle = {
  display: 'flex',
  gap: '8px',
};

const inputStyle = {
  flex: 1,
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const disabledButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#6c757d',
  cursor: 'not-allowed',
};

// Original card-style navigation from ChatInterface
const welcomeStyle = {
  textAlign: 'center',
  margin: '32px auto',
  maxWidth: '800px',
};

const agentCardsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  justifyContent: 'center',
  margin: '32px auto',
  maxWidth: '1000px',
};

const agentCardStyle = {
  width: '200px',
  height: '180px',
  padding: '20px',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  backgroundColor: 'white',
  textAlign: 'center',
};

const agentCardHoverStyle = {
  transform: 'translateY(-5px)',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
};

const agentIconStyle = {
  fontSize: '36px',
  marginBottom: '12px',
};

const agentTitleStyle = {
  fontWeight: 'bold',
  marginBottom: '8px',
};

const agentDescriptionStyle = {
  fontSize: '0.9rem',
  color: '#666',
};

const SimpleChatInterface = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m PA Agent, your AI work assistant. I can help you with emails, calendar management, documentation, and code review. What would you like me to help you with today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredAgent, setHoveredAgent] = useState(null);
  
  const agents = [
    {
      id: 'email',
      title: 'Email Assistant',
      description: 'Manage your inbox, summarize emails, and draft responses',
      icon: '✉️',
      path: '/email',
    },
    {
      id: 'calendar',
      title: 'Calendar Planner',
      description: 'Schedule meetings and manage your events',
      icon: '📅',
      path: '/calendar',
    },
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Generate project plans, reports and presentations',
      icon: '📄',
      path: '/docs',
    },
    {
      id: 'code',
      title: 'Code Review',
      description: 'Get feedback on your code and refactoring suggestions',
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
    <div>
      <div style={welcomeStyle}>
        <h1>Welcome to PA Agent - Work Buddy</h1>
        <p>Select an agent to get started or use the chat below for general assistance</p>
      </div>
      
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

      {/* Chat interface */}
      <div style={chatContainerStyle}>
        <div style={chatHeaderStyle}>
          <span>PA Agent - General Assistant</span>
          <span style={{ fontSize: '12px', color: '#666' }}>
            {isLoading ? 'Thinking...' : 'Ready'}
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
              <strong>{message.role === 'user' ? 'You' : 'PA Agent'}:</strong>
              <div style={{ marginTop: '4px' }}>{message.content}</div>
            </div>
          ))}
          
          {isLoading && (
            <div style={assistantMessageStyle}>
              <strong>PA Agent:</strong>
              <div style={{ marginTop: '4px' }}>
                <em>Thinking...</em>
              </div>
            </div>
          )}
        </div>

        <div style={inputContainerStyle}>
          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '8px', 
              fontSize: '12px' 
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={inputFormStyle}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about your work..."
              style={inputStyle}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={isLoading || !input.trim() ? disabledButtonStyle : buttonStyle}
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
