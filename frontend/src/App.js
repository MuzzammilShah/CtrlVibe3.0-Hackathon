import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';

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
  const handleCallback = (code) => {
    // In a real implementation, this would exchange the code for tokens
    // and store them in localStorage
    console.log('Received auth code:', code);
    
    // Mock authentication for demo purposes
    localStorage.setItem('accessToken', 'mock-token');
    setIsAuthenticated(true);
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
        </Routes>
      </div>
    </Router>
  );
}

// Callback handler component
function CallbackHandler({ handleCallback }) {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleCallback(code);
    }
  }, [handleCallback]);
  
  return <div>Processing authentication...</div>;
}

export default App;
