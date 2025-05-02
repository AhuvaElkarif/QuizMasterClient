import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ResultsCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 0.5rem;
`;

const SubmissionDate = styled.p`
  color: var(--color-gray-dark);
`;

const SummaryBox = styled.div`
  background-color: var(--color-blue-light);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
`;

const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    text-align: center;
  }
`;

const SummaryItem = styled.div`
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.h2`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-dark);
`;

const SummaryValue = styled.p<{ color?: string }>`
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: ${props => props.color || 'inherit'};
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: 1rem;
`;

const QuestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuestionCard = styled.div<{ isCorrect: boolean }>`
  padding: 1rem;
  border-radius: var(--border-radius);
  background-color: ${props => props.isCorrect ? 'var(--color-success-light)' : 'var(--color-error-light)'};
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const QuestionText = styled.h3`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  margin-bottom: 0.5rem;
`;

const QuestionStatus = styled.span<{ isCorrect: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  background-color: ${props => props.isCorrect ? 'var(--color-success-light)' : 'var(--color-error-light)'};
  color: ${props => props.isCorrect ? 'var(--color-success-dark)' : 'var(--color-error-dark)'};
`;

const AnswerDetails = styled.div`
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
`;

const AnswerItem = styled.div`
  display: flex;
  align-items: center;
`;

const AnswerLabel = styled.span`
  font-weight: var(--font-weight-medium);
  margin-right: 0.5rem;
`;

const CorrectAnswer = styled.span`
  color: var(--color-success);
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--border-radius);
  font-weight: var(--font-weight-medium);
  &:hover {
    background-color: var(--color-primary-dark);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-primary-light);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LoadingContent = styled.div`
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
    if (percentage >= 80) return 'var(--color-success)';
    if (percentage >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <LoadingSpinner />
          <LoadingText>Loading results...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }
  
  if (error || !results || !quiz) {
    return (
      <LoadingContainer>
        <ErrorContainer>
          <ErrorText>{error || 'Results not found'}</ErrorText>
          <Button
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: '1rem' }}
          >
            Back to Dashboard
          </Button>
        </ErrorContainer>
      </LoadingContainer>
    );
  }
  
  const { score = 0, totalQuestions = 0 } = results;
  const scorePercentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <Container>
      <ResultsCard>
        <Header>
          <Title>{quiz.title} - Results</Title>
          <SubmissionDate>
            Submitted on {new Date(results.submittedAt).toLocaleDateString()} at {new Date(results.submittedAt).toLocaleTimeString()}
          </SubmissionDate>
        </Header>
        
        <SummaryBox>
          <SummaryContent>
            <SummaryItem>
              <SummaryLabel>Score</SummaryLabel>
              <SummaryValue color={getGradeColor(score, totalQuestions)}>
                {score}/{totalQuestions} ({scorePercentage}%)
              </SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Time Spent</SummaryLabel>
              <SummaryValue color="var(--color-primary)">
                {formatTime(results.timeSpent)}
              </SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Result</SummaryLabel>
              <SummaryValue color={scorePercentage >= 60 ? 'var(--color-success)' : 'var(--color-error)'}>
                {scorePercentage >= 60 ? 'PASS' : 'FAIL'}
              </SummaryValue>
            </SummaryItem>
          </SummaryContent>
        </SummaryBox>
        
        <SectionTitle>Answers Review</SectionTitle>
        
        <QuestionsContainer>
          {quiz.questions.map((question, index) => {
            const studentAnswer = results.studentAnswers[question.id] || 'Not answered';
            const isCorrect = studentAnswer === question.correctAnswer;
            
            return (
              <QuestionCard 
                key={question.id} 
                isCorrect={isCorrect}
              >
                <QuestionHeader>
                  <QuestionText>
                    Question {index + 1}: {question.text}
                  </QuestionText>
                  <QuestionStatus isCorrect={isCorrect}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </QuestionStatus>
                </QuestionHeader>
                
                <AnswerDetails>
                  <AnswerItem>
                    <AnswerLabel>Your answer:</AnswerLabel>
                    <span>{studentAnswer}</span>
                  </AnswerItem>
                  
                  {!isCorrect && (
                    <AnswerItem>
                      <AnswerLabel>Correct answer:</AnswerLabel>
                      <CorrectAnswer>{question.correctAnswer}</CorrectAnswer>
                    </AnswerItem>
                  )}
                </AnswerDetails>
              </QuestionCard>
            );
          })}
        </QuestionsContainer>
        
        <ButtonContainer>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </ButtonContainer>
      </ResultsCard>
    </Container>
  );
};

export default ResultsPage;