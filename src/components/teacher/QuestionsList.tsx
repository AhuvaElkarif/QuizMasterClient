import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchQuestions, removeQuestion } from '../../redux/slices/questionSlice';
import { Question } from '../../types/question.types';
import styled from 'styled-components';
import { Card, Alert } from '../common/Input';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';

const QuestionCard = styled(Card)`
  margin-bottom: 1rem;
  position: relative;
`;

const QuestionText = styled.h3`
  margin-bottom: 1rem;
  font-size: ${theme.fontSizes.lg};
`;

const OptionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 1rem;
`;

const OptionItem = styled.li<{ isCorrect?: boolean }>`
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: ${theme.borderRadius.md};
  background-color: ${({ isCorrect }) => isCorrect ? '#d1fae5' : '#f3f4f6'};
  border-left: 4px solid ${({ isCorrect }) => isCorrect ? theme.colors.success : 'transparent'};
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${theme.colors.dark};
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const QuestionsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { questions, loading, error } = useAppSelector(state => state.questions);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);
  
  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setDeleteInProgress(questionId);
      try {
        await dispatch(removeQuestion(questionId));
      } finally {
        setDeleteInProgress(null);
      }
    }
  };
  
  if (loading && questions.length === 0) {
    return (
      <LoaderContainer>
        <Loader size="lg" />
      </LoaderContainer>
    );
  }
  
  if (error) {
    return <Alert type="danger">{error}</Alert>;
  }
  
  if (questions.length === 0) {
    return (
      <EmptyState>
        <h3>No questions yet</h3>
        <p>Create your first question to see it here.</p>
      </EmptyState>
    );
  }
  
  return (
    <div>
      {questions.map((question: Question) => (
        <QuestionCard key={question.id}>
          <QuestionText>{question.text}</QuestionText>
          <OptionsList>
            {question.options.map(option => (
              <OptionItem 
                key={option.id} 
                isCorrect={option.isCorrect}
              >
                {option.text} {option.isCorrect && '(Correct)'}
              </OptionItem>
            ))}
          </OptionsList>
          <DeleteButton
            variant="danger"
            size="sm"
            onClick={() => handleDeleteQuestion(question.id)}
            disabled={deleteInProgress === question.id}
          >
            {deleteInProgress === question.id ? 'Deleting...' : 'Delete'}
          </DeleteButton>
        </QuestionCard>
      ))}
    </div>
  );
};

export default QuestionsList;