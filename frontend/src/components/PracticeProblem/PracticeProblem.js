// PracticeProblem.js
import React, { useState } from 'react';
import { Award, ArrowRight, RotateCcw } from 'lucide-react';
import './PracticeProblem.css';

const PracticeProblem = ({ problem, onGrade, onNext, problemNumber, totalProblems }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGrade = async () => {
    if (!answer.trim()) {
      setFeedback({
        message: 'Please provide an answer to grade.',
        type: 'warning'
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await onGrade(problem.problem, answer);
      setFeedback(result);
    } catch (error) {
      setFeedback({
        message: 'Failed to grade your answer. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="practice-problem" data-testid="practice-problem">
      <div className="problem-header">
        <h3 className="problem-number">Problem {problemNumber} of {totalProblems}</h3>
      </div>
      
      <div className="problem-content">
        <p className="problem-text" data-testid="problem-text">{problem.problem}</p>
      </div>
      
      <div className="answer-section">
        <label className="answer-label">Your Answer:</label>
        <textarea
          className="answer-textarea"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer here..."
          data-testid="answer-textarea"
        />
      </div>
      
      <div className="problem-actions">
        <button 
          className="grade-button"
          onClick={handleGrade}
          disabled={loading}
          data-testid="grade-button"
        >
          {loading ? <RotateCcw className="loading-icon" size={18} /> : <Award size={18} />}
          Grade My Answer
        </button>
        <button 
          className="next-button"
          onClick={onNext}
          data-testid="next-button"
        >
          Next Problem <ArrowRight size={16} />
        </button>
      </div>
      
      {feedback && (
        <div 
          className={`feedback-container ${feedback.type || 'info'}`}
          data-testid="feedback-container"
        >
          {feedback.score !== undefined && (
            <div className="score-display">
              <strong>Score:</strong> {feedback.score}/100
            </div>
          )}
          <p className="feedback-text">{feedback.message || feedback.feedback}</p>
          {feedback.correct_solution && (
            <div className="solution-section">
              <strong>Correct Solution:</strong>
              <p>{feedback.correct_solution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeProblem;