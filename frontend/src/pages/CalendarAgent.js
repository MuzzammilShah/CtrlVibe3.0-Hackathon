import React, { useState, useEffect } from 'react';
import { calendarService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CalendarAgent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [naturalLanguageRequest, setNaturalLanguageRequest] = useState('');
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching calendar events...');
      
      const data = await calendarService.getEvents();
      console.log('Calendar events response:', data);
      
      setEvents(data.events || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      
      let errorMessage = 'Failed to fetch calendar events.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please re-authenticate with Google.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your Google Calendar permissions.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your internet connection.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!naturalLanguageRequest.trim()) {
      setError('Please enter an event description.');
      return;
    }
    
    try {
      setCreatingEvent(true);
      setError('');
      setSuccess('');
      console.log('Creating calendar event:', naturalLanguageRequest);
      
      const data = await calendarService.createEvent(naturalLanguageRequest);
      console.log('Event creation response:', data);
      
      // Add the new event to the list if it was created successfully
      if (data.event) {
        setEvents([...events, data.event]);
        setSuccess(data.message || 'Event created successfully!');
      } else {
        setSuccess('Event created successfully!');
      }
      
      setNaturalLanguageRequest('');
      setCreatingEvent(false);
      
      // Refresh events list to show the new event
      setTimeout(() => {
        fetchEvents();
      }, 1000);
      
    } catch (err) {
      console.error('Error creating event:', err);
      
      let errorMessage = 'Failed to create event. Please try again.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please re-authenticate with Google.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your Google Calendar permissions.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      setCreatingEvent(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // Modern Styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
    padding: '2rem',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    background: 'white',
    padding: '1.5rem 2rem',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
  };

  const titleStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const formStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
  };

  const formHeaderStyle = {
    marginBottom: '1.5rem',
  };

  const formTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '0.75rem',
  };

  const formDescriptionStyle = {
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
    border: '2px solid #e2e8f0',
    fontFamily: 'inherit',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    marginBottom: '1.5rem',
  };

  const inputFocusStyle = {
    borderColor: '#0ea5e9',
    boxShadow: '0 0 0 3px rgba(14, 165, 233, 0.1)',
    backgroundColor: '#f0f9ff',
  };

  const eventListContainerStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
  };

  const eventListHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const eventListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const eventItemStyle = {
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #fafafa 0%, #f8fafc 100%)',
    transition: 'all 0.2s ease',
  };

  const eventItemHoverStyle = {
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    transform: 'translateY(-1px)',
  };

  const eventTitleStyle = {
    fontWeight: '600',
    fontSize: '1.125rem',
    marginBottom: '0.75rem',
    color: '#1e293b',
  };

  const eventDetailsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: '#64748b',
    marginBottom: '0.5rem',
  };

  const eventDetailItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const loadingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    gap: '1rem',
  };

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#64748b',
    textAlign: 'center',
    padding: '2rem',
  };

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #fecaca',
    marginBottom: '1rem',
    fontWeight: '500',
  };

  const successStyle = {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #bbf7d0',
    marginBottom: '1rem',
    fontWeight: '500',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={containerStyle}>
      {/* Modern Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          📅 Calendar Planner
        </h1>
        <button 
          className="btn btn-secondary" 
          onClick={handleBack}
          style={{ borderRadius: '0.75rem' }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={contentStyle}>
        {/* Event Creation Form */}
        <div style={formStyle}>
          <div style={formHeaderStyle}>
            <h2 style={formTitleStyle}>✨ Create New Event</h2>
            <p style={formDescriptionStyle}>
              Describe your event in natural language and AI will create it for you.
            </p>
            <p style={formDescriptionStyle}>
              <strong>Example:</strong> "Schedule a team meeting next Tuesday at 2pm for 1 hour"
            </p>
          </div>
          
          {error && <div style={errorStyle}>{error}</div>}
          {success && <div style={successStyle}>{success}</div>}
          
          <form onSubmit={handleCreateEvent}>
            <input
              type="text"
              style={inputStyle}
              value={naturalLanguageRequest}
              onChange={(e) => setNaturalLanguageRequest(e.target.value)}
              onFocus={(e) => e.target.style.cssText = Object.entries({...inputStyle, ...inputFocusStyle}).map(([k,v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';')}
              onBlur={(e) => e.target.style.cssText = Object.entries(inputStyle).map(([k,v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';')}
              placeholder="Describe your event (e.g., Meeting with John tomorrow at 3pm)..."
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={creatingEvent || !naturalLanguageRequest.trim()}
              style={{
                borderRadius: '0.75rem',
                opacity: (!naturalLanguageRequest.trim() || creatingEvent) ? 0.5 : 1,
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {creatingEvent ? '⏳ Creating Event...' : '🎯 Create Event'}
            </button>
          </form>
        </div>

        {/* Events List */}
        <div style={eventListContainerStyle}>
          <h2 style={eventListHeaderStyle}>
            📋 Upcoming Events
            {events.length > 0 && (
              <span style={{ 
                background: '#e0f2fe', 
                color: '#0369a1', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '1rem', 
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {events.length}
              </span>
            )}
          </h2>
          
          {loading ? (
            <div style={loadingContainerStyle}>
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your calendar events...</p>
            </div>
          ) : events.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
              <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>No upcoming events</h3>
              <p>Create your first event using the form above!</p>
            </div>
          ) : (
            <div style={eventListStyle}>
              {events.map((event) => (
                <div 
                  key={event.id} 
                  style={eventItemStyle}
                  onMouseEnter={(e) => {
                    e.target.style.cssText = Object.entries({...eventItemStyle, ...eventItemHoverStyle}).map(([k,v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';');
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.cssText = Object.entries(eventItemStyle).map(([k,v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:${v}`).join(';');
                  }}
                >
                  <div style={eventTitleStyle}>{event.title}</div>
                  <div style={eventDetailsStyle}>
                    <div style={eventDetailItemStyle}>
                      <span>🕒</span>
                      <span><strong>Start:</strong> {formatDate(event.start)}</span>
                    </div>
                    <div style={eventDetailItemStyle}>
                      <span>⏰</span>
                      <span><strong>End:</strong> {formatDate(event.end)}</span>
                    </div>
                    {event.location && (
                      <div style={eventDetailItemStyle}>
                        <span>📍</span>
                        <span><strong>Location:</strong> {event.location}</span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <div style={{ 
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(148, 163, 184, 0.1)',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#374151'
                    }}>
                      <strong>Description:</strong> {event.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarAgent;
