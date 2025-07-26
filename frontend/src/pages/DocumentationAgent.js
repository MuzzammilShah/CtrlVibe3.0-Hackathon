import React, { useState } from 'react';
import { documentationService } from '../services/api';
import { useNavigate } from 'react-router-dom';

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

  // Styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
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

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '20px',
  };

  const tabStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '2px solid #007bff',
    fontWeight: 'bold',
  };

  const contentStyle = {
    display: 'flex',
    gap: '30px',
  };

  const formStyle = {
    flex: '0 0 40%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  };

  const labelStyle = {
    fontWeight: 'bold',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
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
    ...buttonStyle,
    backgroundColor: '#6c757d',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
  };

  const resultStyle = {
    flex: '0 0 55%',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
    whiteSpace: 'pre-wrap',
    maxHeight: '600px',
    overflowY: 'auto',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Documentation Assistant</h1>
        <button style={secondaryButtonStyle} onClick={handleBack}>
          Back to Home
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
          <h2>Generated Content</h2>
          {loading ? (
            <div>Generating content...</div>
          ) : generatedContent ? (
            <div>{generatedContent}</div>
          ) : (
            <div>Fill in the form and generate content to see the result here.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationAgent;
