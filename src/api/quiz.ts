// Types
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'multiple-answer' | 'text';
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  timeLimit?: number; // in minutes
  visibility: 'public' | 'private';
  questions: Question[];
}

export interface QuizResult {
  quizId: string;
  quizTitle: string;
  date: string;
  answers: Record<string, any>;
  score: number;
  totalPoints: number;
  percentage: number;
}

export interface QuizSubmitResponse {
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: Record<string, any>;
  wrongAnswers: Record<string, any>;
}

// Sample data (can be moved to a separate mock file)
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics',
    subject: 'Programming',
    timeLimit: 10, // in minutes
    visibility: 'public',
    questions: [
      {
        id: '1-1',
        text: 'What type of language is JavaScript?',
        type: 'multiple-choice',
        options: [
          'Statically typed compiled language',
          'Dynamically typed interpreted language',
          'Markup language',
          'Database query language'
        ],
        correctAnswer: 'Dynamically typed interpreted language',
        points: 1
      },
      {
        id: '1-2',
        text: 'Which of the following are primitive data types in JavaScript?',
        type: 'multiple-answer',
        options: [
          'String',
          'Number',
          'Boolean',
          'undefined',
          'Object',
          'Array'
        ],
        correctAnswers: ['String', 'Number', 'Boolean', 'undefined'],
        points: 2
      },
      {
        id: '1-3',
        text: 'What does DOM stand for?',
        type: 'text',
        correctAnswer: 'Document Object Model',
        points: 1
      },
      {
        id: '1-4',
        text: 'Which method adds an element to the end of an array?',
        type: 'multiple-choice',
        options: [
          'push()',
          'pop()',
          'unshift()',
          'shift()'
        ],
        correctAnswer: 'push()',
        points: 1
      },
      {
        id: '1-5',
        text: 'What does the === operator do in JavaScript?',
        type: 'multiple-choice',
        options: [
          'Assigns a value to a variable',
          'Checks if values are equal (with type conversion)',
          'Checks if values are equal (without type conversion)',
          'Logical AND operation'
        ],
        correctAnswer: 'Checks if values are equal (without type conversion)',
        points: 1
      }
    ]
  },
  {
    id: '2',
    title: 'React Basics',
    description: 'Test your understanding of React fundamentals',
    subject: 'Web Development',
    timeLimit: 15,
    visibility: 'public',
    questions: [
      {
        id: '2-1',
        text: 'What is React?',
        type: 'multiple-choice',
        options: [
          'A programming language',
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A styling framework'
        ],
        correctAnswer: 'A JavaScript library for building user interfaces',
        points: 1
      },
      {
        id: '2-2',
        text: 'Which of the following are React hooks?',
        type: 'multiple-answer',
        options: [
          'useState',
          'useEffect',
          'useContext',
          'useLayout',
          'useQuery',
          'useReducer'
        ],
        correctAnswers: ['useState', 'useEffect', 'useContext', 'useReducer'],
        points: 2
      },
      {
        id: '2-3',
        text: 'What file extension is commonly used for React components?',
        type: 'text',
        correctAnswer: '.jsx',
        points: 1
      },
      {
        id: '2-4',
        text: 'What is the virtual DOM in React?',
        type: 'multiple-choice',
        options: [
          'A physical component in your computer',
          'A lightweight copy of the actual DOM',
          'A database of React components',
          'A JavaScript engine'
        ],
        correctAnswer: 'A lightweight copy of the actual DOM',
        points: 2
      }
    ]
  },
  {
    id: '3',
    title: 'CSS Mastery',
    description: 'Test your CSS knowledge and skills',
    subject: 'Web Development',
    timeLimit: 8,
    visibility: 'private',
    questions: [
      {
        id: '3-1',
        text: 'What does CSS stand for?',
        type: 'text',
        correctAnswer: 'Cascading Style Sheets',
        points: 1
      },
      {
        id: '3-2',
        text: 'Which CSS property is used to change the text color of an element?',
        type: 'multiple-choice',
        options: [
          'text-color',
          'font-color',
          'color',
          'text-style'
        ],
        correctAnswer: 'color',
        points: 1
      },
      {
        id: '3-3',
        text: 'Which of the following are valid CSS positioning values?',
        type: 'multiple-answer',
        options: [
          'static',
          'relative',
          'fixed',
          'absolute',
          'inherit',
          'centered'
        ],
        correctAnswers: ['static', 'relative', 'fixed', 'absolute', 'inherit'],
        points: 2
      }
    ]
  }
];

