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

  // Styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 60px)',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontFamily: 'inherit',
  };

  const buttonStyle = {
    padding: '10px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const secondaryButtonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#6c757d',
    color: 'white',
    cursor: 'pointer',
  };

  const eventListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const eventItemStyle = {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: 'white',
  };

  const eventTitleStyle = {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '5px',
  };

  const eventDetailsStyle = {
    display: 'flex',
    gap: '20px',
    fontSize: '0.9rem',
    color: '#555',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Calendar Planner</h1>
        <button style={secondaryButtonStyle} onClick={handleBack}>
          Back to Home
        </button>
      </div>

      <div style={contentStyle}>
        <div style={formStyle}>
          <h2>Create Event</h2>
          <p>Describe your event in natural language and the AI will create it for you.</p>
          <p>For example: "Schedule a team meeting next Tuesday at 2pm for 1 hour"</p>
          
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
          
          <form onSubmit={handleCreateEvent}>
            <input
              type="text"
              style={inputStyle}
              value={naturalLanguageRequest}
              onChange={(e) => setNaturalLanguageRequest(e.target.value)}
              placeholder="Describe your event..."
            />
            <button 
              type="submit" 
              style={buttonStyle}
              disabled={creatingEvent || !naturalLanguageRequest.trim()}
            >
              {creatingEvent ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>

        <div>
          <h2>Upcoming Events</h2>
          {loading ? (
            <div>Loading events...</div>
          ) : events.length === 0 ? (
            <div>No upcoming events found</div>
          ) : (
            <div style={eventListStyle}>
              {events.map((event) => (
                <div key={event.id} style={eventItemStyle}>
                  <div style={eventTitleStyle}>{event.title}</div>
                  <div style={eventDetailsStyle}>
                    <div><strong>Start:</strong> {formatDate(event.start)}</div>
                    <div><strong>End:</strong> {formatDate(event.end)}</div>
                  </div>
                  {event.location && (
                    <div><strong>Location:</strong> {event.location}</div>
                  )}
                  {event.description && (
                    <div><strong>Description:</strong> {event.description}</div>
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
