// QuestionAnswering.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionAnswering from './QuestionAnswering';

describe('QuestionAnswering Component', () => {
  const mockTopic = { id: 'topic1', title: 'Topic 1' };
  const mockOnAskQuestion = jest.fn();
  
  beforeEach(() => {
    mockOnAskQuestion.mockReset();
    mockOnAskQuestion.mockResolvedValue({
      message: 'This is an answer',
      type: 'info'
    });
  });
  
  test('renders component correctly', () => {
    render(
      <QuestionAnswering 
        onAskQuestion={mockOnAskQuestion}
        selectedTopic={mockTopic}
      />
    );
    
    expect(screen.getByText('Ask a Question')).toBeInTheDocument();
    expect(screen.getByTestId('question-input')).toBeInTheDocument();
    expect(screen.getByTestId('ask-button')).toBeInTheDocument();
  });
  
  test('input placeholder shows selected topic', () => {
    render(
      <QuestionAnswering 
        onAskQuestion={mockOnAskQuestion}
        selectedTopic={mockTopic}
      />
    );
    
    const input = screen.getByTestId('question-input');
    expect(input.placeholder).toContain('Topic 1');
  });
  
  test('calls onAskQuestion when the ask button is clicked', async () => {
    render(
      <QuestionAnswering 
        onAskQuestion={mockOnAskQuestion}
        selectedTopic={mockTopic}
      />
    );
    
    const input = screen.getByTestId('question-input');
    fireEvent.change(input, { target: { value: 'What is gravity?' } });
    
    const button = screen.getByTestId('ask-button');
    fireEvent.click(button);
    
    expect(mockOnAskQuestion).toHaveBeenCalledWith('topic1', 'What is gravity?');
    
    await waitFor(() => {
      expect(screen.getByTestId('answer-container')).toBeInTheDocument();
      expect(screen.getByText('This is an answer')).toBeInTheDocument();
    });
  });
  
  test('displays error when onAskQuestion fails', async () => {
    mockOnAskQuestion.mockRejectedValue(new Error('Failed'));
    
    render(
      <QuestionAnswering 
        onAskQuestion={mockOnAskQuestion}
        selectedTopic={mockTopic}
      />
    );
    
    const input = screen.getByTestId('question-input');
    fireEvent.change(input, { target: { value: 'What is gravity?' } });
    
    const button = screen.getByTestId('ask-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      const answerContainer = screen.getByTestId('answer-container');
      expect(answerContainer).toHaveClass('error');
      expect(screen.getByText('Failed to get an answer. Please try again.')).toBeInTheDocument();
    });
  });
});