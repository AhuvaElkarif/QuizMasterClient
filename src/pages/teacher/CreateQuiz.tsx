import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createQuiz } from '../../store/slices/quizSlice';
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

const CreateQuiz: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [formError, setFormError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.quizzes);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setFormError('נא להזין כותרת לחידון');
      return;
    }
    
    if (isNaN(parseInt(timeLimit)) || parseInt(timeLimit) <= 0) {
      setFormError('נא להזין מגבלת זמן תקינה (בדקות)');
      return;
    }
    
    setFormError('');
    
    // Create quiz
    dispatch(createQuiz({
      title,
      description,
      timeLimit: parseInt(timeLimit),
    }) as any);
    
    // Navigation will happen in success effect
  };
  
  // Listen for creation completion to navigate to quiz editor
  const { quizzes } = useSelector((state: RootState) => state.quizzes);
  
  React.useEffect(() => {
    if (!isLoading && !error && title && quizzes.some(q => q.title === title)) {
      const newQuiz = quizzes.find(q => q.title === title);
      if (newQuiz) {
        navigate(`/teacher/quiz/${newQuiz.id}`);
      }
    }
  }, [isLoading, error, quizzes, title, navigate]);
  
  if (isLoading) {
    return <Loading message="יוצר את החידון..." />;
  }
  
  return (
    <>
      <PageHeader>
        <h1>יצירת חידון חדש</h1>
      </PageHeader>
      
      <Card>
        {error && <ErrorMessage message={error} />}
        {formError && <ErrorMessage message={formError} />}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">כותרת החידון</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="הזן כותרת לחידון..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">תיאור החידון (אופציונלי)</Label>
            <TextArea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="הזן תיאור קצר לחידון..."
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="timeLimit">מגבלת זמן (בדקות)</Label>
            <Input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              placeholder="הזן זמן מקסימלי להשלמת החידון..."
              min="1"
            />
          </FormGroup>
          
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
            <Button variant="outline" type="button" onClick={() => navigate('/teacher/quizzes')}>ביטול</Button>
            <Button type="submit">צור חידון</Button>
          </div>
        </Form>
      </Card>
    </>
  );
};

export default CreateQuiz;