import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import { AddOptionButton, ButtonGroup, CancelButton, Card, ErrorText, FormGroup, Header, HelpText, Label, LoadingContainer, LoadingSpinner, LoadingText, OptionInput, OptionRow, OptionsContainer, OptionsHeader, PointsContainer, PointsInput, PointsLabel, PointsUnit, Radio, RemoveButton, SaveButton, TextArea, Title } from '../../styles/EditQuestion';
import { Container, ErrorMessage } from '../../styles/Theme';

interface QuestionOption {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation?: string;
  points: number;
  quizId: string;
}

interface QuestionUpdateRequest {
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficultyLevel: number;
}

const EditQuestion: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewQuestion = questionId === 'new';
  
  const quizId = location.state?.quizId || new URLSearchParams(location.search).get('quizId');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question>({
    id: '',
    text: '',
    options: [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
      { id: '4', text: '' }
    ],
    correctOptionId: '',
    explanation: '',
    points: 1,
    quizId: quizId || ''
  });
  
  useEffect(() => {
    const fetchQuestion = async () => {
      if (isNewQuestion) {
        setQuestion(prev => ({
          ...prev,
          quizId: quizId || ''
        }));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("questionId",questionId)
        const response = await api.get(`/questions/${questionId}`);
        
        // Convert from API model to our component model
        const questionData = response.data;
        
        // Format the data to match our frontend model
        const formattedQuestion = {
          id: questionData.id,
          text: questionData.text,
          options: questionData.options.map((text: string, index: number) => ({
            id: `opt${index + 1}`,
            text
          })),
          correctOptionId: `opt${questionData.options.indexOf(questionData.correctAnswer) + 1}`,
          explanation: questionData.explanation || '',
          points: questionData.difficultyLevel || 1,
          quizId: questionData.quizId || quizId || ''
        };
        
        setQuestion(formattedQuestion);
      } catch (err) {
        console.error(err);
        setError('נכשל בטעינת השאלה. אנא נסה שוב.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestion();
  }, [questionId, isNewQuestion, quizId]);
  
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(prev => ({
      ...prev,
      text: e.target.value
    }));
  };
  
  const handleOptionChange = (id: string, value: string) => {
    setQuestion(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === id ? { ...option, text: value } : option
      )
    }));
  };
  
  const handleCorrectOptionChange = (id: string) => {
    setQuestion(prev => ({
      ...prev,
      correctOptionId: id
    }));
  };
  
  const handleExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(prev => ({
      ...prev,
      explanation: e.target.value
    }));
  };
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) return;
    
    setQuestion(prev => ({
      ...prev,
      points: value
    }));
  };
  
  const addOption = () => {
    if (question.options.length >= 6) {
      setError('מקסימום 6 אפשרויות מותרות');
      return;
    }
    
    const newOptionId = `opt${question.options.length + 1}`;
    
    setQuestion(prev => ({
      ...prev,
      options: [...prev.options, { id: newOptionId, text: '' }]
    }));
  };
  
  const removeOption = (id: string) => {
    if (question.options.length <= 2) {
      setError('נדרשות לפחות 2 אפשרויות');
      return;
    }
    
    setQuestion(prev => {
      // If we're removing the correct option, reset correctOptionId
      const newCorrectOptionId = prev.correctOptionId === id 
        ? '' 
        : prev.correctOptionId;
      
      return {
        ...prev,
        options: prev.options.filter(option => option.id !== id),
        correctOptionId: newCorrectOptionId
      };
    });
  };
  
  const validateQuestion = (): boolean => {
    // Check if question text is present
    if (!question.text.trim()) {
      setError('נדרש טקסט לשאלה');
      return false;
    }
    
    // Check if at least 2 options are present and all have text
    if (question.options.length < 2) {
      setError('נדרשות לפחות 2 אפשרויות');
      return false;
    }
    
    const emptyOption = question.options.find(opt => !opt.text.trim());
    if (emptyOption) {
      setError('כל האפשרויות חייבות להכיל טקסט');
      return false;
    }
    
    // Check if correct answer is selected
    if (!question.correctOptionId) {
      setError('אנא בחר את התשובה הנכונה');
      return false;
    }
    
    return true;
  };
  
  const handleSave = async () => {
    if (!validateQuestion()) return;
    
    try {
      setSaving(true);
      
      // Convert our frontend model to the API request model
      const correctOptionIndex = question.options.findIndex(opt => opt.id === question.correctOptionId);
      const correctAnswer = correctOptionIndex !== -1 ? question.options[correctOptionIndex].text : '';
      
      const questionUpdateRequest: QuestionUpdateRequest = {
        text: question.text,
        options: question.options.map(opt => opt.text),
        correctAnswer: correctAnswer,
        category: 'General', // Default category or get from form
        difficultyLevel: question.points
      };
      
      if (isNewQuestion) {
        // Create new question
        await api.post('/questions', {
          ...questionUpdateRequest,
          quizId: question.quizId
        });
      } else {
        // Update existing question
        await api.put(`/questions/${questionId}`, questionUpdateRequest);
      }
      
      // Redirect back to quiz editor
      navigate(`/teacher/quiz/${question.quizId}`);
    } catch (err) {
      console.error(err);
      setError('נכשל בשמירת השאלה. אנא נסה שוב.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/teacher/quiz/${question.quizId}`);
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <div>
          <LoadingSpinner />
          <LoadingText>טוען שאלה...</LoadingText>
        </div>
      </LoadingContainer>
    );
  }
  
  return (
    <Container>
      <Card>
        <Header>
          <Title>
            {isNewQuestion ? 'יצירת שאלה חדשה' : 'עריכת שאלה'}
          </Title>
          <PointsContainer>
            <PointsLabel>ערך השאלה:</PointsLabel>
            <PointsInput
              type="number"
              min="1"
              value={question.points}
              onChange={handlePointsChange}
            />
            <PointsUnit>נקודות</PointsUnit>
          </PointsContainer>
        </Header>
        
        {error && (
          <ErrorMessage>
            <ErrorText>{error}</ErrorText>
          </ErrorMessage>
        )}
        
        <FormGroup>
          <Label>טקסט השאלה</Label>
          <TextArea
            value={question.text}
            onChange={handleQuestionTextChange}
            rows={3}
            placeholder="הזן את השאלה שלך כאן..."
          />
        </FormGroup>
        
        <FormGroup>
          <OptionsHeader>
            <Label>אפשרויות תשובה</Label>
            <AddOptionButton type="button" onClick={addOption}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ marginRight: '0.25rem' }}>
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              הוסף אפשרות
            </AddOptionButton>
          </OptionsHeader>
          
          <OptionsContainer>
            {question.options.map((option) => (
              <OptionRow key={option.id}>
                <Radio
                  type="radio"
                  id={`correct-${option.id}`}
                  name="correctOption"
                  checked={question.correctOptionId === option.id}
                  onChange={() => handleCorrectOptionChange(option.id)}
                />
                <OptionInput
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder="הזן טקסט לאפשרות"
                />
                <RemoveButton
                  type="button"
                  onClick={() => removeOption(option.id)}
                  aria-label="הסר אפשרות"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </RemoveButton>
              </OptionRow>
            ))}
          </OptionsContainer>
          <HelpText>
            סמן את כפתור הרדיו ליד התשובה הנכונה.
          </HelpText>
        </FormGroup>
        
        <FormGroup>
          <Label>הסבר (אופציונלי)</Label>
          <TextArea
            value={question.explanation || ''}
            onChange={handleExplanationChange}
            rows={3}
            placeholder="הזן הסבר לתשובה הנכונה (יוצג לתלמידים לאחר השלמת החידון)"
          />
        </FormGroup>
        
        <ButtonGroup>
          <CancelButton
            type="button"
            onClick={handleCancel}
            disabled={saving}
          >
            ביטול
          </CancelButton>
          <SaveButton
            type="button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                שומר...
              </>
            ) : (
              'שמור שאלה'
            )}
          </SaveButton>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default EditQuestion;