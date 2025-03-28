// api.js mock
export const searchPhysics = jest.fn().mockResolvedValue({
    query: "test query",
    answer: "This is a test answer"
  });
  
  export const learnTopic = jest.fn().mockResolvedValue({
    answer: "This is a topic-specific answer"
  });
  
  export const getPracticeProblems = jest.fn().mockResolvedValue({
    problems: [
      {
        id: "test-1",
        problem: "Test problem",
        answer: "Test answer",
        explanation: "Test explanation"
      }
    ]
  });
  
  export const gradeAnswer = jest.fn().mockResolvedValue({
    score: 85,
    correct: true,
    feedback: "Good job!",
    correct_solution: "The correct approach is..."
  });
  
  export default {
    searchPhysics,
    learnTopic,
    getPracticeProblems,
    gradeAnswer
  };