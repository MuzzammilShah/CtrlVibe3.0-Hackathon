import React, { useState } from 'react';
import { documentationService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../utils/markdown';

const DocumentationAgent = () => {
  const [activeTab, setActiveTab] = useState('projectPlan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const navigate = useNavigate();
  
  // Project Plan state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [timelineWeeks, setTimelineWeeks] = useState(4);
  const [teamSize, setTeamSize] = useState(3);
  
  // Report Template state
  const [reportType, setReportType] = useState('');
  const [reportTopic, setReportTopic] = useState('');
  const [reportSections, setReportSections] = useState('');
  
  // Presentation Outline state
  const [presentationTitle, setPresentationTitle] = useState('');
  const [audience, setAudience] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);

  const generateProjectPlan = async (e) => {
    e.preventDefault();
    
    if (!projectTitle || !projectDescription) {
      setError('Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const data = await documentationService.generateProjectPlan(
        projectTitle,
        projectDescription,
        timelineWeeks,
        teamSize
      );
      
      setGeneratedContent(data.content);
      setLoading(false);
    } catch (err) {
      console.error('Error generating project plan:', err);
      setError('Failed to generate project plan');
      setLoading(false);
    }
  };

  const generateReportTemplate = async (e) => {
    e.preventDefault();
    
    if (!reportType || !reportTopic) {
      setError('Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const sections = reportSections ? reportSections.split(',').map(s => s.trim()) : null;
      
      const data = await documentationService.generateReportTemplate(
        reportType,
        reportTopic,
        sections
      );
      
      setGeneratedContent(data.content);
      setLoading(false);
    } catch (err) {
      console.error('Error generating report template:', err);
      setError('Failed to generate report template');
      setLoading(false);
    }
  };

  const generatePresentationOutline = async (e) => {
    e.preventDefault();
    
    if (!presentationTitle || !audience) {
      setError('Please fill out all required fields');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const data = await documentationService.generatePresentationOutline(
        presentationTitle,
        audience,
        durationMinutes
      );
      
      setGeneratedContent(data.content);
      setLoading(false);
    } catch (err) {
      console.error('Error generating presentation outline:', err);
      setError('Failed to generate presentation outline');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const resetForm = () => {
    setGeneratedContent('');
    setError('');
    
    // Reset form values based on active tab
    if (activeTab === 'projectPlan') {
      setProjectTitle('');
      setProjectDescription('');
      setTimelineWeeks(4);
      setTeamSize(3);
    } else if (activeTab === 'reportTemplate') {
      setReportType('');
      setReportTopic('');
      setReportSections('');
    } else if (activeTab === 'presentationOutline') {
      setPresentationTitle('');
      setAudience('');
      setDurationMinutes(15);
    }
  };

    // Modern Styles with consistent layout
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
    padding: '2rem',
    paddingTop: '5rem', // Add space for fixed header
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

  const tabsStyle = {
    display: 'flex',
    background: 'white',
    borderRadius: '1rem',
    padding: '0.5rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
  };

  const tabStyle = {
    flex: 1,
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    borderRadius: '0.75rem',
    textAlign: 'center',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#64748b',
    transition: 'all 0.2s ease',
  };

  const activeTabStyle = {
    ...tabStyle,
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    color: 'white',
    boxShadow: '0 2px 4px -1px rgb(0 0 0 / 0.1)',
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '2rem',
    height: 'calc(100vh - 300px)',
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const formStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    height: 'fit-content',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '0.95rem',
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  };

  const resultStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const resultHeaderStyle = {
    padding: '1.5rem 2rem',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '1.125rem',
  };

  const resultContentStyle = {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
    lineHeight: '1.6',
  };

  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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

  const buttonStyle = {
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const secondaryButtonStyle = {
    backgroundColor: '#f8fafc',
    color: '#475569',
    border: '1px solid #e2e8f0',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          📄 Documentation Assistant
        </h1>
        <button 
          className="btn btn-secondary" 
          onClick={handleBack}
          style={{ borderRadius: '0.75rem' }}
        >
          ← Back to Home
        </button>
      </div>

      <div style={tabsStyle}>
        <div 
          style={activeTab === 'projectPlan' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('projectPlan')}
        >
          Project Plan
        </div>
        <div 
          style={activeTab === 'reportTemplate' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('reportTemplate')}
        >
          Report Template
        </div>
        <div 
          style={activeTab === 'presentationOutline' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('presentationOutline')}
        >
          Presentation Outline
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <div style={contentStyle}>
        <div style={formStyle}>
          {activeTab === 'projectPlan' && (
            <form onSubmit={generateProjectPlan}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Project Title*</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="E.g., Mobile App Development"
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Project Description*</label>
                <textarea
                  style={textareaStyle}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the project goals, features, and requirements..."
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Timeline (weeks)</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={timelineWeeks}
                  onChange={(e) => setTimelineWeeks(parseInt(e.target.value))}
                  min="1"
                  max="52"
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Team Size</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  min="1"
                  max="20"
                />
              </div>
              
              <div style={buttonContainerStyle}>
                <button 
                  type="submit" 
                  style={buttonStyle}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Project Plan'}
                </button>
                <button 
                  type="button" 
                  style={secondaryButtonStyle}
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'reportTemplate' && (
            <form onSubmit={generateReportTemplate}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Report Type*</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  placeholder="E.g., Technical, Research, Business"
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Report Topic*</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={reportTopic}
                  onChange={(e) => setReportTopic(e.target.value)}
                  placeholder="E.g., Market Analysis for Product X"
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Custom Sections (comma-separated, optional)</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={reportSections}
                  onChange={(e) => setReportSections(e.target.value)}
                  placeholder="E.g., Executive Summary, Methodology, Findings"
                />
              </div>
              
              <div style={buttonContainerStyle}>
                <button 
                  type="submit" 
                  style={buttonStyle}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Report Template'}
                </button>
                <button 
                  type="button" 
                  style={secondaryButtonStyle}
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'presentationOutline' && (
            <form onSubmit={generatePresentationOutline}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Presentation Title*</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={presentationTitle}
                  onChange={(e) => setPresentationTitle(e.target.value)}
                  placeholder="E.g., Quarterly Business Review"
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Target Audience*</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="E.g., Executives, Stakeholders, Technical Team"
                  required
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Duration (minutes)</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value))}
                  min="5"
                  max="120"
                />
              </div>
              
              <div style={buttonContainerStyle}>
                <button 
                  type="submit" 
                  style={buttonStyle}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Presentation Outline'}
                </button>
                <button 
                  type="button" 
                  style={secondaryButtonStyle}
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div style={resultStyle}>
          <div style={resultHeaderStyle}>
            📄 Generated Documentation
          </div>
          <div style={resultContentStyle}>
            {loading ? (
              <div style={emptyStateStyle}>
                <div className="loading-spinner" style={{ marginBottom: '1rem' }}></div>
                <p>Generating your documentation...</p>
              </div>
            ) : generatedContent ? (
              <MarkdownRenderer content={generatedContent} />
            ) : (
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>Ready to generate</h3>
                <p>Fill in the form and select a documentation type to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationAgent;
