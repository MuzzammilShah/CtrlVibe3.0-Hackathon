import React, { useState } from 'react';
import { codeReviewService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { MarkdownRenderer } from '../utils/markdown';

const CodeReviewAgent = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [reviewType, setReviewType] = useState('review');
  const [reviewFocus, setReviewFocus] = useState('general');
  const [refactoringGoal, setRefactoringGoal] = useState('');
  const [detailLevel, setDetailLevel] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code) {
      setError('Please enter some code to analyze');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      let data;
      
      if (reviewType === 'review') {
        data = await codeReviewService.reviewCode(code, language, reviewFocus);
      } else if (reviewType === 'refactor') {
        data = await codeReviewService.suggestRefactoring(code, language, refactoringGoal);
      } else if (reviewType === 'explain') {
        data = await codeReviewService.explainCode(code, language, detailLevel);
      }
      
      setResult(data.content);
      setLoading(false);
    } catch (err) {
      console.error(`Error with code ${reviewType}:`, err);
      setError(`Failed to ${reviewType} code. Please try again.`);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
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

  const resultContainerStyle = {
    background: 'white',
    borderRadius: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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

  const selectStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    background: 'white',
  };

  const textareaStyle = {
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
    border: '2px solid #e2e8f0',
    minHeight: '300px',
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    fontSize: '0.9rem',
    resize: 'vertical',
    transition: 'all 0.2s ease',
    outline: 'none',
    lineHeight: '1.5',
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    outline: 'none',
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

  return (
    <div style={containerStyle}>
      {/* Modern Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          💻 Code Review Assistant
        </h1>
        <button 
          className="btn btn-secondary" 
          onClick={handleBack}
          style={{ borderRadius: '0.75rem' }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Consistent Two-Column Layout */}
      <div style={contentStyle}>
        {/* Left Column - Form (Fixed Width) */}
        <div style={formStyle}>
          {error && <div style={errorStyle}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>What would you like to do?</label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    id="review"
                    name="reviewType"
                    value="review"
                    checked={reviewType === 'review'}
                    onChange={() => setReviewType('review')}
                  />
                  <label htmlFor="review" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Review Code</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    id="refactor"
                    name="reviewType"
                    value="refactor"
                    checked={reviewType === 'refactor'}
                    onChange={() => setReviewType('refactor')}
                  />
                  <label htmlFor="refactor" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Suggest Refactoring</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    id="explain"
                    name="reviewType"
                    value="explain"
                    checked={reviewType === 'explain'}
                    onChange={() => setReviewType('explain')}
                  />
                  <label htmlFor="explain" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Explain Code</label>
                </div>
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Programming Language</label>
              <select
                style={selectStyle}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c#">C#</option>
                <option value="c++">C++</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL</option>
                <option value="other">Other</option>
              </select>
            </div>

            {reviewType === 'review' && (
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Review Focus</label>
                <select
                  style={selectStyle}
                  value={reviewFocus}
                  onChange={(e) => setReviewFocus(e.target.value)}
                >
                  <option value="general">General Review</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                  <option value="maintainability">Maintainability</option>
                  <option value="best-practices">Best Practices</option>
                </select>
              </div>
            )}

            {reviewType === 'refactor' && (
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Refactoring Goal</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={refactoringGoal}
                  onChange={(e) => setRefactoringGoal(e.target.value)}
                  placeholder="E.g., Improve performance, reduce complexity, DRY"
                />
              </div>
            )}

            {reviewType === 'explain' && (
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Detail Level</label>
                <select
                  style={selectStyle}
                  value={detailLevel}
                  onChange={(e) => setDetailLevel(e.target.value)}
                >
                  <option value="high">High Detail</option>
                  <option value="medium">Medium Detail</option>
                  <option value="low">Low Detail</option>
                </select>
              </div>
            )}

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Your Code</label>
              <textarea
                style={textareaStyle}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ borderRadius: '0.75rem', width: '100%', marginTop: '1rem' }}
            >
              {loading ? (
                reviewType === 'review' ? '⏳ Reviewing...' : 
                reviewType === 'refactor' ? '⏳ Refactoring...' : '⏳ Explaining...'
              ) : (
                reviewType === 'review' ? '🔍 Review Code' : 
                reviewType === 'refactor' ? '🔧 Suggest Refactoring' : '📖 Explain Code'
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Results (Fixed Width) */}
        <div style={resultContainerStyle}>
          <div style={resultHeaderStyle}>
            {reviewType === 'review' && '🔍 Code Review Results'}
            {reviewType === 'refactor' && '🔧 Refactoring Suggestions'}
            {reviewType === 'explain' && '📖 Code Explanation'}
          </div>
          <div style={resultContentStyle}>
            {loading ? (
              <div style={emptyStateStyle}>
                <div className="loading-spinner" style={{ marginBottom: '1rem' }}></div>
                <p>Analyzing your code...</p>
              </div>
            ) : result ? (
              <MarkdownRenderer content={result} />
            ) : (
              <div style={emptyStateStyle}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💻</div>
                <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>Ready to analyze</h3>
                <p>Enter your code and select an analysis type to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewAgent;
