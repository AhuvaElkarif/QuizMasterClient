import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
`;

const ContentWrapper = styled.div`
  max-width: 28rem;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ErrorCode = styled.h1`
  font-size: 9rem;
  font-weight: 800;
  color: #3b82f6;
`;

const Title = styled.h2`
  margin-top: 1.5rem;
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

const Description = styled.p`
  margin-top: 0.5rem;
  font-size: 1.125rem;
  color: #4b5563;
`;

const Divider = styled.div`
  position: relative;
  margin-top: 1.5rem;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;

    &::after {
      content: "";
      width: 100%;
      border-top: 1px solid #d1d5db;
    }
  }
`;

const DividerText = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  font-size: 0.875rem;

  span {
    padding: 0 1rem;
    background-color: #f9fafb;
    color: #6b7280;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: white;
  background-color: #2563eb;
  
  &:hover {
    background-color: #1d4ed8;
  }
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #3b82f6;
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: #374151;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-offset: 2px;
    ring-color: #3b82f6;
  }
`;

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <div>
          <ErrorCode>404</ErrorCode>
          <Title>Page Not Found</Title>
          <Description>
            The page you're looking for doesn't exist or has been moved.
          </Description>
        </div>
        
        <Divider>
          <DividerText>
            <span>What would you like to do?</span>
          </DividerText>
        </Divider>
        
        <ButtonContainer>
          <PrimaryButton onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate(-1)}>
            Go Back
          </SecondaryButton>
        </ButtonContainer>
      </ContentWrapper>
    </Container>
  );
};

export default NotFoundPage;