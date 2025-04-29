import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createQuestion, clearError } from '../../store/slices/questionsSlice';
import styled from 'styled-components';
import { Card, Form, FormGroup, Label, Input, TextArea, Button } from '../../styles/Theme';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const CreateQuestion: React.FC = () => {
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [incorrectAnswer1, setIncorrectAnswer1] = useState('');
  const [incorrectAnswer2, setIncorrectAnswer2] = useState('');
  const [incorrectAnswer3, setIncorrectAnswer3] = useState('');
  const [formError, setFormError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.questions);
  
  useEffect(() => {
    // נקה את השגיאות הקודמות כשהדף נטען
    dispatch(clearError());
  }, [dispatch]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // בדיקת תקינות
    if (!questionText || !correctAnswer || !incorrectAnswer1 || !incorrectAnswer2 || !incorrectAnswer3) {
      setFormError('נא למלא את כל השדות');
      return;
    }
    
    setFormError('');
    
    // הכנת מערך התשובות השגויות
    const incorrectAnswers = [incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];
    
    // שליחת השאלה
    dispatch(createQuestion({
      text: questionText,
      correctAnswer,
      incorrectAnswers
    })as any);
    
    // ניווט לרשימת השאלות לאחר היצירה (יקרה בזכות הeffect למטה)
  };
  
  // האזנה לסיום היצירה כדי לנווט לרשימת השאלות
  const { questions } = useSelector((state: RootState) => state.questions);
  
  useEffect(() => {
    if (!isLoading && !error && questionText && questions.some(q => q.text === questionText)) {
      navigate('/teacher/questions');
    }
  }, [isLoading, error, questions, questionText, navigate]);
  
  if (isLoading) {
    return <Loading message="יוצר את השאלה..." />;
  }
  
  return (
    <>
      <PageHeader>
        <h1>יצירת שאלה חדשה</h1>
      </PageHeader>
      
      <Card>
        {error && <ErrorMessage message={error} />}
        {formError && <ErrorMessage message={formError} />}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="questionText">טקסט השאלה</Label>
            <TextArea
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="הכנס את טקסט השאלה כאן..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="correctAnswer">תשובה נכונה</Label>
            <Input
              type="text"
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="הכנס את התשובה הנכונה כאן..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="incorrectAnswer1">תשובה שגויה 1</Label>
            <Input
              type="text"
              id="incorrectAnswer1"
              value={incorrectAnswer1}
              onChange={(e) => setIncorrectAnswer1(e.target.value)}
              placeholder="הכנס תשובה שגויה כאן..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="incorrectAnswer2">תשובה שגויה 2</Label>
            <Input
              type="text"
              id="incorrectAnswer2"
              value={incorrectAnswer2}
              onChange={(e) => setIncorrectAnswer2(e.target.value)}
              placeholder="הכנס תשובה שגויה כאן..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="incorrectAnswer3">תשובה שגויה 3</Label>
            <Input
              type="text"
              id="incorrectAnswer3"
              value={incorrectAnswer3}
              onChange={(e) => setIncorrectAnswer3(e.target.value)}
              placeholder="הכנס תשובה שגויה כאן..."
            />
          </FormGroup>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
            <Button variant="outline" type="button" onClick={() => navigate('/teacher/questions')}>ביטול</Button>
            <Button type="submit">צור שאלה</Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default CreateQuestion;