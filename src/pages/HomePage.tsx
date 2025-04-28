import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppSelector } from "../redux/hooks";
// import { RootState } from '../utils/types';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 60px 0;
  background-color: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: #333;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #666;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
`;

const Button = styled(Link)`
  padding: 14px 32px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
`;

const PrimaryButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #4a90e2;
  border: 2px solid #4a90e2;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const FeaturesSection = styled.section`
  margin: 60px 0;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  color: #333;
  text-align: center;
  margin-bottom: 40px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
`;

const HomePage: React.FC = () => {
  const user = null;//useAppSelector((state) => state.auth.user);
  
  return (
    <HomeContainer>
      <HeroSection>
        <Title>Welcome to QuizMaster</Title>
        <Subtitle>
          An interactive platform for creating and taking quizzes. Perfect for teachers and students!
        </Subtitle>
        
        <ButtonContainer>
          {user ? (
            // If user is logged in, show dashboard links based on role
            user.role === 'teacher' ? (
              <PrimaryButton to="/teacher/dashboard">Teacher Dashboard</PrimaryButton>
            ) : (
              <PrimaryButton to="/student/dashboard">Student Dashboard</PrimaryButton>
            )
          ) : (
            // If no user is logged in, show login/register links
            <>
              <PrimaryButton to="/login">Log In</PrimaryButton>
              <SecondaryButton to="/register">Sign Up</SecondaryButton>
            </>
          )}
        </ButtonContainer>
      </HeroSection>
      
      <FeaturesSection>
        <SectionTitle>Features</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>For Teachers</FeatureTitle>
            <FeatureDescription>
              Create multiple-choice questions, organize them into quizzes, and track student performance.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>For Students</FeatureTitle>
            <FeatureDescription>
              Take quizzes, get immediate feedback, and track your progress over time.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Easy to Use</FeatureTitle>
            <FeatureDescription>
              Intuitive interface that makes creating and taking quizzes a breeze.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default HomePage;