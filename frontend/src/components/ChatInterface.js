import React from 'react';
import { useChat } from '@ai-sdk/react';
import { allTools } from '../tools';
import { useNavigate } from 'react-router-dom';

// Styling for chat interface
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
  backgroundColor: '#f1f1f1',
};

const inputContainerStyle = {
  display: 'flex',
  padding: '16px',
  borderTop: '1px solid #e0e0e0',
};

const inputStyle = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  resize: 'none',
  fontFamily: 'inherit',
};

const sendButtonStyle = {
  marginLeft: '8px',
  padding: '0 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const loadingIndicatorStyle = {
  alignSelf: 'center',
  margin: '16px 0',
  color: '#888',
  fontStyle: 'italic',
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

const welcomeStyle = {
  textAlign: 'center',
  margin: '32px 0',
};

const ChatInterface = () => {
  const navigate = useNavigate();
  
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: 'http://localhost:8000/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m PA Agent, your AI work assistant. I can help you with emails, calendar management, documentation, and code review. What would you like me to help you with today?',
      },
    ],
    onError: (error) => {
      console.error('Chat error:', error);
    },
    onFinish: (message) => {
      console.log('Chat finished:', message);
    },
    onResponse: (response) => {
      console.log('Chat response:', response);
    },
    experimental_onToolCall: async (toolCall, conversations) => {
      const tool = allTools.find(t => t.name === toolCall.name);
      
      if (!tool) {
        return { error: `Tool ${toolCall.name} not found` };
      }
      
      try {
        return await tool.execute(toolCall.parameters);
      } catch (error) {
        console.error(`Error executing tool ${toolCall.name}:`, error);
        return { error: `Failed to execute tool ${toolCall.name}` };
      }
    },
    maxSteps: 10, // Allow multi-step tool usage
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
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
  
  const [hoveredAgent, setHoveredAgent] = React.useState(null);
  
  const handleAgentClick = (path) => {
    navigate(path);
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
      
      <div style={chatContainerStyle}>
        <div style={chatHeaderStyle}>General Assistant Chat</div>
        
        <div style={messageListStyle}>
          {error && (
            <div style={{...assistantMessageStyle, backgroundColor: '#ffebee', color: '#c62828'}}>
              Error: {error.message || error}
            </div>
          )}
          
          {messages
            .filter(m => m.role !== 'system') // Hide system messages
            .map((message) => (
              <div
                key={message.id}
                style={message.role === 'user' ? userMessageStyle : assistantMessageStyle}
              >
                {message.content}
              </div>
            ))}
          
          {isLoading && (
            <div style={loadingIndicatorStyle}>PA Agent is thinking...</div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={inputContainerStyle}>
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask PA Agent to help with emails, calendar, documents, or code..."
            style={inputStyle}
            rows={2}
          />
          <button type="submit" style={sendButtonStyle} disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
