import styled from "styled-components";

// Styled Components
export const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

export const PointsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PointsLabel = styled.span`
  margin-right: 0.75rem;
  color: #4b5563;
`;

export const PointsInput = styled.input`
  width: 4rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
  }
`;

export const PointsUnit = styled.span`
  margin-left: 0.25rem;
  color: #4b5563;
`;

export const ErrorMessage = styled.div`
  margin-bottom: 1.5rem;
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 1rem;
  border-radius: 0.25rem;
`;

export const ErrorText = styled.p`
  color: #b91c1c;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
  }
`;

export const OptionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const AddOptionButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #059669;
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const OptionRow = styled.div`
  display: flex;
  align-items: center;
`;

export const Radio = styled.input`
  margin-right: 0.75rem;
  height: 1.25rem;
  width: 1.25rem;
  color: #2563eb;
`;

export const OptionInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  &:focus {
    outline: none;
    ring: 2px solid #3b82f6;
  }
`;

export const RemoveButton = styled.button`
  margin-left: 0.75rem;
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: #b91c1c;
  }
`;

export const HelpText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const CancelButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  color: #4b5563;
  background: none;
  cursor: pointer;
  &:hover {
    background-color: #f3f4f6;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

export const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
`;