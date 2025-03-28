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
        />
        <button 
          className="ask-button"
          onClick={handleAskQuestion}
          disabled={loading}
        >
          {loading ? <RotateCcw className="loading-icon" size={18} /> : <Lightbulb size={18} />}
          Ask
        </button>
      </div>
      
      {answer && (
        <div className={`answer-container ${answer.type || 'info'}`}>
          <p className="answer-text">{answer.message}</p>
          {answer.source && <p className="answer-source">Source: {answer.source}</p>}
        </div>
      )}
    </div>
  );
};

export default QuestionAnswering;