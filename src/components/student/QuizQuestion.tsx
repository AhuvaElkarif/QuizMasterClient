import React from 'react';
import styled from 'styled-components';

interface QuestionProps {
  question: string;
  options: string[];
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
}

const QuestionContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionText = styled.h3`
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionButton = styled.button<{ isSelected: boolean }>`
  padding: 12px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: ${props => props.isSelected ? '#4a90e2' : '#fff'};
  color: ${props => props.isSelected ? '#fff' : '#333'};
  font-size: 16px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#4a90e2' : '#f0f0f0'};
  }
`;

const QuizQuestion: React.FC<QuestionProps> = ({ question, options, selectedOption, onOptionSelect }) => {
  return (
    <QuestionContainer>
      <QuestionText>{question}</QuestionText>
      <OptionsContainer>
        {options.map((option, index) => (
          <OptionButton
            key={index}
            isSelected={selectedOption === option}
            onClick={() => onOptionSelect(option)}
          >
            {option}
          </OptionButton>
        ))}
      </OptionsContainer>
    </QuestionContainer>
  );
};

export default QuizQuestion;