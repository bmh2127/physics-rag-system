import React from 'react';
import { render, screen } from '@testing-library/react';
import PhysicsRagApp from './PhysicsRagApp';

// Mock the API service
jest.mock('../services/api', () => ({
  searchPhysics: jest.fn(),
  learnTopic: jest.fn(),
  getPracticeProblems: jest.fn(),
  gradeAnswer: jest.fn(),
}));

test('renders physics RAG application header', () => {
  render(<PhysicsRagApp />);
  const headerElement = screen.getByText(/Physics RAG Learning System/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders topics in the sidebar', () => {
  render(<PhysicsRagApp />);
  const classicalMechanicsElement = screen.getByText(/Classical Mechanics/i);
  expect(classicalMechanicsElement).toBeInTheDocument();
});

test('renders empty state message', () => {
  render(<PhysicsRagApp />);
  const emptyStateElement = screen.getByText(/Select a topic from the sidebar to begin learning/i);
  expect(emptyStateElement).toBeInTheDocument();
});