// QuestionAnswering.js
import React, { useState } from 'react';
import { Lightbulb, RotateCcw } from 'lucide-react';
import './QuestionAnswering.css';

const QuestionAnswering = ({ onAskQuestion, selectedTopic }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);

  const handleAskQuestion = async () => {
    if (!query.trim() || !selectedTopic) return;
    
    setLoading(true);
    try {
      const result = await onAskQuestion(selectedTopic.id, query);
      setAnswer(result);
      // Reset the query field after asking
      setQuery('');
    } catch (error) {
      setAnswer({
        message: 'Failed to get an answer. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-answering">
      <h3 className="question-title">Ask a Question</h3>
      <div className="question-input-container">
        <input
          type="text"
          className="question-input"
          placeholder={`Ask anything about ${selectedTopic?.title || 'physics'}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
          data-testid="question-input"
        />
        <button 
          className="ask-button"
          onClick={handleAskQuestion}
          disabled={loading}
          data-testid="ask-button"
        >
          {loading ? <RotateCcw data-testid="loading-icon" className="loading-icon" size={18} /> : <Lightbulb data-testid="lightbulb-icon" size={18} />}
          Ask
        </button>
      </div>
      
      {answer && (
        <div 
          className={`answer-container ${answer.type || 'info'}`}
          data-testid="answer-container"
        >
          <p className="answer-text">{answer.message}</p>
          {answer.source && <p className="answer-source">Source: {answer.source}</p>}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswering;