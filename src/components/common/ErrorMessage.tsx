import React from 'react';
import styled from 'styled-components';

interface ErrorMessageProps {
  message: string;
}

const ErrorContainer = styled.div`
  background-color: rgba(176, 0, 32, 0.1);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-lg);
`;

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <ErrorContainer>
      <p style={{ margin: 0 }}>{message}</p>
    </ErrorContainer>
  );
};

export default ErrorMessage;