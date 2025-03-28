// ContentViewer.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentViewer from './ContentViewer';

describe('ContentViewer Component', () => {
  test('renders content correctly', () => {
    const mockContent = '# Test Title\n\nThis is a test paragraph.\n\n## Subtitle\n\n- List item 1\n- List item 2';
    
    render(<ContentViewer content={mockContent} />);
    
    const contentElement = screen.getByTestId('content-body');
    expect(contentElement).toBeInTheDocument();
    
    // Check that specific elements are present in the formatted content
    expect(contentElement.innerHTML).toContain('<h1>Test Title</h1>');
    expect(contentElement.innerHTML).toContain('<h2>Subtitle</h2>');
    expect(contentElement.innerHTML).toContain('<li>List item 1</li>');
    expect(contentElement.innerHTML).toContain('<li>List item 2</li>');
  });
  
  test('handles empty content gracefully', () => {
    render(<ContentViewer content="" />);
    
    const contentElement = screen.getByTestId('content-body');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement.innerHTML).toBe('');
  });
  
  test('renders markdown formatting correctly', () => {
    const mockContent = 'Normal text with **bold text** and more normal text.';
    
    render(<ContentViewer content={mockContent} />);
    
    const contentElement = screen.getByTestId('content-body');
    expect(contentElement.innerHTML).toContain('Normal text with <strong>bold text</strong> and more normal text.');
  });
});