// TopicNavigator.js
import React from 'react';
import './TopicNavigator.css';

const TopicNavigator = ({ topics, selectedTopic, onSelectTopic }) => {
  return (
    <div className="topic-navigator">
      <h2 className="topic-navigator-title">Physics Topics</h2>
      <div className="topic-list">
        {topics.map(topic => (
          <div 
            key={topic.id}
            className={`topic-item ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
            onClick={() => onSelectTopic(topic)}
          >
            <span className="topic-icon">{topic.icon}</span>
            <div className="topic-info">
              <span className="topic-title">{topic.title}</span>
              <span className="topic-description">{topic.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicNavigator;