import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { addQuestion } from '../../redux/slices/questionSlice';
import { CreateQuestionData } from '../../types/question.types';
import styled from 'styled-components';
import { 
  FormGroup,
  Label,
  Input,
  TextArea,
  ErrorMessage,
  Card,
  Flex
} from '../common/Input';
import { Button } from '../common/Button';

const StyledForm = styled.form`
  width: 100%;
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const RadioButton = styled.input`
  margin-right: 0.5rem;
`;

const OptionInput = styled(Input)`
  flex: 1;
`;

const QuestionForm: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState<{
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }>({
    text: '',
    options: [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
      { id: '4', text: '' }
    ],
    correctOptionId: '1'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, text: e.target.value }));
    if (errors.text) {
      setErrors(prev => ({ ...prev, text: '' }));
    }
  };
  
  const handleOptionChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(option => 
        option.id === id ? { ...option, text: value } : option
      )
    }));
    
    if (errors[`option-${id}`]) {
      setErrors(prev => ({ ...prev, [`option-${id}`]: '' }));
    }
  };
  
  const handleCorrectOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, correctOptionId: e.target.value }));
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required';
    }
    
    formData.options.forEach(option => {
      if (!option.text.trim()) {
        newErrors[`option-${option.id}`] = `Option ${option.id} text is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const correctOption = formData.options.find(option => option.id === formData.correctOptionId)?.text || '';
    const incorrectOptions = formData.options
      .filter(option => option.id !== formData.correctOptionId)
      .map(option => option.text);
    
    const questionData: CreateQuestionData = {
      text: formData.text,
      correctOption,
      incorrectOptions
    };
    
    try {
      const resultAction = await dispatch(addQuestion(questionData));
      if (addQuestion.fulfilled.match(resultAction)) {
        // Reset form after successful submission
        setFormData({
          text: '',
          options: [
            { id: '1', text: '' },
            { id: '2', text: '' },
            { id: '3', text: '' },
            { id: '4', text: '' }
          ],
          correctOptionId: '1'
        });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else if (addQuestion.rejected.match(resultAction)) {
        if (resultAction.payload) {
          setErrors({ form: resultAction.payload as string });
        } else {
          setErrors({ form: 'Failed to add question. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <StyledForm onSubmit={handleSubmit}>
        {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
        {submitSuccess && (
          <div style={{ color: 'green', marginBottom: '1rem' }}>
            Question added successfully!
          </div>
        )}
        
        <FormGroup>
          <Label htmlFor="question-text">Question</Label>
          <TextArea
            id="question-text"
            name="text"
            placeholder="Enter your question"
            value={formData.text}
            onChange={handleQuestionChange}
            error={!!errors.text}
            fullWidth
          />
          {errors.text && <ErrorMessage>{errors.text}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>Options (select the correct answer)</Label>
          {formData.options.map(option => (
            <OptionContainer key={option.id}>
              <RadioButton
                type="radio"
                name="correctOption"
                value={option.id}
                checked={formData.correctOptionId === option.id}
                onChange={handleCorrectOptionChange}
                id={`option-${option.id}`}
              />
              <OptionInput
                placeholder={`Option ${option.id}`}
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                error={!!errors[`option-${option.id}`]}
              />
            </OptionContainer>
          ))}
          {formData.options.map(option => 
            errors[`option-${option.id}`] && 
            <ErrorMessage key={`error-${option.id}`}>{errors[`option-${option.id}`]}</ErrorMessage>
          )}
        </FormGroup>
        
        <Flex>
          <Button
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Question'}
          </Button>
        </Flex>
      </StyledForm>
    </Card>
  );
};

export default QuestionForm;