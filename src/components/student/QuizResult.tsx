import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  onRetakeQuiz: () => void;
}

const ResultContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ScoreHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
`;

const Score = styled.div<{ percentage: number }>`
  font-size: 64px;
  font-weight: bold;
  margin: 20px 0;
  color: ${props => {
    if (props.percentage >= 80) return '#4CAF50';
    if (props.percentage >= 60) return '#FFC107';
    return '#F44336';
  }};
`;

const ScoreText = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  color: #666;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const RetakeButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  border: none;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const DashboardButton = styled(Button)`
  background-color: white;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const QuizResult: React.FC<QuizResultProps> = ({ score, totalQuestions, onRetakeQuiz }) => {
  const navigate = useNavigate();
  const percentage = (score / totalQuestions) * 100;
  
  let message: string;
  if (percentage >= 80) {
    message = "Excellent work! You've mastered the material!";
  } else if (percentage >= 60) {
    message = "Good job! You're on the right track.";
  } else {
    message = "Keep studying and try again. You'll improve!";
  }

  return (
    <ResultContainer>
      <ScoreHeader>Quiz Results</ScoreHeader>
      <Score percentage={percentage}>{percentage.toFixed(0)}%</Score>
      <ScoreText>
        You scored {score} out of {totalQuestions} questions correctly.
      </ScoreText>
      <ScoreText>{message}</ScoreText>
      <ButtonsContainer>
        <RetakeButton onClick={onRetakeQuiz}>Retake Quiz</RetakeButton>
        <DashboardButton onClick={() => navigate('/student/dashboard')}>Back to Dashboard</DashboardButton>
      </ButtonsContainer>
    </ResultContainer>
  );
};

export default QuizResult;