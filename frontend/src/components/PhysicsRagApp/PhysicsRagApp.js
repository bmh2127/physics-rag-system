// PhysicsRagApp.js
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { learnTopic, getPracticeProblems, gradeAnswer } from '../../services/api';
import TopicNavigator from '../TopicNavigator/TopicNavigator';
import ContentViewer from '../ContentViewer/ContentViewer';
import QuestionAnswering from '../QuestionAnswering/QuestionAnswering';
import PracticeProblem from '../PracticeProblem/PracticeProblem';
import './PhysicsRagApp.css';

const PhysicsRagApp = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [mode, setMode] = useState('learn'); // 'learn', 'practice'
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [problemIndex, setProblemIndex] = useState(0);
  
  // Sample physics topics
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
  
  // Function to handle topic selection
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setMode('learn');
  };
  
  // Function to switch mode
  const handleSwitchMode = (newMode) => {
    setMode(newMode);
    
    if (newMode === 'practice' && selectedTopic && selectedTopic.id) {
      // Call API to get practice problems
      setLoading(true);
      getPracticeProblems(selectedTopic.id)
        .then(data => {
          setProblems(data.problems || []);
          if (data.problems && data.problems.length > 0) {
            setCurrentProblem(data.problems[0]);
            setProblemIndex(0);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching practice problems:', error);
          setLoading(false);
          // Initialize with empty problems to handle the error case
          setProblems([]);
          setCurrentProblem(null);
        });
    }
  };
  
  // Function to handle asking questions
  const handleAskQuestion = async (topicId, query) => {
    try {
      const response = await learnTopic(topicId, query);
      // Format the response properly for display
      return {
        message: response.answer || response.message || "I don't have specific information about that topic.",
        type: 'info',
        source: response.source || 'knowledge base'
      };
    } catch (error) {
      console.error('Error asking question:', error);
      return {
        message: 'Sorry, I was unable to answer that question. Please try again.',
        type: 'error'
      };
    }
  };
  
  // Function to handle grading answers
  const handleGradeAnswer = async (question, answer) => {
    try {
      const response = await gradeAnswer(question, answer);
      return response;
    } catch (error) {
      console.error('Error grading answer:', error);
      throw error;
    }
  };
  
  // Function to handle next problem
  const handleNextProblem = () => {
    if (!problems.length) return;
    
    const nextIndex = (problemIndex + 1) % problems.length;
    setProblemIndex(nextIndex);
    setCurrentProblem(problems[nextIndex]);
  };
  
  return (
    <div className="physics-rag-app" data-testid="physics-rag-app">
      <header className="app-header">
        <h1 className="app-title">Physics RAG Learning System</h1>
        <p className="app-subtitle">Learn, Practice, and Test Your Physics Knowledge</p>
      </header>
      
      <div className="app-main">
        <aside className="app-sidebar">
          <TopicNavigator 
            topics={topics}
            selectedTopic={selectedTopic}
            onSelectTopic={handleSelectTopic}
          />
        </aside>
        
        <main className="app-content">
          {selectedTopic ? (
            <div className="topic-container">
              <div className="topic-header">
                <h2 className="topic-title">
                  {selectedTopic.icon} {selectedTopic.title}
                </h2>
                <div className="mode-tabs">
                  <button 
                    className={`mode-tab ${mode === 'learn' ? 'active' : ''}`}
                    onClick={() => handleSwitchMode('learn')}
                  >
                    Learn
                  </button>
                  <button 
                    className={`mode-tab ${mode === 'practice' ? 'active' : ''}`}
                    onClick={() => handleSwitchMode('practice')}
                  >
                    Practice
                  </button>
                </div>
              </div>
              
              {mode === 'learn' && (
                <div className="learn-mode">
                  <ContentViewer content={topicContent[selectedTopic.id]} />
                  <QuestionAnswering 
                    onAskQuestion={handleAskQuestion}
                    selectedTopic={selectedTopic}
                  />
                </div>
              )}
              
              {mode === 'practice' && (
                <div className="practice-mode">
                  {loading ? (
                    <div className="loading-state">Loading practice problems...</div>
                  ) : currentProblem ? (
                    <PracticeProblem 
                      problem={currentProblem}
                      onGrade={handleGradeAnswer}
                      onNext={handleNextProblem}
                      problemNumber={problemIndex + 1}
                      totalProblems={problems.length}
                    />
                  ) : (
                    <div className="empty-state">
                      <p>No practice problems available for this topic.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={48} className="empty-icon" />
              <p>Select a topic from the sidebar to begin learning</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PhysicsRagApp;