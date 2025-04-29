import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number; // in minutes
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  
  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        // In real implementation, replace with actual API call
        // const response = await fetch(`/api/quizzes/${quizId}`);
        // const data = await response.json();
        
        // Mock data for development
        const mockQuiz: Quiz = {
          id: quizId || 'mock-quiz',
          title: 'Sample Quiz',
          questions: [
            {
              id: 'q1',
              text: 'What is the capital of France?',
              options: ['London', 'Berlin', 'Paris', 'Madrid'],
              correctAnswer: 'Paris'
            },
            {
              id: 'q2',
              text: 'Which programming language is this app built with?',
              options: ['JavaScript', 'TypeScript', 'Python', 'Java'],
              correctAnswer: 'TypeScript'
            },
            {
              id: 'q3',
              text: 'What does HTML stand for?',
              options: [
                'Hyper Text Markup Language',
                'High Tech Multi Language',
                'Hyper Transfer Markup Language',
                'Hyper Text Modern Language'
              ],
              correctAnswer: 'Hyper Text Markup Language'
            }
          ],
          timeLimit: 10
        };
        
        setQuiz(mockQuiz);
        setTimeRemaining(mockQuiz.timeLimit * 60); // Convert minutes to seconds
      } catch (err) {
        setError('Failed to load quiz. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId]);
  
  // Timer countdown
  useEffect(() => {
    if (!quiz || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quiz, timeRemaining]);
  
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    // Calculate results
    if (!quiz) return;
    
    const results = {
      quizId: quiz.id,
      studentAnswers: answers,
      timeSpent: (quiz.timeLimit * 60) - timeRemaining,
      submittedAt: new Date().toISOString()
    };
    
    // In a real app, you would submit results to an API
    console.log('Quiz submitted:', results);
    
    // Navigate to results page
    navigate(`/results/${quiz.id}`, { state: { results } });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }
  
  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error || 'Quiz not found'}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const formattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const questionProgress = `${currentQuestionIndex + 1}/${quiz.questions.length}`;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="flex items-center">
            <div className="bg-blue-100 px-4 py-2 rounded-md">
              <span className="font-medium">Time Left: </span>
              <span className={`font-bold ${timeRemaining < 60 ? 'text-red-600' : ''}`}>
                {formattedTime()}
              </span>
            </div>
            <div className="ml-4 bg-gray-100 px-4 py-2 rounded-md">
              <span>Question {questionProgress}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-8 bg-gray-50 p-6 rounded-md">
          <h2 className="text-xl font-medium mb-4">
            {currentQuestion.text}
          </h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                  className="mr-3 h-5 w-5"
                />
                <label htmlFor={`option-${index}`} className="text-lg">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded ${
              currentQuestionIndex === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gray-500 text-white hover:bg-gray-600'
            }`}
          >
            Previous
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;