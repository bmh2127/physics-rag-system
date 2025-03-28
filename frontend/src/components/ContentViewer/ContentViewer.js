// ContentViewer.js
import React from 'react';
import './ContentViewer.css';

const ContentViewer = ({ content }) => {
  // Function to format markdown content
  const formatMarkdown = (markdown) => {
    if (!markdown) return '';
    
    // Process the content step by step to ensure proper nesting
    let formatted = markdown;
    
    // Replace headings first
    formatted = formatted.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    
    // Then handle bold text
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle list items (make sure they don't get nested inside headings)
    formatted = formatted.replace(/^- (.*?)$/gm, '<li>$1</li>');
    
    // Replace newlines with <br /> tags last
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  return (
    <div className="content-viewer">
      <div 
        className="content-body"
        data-testid="content-body"
        dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
      />
    </div>
  );
};

export default ContentViewer;