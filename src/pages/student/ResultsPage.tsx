import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

interface QuizResult {
  quizId: string;
  studentAnswers: Record<string, string>;
  timeSpent: number;
  submittedAt: string;
  score?: number;
  totalQuestions?: number;
}

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
}

const ResultsPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<QuizResult | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if results were passed via location state
        if (location.state?.results) {
          setResults(location.state.results);
        } else {
          // In real implementation, fetch results from an API
          // const resultsResponse = await fetch(`/api/results/${quizId}`);
          // const resultsData = await resultsResponse.json();
          // setResults(resultsData);
          
          // Mock data for development
          setResults({
            quizId: quizId || 'mock-quiz',
            studentAnswers: {
              'q1': 'Paris', 
              'q2': 'TypeScript',
              'q3': 'Hyper Text Markup Language'
            },
            timeSpent: 420, // 7 minutes
            submittedAt: new Date().toISOString(),
            score: 3,
            totalQuestions: 3
          });
        }
        
        // Fetch quiz data to show questions and correct answers
        // In real implementation, replace with actual API call
        // const quizResponse = await fetch(`/api/quizzes/${quizId}`);
        // const quizData = await quizResponse.json();
        
        // Mock quiz data
        setQuiz({
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
          ]
        });
      } catch (err) {
        setError('Failed to load results. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [quizId, location]);
  
  // Calculate score if not provided
  useEffect(() => {
    if (results && quiz && results.score === undefined) {
      let correctAnswers = 0;
      
      quiz.questions.forEach(question => {
        if (results.studentAnswers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      setResults(prev => {
        if (!prev) return null;
        return {
          ...prev,
          score: correctAnswers,
          totalQuestions: quiz.questions.length
        };
      });
    }
  }, [results, quiz]);
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const getGradeColor = (score: number, total: number): string => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading results...</p>
        </div>
      </div>
    );
  }
  
  if (error || !results || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error || 'Results not found'}</p>
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
  
  const { score = 0, totalQuestions = 0 } = results;
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title} - Results</h1>
          <p className="text-gray-600">
            Submitted on {new Date(results.submittedAt).toLocaleDateString()} at {new Date(results.submittedAt).toLocaleTimeString()}
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row justify-around items-center text-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-medium text-gray-700">Score</h2>
              <p className={`text-4xl font-bold ${getGradeColor(score, totalQuestions)}`}>
                {score}/{totalQuestions} ({scorePercentage}%)
              </p>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-medium text-gray-700">Time Spent</h2>
              <p className="text-4xl font-bold text-blue-600">
                {formatTime(results.timeSpent)}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-medium text-gray-700">Result</h2>
              <p className={`text-4xl font-bold ${scorePercentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                {scorePercentage >= 60 ? 'PASS' : 'FAIL'}
              </p>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Answers Review</h2>
        
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const studentAnswer = results.studentAnswers[question.id] || 'Not answered';
            const isCorrect = studentAnswer === question.correctAnswer;
            
            return (
              <div 
                key={question.id} 
                className={`p-4 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium mb-2">
                    Question {index + 1}: {question.text}
                  </h3>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">Your answer:</span>
                    <span>{studentAnswer}</span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">Correct answer:</span>
                      <span className="text-green-600">{question.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;