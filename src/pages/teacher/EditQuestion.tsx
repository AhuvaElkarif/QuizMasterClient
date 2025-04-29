import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

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

const EditQuestion: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewQuestion = questionId === 'new';
  
  // Get quizId from location state or query params
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
        // For new question, just initialize with empty state
        setQuestion(prev => ({
          ...prev,
          quizId: quizId || ''
        }));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // In real implementation, replace with actual API call
        // const response = await fetch(`/api/questions/${questionId}`);
        // if (!response.ok) throw new Error('Failed to fetch question');
        // const data = await response.json();
        // setQuestion(data);
        
        // Mock data for development
        const mockQuestion: Question = {
          id: questionId || 'q1',
          text: 'What is the capital of France?',
          options: [
            { id: 'opt1', text: 'London' },
            { id: 'opt2', text: 'Berlin' },
            { id: 'opt3', text: 'Paris' },
            { id: 'opt4', text: 'Madrid' }
          ],
          correctOptionId: 'opt3',
          explanation: 'Paris is the capital and most populous city of France.',
          points: 2,
          quizId: quizId || 'quiz-1'
        };
        
        setQuestion(mockQuestion);
      } catch (err) {
        console.error(err);
        setError('Failed to load question. Please try again.');
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
      setError('Maximum of 6 options allowed');
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
      setError('Minimum of 2 options required');
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
      setError('Question text is required');
      return false;
    }
    
    // Check if at least 2 options are present and all have text
    if (question.options.length < 2) {
      setError('At least 2 options are required');
      return false;
    }
    
    const emptyOption = question.options.find(opt => !opt.text.trim());
    if (emptyOption) {
      setError('All options must have text');
      return false;
    }
    
    // Check if correct answer is selected
    if (!question.correctOptionId) {
      setError('Please select the correct answer');
      return false;
    }
    
    return true;
  };
  
  const handleSave = async () => {
    if (!validateQuestion()) return;
    
    try {
      setSaving(true);
      
      // In real implementation, replace with actual API call
      // const method = isNewQuestion ? 'POST' : 'PUT';
      // const url = isNewQuestion ? '/api/questions' : `/api/questions/${questionId}`;
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(question)
      // });
      
      // if (!response.ok) throw new Error('Failed to save question');
      
      // Simulate API call
      console.log('Saving question:', question);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect back to quiz editor
      navigate(`/teacher/quiz/${question.quizId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    navigate(`/teacher/quiz/${question.quizId}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading question...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            {isNewQuestion ? 'Create New Question' : 'Edit Question'}
          </h1>
          <div className="flex items-center">
            <span className="mr-3 text-gray-600">Question value:</span>
            <input
              type="number"
              min="1"
              value={question.points}
              onChange={handlePointsChange}
              className="w-16 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-1 text-gray-600">points</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Question Text
          </label>
          <textarea
            value={question.text}
            onChange={handleQuestionTextChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your question here..."
          />
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-lg font-medium text-gray-700">
              Answer Options
            </label>
            <button
              type="button"
              onClick={addOption}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Option
            </button>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  type="radio"
                  id={`correct-${option.id}`}
                  name="correctOption"
                  checked={question.correctOptionId === option.id}
                  onChange={() => handleCorrectOptionChange(option.id)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  placeholder="Enter option text"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeOption(option.id)}
                  className="ml-3 text-red-500 hover:text-red-700"
                  aria-label="Remove option"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Select the radio button next to the correct answer.
          </p>
        </div>
        
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Explanation (Optional)
          </label>
          <textarea
            value={question.explanation || ''}
            onChange={handleExplanationChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter an explanation for the correct answer (shown to students after quiz completion)"
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Question'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;