import React, { useState, useEffect } from 'react';
import { emailService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../utils/markdown';

const EmailAgent = () => {
  const [unreadEmails, setUnreadEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [draftReply, setDraftReply] = useState('');
  const [replyData, setReplyData] = useState(null); // Store full reply data including threading info
  const [replying, setReplying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadEmails();
  }, []);

  const fetchUnreadEmails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching unread emails...');
      
      const data = await emailService.getUnreadEmails();
      console.log('Email response:', data);
      
      setUnreadEmails(data.emails || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching emails:', err);
      
      let errorMessage = 'Failed to fetch emails.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please re-authenticate with Google.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your Gmail permissions.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your internet connection.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setDraftReply('');
    setReplyData(null);
    setReplying(false);
  };

  const handleGenerateReply = async () => {
    if (!selectedEmail) {
      setError('Please select an email first.');
      return;
    }
    
    try {
      setReplying(true);
      setError('');
      console.log('Generating reply for email:', selectedEmail.id);
      
      const data = await emailService.draftReply(selectedEmail.id);
      console.log('Reply generation response:', data);
      
      setReplyData(data); // Store the full reply data
      setDraftReply(data.reply || data.draft_reply || '');
      setReplying(false);
      
      if (!data.reply && !data.draft_reply) {
        setError('No reply was generated. Please try again.');
      }
    } catch (err) {
      console.error('Error generating reply:', err);
      
      let errorMessage = 'Failed to generate reply.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please re-authenticate with Google.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your Gmail permissions.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      setReplying(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedEmail || !draftReply || !replyData) {
      setError('Please select an email and generate a reply first.');
      return;
    }
    
    try {
      setError('');
      console.log('Sending email reply...', {
        to: replyData.to,
        subject: replyData.subject,
        bodyLength: draftReply.length,
        threading: {
          in_reply_to: replyData.in_reply_to,
          references: replyData.references
        }
      });
      
      const response = await emailService.sendEmail(
        replyData.to, 
        replyData.subject, 
        draftReply,
        replyData.in_reply_to,
        replyData.references
      );
      
      console.log('Email sent successfully:', response);
      
      // Show success message
      alert('Email sent successfully!');
      
      // Reset state and fetch emails again
      setSelectedEmail(null);
      setDraftReply('');
      setReplyData(null);
      fetchUnreadEmails();
    } catch (err) {
      console.error('Error sending email:', err);
      
      let errorMessage = 'Failed to send email.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please re-authenticate with Google.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please check your Gmail permissions.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.detail || 'Invalid email data.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
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
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '2rem',
    height: 'calc(100vh - 200px)',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const emailListStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const emailListHeaderStyle = {
    padding: '1.5rem 2rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '1.125rem',
  };

  const emailListContentStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  };

  const emailDetailStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const emailItemStyle = {
    padding: '1.25rem',
    borderBottom: '1px solid #f1f5f9',
    cursor: 'pointer',
    borderRadius: '0.75rem',
    margin: '0.5rem 0',
    transition: 'all 0.2s ease',
    background: '#fafafa',
  };

  const selectedEmailItemStyle = {
    ...emailItemStyle,
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
    border: '2px solid #0ea5e9',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  };

  const emailSenderStyle = {
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#1e293b',
    fontSize: '0.95rem',
  };

  const emailSubjectStyle = {
    marginBottom: '0.5rem',
    color: '#374151',
    fontSize: '0.9rem',
    fontWeight: '500',
  };

  const emailSummaryStyle = {
    fontSize: '0.85rem',
    color: '#64748b',
    lineHeight: '1.4',
  };

  const emailDetailHeaderStyle = {
    padding: '1.5rem 2rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '1.125rem',
  };

  const emailDetailContentStyle = {
    flex: 1,
    overflow: 'auto',
    padding: '2rem',
  };

  const replyContainerStyle = {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const textareaStyle = {
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
    border: '2px solid #e2e8f0',
    minHeight: '200px',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
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
    height: '300px',
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
    marginBottom: '1.5rem',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      {/* Modern Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          ✉️ Email Assistant
        </h1>
        <button 
          className="btn btn-secondary" 
          onClick={handleBack}
          style={{ borderRadius: '0.75rem' }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Error Display */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Main Content */}
      <div style={contentStyle}>
        {/* Email List */}
        <div style={emailListStyle}>
          <div style={emailListHeaderStyle}>
            📧 Unread Emails ({unreadEmails.length})
          </div>
          <div style={emailListContentStyle}>
            {loading ? (
              <div style={loadingContainerStyle}>
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading your emails...</p>
              </div>
            ) : unreadEmails.length === 0 ? (
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📮</div>
                <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>No unread emails</h3>
                <p>You're all caught up! Check back later for new messages.</p>
              </div>
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
        </div>

        {/* Email Detail */}
        <div style={emailDetailStyle}>
          {selectedEmail ? (
            <>
              <div style={emailDetailHeaderStyle}>
                📄 Email Details
              </div>
              <div style={emailDetailContentStyle}>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '1.5rem', 
                    borderRadius: '1rem',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ color: '#1e293b' }}>From:</strong> 
                      <span style={{ marginLeft: '0.5rem', color: '#374151' }}>{selectedEmail.sender}</span>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ color: '#1e293b' }}>Subject:</strong> 
                      <span style={{ marginLeft: '0.5rem', color: '#374151' }}>{selectedEmail.subject}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#1e293b' }}>Summary:</strong> 
                      <span style={{ marginLeft: '0.5rem', color: '#374151' }}>{selectedEmail.summary}</span>
                    </div>
                  </div>
                </div>

                {/* Reply Section */}
                <div style={replyContainerStyle}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                      💬 Draft Reply
                    </h3>
                    <button
                      onClick={handleGenerateReply}
                      disabled={replying}
                      className="btn btn-primary"
                      style={{ 
                        fontSize: '0.875rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.75rem'
                      }}
                    >
                      {replying ? 'Generating...' : '✨ Generate AI Reply'}
                    </button>
                  </div>

                  {draftReply && (
                    <>
                      <div style={{ 
                        marginBottom: '1rem',
                        background: '#f0f9ff',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        border: '1px solid #e0f2fe'
                      }}>
                        <h4 style={{ margin: '0 0 1rem', color: '#1e293b', fontSize: '1rem' }}>Generated Reply Preview:</h4>
                        <div style={{ 
                          background: 'white',
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          border: '1px solid #e2e8f0'
                        }}>
                          <MarkdownRenderer content={draftReply} />
                        </div>
                      </div>
                      
                      <h4 style={{ margin: '0 0 0.75rem', color: '#1e293b', fontSize: '1rem' }}>Edit Reply:</h4>
                      <textarea
                        style={textareaStyle}
                        value={draftReply}
                        onChange={(e) => setDraftReply(e.target.value)}
                        placeholder="Edit your reply here..."
                      />
                      
                      <div style={buttonContainerStyle}>
                        <button 
                          className="btn btn-primary"
                          onClick={handleSendEmail}
                          style={{ borderRadius: '0.75rem' }}
                        >
                          📤 Send Reply
                        </button>
                        <button
                          onClick={() => {
                            setDraftReply('');
                            setReplyData(null);
                          }}
                          className="btn btn-secondary"
                          style={{ borderRadius: '0.75rem' }}
                        >
                          🗑️ Clear
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
              <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>Select an email</h3>
              <p>Choose an email from the list to view details and draft a reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAgent;
