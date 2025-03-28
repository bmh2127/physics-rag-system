// api.js - Using ES module imports
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Search for physics information across all topics
const searchPhysics = async (query) => {
  try {
    const response = await api.post('/search', { query });
    return response.data;
  } catch (error) {
    console.error('Error searching physics:', error);
    throw error;
  }
};

// Learn specific topic with a question
const learnTopic = async (topic, query) => {
  try {
    const response = await api.post(`/learn/${topic}`, { query });
    return response.data;
  } catch (error) {
    console.error(`Error learning topic ${topic}:`, error);
    
    // Fallback for demo purposes when backend is not available
    let answer = "I don't have specific information about that.";
    
    // Simple keyword matching for demo purposes
    if (query.toLowerCase().includes('newton')) {
      answer = "Newton's laws of motion are three fundamental laws that describe the relationship between an object and the forces acting on it. The First Law states that an object will remain at rest or in uniform motion unless acted upon by a force. The Second Law states that force equals mass times acceleration (F=ma). The Third Law states that for every action, there is an equal and opposite reaction.";
    } else if (query.toLowerCase().includes('energy')) {
      answer = "Energy is the capacity to do work or produce heat. In physics, the law of conservation of energy states that energy cannot be created or destroyed, only transformed from one form to another.";
    } else if (query.toLowerCase().includes('gravity')) {
      answer = "Gravity is a fundamental force that attracts objects with mass toward each other. On Earth, gravity gives weight to physical objects, and the Moon's gravity causes the ocean tides.";
    }
    
    return {
      answer: answer,
      source: 'knowledge base'
    };
  }
};

// Get practice problems for a specific topic
const getPracticeProblems = async (topic, difficulty = 'medium') => {
  try {
    const response = await api.post('/practice', { topic, difficulty });
    return response.data;
  } catch (error) {
    console.error('Error getting practice problems:', error);
    
    // Fallback for demo purposes when backend is not available
    return {
      problems: [
        {
          id: `${topic}-1`,
          problem: 'What is the acceleration of a 2kg object with a force of 10N?',
          answer: '5 m/s²',
          explanation: 'Using F = ma, a = F/m = 10N/2kg = 5 m/s²'
        },
        {
          id: `${topic}-2`,
          problem: 'A ball is thrown upward with an initial velocity of 20 m/s. How high will it go? (Assume g = 10 m/s²)',
          answer: '20 m',
          explanation: 'Using v² = v₀² + 2a(x-x₀) where v = 0 at the highest point, we get 0 = 400 + 2(-10)h, so h = 20 m'
        }
      ]
    };
  }
};

// Grade a student's answer to a physics problem
const gradeAnswer = async (question, studentAnswer, referenceAnswer = null) => {
  try {
    const response = await api.post('/grade', {
      question,
      student_answer: studentAnswer,
      reference_answer: referenceAnswer,
    });
    return response.data;
  } catch (error) {
    console.error('Error grading answer:', error);
    
    // Fallback for demo purposes when backend is not available
    const isCorrect = studentAnswer.toLowerCase().includes('5') || 
                      studentAnswer.toLowerCase().includes('20') ||
                      studentAnswer.toLowerCase().includes('newton');
    
    return {
      score: isCorrect ? 90 : 30,
      correct: isCorrect,
      feedback: isCorrect ? 
        'Good job! Your answer is correct.' : 
        'Not quite right. Check your calculations and try again.',
      correct_solution: 'The solution involves identifying the correct formula and applying it to the problem.'
    };
  }
};

export {
  searchPhysics,
  learnTopic,
  getPracticeProblems,
  gradeAnswer,
  api
};