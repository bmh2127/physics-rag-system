// PhysicsRagApp.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhysicsRagApp from './PhysicsRagApp';

// Mock the API module
jest.mock('../../services/api', () => ({
  searchPhysics: jest.fn(),
  learnTopic: jest.fn(),
  getPracticeProblems: jest.fn(),
  gradeAnswer: jest.fn()
}));

// Mock child components
jest.mock('../TopicNavigator/TopicNavigator', () => () => (
  <div data-testid="topic-navigator">TopicNavigator Component</div>
));

jest.mock('../ContentViewer/ContentViewer', () => () => (
  <div data-testid="content-viewer">ContentViewer Component</div>
));

jest.mock('../QuestionAnswering/QuestionAnswering', () => () => (
  <div data-testid="question-answering">QuestionAnswering Component</div>
));

jest.mock('../PracticeProblem/PracticeProblem', () => () => (
  <div data-testid="practice-problem">PracticeProblem Component</div>
));

describe('PhysicsRagApp Component', () => {
  test('renders app title', () => {
    render(<PhysicsRagApp />);
    
    expect(screen.getByText('Physics RAG Learning System')).toBeInTheDocument();
    expect(screen.getByText('Learn, Practice, and Test Your Physics Knowledge')).toBeInTheDocument();
  });
  
  test('renders topic navigator', () => {
    render(<PhysicsRagApp />);
    
    expect(screen.getByTestId('topic-navigator')).toBeInTheDocument();
  });
  
  test('renders empty state when no topic is selected', () => {
    render(<PhysicsRagApp />);
    
    expect(screen.getByText('Select a topic from the sidebar to begin learning')).toBeInTheDocument();
  });
});