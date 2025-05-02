import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const QuizCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuizTitle = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const TimeLeft = styled.div<{ isLow?: boolean }>`
  background-color: var(--color-blue-light);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  
  span.font-bold {
    font-weight: var(--font-weight-bold);
    color: ${props => props.isLow ? 'var(--color-error)' : 'inherit'};
  }
`;

const QuestionCounter = styled.div`
  margin-left: 1rem;
  background-color: var(--color-gray-light);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
`;

const QuestionContainer = styled.div`
  background-color: var(--color-gray-light);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
`;

const QuestionText = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: 1rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
`;

const RadioInput = styled.input`
  height: 1.25rem;
  width: 1.25rem;
  margin-right: 0.75rem;
`;

const OptionLabel = styled.label`
  font-size: var(--font-size-md);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'disabled' }>`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: var(--font-weight-medium);
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background-color: var(--color-primary);
        color: white;
        &:hover {
          background-color: var(--color-primary-dark);
        }
      `;
    } else if (props.variant === 'success') {
      return `
        background-color: var(--color-success);
        color: white;
        &:hover {
          background-color: var(--color-success-dark);
        }
      `;
    } else if (props.variant === 'disabled') {
      return `
        background-color: var(--color-gray);
        cursor: not-allowed;
      `;
    } else {
      return `
        background-color: var(--color-gray);
        color: white;
        &:hover {
          background-color: var(--color-gray-dark);
        }
      `;
    }
  }}
`;

const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LoadingContainer = styled.div`
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid var(--color-primary-light);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
`;

const ErrorContainer = styled.div`
  background-color: var(--color-error-light);
  border-left: 4px solid var(--color-error);
  padding: 1rem;
  border-radius: var(--border-radius);
`;

const ErrorText = styled.p`
  color: var(--color-error);
`;

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
      <CenteredContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading quiz...</LoadingText>
        </LoadingContainer>
      </CenteredContainer>
    );
  }
  
  if (error || !quiz) {
    return (
      <CenteredContainer>
        <ErrorContainer>
          <ErrorText>{error || 'Quiz not found'}</ErrorText>
          <Button 
            variant="primary"
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: '1rem' }}
          >
            Back to Dashboard
          </Button>
        </ErrorContainer>
      </CenteredContainer>
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
    <Container>
      <QuizCard>
        <QuizHeader>
          <QuizTitle>{quiz.title}</QuizTitle>
          <InfoContainer>
            <TimeLeft isLow={timeRemaining < 60}>
              <span>Time Left: </span>
              <span className="font-bold">{formattedTime()}</span>
            </TimeLeft>
            <QuestionCounter>
              <span>Question {questionProgress}</span>
            </QuestionCounter>
          </InfoContainer>
        </QuizHeader>
        
        <QuestionContainer>
          <QuestionText>{currentQuestion.text}</QuestionText>
          
          <OptionsContainer>
            {currentQuestion.options.map((option, index) => (
              <OptionItem key={index}>
                <RadioInput
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleAnswerSelect(currentQuestion.id, option)}
                />
                <OptionLabel htmlFor={`option-${index}`}>
                  {option}
                </OptionLabel>
              </OptionItem>
            ))}
          </OptionsContainer>
        </QuestionContainer>
        
        <ButtonContainer>
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant={currentQuestionIndex === 0 ? 'disabled' : 'secondary'}
          >
            Previous
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              variant="success"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              variant="primary"
            >
              Next
            </Button>
          )}
        </ButtonContainer>
      </QuizCard>
    </Container>
  );
};

export default QuizPage;