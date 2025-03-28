// ContentViewer.js
import React from 'react';
import './ContentViewer.css';

const ContentViewer = ({ content }) => {
  // Function to format markdown content
  const formatMarkdown = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      .replace(/\n/g, '<br />')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*?)$/gm, '<li>$1</li>');
  };

  return (
    <div className="content-viewer">
      <div 
        className="content-body"
        dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
      />
    </div>
  );
};

export default ContentViewer;