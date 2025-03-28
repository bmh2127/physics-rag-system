// TopicNavigator.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopicNavigator from './TopicNavigator';

// Mock topics data
const mockTopics = [
  { id: 'topic1', title: 'Topic 1', icon: '🔄', description: 'Description 1' },
  { id: 'topic2', title: 'Topic 2', icon: '🔥', description: 'Description 2' }
];

describe('TopicNavigator Component', () => {
  test('renders topic list correctly', () => {
    render(
      <TopicNavigator 
        topics={mockTopics} 
        selectedTopic={null} 
        onSelectTopic={() => {}} 
      />
    );
    
    expect(screen.getByText('Physics Topics')).toBeInTheDocument();
    expect(screen.getByText('Topic 1')).toBeInTheDocument();
    expect(screen.getByText('Topic 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });
  
  test('calls onSelectTopic when a topic is clicked', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <TopicNavigator 
        topics={mockTopics} 
        selectedTopic={null} 
        onSelectTopic={mockOnSelect} 
      />
    );
    
    fireEvent.click(screen.getByTestId('topic-item-topic1'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockTopics[0]);
  });
  
  test('applies selected class to the selected topic', () => {
    render(
      <TopicNavigator 
        topics={mockTopics} 
        selectedTopic={mockTopics[0]} 
        onSelectTopic={() => {}} 
      />
    );
    
    const topicItem = screen.getByTestId('topic-item-topic1');
    expect(topicItem).toHaveClass('selected');
    
    const otherTopicItem = screen.getByTestId('topic-item-topic2');
    expect(otherTopicItem).not.toHaveClass('selected');
  });
});