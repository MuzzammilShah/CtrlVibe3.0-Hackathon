import React from 'react';
import { useChat } from '@ai-sdk/react';
import { allTools } from '../tools';

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

const ChatInterface = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: 'You are a helpful AI work assistant called PA Agent. You can help with emails, calendar management, documentation, and code review. Be concise, professional, and helpful.',
      },
    ],
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

  return (
    <div style={chatContainerStyle}>
      <div style={chatHeaderStyle}>PA Agent - Work Buddy</div>
      
      <div style={messageListStyle}>
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
  );
};

export default ChatInterface;
