import React, { useState, useEffect } from 'react';
import { emailService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const EmailAgent = () => {
  const [unreadEmails, setUnreadEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [draftReply, setDraftReply] = useState('');
  const [replying, setReplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadEmails();
  }, []);

  const fetchUnreadEmails = async () => {
    try {
      setLoading(true);
      const data = await emailService.getUnreadEmails();
      setUnreadEmails(data.emails || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to fetch emails. Make sure you are authenticated.');
      setLoading(false);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setDraftReply('');
    setReplying(false);
  };

  const handleGenerateReply = async () => {
    if (!selectedEmail) return;
    
    try {
      setReplying(true);
      const data = await emailService.draftReply(selectedEmail.id);
      setDraftReply(data.reply || '');
      setReplying(false);
    } catch (err) {
      console.error('Error generating reply:', err);
      setError('Failed to generate reply.');
      setReplying(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEmail || !draftReply) return;
    
    try {
      await emailService.sendEmail(
        selectedEmail.sender, 
        `Re: ${selectedEmail.subject}`, 
        draftReply
      );
      
      // Reset state and fetch emails again
      setSelectedEmail(null);
      setDraftReply('');
      fetchUnreadEmails();
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email.');
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
    flex: 1,
    gap: '20px',
    height: 'calc(100vh - 120px)',
    overflow: 'hidden',
  };

  const emailListStyle = {
    flex: '0 0 300px',
    borderRight: '1px solid #e0e0e0',
    overflowY: 'auto',
    padding: '10px',
  };

  const emailDetailStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  };

  const emailItemStyle = {
    padding: '10px',
    borderBottom: '1px solid #e0e0e0',
    cursor: 'pointer',
  };

  const selectedEmailItemStyle = {
    ...emailItemStyle,
    backgroundColor: '#f0f7ff',
  };

  const emailSenderStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
  };

  const emailSubjectStyle = {
    marginBottom: '5px',
  };

  const emailSummaryStyle = {
    fontSize: '0.9rem',
    color: '#666',
  };

  const replyContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  const textareaStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '200px',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '1rem',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
  };

  const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Email Assistant</h1>
        <button style={secondaryButtonStyle} onClick={handleBack}>
          Back to Home
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={contentStyle}>
        <div style={emailListStyle}>
          <h2>Unread Emails</h2>
          {loading ? (
            <div style={loadingContainerStyle}>Loading emails...</div>
          ) : unreadEmails.length === 0 ? (
            <div>No unread emails found</div>
          ) : (
            unreadEmails.map((email) => (
              <div
                key={email.id}
                style={selectedEmail?.id === email.id ? selectedEmailItemStyle : emailItemStyle}
                onClick={() => handleSelectEmail(email)}
              >
                <div style={emailSenderStyle}>{email.sender}</div>
                <div style={emailSubjectStyle}>{email.subject}</div>
                <div style={emailSummaryStyle}>{email.summary}</div>
              </div>
            ))
          )}
        </div>

        <div style={emailDetailStyle}>
          {selectedEmail ? (
            <>
              <h2>Email Details</h2>
              <div style={{ marginBottom: '20px' }}>
                <div><strong>From:</strong> {selectedEmail.sender}</div>
                <div><strong>Subject:</strong> {selectedEmail.subject}</div>
                <div style={{ marginTop: '10px' }}>
                  <strong>Summary:</strong> {selectedEmail.summary}
                </div>
              </div>

              <div style={replyContainerStyle}>
                <div style={buttonContainerStyle}>
                  <button 
                    style={buttonStyle} 
                    onClick={handleGenerateReply}
                    disabled={replying}
                  >
                    {replying ? 'Generating Reply...' : 'Generate AI Reply'}
                  </button>
                </div>

                {draftReply && (
                  <>
                    <textarea
                      style={textareaStyle}
                      value={draftReply}
                      onChange={(e) => setDraftReply(e.target.value)}
                      placeholder="Edit your reply here..."
                    />
                    <div style={buttonContainerStyle}>
                      <button style={buttonStyle} onClick={handleSendEmail}>
                        Send Reply
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={loadingContainerStyle}>
              <p>Select an email to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAgent;
