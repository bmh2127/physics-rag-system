import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchPhysics = async (query) => {
  try {
    const response = await api.post('/search', { query });
    return response.data;
  } catch (error) {
    console.error('Error searching physics:', error);
    throw error;
  }
};

export const learnTopic = async (topic, query) => {
  try {
    const response = await api.post(`/learn/${topic}`, { query });
    return response.data;
  } catch (error) {
    console.error(`Error learning topic ${topic}:`, error);
    throw error;
  }
};

export const getPracticeProblems = async (topic, difficulty = 'medium') => {
  try {
    const response = await api.post('/practice', { topic, difficulty });
    return response.data;
  } catch (error) {
    console.error('Error getting practice problems:', error);
    throw error;
  }
};

export const gradeAnswer = async (question, studentAnswer, referenceAnswer = null) => {
  try {
    const response = await api.post('/grade', {
      question,
      student_answer: studentAnswer,
      reference_answer: referenceAnswer,
    });
    return response.data;
  } catch (error) {
    console.error('Error grading answer:', error);
    throw error;
  }
};

export default api;