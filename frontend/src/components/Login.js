import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  padding: '2rem 1rem',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
  position: 'relative',
  overflow: 'hidden',
};

// Add some subtle background decoration
const backgroundDecoration = {
  position: 'absolute',
  top: '-50%',
  right: '-50%',
  width: '200%',
  height: '200%',
  background: 'radial-gradient(circle, rgba(14, 165, 233, 0.03) 0%, transparent 70%)',
  zIndex: 0,
};

const contentWrapper = {
  position: 'relative',
  zIndex: 1,
  maxWidth: '1200px',
  width: '100%',
};

const titleStyle = {
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: '700',
  marginBottom: '1rem',
  color: '#0f172a',
  background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  lineHeight: '1.2',
};

const subtitleStyle = {
  fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
  marginBottom: '3rem',
  color: '#475569',
  maxWidth: '600px',
  margin: '0 auto 3rem',
  lineHeight: '1.6',
  fontWeight: '400',
};

const buttonStyle = {
  backgroundColor: 'white',
  color: '#1e293b',
  border: '2px solid #e2e8f0',
  padding: '1rem 2rem',
  borderRadius: '1rem',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.75rem',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  textDecoration: 'none',
  margin: '0 auto 4rem',
};

const buttonHoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  borderColor: '#0ea5e9',
};

const googleLogoStyle = {
  width: '24px',
  height: '24px',
};

const featureListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1.5rem',
  margin: '4rem 0',
  maxWidth: '1200px',
  width: '100%',
};

const featureCardStyle = {
  backgroundColor: 'white',
  borderRadius: '1.5rem',
  padding: '2rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  border: '1px solid #f1f5f9',
  transition: 'all 0.3s ease',
  textAlign: 'left',
  position: 'relative',
  overflow: 'hidden',
};

const featureCardHover = {
  transform: 'translateY(-4px)',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

const cardIconStyle = {
  fontSize: '2.5rem',
  marginBottom: '1rem',
  display: 'block',
};

const cardTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '0.75rem',
  color: '#1e293b',
};

const cardDescriptionStyle = {
  fontSize: '0.95rem',
  color: '#64748b',
  lineHeight: '1.6',
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

  const [hoveredCard, setHoveredCard] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const features = [
    {
      title: 'Email Assistant',
      description: 'Summarize emails and draft intelligent responses with AI-powered insights',
      icon: '✉️',
    },
    {
      title: 'Calendar Planner',
      description: 'Create and manage events with natural language processing',
      icon: '📅',
    },
    {
      title: 'Documentation',
      description: 'Generate professional plans, reports, and presentations automatically',
      icon: '📄',
    },
    {
      title: 'Code Review',
      description: 'Get intelligent feedback and suggestions for your code improvements',
      icon: '💻',
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={backgroundDecoration}></div>
      <div style={contentWrapper}>
        <h1 style={titleStyle}>PA Agent</h1>
        <p style={subtitleStyle}>
          Your intelligent AI-powered work assistant for seamless email management, 
          smart scheduling, automated documentation, and comprehensive code review
        </p>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Initializing secure connection...</p>
          </div>
        ) : error ? (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            color: '#dc2626', 
            padding: '1rem 2rem', 
            borderRadius: '0.75rem',
            border: '1px solid #fecaca',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem'
          }}>
            {error}
          </div>
        ) : (
          <a 
            href={loginUrl} 
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <button 
              style={{
                ...buttonStyle,
                ...(isButtonHovered ? buttonHoverStyle : {})
              }}
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google Logo" 
                style={googleLogoStyle} 
              />
              Continue with Google
            </button>
          </a>
        )}

        <div style={featureListStyle}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{
                ...featureCardStyle,
                ...(hoveredCard === index ? featureCardHover : {})
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={cardIconStyle}>{feature.icon}</span>
              <h3 style={cardTitleStyle}>{feature.title}</h3>
              <p style={cardDescriptionStyle}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
