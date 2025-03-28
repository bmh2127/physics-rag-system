import React, { useState, useEffect } from 'react';
import { Search, Book, CheckSquare, RotateCcw, ArrowRight, BookOpen, Lightbulb, Award } from 'lucide-react';
import { searchPhysics, learnTopic, getPracticeProblems, gradeAnswer } from '../services/api';
import './PhysicsRagApp.css';

const PhysicsRagApp = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState('learn'); // 'learn', 'practice', 'grade'
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [problemIndex, setProblemIndex] = useState(0);
  
  // Sample physics topics for demonstration
  const topics = [
    { id: 'classical_mechanics', title: 'Classical Mechanics', icon: '🔄', description: 'Study of motion and forces' },
    { id: 'thermodynamics', title: 'Thermodynamics', icon: '🔥', description: 'Heat, energy, and work' },
    { id: 'electromagnetism', title: 'Electromagnetism', icon: '⚡', description: 'Electricity and magnetism' },
    { id: 'quantum_mechanics', title: 'Quantum Mechanics', icon: '🌀', description: 'Subatomic particles and waves' },
    { id: 'relativity', title: 'Relativity', icon: '🚀', description: 'Space, time, and gravity' }
  ];
  
  // Sample topic content (would be replaced with API calls to our backend)
  const topicContent = {
    'classical_mechanics': `
# Classical Mechanics

Classical mechanics is the study of the motion of bodies under the influence of forces. It was first formalized by Sir Isaac Newton with his three laws of motion:

## Newton's Laws of Motion

1. **First Law (Law of Inertia)**: An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.

2. **Second Law**: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. (F = ma)

3. **Third Law**: For every action, there is an equal and opposite reaction.

## Conservation Laws

- **Conservation of Energy**: Energy cannot be created or destroyed, only transformed from one form to another.
- **Conservation of Momentum**: The total momentum of an isolated system remains constant.
- **Conservation of Angular Momentum**: The total angular momentum of a system remains constant if no external torque acts on it.
    `,
    'thermodynamics': `
# Thermodynamics

Thermodynamics is the branch of physics that deals with heat, work, and temperature, and their relation to energy, radiation, and physical properties of matter.

## Laws of Thermodynamics

0. **Zeroth Law**: If two systems are each in thermal equilibrium with a third system, they are in thermal equilibrium with each other.

1. **First Law (Conservation of Energy)**: Energy cannot be created or destroyed, only transformed from one form to another.

2. **Second Law**: The entropy of an isolated system always increases over time.

3. **Third Law**: As a system approaches absolute zero temperature, its entropy approaches a minimum value.
    `,
    'electromagnetism': `
# Electromagnetism

Electromagnetism is the physics of the electromagnetic field: a field that exerts force on particles with electric charge and is, in turn, affected by the presence and motion of such particles.

## Electric Fields and Forces

- **Coulomb's Law**: F = k|q₁q₂|/r²
- **Electric Field**: E = F/q
- **Gauss's Law**: ∮E·dA = Q/ε₀

## Magnetic Fields and Forces

- **Magnetic Force on a Moving Charge**: F = qv×B
- **Biot-Savart Law**: dB = (μ₀/4π) × (Idl×r̂)/r²
- **Ampere's Law**: ∮B·dl = μ₀I
    `,
    'quantum_mechanics': `
# Quantum Mechanics

Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.

## Key Concepts

- **Wave-Particle Duality**: Quantum entities exhibit both wave-like and particle-like properties.
- **Quantum Superposition**: Quantum systems can exist in multiple states simultaneously.
- **Quantum Entanglement**: Quantum systems can become correlated in ways that classical correlations cannot explain.
- **Uncertainty Principle**: Certain pairs of physical properties cannot be precisely measured simultaneously.
    `,
    'relativity': `
# Relativity

Einstein's theory of relativity consists of two physical theories: special relativity and general relativity.

## Special Relativity

- **Principle of Relativity**: The laws of physics are the same in all inertial reference frames.
- **Speed of Light**: The speed of light in a vacuum is the same for all observers, regardless of their relative motion or the motion of the light source.
- **Time Dilation**: Moving clocks run slower relative to stationary observers.
- **Length Contraction**: Objects are measured to be shorter in the direction of motion.
    `
  };
  
  // Function to handle search
  const handleSearch = () => {
    setLoading(true);
    // Simulate API call to search
    setTimeout(() => {
      const filteredTopics = topics.filter(topic => 
        topic.title.toLowerCase().includes(query.toLowerCase()) ||
        topic.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredTopics);
      setLoading(false);
    }, 500);
  };
  
  // Function to handle topic selection
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setMode('learn');
    setFeedback(null);
    setUserAnswer('');
    setCurrentProblem(null);
  };
  
  // Function to switch mode
  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    setFeedback(null);
    
    if (newMode === 'practice' && selectedTopic) {
      // Call API to get practice problems
      setLoading(true);
      getPracticeProblems(selectedTopic.id)
        .then(data => {
          setProblems(data.problems);
          if (data.problems && data.problems.length > 0) {
            setCurrentProblem(data.problems[0]);
            setProblemIndex(0);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching practice problems:', error);
          setLoading(false);
          setFeedback({
            message: 'Failed to load practice problems. Please try again.',
            type: 'error'
          });
        });
    }
  };
  
  // Function to grade a student's answer
  const handleGradeAnswer = () => {
    if (!currentProblem || !userAnswer.trim()) {
      setFeedback({
        message: 'Please provide an answer to grade.',
        type: 'warning'
      });
      return;
    }
    
    setLoading(true);
    gradeAnswer(currentProblem.problem, userAnswer)
      .then(data => {
        setFeedback({
          score: data.score,
          correct: data.correct,
          message: data.feedback,
          type: data.correct ? 'success' : 'error'
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error grading answer:', error);
        setLoading(false);
        setFeedback({
          message: 'Failed to grade your answer. Please try again.',
          type: 'error'
        });
      });
  };
  
  // Function to handle next problem
  const handleNextProblem = () => {
    if (!problems.length) return;
    
    const nextIndex = (problemIndex + 1) % problems.length;
    setProblemIndex(nextIndex);
    setCurrentProblem(problems[nextIndex]);
    setUserAnswer('');
    setFeedback(null);
  };
  
  // Function to handle answer change
  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
  };
  
  // Function to ask a question about the current topic
  const handleAskQuestion = () => {
    if (!query.trim() || !selectedTopic) return;
    
    setLoading(true);
    learnTopic(selectedTopic.id, query)
      .then(data => {
        setFeedback({
          message: data.answer,
          type: 'info'
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error asking question:', error);
        setLoading(false);
        setFeedback({
          message: 'Failed to get an answer. Please try again.',
          type: 'error'
        });
      });
  };
  
  // Function to format markdown content
  const formatMarkdown = (markdown) => {
    return markdown
      .replace(/\n/g, '<br />')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*?)$/gm, '<li>$1</li>');
  };
  
  return (
    <div className="app-container">
      <header className="header">
        <h1>Physics RAG Learning System</h1>
        <p>Learn, Practice, and Test Your Physics Knowledge</p>
      </header>
      
      <div className="main-content">
        {/* Left sidebar for topics */}
        <div className="sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search topics..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="search-button" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <RotateCcw className="loading" size={20} /> : <Search size={20} />}
            </button>
          </div>
          
          <div className="topic-list">
            <h2>Topics</h2>
            {(results.length > 0 ? results : topics).map(topic => (
              <div 
                key={topic.id} 
                className={`topic-item ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
                onClick={() => handleSelectTopic(topic)}
              >
                <span className="topic-icon">{topic.icon}</span>
                <span>{topic.title}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="content-area">
          {selectedTopic ? (
            <div className="topic-container">
              <div className="topic-header">
                <h2 className="topic-title">
                  {selectedTopic.icon} {selectedTopic.title}
                </h2>
                <div className="mode-buttons">
                  <button 
                    className={`mode-button ${mode === 'learn' ? 'active' : ''}`}
                    onClick={() => handleSwitchMode('learn')}
                  >
                    <Book size={16} className="mode-button-icon" /> Learn
                  </button>
                  <button 
                    className={`mode-button ${mode === 'practice' ? 'active' : ''}`}
                    onClick={() => handleSwitchMode('practice')}
                  >
                    <CheckSquare size={16} className="mode-button-icon" /> Practice
                  </button>
                </div>
              </div>
              
              {mode === 'learn' && (
                <div className="learn-mode">
                  <div className="topic-content">
                    <div dangerouslySetInnerHTML={{ 
                      __html: formatMarkdown(topicContent[selectedTopic.id])
                    }} />
                  </div>
                  
                  <div className="question-section">
                    <h3>Ask a Question</h3>
                    <div className="question-input">
                      <input
                        type="text"
                        placeholder="Enter your question about this topic..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                      />
                      <button 
                        className="question-button"
                        onClick={handleAskQuestion}
                        disabled={loading}
                      >
                        {loading ? <RotateCcw className="loading" size={18} /> : <Lightbulb size={18} className="mode-button-icon" />}
                        Ask
                      </button>
                    </div>
                    
                    {feedback && (
                      <div className={`feedback ${feedback.type}`}>
                        <p>{feedback.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {mode === 'practice' && currentProblem && (
                <div className="practice-mode">
                  <div className="problem">
                    <h3>Problem {problemIndex + 1} of {problems.length}:</h3>
                    <p>{currentProblem.problem}</p>
                  </div>
                  
                  <div className="answer-area">
                    <label>Your Answer:</label>
                    <textarea
                      className="answer-textarea"
                      rows={4}
                      value={userAnswer}
                      onChange={handleAnswerChange}
                      placeholder="Enter your answer here..."
                    />
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      className="grade-button"
                      onClick={handleGradeAnswer}
                      disabled={loading}
                    >
                      {loading ? <RotateCcw className="loading" size={18} /> : <Award size={18} className="mode-button-icon" />}
                      Grade My Answer
                    </button>
                    <button 
                      className="next-button"
                      onClick={handleNextProblem}
                    >
                      Next Problem <ArrowRight size={16} className="mode-button-icon" />
                    </button>
                  </div>
                  
                  {feedback && (
                    <div className={`feedback ${feedback.type}`}>
                      {feedback.score !== undefined && (
                        <div className="score">
                          <strong>Score:</strong> {feedback.score}/100
                        </div>
                      )}
                      <p>{feedback.message}</p>
                    </div>
                  )}
                </div>
              )}
              
              {mode === 'practice' && (!currentProblem || problems.length === 0) && !loading && (
                <div className="empty-state">
                  <CheckSquare size={48} className="empty-icon" />
                  <p>No practice problems available for this topic.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={48} className="empty-icon" />
              <p>Select a topic from the sidebar to begin learning</p>
            </div>
          )}
          
          {loading && !feedback && (
            <div className="loading-overlay">
              <RotateCcw size={32} className="loading" />
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhysicsRagApp;