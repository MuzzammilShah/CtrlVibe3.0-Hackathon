/**
 * Utility functions for converting markdown to HTML
 */

/**
 * Convert markdown text to HTML
 * @param {string} markdown - The markdown text to convert
 * @returns {string} - HTML string
 */
export const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown
    // Handle code blocks first (triple backticks)
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    
    // Handle inline code (single backticks)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Handle bold text (**text** or __text__)
    .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/__([^_]+)__/g, '<strong>$1</strong>')
    
    // Handle italic text (*text* or _text_)
    .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    
    // Handle headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Handle unordered lists (-, *, +)
    .replace(/^\s*[-\*\+]\s+(.*)$/gm, '<li>$1</li>')
    
    // Handle ordered lists (1., 2., etc.)
    .replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')
    
    // Handle line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap consecutive <li> elements in <ul> tags
  html = html.replace(/(<li>.*<\/li>)(?:\s*<br>\s*<li>.*<\/li>)*/g, (match) => {
    // Remove <br> tags between list items
    const cleanMatch = match.replace(/<br>\s*/g, '');
    return `<ul>${cleanMatch}</ul>`;
  });
  
  // Wrap in paragraph tags if not already wrapped
  if (!html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>') && 
      !html.includes('<ul>') && !html.includes('<ol>') && !html.includes('<pre>')) {
    html = `<p>${html}</p>`;
  }
  
  return html;
};

/**
 * React component to render markdown as HTML
 * @param {Object} props - Component props
 * @param {string} props.content - Markdown content to render
 * @param {Object} props.style - Additional styles to apply
 * @returns {JSX.Element}
 */
export const MarkdownRenderer = ({ content, style = {} }) => {
  const html = markdownToHtml(content);
  
  const defaultStyle = {
    lineHeight: '1.6',
    ...style
  };
  
  // Additional CSS for proper markdown styling
  const markdownStyles = `
    <style>
      .markdown-content h1, .markdown-content h2, .markdown-content h3 {
        margin: 16px 0 8px 0;
        color: #333;
      }
      .markdown-content h1 { font-size: 1.5em; font-weight: bold; }
      .markdown-content h2 { font-size: 1.3em; font-weight: bold; }
      .markdown-content h3 { font-size: 1.1em; font-weight: bold; }
      .markdown-content p { margin-bottom: 12px; }
      .markdown-content ul, .markdown-content ol { 
        margin: 12px 0; 
        padding-left: 20px; 
      }
      .markdown-content li { margin-bottom: 4px; }
      .markdown-content strong { font-weight: bold; color: #333; }
      .markdown-content em { font-style: italic; }
      .markdown-content code {
        background-color: #f5f5f5;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }
      .markdown-content pre {
        background-color: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow-x: auto;
        margin: 12px 0;
      }
      .markdown-content pre code {
        background: none;
        padding: 0;
      }
    </style>
  `;
  
  return (
    <div 
      style={defaultStyle}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: markdownStyles + html }}
    />
  );
};
