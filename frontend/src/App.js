import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import SimpleChatInterface from './components/SimpleChatInterface';
import ErrorBoundary from './components/ErrorBoundary';
import EmailAgent from './pages/EmailAgent';
import CalendarAgent from './pages/CalendarAgent';
import DocumentationAgent from './pages/DocumentationAgent';
import CodeReviewAgent from './pages/CodeReviewAgent';
import { authService } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  
  // Check if user is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Verify token is still valid
          const response = await authService.verifyAuth();
          setIsAuthenticated(true);
          setUserInfo(response);
          localStorage.setItem('userInfo', JSON.stringify(response));
        } catch (error) {
          console.log('Token verification failed, clearing auth state');
          // Token is invalid, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userInfo');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);
  
  // Handle OAuth callback
  const handleCallback = async (code) => {
    try {
      console.log('Processing auth code...');
      
      // Check if we're already authenticated (prevent duplicate processing)
      if (isAuthenticated) {
        console.log('Already authenticated, skipping callback processing');
        return { success: true };
      }
      
      // Exchange code for tokens using the backend
      const response = await fetch(`http://localhost:8000/auth/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        
        // Handle specific case of duplicate code usage
        if (response.status === 400 && errorData.detail?.includes('already been used')) {
          console.log('Code already processed by another request, treating as success');
          return { success: true };
        }
        
        throw new Error(errorData.detail || 'Failed to authenticate with the server');
      }
      
      const data = await response.json();
      console.log('Authentication successful:', data);
      
      // Store the access token and user info
      localStorage.setItem('accessToken', data.access_token);
      if (data.user_info) {
        localStorage.setItem('userInfo', JSON.stringify(data.user_info));
        setUserInfo(data.user_info);
      }
      
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with logout even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      setIsAuthenticated(false);
      setUserInfo(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          {/* Add logout button in header if authenticated */}
          {isAuthenticated && (
            <header style={{
              position: 'fixed',
              top: 0,
              right: 0,
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderLeft: '1px solid #ddd',
              borderBottom: '1px solid #ddd',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {userInfo && (
                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                  {userInfo.user_email || userInfo.email}
                </span>
              )}
              <button
                onClick={handleLogout}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Logout
              </button>
            </header>
          )}
          
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
              element={isAuthenticated ? <SimpleChatInterface /> : <Navigate to="/login" />} 
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
    </ErrorBoundary>
  );
}

// Improved Callback handler component
function CallbackHandler({ handleCallback }) {
  const [status, setStatus] = useState('Processing authentication...');
  const [isError, setIsError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  
  useEffect(() => {
    const processCallback = async () => {
      // Prevent multiple simultaneous processing
      if (isProcessing || hasProcessed) return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        setStatus(`Authentication cancelled or failed: ${error}`);
        setIsError(true);
        return;
      }
      
      if (code) {
        setIsProcessing(true);
        setHasProcessed(true);
        setStatus('Exchanging authentication code for tokens...');
        
        try {
          const result = await handleCallback(code);
          
          if (result.success) {
            setStatus('Authentication successful! Redirecting...');
            // Immediate redirect for better UX
            window.location.replace('/');
          } else {
            setStatus(`Authentication failed: ${result.error}`);
            setIsError(true);
          }
        } catch (err) {
          // Only show error if it's not a duplicate processing issue
          if (!err.message.includes('already been used')) {
            setStatus(`Authentication failed: ${err.message}`);
            setIsError(true);
          } else {
            // If it's a duplicate, just redirect
            setStatus('Authentication successful! Redirecting...');
            window.location.replace('/');
          }
        } finally {
          setIsProcessing(false);
        }
      } else {
        setStatus('No authentication code found in URL.');
        setIsError(true);
      }
    };

    processCallback();
  }, [handleCallback, isProcessing, hasProcessed]); // Add hasProcessed to dependencies
  
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
      <p style={{ color: isError ? '#dc3545' : '#333' }}>{status}</p>
      {isError && (
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </button>
      )}
    </div>
  );
}

export default App;
