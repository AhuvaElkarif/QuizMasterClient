import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { registerUser } from '../../redux/slices/authSlice';
import { RegisterCredentials } from '../../types/auth.types';
import styled from 'styled-components';
import { 
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  Card,
  Flex
} from '../common/Input';
import { Button } from '../common/Button';

const StyledForm = styled.form`
  width: 100%;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    name: '',
    role: 'student' // Default role is student
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle radio inputs separately
    if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const resultAction = await dispatch(registerUser(formData));
      if (registerUser.fulfilled.match(resultAction)) {
        // Registration successful, redirect based on user role
        const role = resultAction.payload.role;
        navigate(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
      } else if (registerUser.rejected.match(resultAction)) {
        // Handle registration error
        if (resultAction.payload) {
          setErrors({ form: resultAction.payload as string });
        } else {
          setErrors({ form: 'Registration failed. Please try again.' });
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
        
        <FormGroup>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            fullWidth
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            fullWidth
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            fullWidth
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label>I am a</Label>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleChange}
              />
              Student
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={formData.role === 'teacher'}
                onChange={handleChange}
              />
              Teacher
            </RadioLabel>
          </RadioGroup>
          {errors.role && <ErrorMessage>{errors.role}</ErrorMessage>}
        </FormGroup>
        
        <Flex justify="space-between" align="center">
          <Button
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </Flex>
      </StyledForm>
    </Card>
  );
};

export default RegisterForm;