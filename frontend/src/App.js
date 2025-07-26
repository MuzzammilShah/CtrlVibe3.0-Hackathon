import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import EmailAgent from './pages/EmailAgent';
// We'll need to create these components
import CalendarAgent from './pages/CalendarAgent';
import DocumentationAgent from './pages/DocumentationAgent';
import CodeReviewAgent from './pages/CodeReviewAgent';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is authenticated on load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle OAuth callback
  const handleCallback = async (code) => {
    try {
      console.log('Received auth code:', code);
      
      // Exchange code for tokens using the backend
      const response = await fetch(`http://localhost:8000/auth/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with the server');
      }
      
      const data = await response.json();
      console.log('Authentication successful:', data);
      
      // Store the access token in localStorage
      localStorage.setItem('accessToken', data.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    }
  };
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route 
            path="/auth/callback" 
            element={
              <CallbackHandler handleCallback={handleCallback} />
            } 
          />
          <Route 
            path="/" 
            element={isAuthenticated ? <ChatInterface /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/email" 
            element={isAuthenticated ? <EmailAgent /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/calendar" 
            element={isAuthenticated ? <CalendarAgent /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/docs" 
            element={isAuthenticated ? <DocumentationAgent /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/code" 
            element={isAuthenticated ? <CodeReviewAgent /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

// Callback handler component
function CallbackHandler({ handleCallback }) {
  const [status, setStatus] = useState('Processing authentication...');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      setStatus('Exchanging authentication code for tokens...');
      handleCallback(code)
        .then(() => {
          setStatus('Authentication successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        })
        .catch((error) => {
          setStatus(`Authentication failed: ${error.message}`);
        });
    } else {
      setStatus('No authentication code found in URL.');
    }
  }, [handleCallback]);
  
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    textAlign: 'center',
  };
  
  return (
    <div style={containerStyle}>
      <h2>PA Agent - Authentication</h2>
      <p>{status}</p>
    </div>
  );
}

export default App;
