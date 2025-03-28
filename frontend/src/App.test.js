import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the PhysicsRagApp component to simplify testing
jest.mock('./components/PhysicsRagApp', () => () => <div>Physics RAG App</div>);

test('renders Physics RAG App', () => {
  render(<App />);
  const appElement = screen.getByText(/Physics RAG App/i);
  expect(appElement).toBeInTheDocument();
});