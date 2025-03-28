// PracticeProblem.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PracticeProblem from './PracticeProblem';

describe('PracticeProblem Component', () => {
  const mockProblem = {
    id: 'prob1',
    problem: 'What is the acceleration of a 2kg object with a force of 10N?',
    answer: '5 m/s²',
    explanation: 'Using F = ma, a = F/m = 10N/2kg = 5 m/s²'
  };
  
  const mockOnGrade = jest.fn();
  const mockOnNext = jest.fn();
  
  beforeEach(() => {
    mockOnGrade.mockReset();
    mockOnNext.mockReset();
    mockOnGrade.mockResolvedValue({
      score: 85,
      correct: true,
      feedback: 'Good job!',
      correct_solution: 'The correct approach is...'
    });
  });
  
  test('renders problem correctly', () => {
    render(
      <PracticeProblem 
        problem={mockProblem}
        onGrade={mockOnGrade}
        onNext={mockOnNext}
        problemNumber={1}
        totalProblems={3}
      />
    );
    
    expect(screen.getByText('Problem 1 of 3')).toBeInTheDocument();
    expect(screen.getByTestId('problem-text')).toHaveTextContent(mockProblem.problem);
    expect(screen.getByTestId('grade-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });
  
  test('updates answer state on input change', () => {
    render(
      <PracticeProblem 
        problem={mockProblem}
        onGrade={mockOnGrade}
        onNext={mockOnNext}
        problemNumber={1}
        totalProblems={3}
      />
    );
    
    const textarea = screen.getByTestId('answer-textarea');
    fireEvent.change(textarea, { target: { value: '5 m/s²' } });
    
    expect(textarea).toHaveValue('5 m/s²');
  });
  
  test('calls onGrade with correct parameters when grade button is clicked', async () => {
    render(
      <PracticeProblem 
        problem={mockProblem}
        onGrade={mockOnGrade}
        onNext={mockOnNext}
        problemNumber={1}
        totalProblems={3}
      />
    );
    
    const textarea = screen.getByTestId('answer-textarea');
    fireEvent.change(textarea, { target: { value: '5 m/s²' } });
    
    const gradeButton = screen.getByTestId('grade-button');
    fireEvent.click(gradeButton);
    
    expect(mockOnGrade).toHaveBeenCalledWith(mockProblem.problem, '5 m/s²');
    
    await waitFor(() => {
      expect(screen.getByTestId('feedback-container')).toBeInTheDocument();
      expect(screen.getByText('Good job!')).toBeInTheDocument();
    });
  });
  
  test('displays warning when trying to grade empty answer', async () => {
    render(
      <PracticeProblem 
        problem={mockProblem}
        onGrade={mockOnGrade}
        onNext={mockOnNext}
        problemNumber={1}
        totalProblems={3}
      />
    );
    
    const gradeButton = screen.getByTestId('grade-button');
    fireEvent.click(gradeButton);
    
    await waitFor(() => {
      const feedbackContainer = screen.getByTestId('feedback-container');
      expect(feedbackContainer).toHaveClass('warning');
      expect(screen.getByText('Please provide an answer to grade.')).toBeInTheDocument();
    });
    
    expect(mockOnGrade).not.toHaveBeenCalled();
  });
  
  test('calls onNext when next button is clicked', () => {
    render(
      <PracticeProblem 
        problem={mockProblem}
        onGrade={mockOnGrade}
        onNext={mockOnNext}
        problemNumber={1}
        totalProblems={3}
      />
    );
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});