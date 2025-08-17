import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react';

const TakeQuiz = ({ quizzes, saveQuizResults }) => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const selectedQuiz = quizzes.find(q => q.id === quizId);
    if (selectedQuiz) {
      setQuiz(selectedQuiz);
      // Initialize timer if quiz has a time limit
      if (selectedQuiz.timeLimit) {
        setTimeLeft(selectedQuiz.timeLimit * 60); // Convert minutes to seconds
      }
      // Initialize answers object
      const initialAnswers = {};
      selectedQuiz.questions.forEach(question => {
        initialAnswers[question.id] = 
          question.type === 'multiple-choice' ? null : 
          question.type === 'multiple-answer' ? [] : '';
      });
      setAnswers(initialAnswers);
    } else {
      navigate('/quizzes');
    }
  }, [quizId, quizzes, navigate]);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz?.timeLimit) {
      // Auto-submit when time runs out
      handleSubmitQuiz();
    }
  }, [timeLeft, quizCompleted]);

  if (!quiz) {
    return <div className="flex items-center justify-center h-64">Loading quiz...</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (questionId, value) => {
    if (currentQuestion.type === 'multiple-answer') {
      // Handle checkbox selections
      setAnswers(prev => {
        const currentSelections = [...(prev[questionId] || [])];
        if (currentSelections.includes(value)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter(item => item !== value)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentSelections, value]
          };
        }
      });
    } else {
      // Handle radio buttons or text input
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach(question => {
      const points = question.points || 1;
      totalPoints += points;
      
      if (question.type === 'multiple-choice') {
        if (answers[question.id] === question.correctAnswer) {
          totalScore += points;
        }
      } else if (question.type === 'multiple-answer') {
        const userAnswers = answers[question.id] || [];
        const correctAnswers = question.correctAnswers || [];
        
        // Check if arrays have the same elements (regardless of order)
        const isCorrect = 
          userAnswers.length === correctAnswers.length && 
          userAnswers.every(item => correctAnswers.includes(item));
        
        if (isCorrect) {
          totalScore += points;
        }
      } else if (question.type === 'text') {
        // Case insensitive comparison for text answers
        const userAnswer = (answers[question.id] || '').trim().toLowerCase();
        const correctAnswer = (question.correctAnswer || '').trim().toLowerCase();
        
        if (userAnswer === correctAnswer) {
          totalScore += points;
        }
      }
    });
    
    return {
      score: totalScore,
      totalPoints,
      percentage: Math.round((totalScore / totalPoints) * 100)
    };
  };

  const handleSubmitQuiz = () => {
    const result = calculateScore();
    setScore(result);
    setQuizCompleted(true);
    
    // Save results
    saveQuizResults({
      quizId: quiz.id,
      quizTitle: quiz.title,
      date: new Date().toISOString(),
      answers,
      score: result.score,
      totalPoints: result.totalPoints,
      percentage: result.percentage
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
        
        <div className="p-4 mb-6 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
          <div className="flex flex-col gap-2">
            <p><span className="font-medium">Score:</span> {score.score} / {score.totalPoints}</p>
            <p><span className="font-medium">Percentage:</span> {score.percentage}%</p>
            <p>
              <span className="font-medium">Grade:</span> 
              {score.percentage >= 90 ? 'A' : 
               score.percentage >= 80 ? 'B' : 
               score.percentage >= 70 ? 'C' : 
               score.percentage >= 60 ? 'D' : 'F'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={() => navigate('/quizzes')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Back to Quizzes
          </button>
          <button 
            onClick={() => {
              setQuizCompleted(false);
              setCurrentQuestionIndex(0);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Review Answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        {quiz.timeLimit && (
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-1" />
            <span className={`font-medium ${timeLeft < 60 ? 'text-red-500' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div className="text-sm text-gray-500">
          {currentQuestion.points || 1} {(currentQuestion.points || 1) === 1 ? 'point' : 'points'}
        </div>
      </div>
      
      <div className="p-4 mb-6 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>
        
        {currentQuestion.type === 'multiple-choice' && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-start p-2 rounded hover:bg-gray-200">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  className="mt-1 mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'multiple-answer' && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-start p-2 rounded hover:bg-gray-200">
                <input
                  type="checkbox"
                  name={`question-${currentQuestion.id}`}
                  checked={(answers[currentQuestion.id] || []).includes(option)}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  className="mt-1 mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {currentQuestion.type === 'text' && (
          <div>
            <input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-4 py-2 ${
            currentQuestionIndex === 0 
              ? 'bg-gray-200 text-gray-400' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          } rounded`}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
        
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Quiz
            <Check className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;