// Mock API implementation
const mockAPI = {
  // Simulate API calls with Promise-based responses
  get: async (url: string) => {
    if (url.startsWith('/quiz/random')) {
      const count = parseInt(url.split('=')[1]) || 10;
      
      // Get a random quiz and limit questions if needed
      const randomIndex = Math.floor(Math.random() * mockQuizzes.length);
      const quiz = { ...mockQuizzes[randomIndex] };
      
      // Limit questions if count is specified
      if (quiz.questions.length > count) {
        quiz.questions = quiz.questions.slice(0, count);
      }
      
      return { data: quiz };
    } 
    
    else if (url.match(/\/quiz\/\w+\/results/)) {
      const quizId = url.split('/')[2];
      return {
        data: {
          quizId,
          attempts: [
            {
              date: new Date().toISOString(),
              score: 75,
              totalPoints: 100,
              percentage: 75
            }
          ]
        }
      };
    } 
    
    else if (url === '/quiz/my-results') {
      return {
        data: [
          {
            quizId: '1',
            quizTitle: 'JavaScript Fundamentals',
            date: new Date().toISOString(),
            score: 4,
            totalPoints: 6,
            percentage: 67
          },
          {
            quizId: '2',
            quizTitle: 'React Basics',
            date: new Date(Date.now() - 86400000).toISOString(), // yesterday
            score: 5,
            totalPoints: 6,
            percentage: 83
          }
        ]
      };
    }
    
    throw new Error('URL not found');
  },
  
  post: async (url: string, data: any) => {
    if (url.match(/\/quiz\/\w+\/submit/)) {
      const quizId = url.split('/')[2];
      const quiz = mockQuizzes.find(q => q.id === quizId);
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      
      // Calculate score based on submitted answers
      const { answers } = data;
      let score = 0;
      let totalPoints = 0;
      const correctAnswers: Record<string, any> = {};
      const wrongAnswers: Record<string, any> = {};
      
      quiz.questions.forEach(question => {
        totalPoints += question.points;
        const userAnswer = answers[question.id];
        
        if (question.type === 'multiple-choice' || question.type === 'text') {
          if (userAnswer === question.correctAnswer) {
            score += question.points;
            correctAnswers[question.id] = userAnswer;
          } else {
            wrongAnswers[question.id] = {
              userAnswer,
              correctAnswer: question.correctAnswer
            };
          }
        } 
        else if (question.type === 'multiple-answer') {
          const userAnswerArray = userAnswer || [];
          const correctAnswerArray = question.correctAnswers || [];
          
          // Check if arrays have the same elements
          const isCorrect = 
            userAnswerArray.length === correctAnswerArray.length && 
            userAnswerArray.every((item:any) => correctAnswerArray.includes(item));
          
          if (isCorrect) {
            score += question.points;
            correctAnswers[question.id] = userAnswerArray;
          } else {
            wrongAnswers[question.id] = {
              userAnswer: userAnswerArray,
              correctAnswer: correctAnswerArray
            };
          }
        }
      });
      
      const percentage = Math.round((score / totalPoints) * 100);
      
      return {
        data: {
          quizId,
          score,
          totalPoints,
          percentage,
          correctAnswers,
          wrongAnswers
        }
      };
    }
    
    throw new Error('URL not found');
  }
};

// API functions
export const quizAPI = {
  getRandomQuiz: async (questionCount: number = 10) => {
    // For real implementation
    // const response = await api.get(`/quiz/random?count=${questionCount}`);
    
    // For mock implementation
    const response = await mockAPI.get(`/quiz/random?count=${questionCount}`);
    return response.data;
  },
  
  submitQuiz: async (quizId: string, answers: Record<string, any>) => {
    // For real implementation
    // const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    
    // For mock implementation
    const response = await mockAPI.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
  },
  
  getQuizResults: async (quizId: string) => {
    // For real implementation
    // const response = await api.get(`/quiz/${quizId}/results`);
    
    // For mock implementation
    const response = await mockAPI.get(`/quiz/${quizId}/results`);
    return response.data;
  },
  
  getStudentResults: async () => {
    // For real implementation
    // const response = await api.get('/quiz/my-results');
    
    // For mock implementation
    const response = await mockAPI.get('/quiz/my-results');
    return response.data;
  },
  
  // Additional API methods for teacher functions
  getAllQuizzes: async () => {
    // In a real implementation, this would be an API call
    return mockQuizzes;
  },
  
  getQuizById: async (quizId: string) => {
    const quiz = mockQuizzes.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return quiz;
  },
  
  createQuiz: async (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString()
    };
    
    // In a real implementation, this would update the server
    mockQuizzes.push(newQuiz);
    return newQuiz;
  },
  
  updateQuiz: async (quizId: string, quizData: Partial<Quiz>) => {
    const index = mockQuizzes.findIndex(q => q.id === quizId);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    
    // In a real implementation, this would update the server
    mockQuizzes[index] = {
      ...mockQuizzes[index],
      ...quizData
    };
    
    return mockQuizzes[index];
  },
  
  deleteQuiz: async (quizId: string) => {
    const index = mockQuizzes.findIndex(q => q.id === quizId);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    
    // In a real implementation, this would update the server
    mockQuizzes.splice(index, 1);
    
    return { success: true };
  }
};

export default quizAPI;