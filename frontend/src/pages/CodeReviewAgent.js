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

  const contentStyle = {
    display: 'flex',
    gap: '30px',
  };

  const formStyle = {
    flex: '0 0 45%',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const resultContainerStyle = {
    flex: '0 0 50%',
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

  const selectStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const textareaStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '300px',
    fontFamily: 'monospace',
    fontSize: '14px',
    resize: 'vertical',
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

  const resultStyle = {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    overflowY: 'auto',
    maxHeight: '600px',
    flex: 1,
  };

  const radioContainerStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '10px',
  };

  const radioGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Code Review Assistant</h1>
        <button style={secondaryButtonStyle} onClick={handleBack}>
          Back to Home
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <div style={contentStyle}>
        <div style={formStyle}>
          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>What would you like to do?</label>
              <div style={radioContainerStyle}>
                <div style={radioGroupStyle}>
                  <input
                    type="radio"
                    id="review"
                    name="reviewType"
                    value="review"
                    checked={reviewType === 'review'}
                    onChange={() => setReviewType('review')}
                  />
                  <label htmlFor="review">Code Review</label>
                </div>
                
                <div style={radioGroupStyle}>
                  <input
                    type="radio"
                    id="refactor"
                    name="reviewType"
                    value="refactor"
                    checked={reviewType === 'refactor'}
                    onChange={() => setReviewType('refactor')}
                  />
                  <label htmlFor="refactor">Refactoring Suggestion</label>
                </div>
                
                <div style={radioGroupStyle}>
                  <input
                    type="radio"
                    id="explain"
                    name="reviewType"
                    value="explain"
                    checked={reviewType === 'explain'}
                    onChange={() => setReviewType('explain')}
                  />
                  <label htmlFor="explain">Code Explanation</label>
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
                  style={{...selectStyle, width: '100%'}}
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
              <label style={labelStyle}>Enter Your Code</label>
              <textarea
                style={textareaStyle}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
              />
            </div>

            <button 
              type="submit" 
              style={buttonStyle}
              disabled={loading}
            >
              {loading ? 'Processing...' : reviewType === 'review' ? 'Review Code' : 
                reviewType === 'refactor' ? 'Suggest Refactoring' : 'Explain Code'}
            </button>
          </form>
        </div>

        <div style={resultContainerStyle}>
          <h2>Results</h2>
          <div style={resultStyle}>
            {loading ? (
              <div>Analyzing code...</div>
            ) : result ? (
              <MarkdownRenderer content={result} />
            ) : (
              <div>Submit your code to see results here.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewAgent;
