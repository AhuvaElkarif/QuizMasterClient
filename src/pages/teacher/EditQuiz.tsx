import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchQuizById, updateQuiz, publishQuiz } from '../../store/slices/quizSlice';
import styled from 'styled-components';
import { Card, Form, FormGroup, Label, Input, TextArea, Button, Table, Th, Td, Tr } from '../../styles/Theme';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
`;

const Tab = styled.button<{ active: boolean }>`
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-text-secondary)'};
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: var(--color-primary);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const QuestionItem = styled.div<{ isDragging: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  background-color: ${props => props.isDragging ? 'var(--color-background-light)' : 'white'};
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: ${props => props.isDragging ? 'var(--box-shadow-md)' : 'var(--box-shadow-sm)'};
`;

const DragHandle = styled.div`
  cursor: grab;
  padding: var(--spacing-sm);
  color: var(--color-text-secondary);
  
  &:active {
    cursor: grabbing;
  }
`;

const QuestionText = styled.div`
  flex: 1;
  padding: 0 var(--spacing-md);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const PublishButton = styled(Button)`
  background-color: var(--color-success);
  
  &:hover {
    background-color: var(--color-success-dark);
  }
`;

type TabType = 'details' | 'questions' | 'preview';

const EditQuiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz, isLoading, error } = useSelector((state: RootState) => state.quizzes);
  
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [formError, setFormError] = useState('');
  
  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId) as any);
    }
  }, [dispatch, quizId]);
  
  useEffect(() => {
    if (currentQuiz) {
      setTitle(currentQuiz.title || '');
      setDescription(currentQuiz.description || '');
      setTimeLimit(currentQuiz.timeLimit?.toString() || '30');
    }
  }, [currentQuiz]);
  
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
    
    // Update quiz
    if (quizId && currentQuiz) {
      dispatch(updateQuiz({
        id: quizId,
        title,
        description,
        timeLimit: parseInt(timeLimit),
      }) as any);
    }
  };
  
  const handlePublish = () => {
    if (currentQuiz && currentQuiz.id) {
      if (!currentQuiz.questions || currentQuiz.questions.length === 0) {
        setFormError('לא ניתן לפרסם חידון ללא שאלות. נא להוסיף לפחות שאלה אחת.');
        return;
      }
      
      dispatch(publishQuiz(currentQuiz.id) as any);
    }
  };
  
  const handleDragEnd = (result: any) => {
    // Logic to handle question reordering
    if (!result.destination) return;
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    if (startIndex === endIndex) return;
    
    // Dispatch action to reorder questions
    // This should be implemented in your quizSlice
  };
  
  if (isLoading && !currentQuiz) {
    return <Loading message="טוען את החידון..." />;
  }
  
  return (
    <>
      <PageHeader>
        <h1>{title || 'עריכת חידון'}</h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button variant="outline" onClick={() => navigate('/teacher/quizzes')}>חזור לרשימה</Button>
          {currentQuiz && currentQuiz.status !== 'published' && (
            <PublishButton onClick={handlePublish}>פרסם חידון</PublishButton>
          )}
        </div>
      </PageHeader>
      
      {error && <ErrorMessage message={error} />}
      {formError && <ErrorMessage message={formError} />}
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'details'} 
          onClick={() => setActiveTab('details')}
        >
          פרטי החידון
        </Tab>
        <Tab 
          active={activeTab === 'questions'} 
          onClick={() => setActiveTab('questions')}
        >
          שאלות
        </Tab>
        <Tab 
          active={activeTab === 'preview'} 
          onClick={() => setActiveTab('preview')}
        >
          תצוגה מקדימה
        </Tab>
      </TabsContainer>
      
      <Card>
        {activeTab === 'details' && (
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
              <Button type="submit">שמור שינויים</Button>
            </div>
          </Form>
        )}
        
        {activeTab === 'questions' && (
          <>
            <SectionHeader>
              <h2>שאלות בחידון</h2>
              <Button as={Link} to={`/teacher/questions/new?quizId=${quizId}`}>הוסף שאלה חדשה</Button>
            </SectionHeader>
            
            {currentQuiz && currentQuiz.questions && currentQuiz.questions.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="quiz-questions">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {currentQuiz.questions.map((question, index) => (
                        <Draggable key={question.id} draggableId={question.id} index={index}>
                          {(provided, snapshot) => (
                            <QuestionItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              isDragging={snapshot.isDragging}
                            >
                              <DragHandle {...provided.dragHandleProps}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7 2H5V4H7V2Z" />
                                  <path d="M7 6H5V8H7V6Z" />
                                  <path d="M5 10H7V12H5V10Z" />
                                  <path d="M7 14H5V16H7V14Z" />
                                  <path d="M11 2H13V4H11V2Z" />
                                  <path d="M13 6H11V8H13V6Z" />
                                  <path d="M11 10H13V12H11V10Z" />
                                  <path d="M13 14H11V16H13V14Z" />
                                </svg>
                              </DragHandle>
                              <QuestionText>
                                <p>{question.text}</p>
                              </QuestionText>
                              <ActionButtons>
                                <Button variant="text" as={Link} to={`/teacher/questions/edit/${question.id}?quizId=${quizId}`}>ערוך</Button>
                                <Button variant="text" 
                                  onClick={() => {
                                    // Dispatch action to remove question from quiz
                                  }}
                                >
                                  הסר
                                </Button>
                              </ActionButtons>
                            </QuestionItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <p style={{ textAlign: 'center' }}>
                אין שאלות בחידון זה עדיין. הוסף שאלות כדי שתלמידים יוכלו להשלים את החידון.
              </p>
            )}
            
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <SectionHeader>
                <h3>הוסף שאלות קיימות</h3>
              </SectionHeader>
              
              {/* This could be a table of existing questions to add to this quiz */}
              <p>בקרוב - יכולת להוסיף שאלות קיימות מהמאגר שלך</p>
            </div>
          </>
        )}
        
        {activeTab === 'preview' && (
          <>
            <h2>תצוגה מקדימה של החידון</h2>
            
            {currentQuiz && currentQuiz.questions && currentQuiz.questions.length > 0 ? (
              <div>
                <h3>{title}</h3>
                {description && <p>{description}</p>}
                <p>מגבלת זמן: {timeLimit} דקות</p>
                <p>מספר שאלות: {currentQuiz.questions.length}</p>
                
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <h4>דוגמת שאלה:</h4>
                  <Card>
                    <p>{currentQuiz.questions[0].text}</p>
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                      {currentQuiz.questions[0].options.map((option, index) => (
                        <div key={option.id} style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <label>
                            <input type="radio" name="preview" disabled /> {option.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <p>
                אין שאלות בחידון זה עדיין. הוסף שאלות כדי לראות תצוגה מקדימה.
              </p>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default EditQuiz;