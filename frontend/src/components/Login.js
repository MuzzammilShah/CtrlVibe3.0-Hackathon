import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
  padding: '0 20px',
};

const titleStyle = {
  fontSize: '2.5rem',
  marginBottom: '16px',
  color: '#333',
};

const subtitleStyle = {
  fontSize: '1.2rem',
  marginBottom: '32px',
  color: '#666',
  maxWidth: '600px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const googleLogoStyle = {
  width: '20px',
  height: '20px',
};

const featureListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '16px',
  margin: '48px 0',
  maxWidth: '800px',
};

const featureCardStyle = {
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  padding: '24px',
  width: '200px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const cardTitleStyle = {
  fontSize: '1.2rem',
  marginBottom: '8px',
  color: '#333',
};

const cardDescriptionStyle = {
  fontSize: '0.9rem',
  color: '#666',
};

const Login = () => {
  const [loginUrl, setLoginUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoginUrl = async () => {
      try {
        const url = await authService.getLoginUrl();
        setLoginUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching login URL:', err);
        setError('Failed to initialize login. Please try again later.');
        setLoading(false);
      }
    };

    fetchLoginUrl();
  }, []);

  const features = [
    {
      title: 'Email Assistant',
      description: 'Summarize emails and draft intelligent responses',
    },
    {
      title: 'Calendar Planner',
      description: 'Create and manage events with natural language',
    },
    {
      title: 'Documentation',
      description: 'Generate plans, reports, and presentations',
    },
    {
      title: 'Code Review',
      description: 'Get feedback and suggestions for your code',
    },
  ];

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>PA Agent - Work Buddy</h1>
      <p style={subtitleStyle}>
        Your AI-powered work assistant for email management, scheduling, documentation, and code review
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <a href={loginUrl} style={{ textDecoration: 'none' }}>
          <button style={buttonStyle}>
            <img 
              src="https://developers.google.com/identity/images/g-logo.png" 
              alt="Google Logo" 
              style={googleLogoStyle} 
            />
            Login with Google
          </button>
        </a>
      )}

      <div style={featureListStyle}>
        {features.map((feature, index) => (
          <div key={index} style={featureCardStyle}>
            <h3 style={cardTitleStyle}>{feature.title}</h3>
            <p style={cardDescriptionStyle}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
